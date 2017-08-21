/**
 * Created by Icarat2 on 5/14/2016.
 */


var faculties_login = angular.module('faculties_login',['blockUI','config_app','ngRoute','ngResource']);

faculties_login.config(['$locationProvider','blockUIConfig',function($locationProvider,blockUIConfig) {
    $locationProvider.html5Mode({enabled:true,requireBase:true});
    blockUIConfig.message =  "Logging In ...";
}]);

faculties_login.factory('facultyLoginFactory', ['$resource','faculty_config',function($resource,faculty_config){
    var factory = {};
    var login_url = faculty_config.getLoginApi();

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

/*faculty_login.run(['$window', '$rootScope','$location',
 function ($window ,  $rootScope,$location) {
 $rootScope.goBack = function(){
 $window.history.back();
 }
 }]);*/

faculties_login.controller('faculties_loginCtrl', ['$scope','facultyLoginFactory','$window',function($scope,facultyLoginFactory,$window){

    $scope.username = '';
    $scope.password = '';

    $scope.login = function(){
        var body = '{"userName":"'+$scope.username+'","password":"'+$scope.password+'"}';
        var response = facultyLoginFactory.getLogin($scope.login_as).login({},body,function(response){
            console.log(response);
            if(response.status == 200 || response.status == 201){
                var data = response.data;
                $window.sessionStorage.setItem('orgId',data.orgId);
                $window.sessionStorage.setItem('facultyId',data.facultyId);
                $window.sessionStorage.setItem('branchId',data.branchId);
                $window.localStorage.setItem('authCode', data.authCode);
                $window.localStorage.setItem('facultyName', data.facultyName);
                console.log(response);
                $window.location = 'facultyMain.html';
            }
        },function(response){
            console.log(response);
            if(response.status == 0){
                $window.location = 'system_error.html';
                //alert("Username or password is incorrect!");
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