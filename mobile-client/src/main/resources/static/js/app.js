angular.module('sso', [ 'ngRoute', 'ngResource' ]).config(
		function($routeProvider) {

			$routeProvider.otherwise('/');
			$routeProvider.when('/', {
				templateUrl : 'home.html',
				controller : 'home'
			}).when('/dashboard', {
				templateUrl : 'dashboard.html',
				controller : 'dashboard'
			}).when('/user', {
                templateUrl : 'user.html',
                controller : 'user'
            }).when('/logined', {
                templateUrl : 'logined.html',
                controller : 'logined'
            }).when('/myitem', {
                templateUrl : 'myItem.html',
                controller : 'myItem'
            }).when('/additem', {
                templateUrl : 'addItem.html',
                controller : 'addItem'
            });

		}).controller('navigation', function($scope, $http, $window, $route) {
			$scope.tab = function(route) {
				return $route.current && route === $route.current.controller;
			};
			if (!$scope.user) {
				$http.get('/dashboard/user').success(function(data) {
					$scope.user = data;
					$scope.authenticated = true;
					$window.location.href = '#/logined';
				}).error(function() {
					$scope.authenticated = false;
				});
			}
			$scope.logout = function() {
				$http.post('/dashboard/logout', {}).success(function() {
					delete $scope.user;
					$scope.authenticated = false;
					// Force reload of home page to reset all state after logout
					$window.location.hash = '';
				});
		};
}).controller('home', function($scope, $window) {
}).controller('logined', function($scope, $http) {
	switch (new Date().getHours()) {
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
        case 18:
            $scope.welcomeMsg = "Good Afternoon ~.~";
            break;
        case 19:
        case 20:
        case 21:
        case 22:
        case 23:
        case 24:
            $scope.welcomeMsg = "Good Evening ~.~";
            break;
        default:
            $scope.welcomeMsg = "Good Morning ~.~";
	}
    $http.get('/dashboard/user').success(function(data) {
        $scope.email = data.name;
    });

}).controller('myItem', function($scope, $window, $http) {
    $http.get('/dashboard/item/get').success(function(data) {
        $scope.items = data;
        if(data.length == 0){
            $scope.message="you do not have item, please add ... ...";
            $scope.table_header=null;
        }else{
            $scope.message=null;
            $scope.table_header="Date";
        }
    }).error(function(data, status) {
        alert('get data error!');
    });

    // index here used to delete current item from items
    $scope.delete = function(title,index) {
        var yes = confirm('delete item: '+title+' ?');
        if(yes){
            $http.post('/dashboard/item/delete?title=' + title).success(function(data) {
                if(data != null){
                    alert(data.status);
                    $scope.items.splice(index, 1);
                }
            });
        }
    };
    $scope.nav_additem = function() {
        $window.location.href = '#/additem';
    };

}).controller('addItem', function($scope, $window, $http, $filter) {
    $scope.item = {
        email:'',
        title:'',
        content:'',
        date:''
    };
    var useremail = "";
    $http.get('/dashboard/user').success(function(data) {
        useremail = data.name;
    });
    $scope.updateItem = function(item) {
        var yes = confirm('add this new item ?');
        if(yes){
            item.email = useremail;
            //var date_string = date.getDay()+"/"+date.getMonth()+"/"+date.getFullYear();
            item.date = $filter('date')(new Date(), 'dd-MM-yyyy');
            $http.post('/dashboard/item/new', item).success(function(data) {
                if(data != null){
                    alert(data.status);
                    $window.location.href = '#/myitem';
                }
            });
        }
    };
    $scope.resetForm = function() {
        $scope.item.title = "";
        $scope.item.content = "";
    };

}).controller('dashboard', function($scope, $http, $window) {
    $http.get('/dashboard/item/all').success(function(data) {
        if(data.length == 0){
            $scope.message="no item, please add ... ...";
            $scope.table_header_date=null;
            $scope.table_header_pusher=null;
        }else{
            $scope.message=null;
            $scope.table_header_date="Date";
            $scope.table_header_pusher="Pusher";
        }
		$scope.items = data;
	}).error(function(data, status) {
        alert('get data error!');
    });

    $scope.nav_myitem = function() {
        $window.location.href = '#/myitem';
    };
}).controller('user', function($scope, $http) {
    $scope.userdetail = {
        // profileImg:'',
        email:'',
        nickName:'',
        gender:'',
        dob:'',
        phoneNum:'',
        aboutMe:''
    };
    var useremail = "";
    $http.get('/dashboard/user').success(function(data) {
    	$scope.user = data;
    	useremail = data.name;
    });
    $http.get('/dashboard/userdetail').success(function(detail) {
    	if(detail != null){
            $scope.userdetail = detail;
		}
	});

    $scope.updateUserInfo = function(detail) {
    	var yes = confirm('update user detail ?');
    	if(yes){
    		detail.email = useremail;
            $http.post('/dashboard/updateUserdetail', detail).success(function(data) {
                if(data != null){
                    alert(data.status);
                }
            });
		}
    };

    $scope.resetForm = function() {
        $http.get('/dashboard/userdetail').success(function(detail) {
            if(detail != null){
                $scope.userdetail = detail;
            }
        });
    };
});

// jquery code,
// hidden hamburger manu
$('.nav a').on('click', function(){
    $('.btn-navbar').click(); //bootstrap 2.x
    $('.navbar-toggle').click() //bootstrap 3.x by Richard
});