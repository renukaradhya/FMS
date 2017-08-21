/**
 * Created by Neha.garg on 06-01-2015.
 */

var branchManager_login = angular.module('branchManager_login',['blockUI','config_app','ngRoute','ngResource']);

branchManager_login.config(['$locationProvider','blockUIConfig',function($locationProvider,blockUIConfig) {
    $locationProvider.html5Mode({enabled:true,requireBase:true});
    blockUIConfig.message =  "Logging In ...";
}]);

branchManager_login.factory('br_manager_loginFactory', ['$resource','br_Manager_Config',function($resource,br_Manager_Config){
    var factory = {};
    var login_url = br_Manager_Config.getLoginApi();

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

branchManager_login.controller('loginCtrl',['$scope','br_manager_loginFactory','$window',function($scope,br_manager_loginFactory,$window){

    $scope.username = '';
    $scope.password = '';

    $scope.login = function(){
        var body = '{"userName":"'+$scope.username+'","password":"'+$scope.password+'"}';
        var response = br_manager_loginFactory.getLogin($scope.login_as).login({},body,function(response){
            console.log(response);
            if(response.status == 200){
                var data = response.data;
                $window.sessionStorage.setItem('orgId',data.orgId);
                $window.sessionStorage.setItem('userId',data.userId);
                $window.sessionStorage.setItem('branchId',data.branchId);
                $window.localStorage.setItem('authCode', data.authCode);
                console.log("orgId"+ data.orgId);
                console.log("userId"+ data.userId);
                console.log("branchId"+ data.branchId);
                $window.location = 'pc_main.html';
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

   /* if(data.status == 404)
        $scope.$parent.response_message = "Userid and password did not match";*/
}