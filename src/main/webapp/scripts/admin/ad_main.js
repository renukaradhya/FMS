
var appAdmin = angular.module('appAdmin',['ui.bootstrap','blockUI','slimScrollDirective','highcharts-ng','angularUtils.directives.dirPagination','config_app','ui.bootstrap','ad_login_app',"checklist-model",'ui.router', 'ngRoute', 'ngResource']);

appAdmin.factory('addFactory',['$resource','admin_config','$window',function($resource,admin_config,$window){
    var factory = {};
    var baseUrl = admin_config.getBaseUrl();
    // var password_url= admin_config.getPasswordApi();

    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchOrganizationList = function(){
        return $resource(baseUrl+'org',{},{
            fetch: {
                method: 'get',
                isArray: true,
                interceptor: {
                    response: function (data) {
                        return data;
                    }
                }
            }
        });
    };


    factory.createOrgnization = function(){
        // http://localhost:8080/Eshiksha/org
        return $resource(baseUrl+'org',{},{
            add:{
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

    factory.validateUsername = function(orgId,userName) {
        return $resource(baseUrl+'org/'+orgId+'/userName/'+userName,{},{
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

    // http://localhost:8080/Eshiksha/org/adminInfo
    factory.listAdmins = function(){
        return $resource(baseUrl+'org/adminInfo',{},{
            fetch: {
                method: 'get',
                isArray: true,
                interceptor: {
                    response: function (data) {
                        return data;
                    }
                }
            }
        });
    };

    factory.createAdmin = function(orgId){
        // http://52.66.47.7:8080/Eshiksha/org/ORG0000001/admin
        return $resource(baseUrl+'org/'+orgId+'/admin',{},{
            add:{
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


   /* factory.changePassword = function(uid){
        // http://localhost:8080/feesmanagementsystem/org/sdfaf/user/dsafa/password
        return $resource(password_url+'/user/'+uid+'/password',{},{
            pass:{
                method:'PUT',
                headers:{ 'Authorization' :authCode, 'Content-Type': 'application/json'},
                interceptor: {
                    response : function(data){
                        return data;
                    }
                }
            }
        });
    };*/


    return factory;
}]);

appAdmin.run([function () {
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

appAdmin.controller('adminController',['$scope','$location','admin_config','$window',function($scope,$location,admin_config,$window) {
    var flag = admin_config.setConfig();

    if(flag)
        _init();
    else {
        $window.location = 'index.html';
        $scope.$parent.response_message = 'Please try after some time';
    }
    function _init(){
        $location.path('/orglist.list');
    }
}]);

appAdmin.controller('orgController',['$scope','addFactory','$state','$timeout','$window',function($scope,addFactory,$state,$timeout,$window){


    var initials = {
        orgName:"",address:"",pincode:"",userName:"",password:"",firstName:"",lastName:"",email:"",
        phoneNumber:"",type:"",boardOfEducation:"",recognizedBy:"",affiliationNumber:"",faxNumber:""
    };
    $scope.bg_list = ["A +ve","A -ve","B +ve","B -ve","AB +ve","AB -ve","O +ve","O -ve"];
    $scope.todaydate = new Date();

    var oganizations =  addFactory.fetchOrganizationList().fetch({},function(response){
            $scope.organization_list =[];
            $scope.todaydate = new Date();
            if(response.status == 200 || response.status == 201) {

                // var _data1 = JSON.parse(response.data);
                var _data = angular.fromJson(response.data);
                $scope.organization_list = _data;
                $state.go('orglist.list');
            }
        },error);
    // var orgnizations;

    $scope.setBaseContentHeight = function(length){
        if(length > 10){
            $('.base-content').css({'height':'100%'});
            $('.slim-content').slimScroll({
                height: "95%",
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

    $scope.fetchOrgList = function() {
        addFactory.fetchOrganizationList().fetch({},function(response){
            $scope.organization_list =[];
            $scope.todaydate = new Date();
            if(response.status == 200) {

                var _data = angular.fromJson(response.data);
                $scope.organization_list = _data;
            }
        },error);
    };


    $scope.createOrg = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        $scope.add.gender = "Male";
    };

    $scope.createOrgnization = function(){
        var add = $scope.add;

        var body = ' { ' +
            '"orgName":"' + add.orgName + '",' +
            '"address" :"' + add.address + '",'+
            '"pincode" :"'+ add.pincode + '",' +
            '"boardOfEducation" :"'+ add.boardOfEducation + '",' +
            '"recognizedBy" :"'+ add.recognizedBy + '",' +
            '"faxNumber" :"'+ add.faxNumber + '",' +
            '"affiliationNumber" :"'+ add.affiliationNumber + '"' +
            '}';

        var response = addFactory.createOrgnization();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                //$scope.fetchOrgList();
                $scope.response_msg = "Organization created successfully !!!";
                $state.go('orglist.list');
            }
            //$state.go('^.list');
        },function(response){
            $scope.response_msg1 = response.data.errorMessage;

            if(response.status == 409){
                $scope.response_msg1 = "Creating organization unsuccessful !!!";
            } else if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
             }
            else
                $scope.response_msg1= "Creating organization unsuccessful !!!";
        });
    };

    $scope.listAdmins = function(){
        $scope.response_msg = "";
        addFactory.listAdmins().fetch({},function(response){
            $scope.admin_list =[];
            console.log(response);
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.admin_list = _data;
                    $scope.$parent.setBaseContentHeight($scope.admin_list.length);
                }
            }
        },function(response){
            $scope.admin_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.validateUsername = function(org,userName){

        if(orgId  != undefined){
            var user = window.btoa(userName);
            var orgid = window.btoa(org);
            addFactory.validateUsername(orgid, user).fetch({}, function(response){
                if(response.status == 200 || response.status == 201){
                    $scope.availability = "Available !!"
                }
            }, function(response){
                $scope.availability = response.data.errorMessage;
            });

        }else{
            $scope.availability = "Please select the Organization Id.";
        }
    };

    $scope.addAdmin = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.org_list = $scope.organization_list;
        $scope.add = angular.copy(initials);
        $scope.add.gender = "Male";
    };


    $scope.createAdmin = function (organizationId) {
        var add = $scope.add;

        var body = ' { ' +
            '"userName":"' + add.userName + '",' +
            '"password" :"' + add.password + '",'+
            '"firstName":"' + add.firstName + '",' +
            '"lastName" :"' + add.lastName + '",'+
            '"gender" :"' + add.gender + '",'+
            '"blood" :"' + add.blood + '",'+
            '"emails"'+':'+
                '['+
                    '{'+
                        '"email" :"' + add.email + '",'+
                        '"type" :"' + add.type +'"'+
                    '}'+
                ']'+','+
                '"phoneNumbers"'+':'+
                '['+
                    '{'+
                        '"phoneNumber" :"' + add.phoneNumber + '",'+
                        '"type" :"' + add.type +'"'+
                    '}'+
                ']'+
            '}';

        console.log(organizationId);
        var response = addFactory.createAdmin(organizationId);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.listAdmins();
            }
            $state.go('^.adminlist');
            $scope.response_msg = "Organization Admin added successfully !!!";
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data;
            }
            else
                $scope.response_msg1= "Addition of Organization Admin is unsuccessful !!!";
        });
    };

    $scope.orgDetails = {
        organization_list: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };

    $scope.pageChanged = function(){
        $scope.orgDetails.startValue = (($scope.orgDetails.currentPage - 1) * $scope.orgDetails.numPerPage);
        $scope.fetchFacultyList($scope.orgDetails.startValue,$scope.orgDetails.numPerPage);
    };


    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

    $state.go('orglist.list');
}]);

appAdmin.config(['$stateProvider','$urlRouterProvider','$routeProvider','$locationProvider','blockUIConfig',function($stateProvider,$urlRouterProvider,$routeProvider, $locationProvider,blockUIConfig) {
    /*$httpProvider.defaults.useXDomain = true;
     delete $httpProvider.defaults.headers.common['X-Requested-With'];*/

    $urlRouterProvider.otherwise("/#");

    $stateProvider
        .state('orglist', {
            url: "/orglist",
            template: '<div ui-view style="height:100%"></div>',
            //templateUrl: 'views/admin/ad_orglist.html',
            controller:'orgController'
        })
        .state('orglist.list', {
            url: "",
            templateUrl: 'views/admin/ad_orglist.html'
        })
        .state('orglist.add', {
            url: "",
            templateUrl: 'views/admin/ad_addOrg.html'
        })
        .state('orglist.admin', {
            url: "",
            templateUrl: 'views/admin/ad_createAdmin.html'
        })
        .state('orglist.adminlist', {
            url: "",
            templateUrl: 'views/admin/ad_adminList.html'
        })
        .state('pass', {
            url: "/pass",
            templateUrl: 'views/br_manager/change_password.html',
            controller:'passwordCtrl'
        });

    $locationProvider.html5Mode(true);
    blockUIConfig.message =  "Processing ...";

}]);

appAdmin.controller('logoutCtrl', ['$scope', '$window',function($scope, $window) {
    $scope.logout = function(){
        $window.sessionStorage.removeItem('adminId');
        //$window.sessionStorage.removeItem('pcId');
        //$window.sessionStorage.removeItem('userId');
        $window.location = 'appLogin.html';
    }
}]);

/*
branchManager.controller('passwordCtrl', ['$scope','addFactory','$state','$timeout','$window',function($scope,addFactory,$state,$timeout,$window) {
    var initials = {
        username:"",oldPassword:"",newPassword:"",confirmPassword:""
    };

    $scope.passwordChange = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };
    $scope.changePassword = function(){

        var uid = $window.sessionStorage.getItem('userId');
        console.log("udi "+ uid);
        var add = $scope.add;
        var body = ' { ' +
            '"username":"' + add.username + '",' +
            '"oldPassword" :"' + add.oldPassword + '",'+
            '"newPassword" :"'+ add.newPassword + '",' +
            '"confirmPassword" :"'+ add.confirmPassword +
            '"}';
        var user = window.btoa(uid);
        var response = branchManagerFactory.changePassword(user);
        var data = response.pass({}, body, function (response) {
            if(response.status == 200){
                alert("Password Changed successfully!!!");
            }
            $state.go('^.dash');
            $scope.response_msg = "Password changed successfully !!!";
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
}]);*/

function goToHome(){
    $('.sidebar-menu #space a').trigger('click');
}

