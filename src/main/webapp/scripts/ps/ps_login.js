/**
 * Created by Pruthvi on 12-06-2015.
 */

var login_app = angular.module('login_app',['blockUI','config_app','ngRoute','ngResource']);

login_app.config(['$locationProvider','blockUIConfig',function($locationProvider,blockUIConfig) {
    $locationProvider.html5Mode({enabled:true,requireBase:true});
    blockUIConfig.message =  "Logging In ...";
}]);

login_app.factory('loginFactory',['$resource','Config', function($resource,Config){
    var factory = {};
    var login_url = Config.getLoginApi();

    factory.getLogin = function(type){
        return $resource(login_url+'/'+type,{},{
            login:{
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                interceptor: {
                    response : function(data){
                        return data;
                    }
                }
            }
        });
    };

    return factory;
}]);

/*login_app.run(['$window', '$rootScope','$location',
    function ($window ,  $rootScope,$location) {
        $rootScope.goBack = function(){
           $window.history.back();
        }
    }]);*/

login_app.controller('loginController',['$scope','loginFactory','$window',function($scope,loginFactory,$window){

    $scope.username = '';
    $scope.password = '';

   $scope.login = function(){
        var body = '{"userName":"'+$scope.username+'","password":"'+$scope.password+'"}';
               var response = loginFactory.getLogin($scope.login_as).login({},body,function(response){
            if(response.status == 200){
                var data = response.data;
                $window.sessionStorage.setItem('orgId',data.orgId);
                $window.sessionStorage.setItem('userId',data.userId);
                $window.localStorage.setItem('authCode', data.authCode);
                $window.location = 'ps_main.html';

            }
        },function(response){
            console.log(response);
            if(response.status == 0){
                //$window.location = 'system_error.html';
            }else {
                $scope.$parent.$parent.response_message = response.data;
            }
        });
    };

    $scope.clearErrorMsg = function(){
        $scope.$parent.$parent.response_message = "";
    }
}]);

function error(data,header,$scope,response){
    console.log(response.$promise.getState());
    if(data.status == 404){

    }
}