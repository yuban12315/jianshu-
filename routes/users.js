let express = require('express');
let user_service = require('./../libs/services/user_service')

let async = require('async')
let router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/check_login', (req, res) => {
    let logged = !!req.session.logged
    res.send({
        logged
    })
})

router.post('/login', (req, res) => {
    async.waterfall([
            (callback) => {
                let flag = user_service.check_data(req.body)
                if (flag) {
                    callback(null, req.body)
                }
                else {
                    callback(new Error('validate failed'))
                }
            },
            (user_data, callback) => {
                user_service.login(user_data, (error) => {
                    if (error) {
                        callback(error)
                    }
                    else {
                        callback(null)
                    }
                })
            }
        ],
        (error) => {
            if (error) {
                res.send({
                    status: false,
                    msg: error.message
                })
            }
            else {
                req.session.user_id = req.body.user_id
                req.session.logged = true
                console.log(req.session.id)
                res.send({
                    status: true,
                    msg: 'login successfully'
                })
            }
        })
})

router.post('/logout', (req, res) => {
    let logged = !!req.session.logged
    if (logged) {
        req.session.destroy((err) => {
            res.send({
                status: true,
                msg: '退出登录成功'
            })
        })
    }
    else {
        res.send({
            status:true,
            msg:'已退出登录'
        })
    }

})

router.post('/register', (req, res) => {
    async.waterfall([
        (callback) => {
            let flag = user_service.check_data(req.body)
            if (flag) {
                callback(null, req.body)
            }
            else {
                callback(new Error('validate false'))
            }
        },
        (user_data, callback) => {
            user_service.create(user_data, (error) => {
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
                msg: 'register successfuly'
            })
        }
    })
})

router.get('/history', (req, res) => {
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
                user_service.get_view_history(req.session.user_id, (error, result) => {
                    if (error) {
                        callback(error)
                    }
                    else {
                        callback(null, result)
                    }
                })

            }
        ],
        (error, result) => {
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

router.get('/my_article',(req,res)=>{
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
                user_service.get_my_article(req.session.user_id, (error, result) => {
                    if (error) {
                        callback(error)
                    }
                    else {
                        callback(null, result)
                    }
                })

            }
        ],
        (error, result) => {
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

module.exports = router
