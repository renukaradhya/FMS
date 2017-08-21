
var smart_parking = angular.module('smart_parking',['ui.bootstrap','slimScrollDirective','highcharts-ng','googlechart','angularUtils.directives.dirPagination','ngSanitize','config_app','login_app',"checklist-model",'ui.router','ngStorage']);

smart_parking.controller('mainController',['$scope','$location','Config','$window',function($scope,$location,Config,$window) {
    var flag = Config.setConfig();
    if(flag)
        _init();
    else {
        $window.location = 'index.html';
        $scope.$parent.response_message = 'Please try after some time';
    }
    function _init(){
        $location.path('/dash');
    }
   // var flag = true;
    if(!flag){
        $window.location = 'index.html';
        $scope.$parent.response_message = 'Please try after some time';
    }
}]);

smart_parking.directive('blink',['$timeout', function($timeout) {
    return {
        restrict: 'A',
        transclude: true,
        scope: {},
        controller: function ($scope, $element) {
            function showElement() {
                /*$element.css("color", "#000");*/
                $element.css("opacity", "1");
                $timeout(hideElement, 1000);
            }
            function hideElement() {
                /*$element.css("color", "#fff");*/
                $element.css("opacity", ".2");
                $timeout(showElement, 1000);
            }
            showElement();
        },
        template: '<span ng-transclude></span>',
        replace: true
    };
}]);
smart_parking.config(['$sceProvider',function($sceProvider) {
    // Completely disable SCE.  For demonstration purposes only!
    // Do not use in new projects.
    $sceProvider.enabled(false);
}]);

/* Added for Uploading files */
smart_parking.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

//Adding to find resize of window
smart_parking.directive('resize',['$window', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return {
                'h': w.height(),
                'w': w.width()
            };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.style = function () {
                return {
                    'height': (newValue.h - 100) + 'px',
                    'width': (newValue.w - 100) + 'px'
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
}]);
/* Added for to Provide html code from Angularjs */
smart_parking.config(['$provide',function($provide){
    $provide.decorator("$sanitize",['$delegate','$log', function($delegate, $log){
        return function(text, target){

            var result = $delegate(text, target);
            return result;
        };
    }]);
}]);


smart_parking.config(['$stateProvider','$urlRouterProvider','$locationProvider','blockUIConfig',function($stateProvider,$urlRouterProvider,$locationProvider,blockUIConfig ) {
    /*$httpProvider.defaults.useXDomain = true;
     delete $httpProvider.defaults.headers.angular['X-Requested-With'];*/

    $urlRouterProvider.otherwise("/#");

    $stateProvider
        .state('dash', {
            url: "/dash",
            templateUrl: 'views/ps/ps_dashboard.html',
            controller:'dashCtrl'
        })

        .state('password',{
            url:"/password",
            templateUrl: 'views/ps/passwordChange.html',
            controller:'password1Ctrl'
        })

        .state('branch', {
            abstract:true,
            url: "/branch",
            template: '<div ui-view style="height:100%"></div>',
            controller:'branchController'
        })
        .state('branch.list', {
            url: "",
            templateUrl: 'views/ps/ps_branches.html'
        })
        .state('branch.add', {
            url: "",
            templateUrl: 'views/ps/ps_add_branch.html'
        })
        .state('branch.edit', {
            url: "",
            templateUrl: 'views/ps/ps_editBranch.html'
        })


        .state('fees', {
            abstract:true,
            url: "/fees",
            template: '<div ui-view style="height:100%"></div>',
            controller:'feeController'
        })
        .state('fees.list', {
            url: "",
            templateUrl: 'views/ps/ps_feeManagement.html'
        })
        .state('fees.add', {
            url: "",
            templateUrl: 'views/ps/ps_addFee.html'
        })
        .state('fees.details', {
            url: "",
            templateUrl: 'views/ps/ps_feeStructureDetails.html'
        })
        .state('fees.edit', {
            url: "",
            templateUrl: 'views/ps/ps_editFee.html'
        })
        .state('branchManagers', {
            url: "/branchManagers",
            template: '<div ui-view style="height:100%"></div>',
            controller:'managerCtrl'
        })
        .state('branchManagers.list', {
            url: "",
            templateUrl: 'views/ps/ps_branchManagers.html'
        })
        .state('branchManagers.add', {
            url: "",
            templateUrl: 'views/ps/ps_addBranchManager.html'
        })
        .state('branchManagers.edit', {
            url: "",
            templateUrl: 'views/ps/ps_editManager.html'
        })
        .state('branchOperator', {
            url: "/branchoperator",
            template: '<div ui-view style="height:100%"></div>',
            controller:'operatorCtrl'
        })
        .state('branchOperator.list', {
            url: "",
            templateUrl: 'views/ps/ps_branchOperators.html'
        })
        .state('branchOperator.add', {
            url: "",
            templateUrl: 'views/ps/ps_addOperator.html'
        })
        .state('branchOperator.edit', {
            url: "",
            templateUrl: 'views/ps/ps_editOperator.html'
        })
        .state('settings', {
            abstract:true,
            url: "/settings",
            template: '<div ui-view style="height:100%"></div>',
            controller:'settingsController'
        })
        .state('settings.list', {
            url: "",
            templateUrl: 'views/ps/ps_ManageSettings.html'
        })
        .state('settings.post', {
            url: "",
            templateUrl: 'views/ps/ps_initialSettings.html'
        })
        .state('settings.final', {
            url: "",
            templateUrl: 'views/ps/ps_postFinalAssess.html'
        })
        .state('settings.aca', {
            url: "",
            templateUrl: 'views/ps/ps_postAcademicYear.html'
        })
        .state('settings.ass', {
            url: "",
            templateUrl: 'views/ps/ps_postAssessments.html'
        })
        .state('settings.set', {
            url: "",
            templateUrl: 'views/ps/mg_presets.html'
        })
        .state('settings.designation', {
            url: "",
            templateUrl: 'views/ps/ps_designation_list.html'
        })
        .state('settings.desig', {
            url: "",
            templateUrl: 'views/ps/ps_designation_post.html'
        })
        .state('settings.leavelist', {
            url: "",
            templateUrl: 'views/ps/ps_leavel_list.html'
        })
        .state('settings.leave', {
            url: "",
            templateUrl: 'views/ps/ps_leaves_post.html'
        })
        .state('settings.sys', {
            url: "",
            templateUrl: 'views/ps/ps_syllabus.html'
        })
        .state('settings.cat', {
            url: "",
            templateUrl: 'views/ps/ps_subjectCategories.html'
        })
        .state('settings.basic', {
            url: "",
            templateUrl: 'views/ps/ps_basicSettings.html'
        })
        .state('settings.logo', {
            url: "",
            templateUrl: 'views/ps/logo.html'
        })
        .state('settings.grade', {
            url: "",
            templateUrl: 'views/ps/ps_gradesPosting.html'
        })
    ;


    $locationProvider.html5Mode(true);
    //blockUIConfig.cssClass = 'block-ui bg-base';
    blockUIConfig.message = "Processing ...";

}]);

smart_parking.run([ function () {
    $(function () {
        $(document).keydown(function (e) {
            if((e.which || e.keyCode) == 116 || (e.keyCode == 82 && e.ctrlKey)){
                e.preventDefault();
                console.log(e)
            }else {
                return (e.which || e.keyCode) != 116;
            }
        });
    });
}]);



smart_parking.factory('spaceFactory',['$resource','Config', '$window',function($resource,Config, $window){
    var factory = {};
    var password_url= Config.getPasswordApi();
    var info_url = Config.getOrgAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.changePassword = function(uid){
            return $resource(password_url+'/user/'+uid+'/password',{},{
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
    factory.fetchOrgInfo = function(){
        return $resource(info_url,{},{
            fetch: {
                method: 'get',
                isArray: false,
                interceptor: {
                    response: function (data) {
                        console.log(data);
                        return data;
                    }
                }
            }
        });
    };

    return factory;
}]);

smart_parking.controller('spaceController', ['$scope','$rootScope','spaceFactory','$window','Config','$modal','$state',function($scope,$rootScope,spaceFactory,$window,Config,$modal,$state) {

    // $scope.$parent.logo_image = "images/space_default.jpg";
    // $scope.$parent.user_image = "images/avatar.png";
    $scope.todaydate = new Date();

    var company = spaceFactory.fetchOrgInfo().fetch({},function(response){
        $scope.todaydate = new Date();
        console.log(response);
        if(response.status == 200 || response.status == 201) {
            var _data = angular.fromJson(response.data);
            var org_info = {
                "orgName": _data.orgName,
                "adminName": _data.adminName,
                "address": _data.address,
                "pincode": _data.pincode
            };
            console.log(org_info.orgName);
            console.log(org_info.address);
            console.log(org_info.pincode);

            // $scope.$parent.logo_image = "images/loading5.jpg";

            $scope.$parent.orgName = org_info.orgName;
            $scope.$parent.adminName = org_info.adminName;
            $scope.$parent.address = org_info.address;
            $scope.$parent.pincode = org_info.pincode;
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
    }
}]);

smart_parking.controller('logoutCtrl', ['$scope', '$window','$sessionStorage','$localStorage', function($scope, $window,$sessionStorage,$localStorage) {
    $scope.logout = function(){
        $window.sessionStorage.removeItem('parkingSpaceId');
        $window.sessionStorage.removeItem('userId');
        $window.sessionStorage.clear();
        $window.localStorage.clear();
        $sessionStorage.$reset();
        $localStorage.$reset();
        $window.location = 'appLogin.html';
    }
}]);

function error(data,header){
    console.log("Error Response code : "+data.status);
}
function show_dialoge($modal,$scope,message,html){
    return $modal.open({
        scope: $scope,
        templateUrl: html,
        controller: 'dialogeCtrl',
        resolve :{
            message : function(){
                return message;
            }}
    });
}


smart_parking.controller('password1Ctrl', ['$scope','spaceFactory','$state','$timeout','$window',function($scope,spaceFactory,$state,$timeout,$window) {
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
        console.log("uid "+ uid);
        var add = $scope.add;
        var body = ' { ' +
            '"username":"' + add.username + '",' +
            '"oldPassword" :"' + add.oldPassword + '",'+
            '"newPassword" :"'+ add.newPassword + '",' +
            '"confirmPassword" :"'+ add.confirmPassword +
            '"}';
        var user = window.btoa(uid);
        var response = spaceFactory.changePassword(user);
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


smart_parking.controller('dialogeCtrl', ['$scope', '$modalInstance','message',function ($scope, $modalInstance,message) {

    $scope.message = message;
    $scope.ok = function () {
        $modalInstance.close(true);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

var setView = function (id, url, $scope, $http, $compile) {
    $http.get(url).then(function (result) {
        $('#' + id).html($compile(result.data)($scope));
    });
};

function goToHome(){
    $('.sidebar-menu #dashboard a').trigger('click');
}


smart_parking.value("slimScrollConfig", {});

smart_parking.directive("slimScroll", ["slimScrollConfig", function (slimScrollConfig) {
    var options = {};
    if (slimScrollConfig) {
        angular.extend(options, slimScrollConfig);
    }
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            // instance-specific options
            var opts = angular.extend({}, options, scope.$eval(attrs.slimScroll));
            angular.element(element).slimScroll(opts);/*
             if(attrs['list'] != undefined) {
             console.log(attrs['list'].length)
             if (attrs['list'].length > 0) {
             console.log(attrs['id'])
             var opts = angular.extend({}, options, scope.$eval(attrs.slimScroll));
             console.log(opts)
             angular.element(element).slimScroll(opts);
             }
             }*/
        }
    };
}]);