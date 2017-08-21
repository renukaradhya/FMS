/**
 * Created by uidr1063 on 1/2/2016.
 */


var branchOperator_login = angular.module('branchOperator_login',['blockUI','config_app','ngRoute','ngResource']);

branchOperator_login.config(['$locationProvider','blockUIConfig',function($locationProvider,blockUIConfig) {
    $locationProvider.html5Mode({enabled:true,requireBase:true});
    blockUIConfig.message =  "Logging In ...";
}]);

branchOperator_login.factory('br_operator_loginFactory', ['$resource','br_Operator_Config',function($resource,br_Operator_Config){
    var factory = {};
    var login_url = br_Operator_Config.getLoginApi();

    factory.getLogin = function(type){
        return $resource(login_url+'/'+type+'/branchOperatorLogin',{},{
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

branchOperator_login.controller('bo_loginCtrl',['$scope','br_operator_loginFactory','$window',function($scope,br_operator_loginFactory,$window){

    $scope.username = '';
    $scope.password = '';

    $scope.login = function(){
        var body = '{"userName":"'+$scope.username+'","password":"'+$scope.password+'"}';
        var response = br_operator_loginFactory.getLogin($scope.login_as).login({},body,function(response){
            if(response.status == 200){
                var data = response.data;
                $window.sessionStorage.setItem('orgId',data.orgId);
                $window.sessionStorage.setItem('userId',data.userId);
                $window.sessionStorage.setItem('branchId',data.branchId);
                $window.localStorage.setItem('authCode', data.authCode);
                $window.localStorage.setItem('operatorName', data.operatorName);
                console.log(response);
                $window.location = 'br_operator_main.html';
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
}