let app = angular.module('main', ['ngRoute', 'myService', 'angularCSS'])

app.controller('navCtrl', ['$scope', '$rootScope', '$location', 'userService', function ($scope, $rootScope, $location, userService) {

    $scope.ifSignIn = function () {
        return $rootScope.ifSignIn
    }
    $scope.search = function () {
        alert('search')
    }
    $scope.checkSignIn=function () {
        console.log('checkSign')
        userService.checkLog((result)=>{
            console.log('sd')
            console.log(result)
            $rootScope.ifSignIn=result.logged
            $rootScope.username=result.username
        })
    }
    $scope.toSignIn = function () {
        $location.path('/signIn')
    }
    $scope.toSignUp = function () {
        $location.path('/signUp')
    }
    $scope.showNav = function () {
        return $rootScope.ifShowNavbar
    }
    $rootScope.$on('$routeChangeStart', function () {
        $rootScope.web_title = '加载中';
        $scope.checkSignIn()
    });

    $scope.init=function () {

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
        console.log('main - init')
        $rootScope.web_title='简书 - 创作你的创作'
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
            result.data.content = $sce.trustAsHtml(result.data.content)
            $scope.article = result.data
            $scope.article.publish_date = articleService.setDate($scope.article.publish_date, 1)
            $rootScope.web_title = $scope.article.title + ' -简书'
        })
    }

    $scope.init = function () {
        console.clear()
        $rootScope.ifShowNavbar = true
        console.log('detail-init')
        $scope.getDetail()
    }()
}])

app.controller('signInCtrl', ['$scope', '$rootScope', '$location', 'userService', function ($scope, $rootScope, $location, userService) {

    $scope.submit = function () {
        console.log('submit')
        console.log('username',$scope.form.username.val)
        console.log('password',$scope.form.password.val)
        userService.login({
            username:$scope.form.username.val,
            password:$scope.form.password.val
        }).then((result)=>{
            if(result.status){
                $rootScope.username=$scope.form.username.val
                $rootScope.ifSignIn=true
                $location.path('/')
            }
            else{
                $scope.error.status=true
                $scope.error.msg=result.msg
            }
        })
    }
    $scope.blur_u=function () {
        $scope.form.username.blur=true
    }
    $scope.blur_p=function () {
        $scope.form.password.blur=true
    }
    $scope.toSignUp = function () {
        $location.path('/signUp')
    }

    $scope.init = function () {
        $rootScope.ifShowNavbar = true
        $rootScope.web_title = '登录 - 简书'

        $scope.form={
            username:{
                val:'',
                blur:false
            },
            password:{
                val:'',
                blur:false
            }
        }
        $scope.error={
            status:false,
            msg:''
        }
    }()
}])

app.controller('signUpCtrl', ['$scope', '$rootScope', '$location', 'userService', function ($scope, $rootScope, $location, userService) {

    $scope.submit = function () {
        alert('ds')
    }
    $scope.toSignIn = function () {
        $location.path('/signIn')
    }

    $scope.init = function () {
        $rootScope.ifShowNavbar = true
        $rootScope.web_title = '注册 - 简书'
    }()
}])

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: "page/main/main.html",
        controller: 'mainCtrl',
        css: 'page/main/main.css'
    })
        .when('/detail', {
            templateUrl: "page/detail/detail.html",
            controller: 'detailCtrl',
            css: 'page/detail/detail.css'
        })
        .when('/signIn', {
            templateUrl: "page/signIn/signIn.html",
            controller: 'signInCtrl',
            css: 'page/signIn/signIn.css'
        })
        .when('/signUp', {
            templateUrl: "page/signUp/signUp.html",
            controller: 'signUpCtrl',
            css: 'page/signUp/signUp.css'
        })
        .otherwise({
            redirectTo: '/'
        })
}])