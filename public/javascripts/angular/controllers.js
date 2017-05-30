let app = angular.module('main', ['ngRoute', 'myService', 'angularCSS'])

app.controller('navCtrl', ['$scope', '$rootScope', '$location', 'userService', function ($scope, $rootScope, $location, userService) {
    $rootScope.web_title = '简书 - 创作你的创作'
    $rootScope.ifSignIn = false
    $rootScope.username = 'test_username'
    $rootScope.ifShowNavbar=true
    $scope.ifSignIn = function () {
        return $rootScope.ifSignIn
    }
    $scope.search = function () {
        alert('search')
    }
    $scope.toSignIn=function () {
        $location.path('/signIn')
    }
    $scope.toSignUp=function () {
        $location.path('/signUp')
    }
    $scope.showNav=function () {
        return $rootScope.ifShowNavbar
    }
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
        console.clear()
        console.log('main - init')
        $scope.page = 1
        $rootScope.ifShowNavbar=true
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
            $rootScope.web_title=$scope.article.title+' -简书'
        })
    }

    $scope.init = function () {
        console.clear()
        $rootScope.ifShowNavbar=true
        console.log('detail-init')
        $scope.getDetail()
    }()
}])

app.controller('signInCtrl',['$scope','$rootScope','$location','userService',function ($scope, $rootScope, $location, userService) {

    $scope.submit=function () {
        alert('sd')
    }

    $scope.init=function () {
      $rootScope.ifShowNavbar=true
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
        .when('/signIn',{
            templateUrl: "page/signIn/signIn.html",
            controller: 'signInCtrl',
            css: 'page/signIn/signIn.css'
        })
        .otherwise({
            redirectTo: '/'
        })
}])