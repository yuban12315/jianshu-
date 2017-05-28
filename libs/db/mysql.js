let mysql=require('mysql')

let conn=mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"",
    database:"jianshu"
})
/*conn.query('select count(*)"num" from views where article_id =1',(error,result)=>{
    console.log(result[0].num)
})*/

module.exports=conn
