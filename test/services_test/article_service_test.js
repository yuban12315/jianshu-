let article_service=require('././../../libs/services/article_service')

let article={
    article_id:5,
    title:'test_4',
    content:'# sdsd',
    user_id:1
}

let a={}
article_service.publish(5,1,(error)=>{
    if(error) console.log(error)

})
