let mysql = require('./../db/mysql')
let async = require('async')

class user_service {
    create(user_data, callback) {
        async.waterfall([
            (callback) => {
                mysql.query('select from users where username= ?', user_data.username, (err, res) => {
                    if (err) {
                        callback(err)
                    }
                    else {
                        if (res.length != 0) {
                            callback(new Error('用户名已被使用'))
                        }
                        else {
                            callback(null)
                        }
                    }
                })
            },
            (callback) => {
                mysql.query('insert into users set?', {
                    username:user_data.username,
                    password:user_data.password
                }, (error) => callback(error))
            }
        ], (error) => callback(error))
    }

    login(user_data, callback) {
        mysql.query('select * from users where username =? and password= ?', [user_data.username, user_data.password], (err, res) => {
            if (err) {
                callback(err)
            }
            else {
                if (res.length === 0) {
                    callback(new Error('用户名或密码错误'))
                }
                else {
                    callback(null)
                }
            }
        })
    }

    view(data,callback){
        mysql.query('insert into views set ?',{
            user_id:data.user_id,
            article_id:data.article_id
        },(error)=>callback(error))
    }

    get_view_history(user_id,callback){
        mysql.query('select v.article_id,a.title from views v,articles a where v.user_id = ? and v.article_id=a.article_id',user_id,(error,result)=>{
            if(error){
                callback(error)
            }
            else{
                callback(null,result)
            }
        })
    }

    get_my_article(user_id,callback){
        async.waterfall([
            (callback)=>{
                mysql.query('select article_id,user_id,title from articles where user_id= ? ',user_id,(error,result)=>{
                    if(error){
                        callback(error)
                    }
                    else{
                        callback(null,result)
                    }
                })
            }
        ],(error,result)=>callback(error,result))
    }

    check_data(user_data){
        /*user_data should have username and password*/
        if(!user_data){
            return false
        }
        if(!user_data.hasOwnProperty('username')){
            return false
        }
        if(!user_data.hasOwnProperty('password')){
            return false
        }
        let validate_string =/^[a-zA-Z0-9_\u4e00-\u9fa5]{3,16}$/
        if(!(validate_string.test(user_data.username))){
            return false
        }
        if(!(validate_string.test(user_data.password))){
            return false
        }
        return true
    }

}
module.exports = new user_service()
