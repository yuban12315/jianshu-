function setDate(s) {
    let str=''

    //date from article
    let date=new Date(s)
    let year=date.getFullYear()
    let month=date.getMonth()+1
    let day=date.getDay()+1
    let hours=date.getHours()-8
    let minutes=date.getMinutes()
    //system date
    let sysdate=new Date()
    let _year=sysdate.getFullYear()
    if(!_year===year){
        str+=year+'.'
    }
    if(month<10) month='0'+month
    if(day<10) day='0'+day
    if(hours<10) hours='0'+hours
    if(minutes<10) minutes='0'+minutes
    str+=`${month}.${day} ${hours}:${minutes}`
    console.log(str)
    return str
}
setDate("2017-05-24 14:35:51")