let request = require('superagent')

request.post('127.0.0.1/users/register',{
    username:'admin1',
    password:'123456'
},(err,res)=>{
    if(err){
        console.log(err)
    }
    if(res){
        console.log(JSON.parse(res.text))
    }
})

// request.post('127.0.0.1/users/login',{
//     username:'admin1',
//     password:'123456'
// },(err,res)=>{
//     if(err){
//         console.log(err)
//     } bn
//     if(res){
//         console.log(JSON.parse(res.text))
//     }
// })

// request.get('127.0.0.1/users/check_login',(err,res)=>{
//     if(err){
//         console.log(err)
//     }
//     if(res){
//         console.log(JSON.parse(res.text))
//     }
// })