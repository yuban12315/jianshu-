let app = angular.module('main', ['ngRoute', 'myService', 'angularCSS', 'LocalStorageModule', 'ngCookies'])

app.controller('navCtrl', ['$scope', '$rootScope', '$location', 'userService', function ($scope, $rootScope, $location, userService) {

    $scope.ifSignIn = function () {
        return $rootScope.ifSignIn
    }
    $scope.search = function () {
        $location.path('/search')
        $location.search({name:$scope.name})
    }
    //检查用户登录状态
    $scope.checkSignIn = function () {
        userService.checkLog().then((result) => {
            $rootScope.ifSignIn = result.logged
            $rootScope.username = result.username
        })
    }
    //登出
    $scope.signOut = function () {
        userService.logout().then((result) => {
            //console.log(result)
            $location.path('/')
            location.reload()
        })
    }

    $scope.toSignIn = function () {
        $location.path('/signIn')
    }
    $scope.toSignUp = function () {
        $location.path('/signUp')
    }
    $scope.toMyArticles = function () {
        $location.path('/myArticles')
    }
    $scope.newArticle = function () {
        $location.path('write')
        $location.search({way: 'new'})
    }
    $scope.showNav = function () {
        return $rootScope.ifShowNavbar
    }
    $rootScope.$on('$routeChangeStart', function () {
        $rootScope.web_title = '加载中';
        $scope.checkSignIn()
    });

    $scope.init = function () {
        $scope.name=''
    }()

}])

app.controller('mainCtrl', ['$scope', '$rootScope', '$location', 'userService', 'articleService', function ($scope, $rootScope, $location, userService, articleService) {

    $scope.ifNext = function () {
        if ($scope.nextPage) {
            return 'btn-true'
        }
        else {
            return 'btn-defult'
        }
    }
    $scope.toNext = function () {
        if ($scope.nextPage) {
            $scope.page += 1
            $scope.getPage()
        }
        else {
            alert('没有更多了')
        }
    }
    $scope.ifLast = function () {
        if ($scope.page > 1) {
            return 'btn-true'
        }
        else {
            return 'btn-default'
        }
    }
    $scope.toLast = function () {
        if ($scope.page > 1) {
            $scope.page -= 1
            $scope.getPage()
        }
        else {
            alert('没有更多了')
        }
    }

    $scope.getPage = function () {
        articleService.get_articles($scope.page).then((result) => {
            if (result.status) {
                $scope.articles = result.data.article_list
                $scope.nextPage = result.data.next_page
                for (let i in $scope.articles) {
                    $scope.articles[i].publish_date = articleService.setDate($scope.articles[i].publish_date)
                    $scope.articles[i].content = marked($scope.articles[i].content).replace(/<.*?>/g, "")
                    //result[i].content=result[i].content.replace(/<.*?>/g,"")
                }
            }
            else {
                alert(result.msg)
            }
        })
    }
    $scope.getDetail = function (index) {
        $location.path('/detail')
        $location.search({id: $scope.articles[index].article_id})
    }

    $scope.init = function () {
        //console.log('main - init')
        $rootScope.web_title = '简书 - 创作你的创作'
        $scope.page = 1
        $rootScope.ifShowNavbar = true
        $scope.getPage()

    }();
}])

app.controller('detailCtrl', ['$scope', '$rootScope', '$location', 'articleService', '$sce', function ($scope, $rootScope, $location, articleService, $sce) {

    $scope.getDetail = function () {
        if (!$location.search().id) {
            $scope.id = 1
        }
        else $scope.id = $location.search().id
        articleService.get_detail($scope.id).then((result) => {
            result.data.content = $sce.trustAsHtml(marked(result.data.content))
            $scope.article = result.data
            $scope.article.publish_date = articleService.setDate($scope.article.publish_date, 1)
            $rootScope.web_title = $scope.article.title + ' - 简书'
        })
    }

    $scope.init = function () {
        console.clear()
        $rootScope.ifShowNavbar = true
        //console.log('detail-init')
        $scope.getDetail()
    }()
}])

app.controller('signInCtrl', ['$scope', '$rootScope', '$location', 'userService', function ($scope, $rootScope, $location, userService) {

    $scope.submit = function () {
        // //console.log('submit form')
        // //console.log('username', $scope.form.username.val)
        // //console.log('password', $scope.form.password.val)
        userService.login({
            username: $scope.form.username.val,
            password: $scope.form.password.val
        }).then((result) => {
            if (result.status) {
                $rootScope.username = $scope.form.username.val
                $rootScope.ifSignIn = true
                $location.path('/')
            }
            else {
                $scope.error.status = true
                $scope.error.msg = result.msg
            }
        })
    }
    $scope.blur_u = function () {
        $scope.form.username.blur = true
    }
    $scope.blur_p = function () {
        $scope.form.password.blur = true
    }
    $scope.toSignUp = function () {
        $location.path('/signUp')
    }

    $scope.init = function () {
        $rootScope.ifShowNavbar = true
        $rootScope.web_title = '登录 - 简书'

        $scope.form = {
            username: {
                val: '',
                blur: false
            },
            password: {
                val: '',
                blur: false
            }
        }
        $scope.error = {
            status: false,
            msg: ''
        }
    }()
}])

app.controller('signUpCtrl', ['$scope', '$rootScope', '$location', 'userService', function ($scope, $rootScope, $location, userService) {

    $scope.submit = function () {
        //console.log('submit form')
        //console.log('username', $scope.form.username.val)
        //console.log('password', $scope.form.password.val)
        userService.create({
            username: $scope.form.username.val,
            password: $scope.form.password.val
        }).then((result) => {
            if (result.status) {
                $rootScope.username = $scope.form.username.val
                $rootScope.ifSignIn = true
                $location.path('/')
            }
            else {
                $scope.error.status = true
                $scope.error.msg = result.msg
            }
        })
    }
    $scope.blur_u = function () {
        $scope.form.username.blur = true
    }
    $scope.blur_p = function () {
        $scope.form.password.blur = true
    }
    $scope.toSignIn = function () {
        $location.path('/signIn')
    }

    $scope.init = function () {
        $rootScope.ifShowNavbar = true
        $rootScope.web_title = '注册 - 简书'

        $scope.form = {
            username: {
                val: '',
                blur: false
            },
            password: {
                val: '',
                blur: false
            }
        }
        $scope.error = {
            status: false,
            msg: ''
        }
    }()
}])

app.controller('myArticlesCtrl', ['$scope', '$rootScope', '$location', 'userService', 'articleService', '$cookieStore', '$sce', function ($scope, $rootScope, $location, userService, articleService, $cookieStore, $sce) {

    $scope.toMainPage = function () {
        $location.path('/')
    }
    $scope.newArticle = function () {
        $location.path('write')
        $location.search({way: 'new'})
    }
    $scope.editArticle = function () {
        $location.path('write')
        $cookieStore.put('edit_article_id', $scope.article.article_id)
        $location.search({way: 'edit', article_id: $scope.article.article_id})
    }
    $scope.showDeleteModal = function () {
        $('#modal-btn').click()
    }
    $scope.deleteArticle = function () {
        //console.log($scope.article)
        articleService.deleteThis($scope.article.article_id).then((result) => {
            if (result.status) {
                location.reload()
            }
            else {
                alert(result.msg)
            }
        })
    }
    $scope.getMyArticle = function () {
        userService.getMyArticle().then((result) => {
            if (result.status) {
                $scope.articles = result.data
            }
        })
    }
    $scope.changeSize = function () {
        window.onresize = function () {
            let height = document.body.scrollHeight
            $('.myArticles').css({height: height})
            $('.article-list').css({height: height})
            $('.article-detail').css({height: height})
        }
    }
    $scope.showDetail = function (index) {
        articleService.get_detail_free($scope.articles[index].article_id).then((result) => {
            if (result.status) {
                result.data.content = $sce.trustAsHtml(marked(result.data.content))
                $scope.article = result.data
                $scope.showPage = true
                $cookieStore.remove('article_id')
                $cookieStore.put('article_id', $scope.articles[index].article_id)
            }
        })

        $('.article').removeClass('active-')
        $(`#${index}`).addClass('active-')
        //console.log()
    }
    $scope.getPrevious = function (article_id) {
        articleService.get_detail_free(article_id).then((result) => {
            if (result.status) {
                result.data.content = $sce.trustAsHtml(marked(result.data.content))
                $scope.article = result.data
            }
        })
    }
    $scope.init = function () {
        if(!$rootScope.ifSignIn){
            $location.path('/')
        }
        $rootScope.web_title = '我的主页 - 简书'
        $rootScope.ifShowNavbar = false
        let height = document.body.scrollHeight
        $('.myArticles').css({height: height})
        $('.article-list').css({height: height})
        $('.article-detail').css({height: height})
        //$scope.
        $scope.getMyArticle()
        $scope.changeSize()
        if ($cookieStore.get('article_id') !== undefined) {
            $scope.showPage = true
            $scope.getPrevious($cookieStore.get('article_id'))
        }
        else {
            $scope.showPage = false
        }
    }()

}])

app.controller('writeCtrl', ['$scope', '$rootScope', '$location', 'userService', 'articleService', '$cookieStore', '$sce', function ($scope, $rootScope, $location, userService, articleService, $cookieStore, $sce) {

    $scope.back=function () {
        history.go(-1)
    }

    $scope.getArticle = function (article_id) {
        if (article_id) {
            articleService.get_detail_free(article_id).then((result) => {
                if (result.status) {
                    $scope.article = result.data
                    if(result.data.published==1){
                        $scope.published=true
                    }
                    else{
                        $scope.published=false
                    }

                    // $scope.articleCopy=result.data
                    $scope.articleCopy={}
                    Object.assign($scope.articleCopy,result.data)
                    // let content=result.data.content.toString().repeat(1)
                    // $scope.articleCopy.content=$sce.trustAsHtml(marked(content))
                    $scope.articleCopy.content=$sce.trustAsHtml(marked($scope.articleCopy.content))
                    //console.log($scope.articleCopy)
                    $scope.$watch('article.title',(newValue,oldValue)=>{
                        // //console.log(newValue)
                        $('.fa-refresh')[0].innerHTML=' 发布更新'
                        $('.fa-mail-forward')[0].innerHTML=' 发布文章'
                        $scope.articleCopy.title=newValue
                    })
                    $scope.$watch('article.content',(newValue,oldValue)=>{
                        ////console.log(newValue)
                        $('.fa-refresh')[0].innerHTML=' 发布更新'
                        $('.fa-mail-forward')[0].innerHTML=' 发布文章'
                        let content=$scope.article.content
                        content=content.replace(/<script>/g,'script')
                        $scope.articleCopy.content=$sce.trustAsHtml(marked(content))
                    })
                    // //console.log(content)
                }
            })
        }
    }
    $scope.changeSize=function () {
        let height = document.body.scrollHeight
        $('.write').css({height: height})
        $('#editor').css({height: height})
        $('#articleContent').css({height: height-90})
        $('#markDown').css({height: height})
        window.onresize=function () {
            let height = document.body.scrollHeight
            $('.write').css({height: height})
            $('#editor').css({height: height})
            $('#articleContent').css({height: height-90})
            $('#markDown').css({height: height})
        }

    }

    $scope.updateArticle=function () {
        $('.fa-refresh')[0].innerHTML=' 发布中...'
        articleService.update($scope.article).then((result)=>{
            if(result.status){
                $('.fa-refresh')[0].innerHTML=' 已发布'
                $scope.msg=result.msg
            }
        })
    }
    $scope.publishArticle=function () {
        if($scope.way=='edit'){
            $('.fa-mail-forward')[0].innerHTML=' 发布中...'
            articleService.publish($scope.article).then((result)=>{
                if(result.status){
                    $('.fa-mail-forward')[0].innerHTML=' 已发布'
                    $scope.msg=result.msg
                    $scope.published=true
                }
            })
        }
        else if($scope.way='new'){
            $('.fa-mail-forward')[0].innerHTML=' 发布中...'
            articleService.create($scope.article).then((result)=>{
                if(result.msg){
                    let article_id=result.data
                    $cookieStore.put('new_article_id',article_id)
                    articleService.publish({article_id}).then((result)=>{
                        if(result.status){
                            $('.fa-mail-forward')[0].innerHTML=' 已发布'
                            $scope.published=true
                            $scope.ifEdit=true
                        }
                    })
                }
            })

        }
    }
    $scope.saveArticle=function () {
        if($scope.way=='edit'){

        }
        else if($scope.way=='new'){

        }

    }

    $scope.init = function () {
        if(!$rootScope.ifSignIn){
            $location.path('/')
        }
        $rootScope.web_title = '简书 - 文章编辑'
        $rootScope.ifShowNavbar = false
        let data = $location.search()
        $scope.way = data.way
        if($scope.way==='edit'){
            $scope.getArticle(data.article_id)
            $scope.ifEdit=true
        }
        else{
            $scope.article={
                title:"无标题文章",
                content:''
            }
            $scope.published=false
            $scope.articleCopy={}
            Object.assign($scope.articleCopy,$scope.article)
            $scope.$watch('article.title',(newValue,oldValue)=>{
                // //console.log(newValue)
                $scope.articleCopy.title=newValue
            })
            $scope.$watch('article.content',(newValue,oldValue)=>{
                ////console.log(newValue)
                let content=$scope.article.content
                content=content.replace(/<script>/g,'script')
                $scope.articleCopy.content=$sce.trustAsHtml(marked(content))
            })
        }

        $scope.changeSize()

    }()


}])

app.controller('searchCtrl',['$scope','$rootScope','$location','userService','articleService',function ($scope,$rootScope,$location,userService,articleService) {

    $scope.getArticles=function () {
        let data=$location.search()
        if(data.hasOwnProperty('name'))$scope.name=data.name
        else  $scope.name='test'

        articleService.search($scope.name).then((result)=>{
            if(result.status){
                $scope.articles=result.data
                for (let i in $scope.articles) {
                    $scope.articles[i].publish_date = articleService.setDate($scope.articles[i].publish_date)
                    $scope.articles[i].content = marked($scope.articles[i].content).replace(/<.*?>/g, "")
                    //result[i].content=result[i].content.replace(/<.*?>/g,"")
                }
                $scope.nums=result.data.length
            }
        })
    }

    $scope.getDetail = function (index) {
        $location.path('/detail')
        $location.search({id: $scope.articles[index].article_id})
    }

    $scope.init = function () {
        //console.log('search - init')
        $rootScope.web_title = '简书 - 搜索结果'
        $rootScope.ifShowNavbar = true
        $scope.getArticles()


    }();
}])

app.config(['$routeProvider', function ($routeProvider) {
    //主界面，显示已发布文章列表
    $routeProvider.when('/', {
        templateUrl: "page/main/main.html",
        controller: 'mainCtrl',
        css: 'page/main/main.css'
    })
    //文章详情页
        .when('/detail', {
            templateUrl: "page/detail/detail.html",
            controller: 'detailCtrl',
            css: 'page/detail/detail.css'
        })
        //登录页
        .when('/signIn', {
            templateUrl: "page/signIn/signIn.html",
            controller: 'signInCtrl',
            css: 'page/signIn/signIn.css'
        })
        //注册页
        .when('/signUp', {
            templateUrl: "page/signUp/signUp.html",
            controller: 'signUpCtrl',
            css: 'page/signUp/signUp.css'
        })
        .when('/myArticles', {
            templateUrl: "page/myArticles/myArticles.html",
            controller: 'myArticlesCtrl',
            css: 'page/myArticles/myArticles.css'
        })
        .when('/write', {
            templateUrl: "page/write/write.html",
            controller: 'writeCtrl',
            css: 'page/write/write.css'
        })
        .when('/search', {
            templateUrl: "page/search/search.html",
            controller: 'searchCtrl',
            css: 'page/search/search.css'
        })
        .otherwise({
            redirectTo: '/'
        })

}])