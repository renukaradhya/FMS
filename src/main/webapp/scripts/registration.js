/**
 * Created by Icarat2 on 4/28/2016.
 */

var registration_app = angular.module('registration_app',['blockUI','config_app','ngRoute','ngResource']);

registration_app.config(function($locationProvider,blockUIConfig) {
    $locationProvider.html5Mode({enabled:true,requireBase:true});
    blockUIConfig.message =  "Registration ...";
});

registration_app.factory('registrationFactory',['$resource','Config', function($resource,Config){
    var factory = {};
    var registration_url = Config.getRegistrationApi();

    factory.getRegister = function(type) {
        return $resource(registration_url + '/' + type, {}, {
            login: {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                interceptor: {
                    response: function (data) {
                        return data;
                    }
                }
            }
        });
    };
}]);

registration_app.controller('registrationCtrl',['$scope','registrationFactory','$window',function($scope,registrationFactory,$window){

    $scope.register = function(){
        var body = '{"orgName":"'+$scope.orgName+'",' +
            '"address":"'+$scope.address+ '",' +
            '"pincode":"'+$scope.pincode+'"}';

        var response = registrationFactory.getRegister($scope.resgister_as).register({},body,function(response){
            if(response.status == 200){
                /*var data = response.data;
                $window.sessionStorage.setItem('orgId',data.orgId);
                $window.sessionStorage.setItem('userId',data.userId);
                $window.location = 'login.html'; */
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
}]);