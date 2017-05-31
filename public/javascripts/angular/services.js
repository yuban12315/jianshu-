let myService = angular.module('myService', []);

myService.factory('userService', ['$q', '$http', ($q, $http) => {
    class userService {

        checkData(user_data) {
            let validate_string = /^[a-zA-Z0-9_\u4e00-\u9fa5]{3,16}$/
            if (!(validate_string.test(user_data.username))) {
                return false
            }
            if (!(validate_string.test(user_data.password))) {
                return false
            }
            return true
        }

        login(user_data) {
            let defer = $q.defer()
            $http.post('/users/login', user_data).then((result) => defer.resolve(result.data))
            return defer.promise
        }

        checkLog(){
            let defer=$q.defer()
            $http.get('/users/check_login').then((result)=>defer.resolve(result.data))
        }

        logout() {
            let defer = $q.defer()
            $http.post('/users/logout', {}).then((result) => defer.resolve(result.data))
            return defer.promise
        }

        create(user_data) {
            let defer = $q.defer()
            $http.post('users/create', user_data).then((result) => defer.resolve(result.data))
            return defer.promise
        }

        getViewHistory() {
            let defer = $q.defer()
            $http.get('users/history').then((result) => defer.resolve(result.data))
            return defer.promise
        }

        getMyArticle() {
            let defer = $q.defer()
            $http.post('/users/')
            return defer.promise
        }
    }
    return new userService()
}])

myService.factory('articleService', ['$q', '$http', ($q, $http) => {
    class articleService {
        create(article_data) {
            let defer = $q.defer()
            $http.post('article/create', article_data).then((result) => defer.resolve(result.data))
            return defer.promise
        }

        update(article_data) {
            let defer = $q.defer()
            $http.post('article/update', article_data).then((result) => defer.resolve(result.data))
            return defer.promise
        }

        to_html(article_data) {
            let defer = $q.defer()
            $http.post('articles/to_html', article_data).then((result) => defer.resolve(result.data))
            return defer.promise
        }

        get_articles(page) {
            let defer = $q.defer()
            $http.get(`articles/?page=${page}`).then((result) => defer.resolve(result.data))
            return defer.promise
        }

        get_detail(article_id) {
            let defer = $q.defer()
            $http.get(`articles/detail?id=${article_id}`).then((result) => defer.resolve(result.data))
            return defer.promise
        }

        setDate(s, flag) {
            let str = ''

            //date from article
            let date = new Date(s)
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDay() + 1
            let hours = date.getHours() - 8
            let minutes = date.getMinutes()

            //system date
            let sysdate = new Date()
            let _year = sysdate.getFullYear()
            if (!_year === year) {
                str += year + '.'
            }
            if (month < 10) month = '0' + month
            if (day < 10) day = '0' + day
            if (hours < 10) hours = '0' + hours
            if (minutes < 10) minutes = '0' + minutes
            str += `${month}.${day} ${hours}:${minutes}`

            if (flag) str = `${year}.${str}`

            return str
        }
    }
    return new articleService()
}])