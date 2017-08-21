/**
 * Created by Neha.garg on 06-01-2015.
 */

var ad_login_app = angular.module('ad_login_app',['blockUI','config_app','ngRoute','ngResource']);

ad_login_app.config(['$locationProvider','blockUIConfig',function($locationProvider,blockUIConfig) {
    $locationProvider.html5Mode({enabled:true,requireBase:true});
    blockUIConfig.message =  "Logging In ...";
}]);

ad_login_app.factory('adminloginFactory', ['$resource','admin_config',function($resource,admin_config){
    var factory = {};
    var login_url = admin_config.getLoginApi();

    factory.getLogin = function(type){
        // http://localhost:8080/Eshiksha/login/admin
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

ad_login_app.controller('adminloginController',['$scope','adminloginFactory','$window',function($scope,adminloginFactory,$window){

    $scope.username = '';
    $scope.password = '';

    $scope.adminLogin = function(){
        var body = '{"userName":"'+$scope.username+'","password":"'+$scope.password+'"}';
        var response = adminloginFactory.getLogin($scope.login_as).login({},body,function(response){
            if(response.status == 200){
                var data = response.data;
                $window.sessionStorage.setItem('loggedin',true);
                $window.location = 'ad_main.html';
            }
        },function(response){
            console.log(response);
            if(response.status == 0){
                $window.location = 'system_error.html';
            }else {
                $scope.$parent.$parent.response_message = response.data;
            }

        });
    };

    $scope.clearErrorMsg = function(){
        $scope.$parent.$parent.response_message = "";
    }

}]);

function error(response){
    console.log(response.status);

   /*  if(response.status == 404)
     $scope.$parent.response_message = "Userid and password did not match";*/
}
