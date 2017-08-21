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
var facultyApp = angular.module('facultyApp',['ui.bootstrap','blockUI','slimScrollDirective','highcharts-ng','angularUtils.directives.dirPagination','config_app','faculties_login',"checklist-model",'ui.router', 'ngRoute', 'ngResource']);

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
        .state('cancel',{
            abstract:true,
            url: "/cancel",
            template: '<div ui-view style="height:100%"></div>',
            controller: 'leaveCancelCtrl'
        })
        .state('cancel.list', {
            url: "",
            templateUrl: 'views/faculties/fa_leaveCancel.html'
        })


    ;

    $locationProvider.html5Mode(true);
    blockUIConfig.message =  "Processing ...";

}]);

facultyApp.controller('logoutCtrl', ['$scope', '$window',function($scope, $window) {
    $scope.logout = function(){
        $window.sessionStorage.removeItem('orgId');
        $window.sessionStorage.removeItem('branchId');
        $window.sessionStorage.removeItem('facultyId');
        $window.location = 'index.html';
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


facultyApp.factory('dashboardFactory', ['$resource', 'faculty_config', '$window',function($resource, faculty_config, $window){
    var factory = {};
    var dashboard_url = faculty_config.getAssetAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchAssetList = function(){
        return $resource(dashboard_url,{},{
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

facultyApp.controller('dashboardCtrl', ['$scope','dashboardFactory',function($scope,dashboardFactory){

    $scope.fetchAssetList = function(){
        $scope.response_msg = "";
        dashboardFactory.fetchAssetList().fetch({},function(response){
            $scope.asset_info =[];
            console.log(response);
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.asset_info = _data;
                }
            }
        },function(response){
            $scope.asset_info = [];
            console.log(response.status);
        });
    };

    $scope.init = function(){
        $scope.fetchAssetList();
    };

    $scope.init();
}]);

facultyApp.factory('leaveFactory',['$resource','faculty_config', '$window',function($resource,faculty_config, $window) {
    var factory = {};
    var fetch_leave_url = faculty_config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");


    factory.fetchLeaveList = function(faculty,year,offset,limit){
        // http://localhost:8080/Eshiksha/org/sdfsdf/branch/sfdsdf/facultyleave/sdfsdf/year/sdfsdf
        // '/faculty?offset='+offset+'&limit='+limit,
        return $resource(fetch_leave_url+'/facultyleave/'+faculty+'/year/'+year+'?offset='+offset+'&limit='+limit,{},{
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

    factory.fetchApprovalList = function(faculty,year,offset,limit){
        // http://localhost:8080/Eshiksha/org/dfsfdsdf/branch/sfsdf/facultyleave/dfsdf/year/sdfsdfs/statusList
        // '/faculty?offset='+offset+'&limit='+limit,
        return $resource(fetch_leave_url+'/facultyleave/'+faculty+'/year/'+year+'/statuslist?offset='+offset+'&limit='+limit,{},{
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

    factory.submitLeaveRequest = function(uid){
        // http://localhost:8080/Eshiksha/org/erwer/branch/ewrwer/facultyleave/werwer
        return $resource(fetch_leave_url+'/facultyleave/'+uid,{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data)
                    {
                        return data;
                    }
                }
            }
        });
    };

    factory.leaveCancel = function (leaveId, facultyId, Cancel) {
        // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/facultyleave/FAC00001/leave/LEAVE0000005/state/Cancel/cancel
        return $resource(fetch_leave_url+'/facultyleave/'+facultyId+'/leave/'+leaveId+'/state/'+Cancel+'/cancel',{}, {
            remove: {
                method: 'put',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor: {
                    response: function (data){
                        return data;
                    }
                }
            }
        });
    };

    factory.editLeaveEntry = function(facultyId){
        // http://localhost:8080/Eshiksha/org/org123/branch/bran123/facultyleave/fac123/update
        return $resource(fetch_leave_url+'/facultyleave/'+facultyId+'/update',{},{
            edit: {
                method: 'PUT',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray: false,
                interceptor: {
                    response: function(data){
                        return data;
                    }
                }
            }
        });
    };

    return factory;
}]);


facultyApp.controller('leaveManagementCtrl', ['$scope','leaveFactory','faculty_appConfig','$state','$filter','$modal','$window',function($scope,leaveFactory,faculty_appConfig,$state,$filter,$modal,$window)
{
    // Check for initials
    var initials = {fromDate:"", toDate:"", reason:"", year:"" };
    $scope.leaveDetails = {
        leaveList: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };
    $scope.fetchYearList = function () {
        $scope.year_list = ["2015-16","2016-17","2017-18","2018-19"];
    };
    $scope.fetchLeaveList = function(year,offset,limit){
        var faculty = $window.sessionStorage.getItem('facultyId');
        var faculty1 = window.btoa(faculty);
        var year1 = window.btoa(year);
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        leaveFactory.fetchLeaveList(faculty1,year1,offset,limit).fetch({},function(response){
            $scope.leave_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.facultyLeaveResponseDTO!=undefined){
                    var _data = angular.fromJson(response.data.facultyLeaveResponseDTO);
                    $scope.leave_list = _data;
                 //   console.log("leave_list"+$scope.leave_list.state);
                   $scope.totalPages = Math.ceil($scope.count/$scope.leaveDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.leave_list.length);
                }
            }

        },function(response){
            $scope.leave_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "leave" && $scope.leave_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.leave_list.length);
        }
    });

    $scope.requestLeave = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };


    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

    $scope.submitLeaveRequest = function(){

        var add = $scope.add;
        var uid = $window.sessionStorage.getItem('facultyId');
        console.log("FId:"+ uid);
        var faculty1 = window.btoa(uid);
        $scope.add.fromDate.Value = $filter('date')(new Date(add.fromDate),'yyyy-MM-dd');
        $scope.add.toDate.Value = $filter('date')(new Date(add.toDate),'yyyy-MM-dd');
        console.log("Inside the Submit Leave Function");
        var body = ' { ' +
            '"fromDate" :"' + $scope.add.fromDate.Value + '",' +
            '"toDate" :"' + $scope.add.toDate.Value + '",' +
            '"year":"' + add.year + '",' +
            '"reason" :"' + add.reason +
            '"}';
        var response = leaveFactory.submitLeaveRequest(faculty1);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchYearList();
            }
            $state.go('^.list');
            $scope.response_msg = "Addition of Leave Is Successfull !!!";
        },function(response){
            if(response.status == 409 || response.status == 404){
                // Check for status Code and variable below
               $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition Of Leave Is Unsuccessful !!!";
        });
    };

    $scope.leaveCancel = function(leave,index,year){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var cancel = window.btoa("Cancel");
        var leave = window.btoa(leave.leaveId);
        var year1 = window.btoa(year);
        console.log("Leave cancellation Year:"+year1);
        console.log("Inside Cancel function !!");
        var facultyID1 = $window.sessionStorage.getItem('facultyId');
        var faculty = window.btoa(facultyID1);
        console.log("FId:"+ faculty);

        var dialogue_message = "Are you sure you want to Cancel the Leave ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){

                leaveFactory.leaveCancel(leave,faculty,cancel).remove({},function(response){
                    if(response.status == 200){
                        $scope.fetchYearList();
                        $scope.leave_list =[];
                        console.log("Cancelled")
                    }
                    $state.go("^.list");
                    $scope.response_msg = "Leave Cancelled successfully !!!";
                },function(response){
                    if(response.status == 409 || response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }else{
                        $scope.response_msg1 = "Leave Cancellation failed !!!";
                        console.log(response.status);
                    }

                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };

    $scope.editLeave = function (leaveId) {
        console.log("leaveId :"+leaveId);
        //$scope.edit.leaveId = leaveId;
        //console.log($scope.edit.leaveId);
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.leave_list, function (leave) {
            console.log("Leave: "+leave.leaveId);
            if (leaveId == leave.leaveId) {
                $scope.edit.leaveId = leave.leaveId;
                $scope.edit.fromDate = new Date(leave.fromDate);
                $scope.edit.toDate = new Date(leave.toDate);
                $scope.edit.year = leave.year;
                $scope.edit.reason = leave.reason;
            }
        });
    };

    $scope.editLeaveEntry = function (leaveId,year) {
        var facultyId = $window.sessionStorage.getItem('facultyId');
        var faculty = window.btoa(facultyId);
        var leave = window.btoa(leaveId);
        var year1 = window.btoa(year);
        var edit = $scope.edit;
        console.log("Edited Leave "+leave);
        console.log("Edited Year"+year1);
        $scope.edit.fromDate.Value = $filter('date')(new Date(edit.fromDate),'yyyy-MM-dd');
        $scope.edit.toDate.Value = $filter('date')(new Date(edit.toDate),'yyyy-MM-dd');
        var body = ' { ' +
            '"fromDate" :"' +$scope.edit.fromDate.Value + '",' +
            '"toDate" :"' + $scope.edit.toDate.Value + '",' +
            '"year":"' + edit.year + '",' +
            '"reason" :"' + edit.reason+ '",' +
            '"leaveId":"' + leaveId + '"' +
            ' } ';
       // var leave = window.btoa(leaveId);
        var response = leaveFactory.editLeaveEntry(faculty);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200){
                $scope.fetchYearList();
            }
            $state.go("^.list");
             $scope.response_msg = "Leave Details are Updated successfully !!!";

        },function(response){
            if(response.status == 409 || response.status == 404){
                // Check for status Code and variable below
               // $scope.edit.vehicle = "";
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Leave details are unsuccessful !!!";
        });
    };

    $scope.init = function(year){
        $scope.leaveDetails.numPerPage = parseInt($scope.leaveDetails.numPerPage);
        $scope.maxSize = 5;
         $scope.fetchLeaveList(year,0,$scope.leaveDetails.numPerPage);
        console.log("Selected Items per Page :"+$scope.leaveDetails.numPerPage);
    };

    $scope.init();

    $scope.pageChanged = function(year){
        $scope.leaveDetails.startValue = (($scope.leaveDetails.currentPage - 1) * $scope.leaveDetails.numPerPage);
        $scope.fetchLeaveList(year,$scope.leaveDetails.startValue,$scope.leaveDetails.numPerPage);
    };
}]);
facultyApp.controller('leaveStatusCtrl', ['$scope','leaveFactory','faculty_appConfig','$state','$filter','$modal','$window',function($scope,leaveFactory,faculty_appConfig,$state,$filter,$modal,$window)
{
    $scope.approvalDetails = {
        leaveList: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };

    $scope.fetchYearList = function () {
        $scope.year_list = ["2015-16","2016-17","2017-18","2018-19"];
    };
    $scope.fetchApprovalList = function(year,offset,limit){
        var faculty = $window.sessionStorage.getItem('facultyId');
        var faculty1 = window.btoa(faculty);
        console.log("FacultyId in Approval: "+faculty1);
        var year1 = window.btoa(year);
        console.log("Year in Approval: "+year1);
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        leaveFactory.fetchApprovalList(faculty1,year1,offset,limit).fetch({},function(response){
            $scope.approval_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                console.log("Total Leaves Count: "+response.data.total);
                if(response.data.facultyLeaveResponseDTO!=undefined){
                    var _data = angular.fromJson(response.data.facultyLeaveResponseDTO);
                    $scope.approval_list = _data;
                    // console.log("leave_list"+$scope.leave_list);
                    $scope.totalPages = Math.ceil($scope.count/$scope.approvalDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.approval_list.length);
                }
            }

        },function(response){
            $scope.approval_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "status" && $scope.approval_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.approval_list.length);
        }
    });

    $scope.init = function(year){
        $scope.approvalDetails.numPerPage = parseInt($scope.approvalDetails.numPerPage);
        $scope.maxSize = 5;
         $scope.fetchApprovalList(year,0,$scope.approvalDetails.numPerPage);
        console.log("Selected Items Per Page: "+$scope.approvalDetails.numPerPage);
    };

    $scope.init();

    $scope.pageChanged = function(year){
        $scope.approvalDetails.startValue = (($scope.approvalDetails.currentPage - 1) * $scope.approvalDetails.numPerPage);
        $scope.fetchApprovalList(year,$scope.approvalDetails.startValue,$scope.approvalDetails.numPerPage);
    };

}]);

/*
facultyApp.controller('leaveRejectCtrl', ['$scope','leaveFactory','faculty_appConfig','$state','$filter','$modal','$window',function($scope,leaveFactory,faculty_appConfig,$state,$filter,$modal,$window)
{
    $scope.rejectionDetails = {
        leaveList: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };

    $scope.fetchYearList = function () {
        $scope.year_list = ["2015-16","2016-17","2017-18","2018-19"];
    };
    $scope.fetchRejectionList = function(year){
        var faculty = $window.sessionStorage.getItem('facultyId');
        console.log("FacultyId in Rejection: "+faculty);
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        leaveFactory.fetchRejectionList(faculty,year).fetch({},function(response){
            $scope.rejection_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.facultyLeaveResponseDTO!=undefined){
                    var _data = angular.fromJson(response.data.facultyLeaveResponseDTO);
                    $scope.rejection_list = _data;
                    // console.log("leave_list"+$scope.leave_list);
                    $scope.totalPages = Math.ceil($scope.count/$scope.rejectionDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.rejection_list.length);
                }
            }

        },function(response){
            $scope.rejection_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "reject" && $scope.rejection_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.rejection_list.length);
        }
    });


}]);

facultyApp.controller('leaveCancelCtrl', ['$scope','leaveFactory','faculty_appConfig','$state','$filter','$modal','$window',function($scope,leaveFactory,faculty_appConfig,$state,$filter,$modal,$window)
{
    $scope.cancellationDetails = {
        leaveList: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };

    $scope.fetchYearList = function () {
        $scope.year_list = ["2015-16","2016-17","2017-18","2018-19"];
    };
    $scope.fetchCancellationList = function(year){
        var faculty = $window.sessionStorage.getItem('facultyId');
        console.log("FacultyId in Rejection: "+faculty);
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        leaveFactory.fetchCancellationList(faculty,year).fetch({},function(response){
            $scope.cancellation_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.facultyLeaveResponseDTO!=undefined){
                    var _data = angular.fromJson(response.data.facultyLeaveResponseDTO);
                    $scope.cancellation_list = _data;
                    // console.log("leave_list"+$scope.leave_list);
                    $scope.totalPages = Math.ceil($scope.count/$scope.cancellationDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.cancellation_list.length);
                }
            }

        },function(response){
            $scope.cancellation_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "cancel" && $scope.cancellation_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.cancellation_list.length);
        }
    });


}]);*/

facultyApp.factory('assignmentFactory',['$resource','faculty_config', '$window',function($resource,faculty_config, $window){
    var factory = {};
    var fetch_assignment_url = faculty_config.getAssignmentAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchAssignmentList = function(classRoomId){
        //http://localhost:8080/feesmanagementsystem/org/ORG0000001/branch/BRANCH0001/classroom/CL0000002/assignment
        return $resource(fetch_assignment_url+'/classroom/'+classRoomId+'/assignment',{},{
            add: {
                method: 'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        return data;
                    }
                }
            }
        });
    };


    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_assignment_url+'/classroom/year/'+ selectedYear, {}, {
            fetch : {
                method : 'get',
                isArray : false,
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data) {
                        return data;
                    }
                }
            }
        });
    };

    factory.fetchSectionList = function(currentStandard, selectedYear) {

        // first/section/yr/2016-17
        return $resource(fetch_assignment_url+'/classroom/standard/' + currentStandard +  '/section/year/'
            + selectedYear, {}, {
            fetch : {
                method : 'get',
                isArray : false,
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data) {
                        return data;
                    }
                }
            }
        });
    };

    factory.listSubjects = function(classRoomId){
        return $resource(fetch_assignment_url+'/subject/classroom/'+classRoomId,{},{
            fetch : {
                method : 'get',
                isArray : false,
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data) {
                        return data;
                    }
                }
            }
        });
    };

    factory.createAssignment = function(facultyId, classRoomId, subjectId){
        // classroom/CL0000001/assignment/subject/KAN011/faculty/FC0000001
        return $resource(fetch_assignment_url+'/classroom/'+classRoomId+'/assignment/subject/'+subjectId+'/faculty/'+facultyId,{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        return data;
                    }
                }
            }
        });
    };

    // classroom/CLASSROOM/assignment/subject/SUBJECT/faculty/FACALTY/startDate/2012-70-45/update
    factory.updateAssignment = function(facultyId, classRoomId, subjectId, startDate){
        // classroom/CL0000001/assignment/subject/KAN011/faculty/FC0000001
        return $resource(fetch_assignment_url+'/classroom/'+classRoomId+'/assignment/subject/'+subjectId+'/faculty/'+facultyId+'/startDate/'+startDate+"/update",{},{
            edit:{
                method:'PUT',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
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

facultyApp.controller('assignmentCtrl', ['$scope','assignmentFactory','faculty_appConfig','$state','$filter','$modal','$window',function($scope,assignmentFactory,faculty_appConfig,$state,$filter,$modal,$window){
    var initials = {
        assignmentId:"",assignmentName:"",subjectName:"",description:"",startDate:"",endDate:""
    };

    $scope.assignmentDetails = {
        assignment_list: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };


    $scope.fetchYearList = function(){
        //$scope.response_msg = "";
        $scope.year_list = ["2016-17","2017-18","2018-19", "2019-20"];
        $scope.assignment_list =[];
    };


    $scope.fetchStandardList = function(selectedYear){
        var year = window.btoa(selectedYear);
        assignmentFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            if(response.status == 200 || response.status == 201){
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                    console.log( $scope.standard_list);
                }
            }
        },function(response){
            $scope.standard_list = [];
            $scope.response_msg = "There is no Standards found for this year.";
            console.log(response.status);
        });

    };

    $scope.fetchSectionList = function(currentStandard,selectedYear){
        $scope.response_msg = "";
        var standard = window.btoa(currentStandard);
        var year = window.btoa(selectedYear);
        assignmentFactory.fetchSectionList(standard,year).fetch({},function(response){
            $scope.classroom_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classroom_list = _data;
                    console.log( $scope.classroom_list);
                }
            }
        },function(response){
            $scope.classroom_list = [];
            $scope.response_msg = "There is no classrooms found for this year.";
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.listSubjects = function(classroom){
        $scope.response_msg = "";
        console.log(classroom.classRoomId);
        var classRoom = window.btoa(classroom.classRoomId);
        assignmentFactory.listSubjects(classRoom).fetch({},function(response){
            $scope.sub_list = [];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.subjects!=undefined){
                    var _data = angular.fromJson(response.data.subjects);
                    $scope.sub_list = _data;
                    console.log($scope.sub_list);
                }
            }
        },function(response){
            $scope.sub_list = [];
            $scope.response_msg = "No Subjects Found";
            console.log(response.status);
        });
    };

    $scope.fetchAssignmentList = function(currentClassroom, startDate, endDate){
        $scope.response_msg = "";

        $scope.startDate = $filter('date')(new Date(startDate),'yyyy-MM-dd');
        $scope.endDate = $filter('date')(new Date(endDate),'yyyy-MM-dd');
        var body = ' { ' +
            '"startTime":"' + $scope.startDate + '",' +
            '"endTime" :"' + $scope.endDate + '"}';
        var classRoom = window.btoa(currentClassroom.classRoomId);
        var response = assignmentFactory.fetchAssignmentList(classRoom);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.assignment_list =[];
                console.log(response);
                if(response.status == 200 || response.status == 201){
                    $scope.count = response.data.total;
                    console.log($scope.count);

                    if(response.data.assignments!=undefined){
                        var _data = angular.fromJson(response.data.assignments);
                        console.log(_data);
                        $scope.assignment_list = _data;
                        console.log("data displayed ");
                        $scope.totalPages = Math.ceil($scope.count/$scope.assignmentDetails.numPerPage);
                        $scope.$parent.setBaseContentHeight($scope.assignment_list.length);
                    }
                }
            }
        },function(response){
            $scope.assignment_list = [];
            $scope.response_msg = "There is no assignments found for this classroom.";
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.addAssignment = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };


    $scope.createAssignment = function(classroom, subject){
        var add = $scope.add;
        var facId = $window.sessionStorage.getItem("facultyId");

        $scope.add.startDate.Value = $filter('date')(new Date(add.startDate),'yyyy-MM-dd');
        $scope.add.endDate.Value = $filter('date')(new Date(add.endDate),'yyyy-MM-dd');

        var body = ' { ' +
            '"assignmentName":"' + add.assignmentName + '",' +
            '"subjectName" :"' + subject.subjectName + '",'+
            '"description" :"'+ add.description + '",' +
            '"startDate" :"'+  $scope.add.startDate.Value + '",'+
            '"endDate" :"'+ $scope.add.endDate.Value +
            '"}';

        var faculty = window.btoa(facId);
        var classRoom = window.btoa(classroom.classRoomId);
        var subjectid = window.btoa(subject.subjectId);
        var response = assignmentFactory.createAssignment(faculty,classRoom, subjectid);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchYearList();
                $scope.response_msg = "Assignment added successfully !!!";
            }
            $state.go('^.list');
            $scope.response_msg = "Assignment added successfully !!!";
            console.log(response.status);
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of Assignment is unsuccessful !!!";
        });
    };
    $scope.editAssignment = function(assignment,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";

        $scope.edit = assignment;

        $scope.prevDate = new Date($scope.edit.startDate);
        $scope.edit.startDate = new Date($scope.edit.startDate);
        $scope.edit.endDate = new Date($scope.edit.endDate);

        //$scope.edit = angular.copy(initials);
    };

    $scope.updateAssignment = function(){
        var edit = $scope.edit;
        var facId = $window.sessionStorage.getItem("facultyId");

        $scope.startdate = $filter('date')(new Date( $scope.prevDate),'yyyy-MM-dd');
        $scope.edit.startDate = $filter('date')(new Date( $scope.edit.startDate),'yyyy-MM-dd');
        $scope.edit.endDate = $filter('date')(new Date( $scope.edit.endDate),'yyyy-MM-dd');

        var body = ' { ' +
            '"assignmentName":"' + edit.assignmentName + '",' +
            '"subjectName" :"' + edit.subjectName + '",'+
            '"description" :"'+ edit.description + '",' +
            '"startDate" :"'+  edit.startDate + '",'+
            '"endDate" :"'+ edit.endDate +
            '"}';

        console.log($scope.edit.classroomId);
        var startDate = window.btoa($scope.startdate);
        var faculty = window.btoa($scope.edit.facultyId);
        var classRoom = window.btoa($scope.edit.classroomId);
        var subjectid = window.btoa($scope.edit.subjectId);
        var response = assignmentFactory.updateAssignment(faculty,classRoom, subjectid, startDate);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchYearList();
                $scope.response_msg = "Assignment Updated successfully !!!";
            }
            $state.go('^.list');
            $scope.response_msg = "Assignment Updated successfully !!!";
            console.log(response.status);
        },function(response){
            if(response.status == 404){
             $scope.response_msg1 = response.data.errorMessage;
             }
             else
             $scope.response_msg1= "Updating of Assignment is unsuccessful !!!";
        });
    };
    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

 /*   $scope.init = function(){
    };


    $scope.init();*/
}]);


