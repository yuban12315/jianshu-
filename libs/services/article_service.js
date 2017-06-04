let mysql = require('./../db/mysql')
let async = require('async')
let marked = require('marked')

class article_service {
    to_html(markdown_string, callback) {
        marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
        });
        marked(markdown_string, (err, res) => callback(err, res))
    }

    create(article_data, callback) {
        async.waterfall([
            (callback) => {
                this.to_html(article_data.content, (error, result) => {
                    callback(error, result)
                })
            },
            (html, callback) => {
                article_data.content = html
                article_data.published = 0
                article_data.publish_date = new Date()
                mysql.query('insert into articles set ?', {
                    title: article_data.title,
                    content: article_data.content,
                    published: article_data.published,
                    publish_date: article_data.publish_date,
                    user_id: article_data.user_id
                }, (error) => callback(error))
            }
        ], (error) => callback(error))
    }

    update(article_data, callback) {
        async.waterfall([
            (callback) => {
                this.to_html(article_data.content, (error, result) => {
                    callback(error, result)
                })
            },
            (html, callback) => {
                article_data.content = html
                mysql.query('update articles set ? where article_id=? and user_id=?', [{
                    title: article_data.title,
                    content: article_data.content
                }, article_data.article_id, article_data.user_id], (error) => callback(error))
            }
        ], (error) => callback(error))
    }

    publish(article_id, user_id, callback) {
        async.waterfall([
            (callback) => {
                mysql.query('select article_id from articles where article_id=? and user_id=?', [article_id, user_id],
                    (error, result) => {
                        if (error) {
                            callback(error)
                        }
                        else{
                            if(result.length===0){
                                callback(new Error('该文章不存在'))
                            }
                            else{
                                callback(null)
                            }
                        }
                    })
            },
            (callback)=>{
                mysql.query('update articles set ? where article_id=?', {
                    published: 1
                }, [article_id, user_id], (error) => callback(error))
            }
        ],(error)=>callback(error))
    }

    delete_this(article_id, user_id, callback) {
        /*mysql.query('delete from articles where article_id=? and user_id=?',
         [article_id,user_id],(error)=>callback(error))*/
        async.waterfall([
            (callback) => {
                mysql.query('select article_id from articles where article_id=? and user_id=?', [article_id, user_id],
                    (error, result) => {
                        if (error) {
                            callback(error)
                        }
                        else{
                            if(result.length===0){
                                callback(new Error('该文章不存在'))
                            }
                            else{
                                callback(null)
                            }
                        }
                    })
            },
            (callback)=>{
                mysql.query('delete from articles where article_id=? and user_id=?',
                    [article_id,user_id],(error)=>callback(error))
            }
        ],(error)=>callback(error))
    }

    get_detail(article_id, callback) {
        async.waterfall([
            (callback) => {
                mysql.query('select a.title,a.content,a.publish_date,a.user_id,a.article_id,u.username from users u,articles a where u.user_id=a.user_id and a.article_id= ?', article_id, (error, result) => {
                    if (error) {
                        callback(error)
                    }
                    else {
                        if (result.length === 0) {
                            callback(new Error('该文章不存在或未过审核'))
                        }
                        else {
                            callback(null, result[0])
                        }
                    }
                })
            },
            (data, callback) => {
                mysql.query('select count(*)"num" from views where article_id = ?', article_id, (error, result) => {
                    if (error) {
                        callback(error)
                    }
                    else {
                        data.views = result[0].num
                        callback(null, data)
                    }
                })
            },
        ], (error, result) => callback(error, result))
    }

    get_page(page, callback) {
        let article_num = 5
        async.waterfall([
            (callback) => {
                let num = (page - 1) * article_num;
                mysql.query('select count(*)"num" from articles where published =?',1, (error, result) => {
                    if (error) {
                        callback(error)
                    }
                    else {
                        let next_page
                        let t = (result[0].num / article_num) - page
                        next_page = t > 0
                        callback(null, next_page)
                    }
                })
            },
            (next_page, callback) => {
                let num = (page - 1) * article_num;
                mysql.query('select a.article_id,title,content,username,publish_date from articles a,users u where a.user_id = u.user_id and a.published=? limit ?,?', [1,num, article_num], (error, result) => {
                    if (error) {
                        callback(error)
                    }
                    else {
                        let data = {
                            next_page
                        }
                        for(let i in result){
                            result[i].content=result[i].content.slice(0,200)+'...'
                            result[i].content=result[i].content.replace(/<.*?>/g,"")
                        }
                        data.article_list = result
                        callback(null, data)
                    }
                })
            }
        ], (error, result) => callback(error, result))
    }

    check_data_create(article_data) {
        if (!article_data) {
            return false
        }
        if (!article_data.hasOwnProperty('title')) {
            return false
        }
        if (!article_data.hasOwnProperty('content')) {
            return false
        }
        return true
    }

    check_data_update(article_data) {
        if (!article_data) {
            return false
        }
        if (!article_data.hasOwnProperty('article_id')) {
            return false
        }
        if (!article_data.hasOwnProperty('title')) {
            return false
        }
        if (!article_data.hasOwnProperty('content')) {
            return false
        }
        return true
    }

}

module.exports = new article_service()