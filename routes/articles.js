let express = require('express')
let article_service = require('./../libs/services/article_service')
let user_service = require('./../libs/services/user_service')
let async = require('async')
let router = express.Router()

router.get('/', function (req, res) {
    let page
    if (!req.query.page)
        page = 1
    else {
        page = req.query.page
    }
    article_service.get_page(page, (error, result) => {
        if (error) {
            res.send({
                status: false,
                msg: error.message,
                data: null
            })
        }
        else {
            res.send({
                status: true,
                msg: null,
                data: result
            })
        }
    })
})

router.get('/detail', (req, res) => {
    let logged = !!req.session.logged
    let article_id
    if (!req.query.id) {
        article_id = 1
    }
    else {
        article_id = req.query.id
    }
    if (logged) {
        async.waterfall([
            (callback) => {
                user_service.view({
                    user_id: req.session.user_id,
                    article_id
                }, (error) => {
                    if (error) {
                        callback(error)
                    }
                    else {
                        callback(null)
                    }
                })
            },
            (callback) => {
                article_service.get_detail(article_id, (error, result) => {
                    if (error) {
                        callback(error)
                    }
                    else {
                        callback(null, result)
                    }
                })
            }
        ], (error, result) => {
            if (error) {
                res.send({
                    status: false,
                    msg: error.message,
                    data: null
                })
            }
            else {
                res.send({
                    status: true,
                    msg: null,
                    data: result
                })
            }
        })
    }
    else {
        article_service.get_detail(article_id, (error, result) => {
            if (error) {
                res.send({
                    status: false,
                    msg: error.message,
                    data: null
                })
            }
            else {
                res.send({
                    status: true,
                    msg: null,
                    data: result
                })
            }
        })
    }
})

router.get('/search', (req, res) => {

})

router.post('/to_html', (req, res) => {
    async.waterfall([
        (callback) => {
            let flag = article_service.check_data(req.body)
            if (flag) {
                callback(null, req.body)
            }
            else {
                callback(new Error('validate failed'))
            }
        },
        (article_data, callback) => {
            article_service.to_html(article_data.content, (error, result) => {
                if (error) {
                    callback(error)
                }
                else {
                    article_data.content = result
                    callback(null, article_data)
                }
            })
        }
    ], (error, result) => {
        if (error) {
            res.send({
                status: false,
                msg: error.message,
                data: null
            })
        }
        else {
            res.send({
                status: true,
                msg: null,
                data: result
            })
        }
    })
})

router.post('/create', (req, res) => {
    async.waterfall([
        (callback) => {
            let logged = !!req.session.logged
            if (!logged) {
                callback(new Error('请先登录'))
            }
            else {
                callback(null)
            }
        },
        (callback) => {
            let article_data = req.body
            let flag = article_service.check_data_create(article_data)
            if (flag) {
                article_data.user_id = req.session.user_id
                callback(null, req.body)
            }
            else {
                callback(new Error('validate failed'))
            }
        },
        (article_data, callback) => {
            article_service.create(article_data, (error) => {
                if (error) {
                    callback(error)
                }
                else {
                    callback(null)
                }
            })
        }
    ], (error) => {
        if (error) {
            res.send({
                status: false,
                msg: error.message
            })
        }
        else {
            res.send({
                status: true,
                msg: 'create article successfully'
            })
        }
    })
})

router.post('/publish', (req, res) => {
    async.waterfall([
        (callback) => {
            let logged = !!req.session.logged
            if (!logged) {
                callback(new Error('请先登录'))
            }
            else {
                callback(null)
            }
        },
        (callback) => {
            let article_id = req.body.article_id
            let user_id = req.session.user_id
            article_service.publish(article_id, user_id, (error) => {
                if (error) {
                    callback(error)
                }
                else {
                    callback(null)
                }
            })
        }
    ], (error) => {
        if (error) {
            res.send({
                status: false,
                msg: error.message
            })
        }
        else {
            res.send({
                status: true,
                msg: 'create article successfully'
            })
        }
    })
})

router.post('/delete', (req, res) => {
    async.waterfall([
        (callback) => {
            let logged = !!req.session.logged
            if (!logged) {
                callback(new Error('请先登录'))
            }
            else {
                callback(null)
            }
        },
        (callback) => {
            let article_id = req.body.article_id
            let user_id = req.session.user_id
            article_service.delete(article_id, user_id, (error) => {
                if (error) {
                    callback(error)
                }
                else {
                    callback(null)
                }
            })
        }
    ], (error) => {
        if (error) {
            res.send({
                status: false,
                msg: error.message
            })
        }
        else {
            res.send({
                status: true,
                msg: 'create article successfully'
            })
        }
    })
})

router.post('/update', (req, res) => {
    async.waterfall([
        (callback) => {
            let logged = !!req.session.logged
            if (!logged) {
                callback(new Error('请先登录'))
            }
            else {
                callback(null)
            }
        },
        (callback) => {
            let article_data = req.body
            let flag = article_service.check_data_update(article_data)
            if (flag) {
                article_data.user_id = req.session.user_id
                callback(null, req.body)
            }
            else {
                callback(new Error('validate failed'))
            }
        },
        (article_data, callback) => {
            article_service.update(article_data, (error) => {
                if (error) {
                    callback(error)
                }
                else {
                    callback(null)
                }
            })
        }

    ], (error) => {
        if (error) {
            res.send({
                status: false,
                msg: error.message
            })
        }
        else {
            res.send({
                status: true,
                msg: 'create article successfully'
            })
        }
    })
})

module.exports = router