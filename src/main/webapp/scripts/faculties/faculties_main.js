/**
 * Created by Icarat2 on 5/17/2016.
 */

var facultyApp = angular.module('facultyApp',['ui.date','ui.bootstrap','blockUI','slimScrollDirective','highcharts-ng','angularUtils.directives.dirPagination','config_app','faculties_login',"checklist-model",'ui.router', 'ngRoute', 'ngResource','ngStorage']);

facultyApp.factory('facultyFactory1',['$resource','faculty_config', '$window',function($resource,faculty_config, $window){
    var factory = {};
    var baseUrl = faculty_config.getBaseUrl();
    var password_url = faculty_config.getPasswordAPI();
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

    factory.changeFacultyPassword = function(uid){
        //  BRANCH00001/faculty/FC00000002/password
        return $resource(password_url+'/faculty/'+uid+'/password',{},{
            pass:{
                method:'PUT',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
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

facultyApp.run(['$state',function ($state) {
    $(function () {
        $(document).keydown(function (e) {
            if((e.which || e.keyCode) == 116 || (e.keyCode == 82 && e.ctrlKey)){
                e.preventDefault();
                var path = $state.current.name;
                 var subpath = path.split(".");
                 if(subpath.length > 1) {
                 if (subpath[1] == 'list')
                 $state.reload();
                 }else
                 $state.reload();
            }else {
                return (e.which || e.keyCode) != 116;
            }
        });
    });
}]);

facultyApp.controller('mainFacultyCtrl',['$scope','$location','faculty_config','$window',function($scope,$location,faculty_config,$window) {
    var flag = faculty_config.setConfig();

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

facultyApp.controller('companyFacultyCtrl',['$scope','facultyFactory1','$state','$window','$timeout',function($scope,facultyFactory1,$state,$window,$timeout){


    var company = facultyFactory1.fetchBranchInfo().fetch({},function(response){
        var userName = $window.localStorage.getItem('facultyName');
        console.log(response);
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
            $scope.$parent.address = branch_info.address;
            $scope.$parent.branchName = branch_info.branchName;
            $scope.$parent.pincode = branch_info.pincode;
            $scope.$parent.userName = branch_info.userName;
            $state.go('dash');
        }
    },error);

    $scope.setBaseContentHeight = function(length){
        if(length > 10){
            $('.base-content').css({'height':'90%'});
            $('.slim-content').slimScroll({
                height: "88%",
                alwaysVisible: false,
                size: "3px"
            }).css("width", "100%");
            $('.table-base .slimScrollDiv').css('min-width','660px');
        }else{
            $('.base-content').height('auto');
            $('.slim-content').slimScroll({
                destroy:true
            });
        }
    };

    $state.go('dash');
}]);

facultyApp.config(['$stateProvider','$urlRouterProvider','$routeProvider','$locationProvider','blockUIConfig',function($stateProvider,$urlRouterProvider,$routeProvider, $locationProvider,blockUIConfig) {
    /*$httpProvider.defaults.useXDomain = true;
     delete $httpProvider.defaults.headers.common['X-Requested-With'];*/

    $urlRouterProvider.otherwise("/#");

    $stateProvider
        .state('dash', {
            url: "/dash",
            templateUrl: 'views/faculties/faculties_dashboard.html',
            controller:'dashboardCtrl'
        })

        .state('pass',{
            url: "/pass",
            templateUrl: 'views/faculties/fa_changePassword.html',
            controller: 'facultyPasswordCtrl'
        })

        .state('assignment', {
            abstract:true,
            url: "/assignment",
            template: '<div ui-view style="height:100%"></div>',
            controller:'assignmentCtrl'
        })
        .state('assignment.list', {
            url: "",
            templateUrl: 'views/faculties/fa_assignments.html'
        })
        .state('assignment.create', {
            url: "",
            templateUrl: 'views/faculties/fa_addAssignments.html'
        })
        .state('assignment.edit', {
            url: "",
            templateUrl: 'views/faculties/fa_editAssignment.html'
        })

        .state('leave',{
            abstract:true,
            url: "/leave",
            template: '<div ui-view style="height:100%"></div>',
            controller: 'leaveManagementCtrl'
        })
        .state('leave.list', {
            url: "",
            templateUrl: 'views/faculties/fa_leave.html'
        })
        .state('leave.add', {
            url: "",
            templateUrl: 'views/faculties/fa_requestLeave.html'
        })
        .state('leave.edit', {
            url: "",
            templateUrl: 'views/faculties/fa_editLeave.html'
        })
        .state('leave.summary', {
            url: "",
            templateUrl: 'views/faculties/fa_leaveSummary.html'
        })
        .state('leave.transaction', {
            url: "",
            templateUrl: 'views/faculties/fa_leaveTransactions.html'
        })

        .state('status',{
            abstract:true,
            url: "/approval",
            template: '<div ui-view style="height:100%"></div>',
            controller: 'leaveStatusCtrl'
        })
        .state('status.list', {
            url: "",
            templateUrl: 'views/faculties/fa_leaveApproval.html'
        })

        /*.state('cancel',{
            abstract:true,
            url: "/cancel",
            template: '<div ui-view style="height:100%"></div>',
            controller: 'leaveCancelCtrl'
        })
        .state('cancel.list', {
            url: "",
            templateUrl: 'views/faculties/fa_leaveCancel.html'
        })*/

        .state('attendance',{
            abstract:true,
            url: "/attendance",
            template: '<div ui-view style="height:100%"></div>',
            controller: 'stdAttendanceCtrl'
        })
        .state('attendance.list', {
            url: "",
            templateUrl: 'views/faculties/fa_listClassroom.html'
        })
        .state('attendance.add', {
            url: "",
            templateUrl: 'views/faculties/fa_attendance.html'
        })

    ;

    $locationProvider.html5Mode(true);
    blockUIConfig.message =  "Processing ...";

}]);

facultyApp.controller('logoutCtrl', ['$scope', '$window','$sessionStorage','$localStorage',function($scope, $window,$sessionStorage,$localStorage) {
    $scope.logout = function(){
        $window.sessionStorage.removeItem('orgId');
        $window.sessionStorage.removeItem('branchId');
        $window.sessionStorage.removeItem('facultyId');
        $window.sessionStorage.clear();
        $window.localStorage.clear();
        $sessionStorage.$reset();
        $localStorage.$reset();
        $window.location = 'appLogin.html';
    }
}]);

facultyApp.controller('facultyPasswordCtrl', ['$scope','facultyFactory1','$state','$timeout','$window',function($scope,facultyFactory1,$state,$timeout,$window){
    var initials = {
        username:"",oldPassword:"",newPassword:"",confirmPassword:""
    };

    $scope.passwordChange = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };
    $scope.changeFacultyPassword = function(){
        var uid = $window.sessionStorage.getItem('facultyId');
        console.log("udi "+ uid);
        var add = $scope.add;
        var body = ' { ' +
            '"username":"' + add.username + '",' +
            '"oldPassword" :"' + add.oldPassword + '",'+
            '"newPassword" :"'+ add.newPassword + '",' +
            '"confirmPassword" :"'+ add.confirmPassword +
            '"}';
        var user = window.btoa(uid);
        var response = facultyFactory1.changeFacultyPassword(user);
        var data = response.pass({}, body, function (response) {
            if(response.status == 200){
                alert("Password Changed successfully!!!");
                $window.location = 'index.html';
            }
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Password change is unsuccessful !!!";
        });
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('dash');
    };
}]);



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

facultyApp.controller('dialogeCtrl', ['$scope', '$modalInstance','data',function ($scope, $modalInstance,data) {
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

