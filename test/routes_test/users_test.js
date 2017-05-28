let request = require('superagent')

request.post('127.0.0.1/users/login',{
    username:'admin1',
    password:'123456'
},(err,res)=>{
    if(err){
        console.log(err)
    } bn
    if(res){
        console.log(JSON.parse(res.text))
    }
})