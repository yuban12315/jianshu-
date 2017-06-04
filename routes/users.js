let express = require('express');
let user_service = require('./../libs/services/user_service')

let async = require('async')
let router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

//检查登录状态，返回bool值和用户名
router.get('/check_login', (req, res) => {
    let logged = !!req.session.logged

    if(logged){
        res.send({
            logged,
            username:req.session.username,
            user_id:req.session.user_id
        })
    }
    else{
        res.send({
            logged,
            username:''
        })
    }
})

//用户登录路由
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
                        callback(null,user_data.username)
                    }
                })
            },
            (username,callback)=>{
                user_service.get_id_by_name(username,(error,result)=>{
                    if (error) {
                        callback(error)
                    }
                    else{
                        callback(null,result.user_id)
                    }
                })
            }
        ],
        (error,user_id) => {
            if (error) {
                res.send({
                    status: false,
                    msg: error.message
                })
            }
            else {
                req.session.username=req.body.username
                req.session.logged = true
                req.session.user_id=user_id
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
                    callback(null,user_data.username)
                }
            })
        },
        (username,callback)=>{
            user_service.get_id_by_name(username,(error,result)=>{
                if (error) {
                    callback(error)
                }
                else{
                    callback(null,result.data.user_id)
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
            req.session.username=req.body.username
            req.session.logged = true
            res.send({
                status: true,
                msg: 'register successfully'
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

router.get('/get_name_by_id',(req,res)=>{
    let username
    if(!req.query.username) username='admin1'
    else username=req.query.username
    async.waterfall([
        (callback)=>{
            user_service.get_id_by_name(username,(error,result)=>callback(error,result))
        }
    ],(error, result) => {
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
