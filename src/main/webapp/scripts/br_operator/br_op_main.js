/**
 * Created by uidr1063 on 1/12/2016.
 */

var branchOperator = angular.module('branchOperator',['ui.date','blockUI','slimScrollDirective','highcharts-ng','angularUtils.directives.dirPagination','config_app','ui.bootstrap','branchOperator_login',"checklist-model",'ui.router','ngStorage']);

branchOperator.factory('branchOperatorFactory',['$resource','br_Operator_Config', '$window',function($resource,br_Operator_Config, $window){
    var factory = {};
    var baseUrl = br_Operator_Config.getBaseUrl();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchBranchInfo = function(){
        return $resource(baseUrl,{},{
            fetch: {
                method: 'get',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor: {
                    response: function (data) {
                        return data;
                    }
                }
            }
        });
    };


    return factory;
}]);

branchOperator.run([function () {
    $(function () {
        $(document).keydown(function (e) {
            if((e.which || e.keyCode) == 116 || (e.keyCode == 82 && e.ctrlKey)){
                e.preventDefault();
                /*var path = $state.current.name;
                 var subpath = path.split(".");
                 if(subpath.length > 1) {
                 if (subpath[1] == 'list')
                 $state.reload();
                 }else
                 $state.reload();*/
            }else {
                return (e.which || e.keyCode) != 116;
            }
        });
    });
}]);

branchOperator.controller('br_op_mainCtrl',['$scope','$location','br_Operator_Config','$window',function($scope,$location,br_Operator_Config,$window) {
    var flag = br_Operator_Config.setConfig();

    if(flag)
        _init();
    else {
        $window.location = 'index.html';
        $scope.$parent.response_message = 'Please try after some time';
    }
    function _init(){
        $location.path('/dash');
    }
}]);

branchOperator.controller('br_op_companyCtrl',['$scope','branchOperatorFactory','$state','$window','$timeout',function($scope,branchOperatorFactory,$state,$window,$timeout){

    var company = branchOperatorFactory.fetchBranchInfo().fetch({},function(response){
        var userName = $window.localStorage.getItem('operatorName');
        $scope.todaydate = new Date();
        if(response.status == 200) {
            var _data = angular.fromJson(response.data);
            var branch_info = {
                "orgName": _data.orgName,
                "address": _data.address,
                "branchName": _data.branchName,
                "pincode": _data.pincode,
                "branchId": _data.branchId,
                "userName": userName

            };

            $scope.$parent.logo_image = "images/loading5.jpg";

            $scope.$parent.orgName = branch_info.orgName;
            $scope.$parent.branchId = branch_info.branchId;
            $scope.$parent.branchName = branch_info.branchName;
            $scope.$parent.address = branch_info.address;
            $scope.$parent.pincode = branch_info.pincode;
            $scope.$parent.userName = branch_info.userName;
            $state.go('dash');
        }
    },error);

    $scope.setBaseContentHeight = function(id,length,height,minlength){
        if(length > minlength){
            $('#'+id).slimScroll({
                height: height,
                alwaysVisible: false,
                size: "3px"
            }).css("width", "100%");
            $('.table-base .slimScrollDiv').css('min-width','660px');
        }else{
            $('#'+id).slimScroll({
                destroy:true
            });
        }
    };

    $state.go('dash');
}]);

branchOperator.config(['$stateProvider','$urlRouterProvider','$routeProvider','$locationProvider','blockUIConfig',function($stateProvider,$urlRouterProvider,$routeProvider, $locationProvider,blockUIConfig) {
    /*$httpProvider.defaults.useXDomain = true;
     delete $httpProvider.defaults.headers.common['X-Requested-With'];*/

    $urlRouterProvider.otherwise("/#");

    $stateProvider
        .state('dash', {
            url: "/dash",
            templateUrl: 'views/br_operator/br_op_dashboard.html',
            controller:'dashboardController'
        })

        .state('pass',{
            url: "/pass",
            templateUrl: 'views/br_operator/br_op_changePassword.html',
            controller: 'operatorPasswordCtrl'
        })
        .state('vehicle',{
            abstract: true,
            url: "/vehicle",
            template: '<div ui-view style="height:100%"></div>',
            controller: 'op_vehicleManagementCtrl'
         })
        .state('vehicle.list',{
            url: "",
            templateUrl:'views/br_operator/br_op_vehicleManagement.html'
        })
        .state('vehicle.add',{
            url: "",
            templateUrl:'views/br_operator/br_op_addVehicle.html'
        })
        .state('vehicle.edit',{
            url: "",
            templateUrl:'views/br_operator/br_op_editVehicle.html'
        })

        .state('inventory', {
            abstract:true,
            url: "/inventory",
            template: '<div ui-view style="height:100%"></div>',
            controller:'op_inventoryManagementCtrl'
        })
        .state('inventory.list', {
            url: "",
            templateUrl: 'views/br_operator/br_op_inventoryManagemnt.html'
        })
        .state('inventory.edit', {
            url: "",
            templateUrl: 'views/br_operator/br_op_editInventory.html'
        })
        .state('inventory.add', {
            url: "",
            templateUrl: 'views/br_operator/br_op_addInventory.html'
        })

        .state('library', {
            abstract:true,
            url:"/library",
            template: '<div ui-view style ="height:100%"></div>',
            controller: 'libraryManagementController'
        })
        .state('library.assign', {
            url: "",
            templateUrl: 'views/br_operator/br_op_libraryBookAssign.html'
        })
        .state('library.list', {
            url: "",
            templateUrl: 'views/br_operator/br_op_libraryManagement.html'
        })
        .state('library.add', {
            url: "",
            templateUrl: 'views/br_operator/br_op_addLibraryBook.html'
        })
        .state('library.edit', {
            url: "",
            templateUrl: 'views/br_operator/br_op_editLibraryBook.html'
        })
        .state('library.ret', {
            url: "",
            templateUrl: 'views/br_operator/br_op_libraryBookUnissue.html'
        })
        .state('library.search', {
            url: "",
            templateUrl: 'views/br_operator/br_op_libraryManagement.html'
        })
        .state('library.delist', {
            url: "",
            templateUrl: 'views/br_operator/br_op_libraryDefaulter.html'
        })
    ;




    $locationProvider.html5Mode(true);
    blockUIConfig.message =  "Processing ...";

}]);



branchOperator.controller('operatorPasswordCtrl', ['$scope','branchOperatorFactory','$state','$timeout','$window',function($scope,branchOperatorFactory,$state,$timeout,$window) {

    var initials = {
        username: "", oldPassword: "", newPassword: "", confirmPassword: ""
    };

    $scope.oPasswordChange = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        console.log($scope.userName);
    };
    $scope.changeOperatorPassword = function () {
        var uid = $window.sessionStorage.getItem('userId');
        console.log("udi " + uid);
        var add = $scope.add;
        var body = ' { ' +
            '"username":"' + add.username + '",' +
            '"oldPassword" :"' + add.oldPassword + '",' +
            '"newPassword" :"' + add.newPassword + '",' +
            '"confirmPassword" :"' + add.confirmPassword +
            '"}';
        var user = window.btoa(uid);
        var response = branchOperatorFactory.changeOperatorPassword(user);
        var data = response.pass({}, body, function (response) {
            if (response.status == 200) {
                alert("Password Changed successfully!!!");
                $window.location = 'index.html';
            }
        }, function (response) {
            if (response.status == 409) {
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1 = "Password change is unsuccessful !!!";
        });
    };
    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('dash');
    };
}]);

branchOperator.controller('logoutCtrl', ['$scope','$window','$sessionStorage','$localStorage',function($scope, $window,$sessionStorage,$localStorage) {
    $scope.logout = function(){
        $window.sessionStorage.removeItem('psId');
        $window.sessionStorage.removeItem('pcId');
        $window.sessionStorage.removeItem('userId');
        $window.sessionStorage.clear();
        $window.localStorage.clear();
        $sessionStorage.$reset();
        $localStorage.$reset();
        $window.location = 'appLogin.html';
    }
}]);


/*function show_dialoge($modal,$scope,message,html){
 return $modal.open({
 scope: $scope,
 templateUrl: html,
 controller: 'dialogeCtrl',
 resolve :{
 message : function(){
 return message;
 }
 }
 });
 }*/

function show_dialoge($modal,$scope,message,html,title){
    return $modal.open({
        scope: $scope,
        templateUrl: html,
        controller: 'dialogeCtrl',
        resolve :{
            data : function(){
                if(message == undefined || message == null || message == '')
                    return {message:null,title:title};
                else  if(title == undefined || title == null || title == '')
                    return {message:message,title:null};
                else if ((message == undefined || message == null || message == '')&&(title == undefined || title == null || title == ''))
                    return null;
                else
                    return {message:message,title:title};
            }
        }
    });
}

function open_dialoge(size,$modal,$scope,message,html){
    return $modal.open({
        scope: $scope,
        size:size,
        templateUrl: html,
        controller: 'dialogeCtrl',
        resolve :{
            data : function(){
                return message;
            }
        }
    });
}

branchOperator.controller('dialogeCtrl', ['$scope', '$modalInstance','data',function ($scope, $modalInstance,data) {
    if(data.title == null)
        $scope.message = data.message;
    else if(data.message == null)
        $scope.title = data.title;
    else {
        $scope.message = data.message;
        $scope.title = data.title;
    }
    $scope.ok = function () {
        $modalInstance.close(true);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.close = function () {
        $modalInstance.close(false);
    };
}]);

function error(msg,response){
    if(response.status == 404){
        console.log(msg+response.status);
    }
}

function goToHome(){
    $('.sidebar-menu #space a').trigger('click');
}

