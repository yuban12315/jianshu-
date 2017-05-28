let user_service=require('./../../libs/services/user_service')

user_service.get_my_article(1,(error,result)=>{
    console.log(error)
    console.log(result)
    process.exit(1)
})
