var login_app = angular.module('login_app',['blockUI','config_app','ngRoute','ngResource']);

login_app.config(['$locationProvider','blockUIConfig',function($locationProvider,blockUIConfig) {
    $locationProvider.html5Mode({enabled:true,requireBase:true});
    blockUIConfig.message =  "Logging In ...";
}]);

login_app.factory('loginFactory',['$resource','Config', function($resource,Config){
    var factory = {};
    var login_url = Config.getLoginApi();

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

/*login_app.run(['$window', '$rootScope','$location',
    function ($window ,  $rootScope,$location) {
        $rootScope.goBack = function(){
           $window.history.back();
        }
    }]);*/

login_app.controller('loginController',['$scope','loginFactory','$window',function($scope,loginFactory,$window){

    $scope.username = '';
    $scope.password = '';

   $scope.login = function(){
        var body = '{"userName":"'+$scope.username+'","password":"'+$scope.password+'"}';
               var response = loginFactory.getLogin($scope.login_as).login({},body,function(response){
            if(response.status == 200){
                var data = response.data;
                $window.sessionStorage.setItem('orgId',data.orgId);
                $window.sessionStorage.setItem('userId',data.userId);
                $window.localStorage.setItem('authCode', data.authCode);
                $window.location = 'ps_main.html';

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

    $scope.clearErrorMsg = function(){
        $scope.$parent.$parent.response_message = "";
    }
}]);

function error(data,header,$scope,response){
    console.log(response.$promise.getState());
    if(data.status == 404){

    }
}

var smart_parking = angular.module('smart_parking',['ui.bootstrap','slimScrollDirective','highcharts-ng','googlechart','angularUtils.directives.dirPagination','ngSanitize','config_app','login_app',"checklist-model",'ui.router']);

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
            templateUrl: 'views/ps/ps_fees.html'
        })
        .state('fees.add', {
            url: "",
            templateUrl: 'views/ps/ps_add_fee.html'
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
        });


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
        http://localhost:8080/feesmanagementsystem/org/sdfaf/user/dsafa/password
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
        // http://localhost:8080/Eshiksha/org/ORG0000001
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

smart_parking.controller('logoutCtrl', ['$scope', '$window', function($scope, $window) {
    $scope.logout = function(){
        $window.sessionStorage.removeItem('parkingSpaceId');
        $window.sessionStorage.removeItem('userId');
        $window.location = 'index.html';
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
smart_parking.factory('dashFactory',['$resource','Config', '$window',function($resource,Config, $window){
    var factory = {};
    var fetch_dashboard_asset_url = Config.getAssetAPI();
    var authCode = $window.localStorage.getItem("authCode");
    var main_url = Config.getBranchManagersAPI();

    factory.fetchAssetList = function(){
        return $resource(fetch_dashboard_asset_url,{},{
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

    // http://localhost:8080/Eshiksha/org/ORG0000001/organizationdashboard/studentcountbasedonbranch

    factory.sunburstData = function(){
        return $resource(main_url+'/organizationdashboard/studentcountbasedonbranch',{},{
            fetch: {
                method: 'get',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor: {
                    response: function (data) {
                        console.log(data);
                        return data;
                    }
                }
            }
        });
    };


    // http://localhost:8080/Eshiksha/org/ORG0000001/organizationdashboard/newadmissions
    // http://localhost:8080/Eshiksha/org/ORG0000001/organizationdashboard/studentcount

    factory.getStudentCount = function(){
        return $resource(main_url+'/organizationdashboard/studentcount',{},{
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

    factory.newAdmissions = function(){
        return $resource(main_url+'/organizationdashboard/newadmissions',{},{
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


smart_parking.controller("dashCtrl",['$scope','dashFactory',function($scope,dashFactory){

    $scope.fetchAssetList = function(){
        $scope.response_msg = "";
        dashFactory.fetchAssetList().fetch({},function(response){
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

    function chartData(){
        dashFactory.newAdmissions().fetch({},function(response){
            console.log(response);
            $scope.chart1_info = [];
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.chart1_info = _data;
                    $scope.branch_list = $scope.chart1_info.branchInfoWithListStudentCountDTO;
                    $scope.stCount = $scope.branch_list;
                    console.log($scope.stCount);
                    console.log($scope.branch_list);
                    console.log($scope.chart1_info);
                }
            }
        },function(response){
            $scope.chart1_info = [];
            console.log(response.status);
        });
    }
    chartData();

    function chartDataTwo(){
        dashFactory.getStudentCount().fetch({},function(response){
            console.log(response);
            $scope.chart2_info = [];
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.chart2_info = _data;
                    $scope.values = $scope.chart2_info.studentCountInOrganizationDTO;
                }
            }
        },function(response){
            $scope.chart2_info = [];
            console.log(response.status);
        });
    }
    chartDataTwo();

    function sunburstData(){
        dashFactory.sunburstData().fetch({},function(response){
            console.log(response);
            $scope.data = [];
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.burstvalues = _data;
                    var bdata = $scope.burstvalues;
                    $scope.data = bdata;
                    //$scope.values = $scope.sunburst_info.studentCountInOrganizationDTO;
                    console.log("Required Data"+ $scope.data);
                }
            }
        },function(response){
            $scope.data = [];
            console.log(response.status);
        });
        /*$scope.data = {
            "name": "Gavi",
            "size": 6,
            "children": [
                {
                    "name": "branch1",
                    "branchId": "BRANCH0001",
                    "size": 4,
                    "children": [
                        {"name": "2015-16","branchId": "0001", "size": 200},
                        {"name": "2016-17","branchId": "0001", "size": 350},
                        {"name": "2017-18","branchId": "0001", "size": 270},
                        {"name": "2018-19","branchId": "0001", "size": 340}
                    ]
                },
                {
                    "name": "branch2",
                    "branchId": "BRANCH0002",
                    "size": 4,
                    "children": [
                        {"name": "2015-16","branchId": "0002", "size": 180},
                        {"name": "2016-17","branchId": "0002", "size": 220},
                        {"name": "2017-18","branchId": "0002", "size": 350},
                        {"name": "2018-19","branchId": "0002", "size": 290}
                    ]
                }
                ,
                {
                    "name": "branch3",
                    "branchId": "BRANCH0003",
                    "size": 4,
                    "children": [
                        {"name": "2015-16","branchId": "0003", "size": 180},
                        {"name": "2016-17","branchId": "0003", "size": 220},
                        {"name": "2017-18","branchId": "0003", "size": 350},
                        {"name": "2018-19","branchId": "0003", "size": 290}
                    ]
                }
                ,
                {
                    "name": "branch4",
                    "branchId": "BRANCH0004",
                    "size": 4,
                    "children": [
                        {"name": "2015-16","branchId": "0004", "size": 180},
                        {"name": "2016-17","branchId": "0004", "size": 220},
                        {"name": "2017-18","branchId": "0004", "size": 350},
                        {"name": "2018-19","branchId": "0004", "size": 290}
                    ]
                }
                ,
                {
                    "name": "branch5",
                    "branchId": "BRANCH0005",
                    "size": 4,
                    "children": [
                        {"name": "2015-16","branchId": "0005", "size": 180},
                        {"name": "2016-17","branchId": "0005", "size": 220},
                        {"name": "2017-18","branchId": "0005", "size": 350},
                        {"name": "2018-19","branchId": "0005", "size": 290}
                    ]
                }
                ,
                {
                    "name": "branch6",
                    "branchId": "BRANCH0006",
                    "size": 8,
                    "children": [
                        { "name": "branch6",
                            "size": 4,
                            "children": [
                                {"name": "2015-16","branchId": "0006", "size": 180},
                                {"name": "2016-17","branchId": "0006", "size": 220},
                                {"name": "2017-18","branchId": "0006", "size": 350},
                                {"name": "2018-19","branchId": "0006", "size": 290}
                            ]
                        },
                        {"name": "2015-16","branchId": "0006", "size": 180},
                        {"name": "2016-17","branchId": "0006", "size": 220},
                        {"name": "2017-18","branchId": "0006", "size": 350},
                        {"name": "2018-19","branchId": "0006", "size": 290}
                    ]
                }
            ]
        }*/
    }
    sunburstData();


    $scope.init = function(){
        $scope.fetchAssetList();
    };

    $scope.init();

}]);


smart_parking.directive('pieChart', function() {
    return {
        restrict: 'E',
        scope: {
            values: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('values', function(values) {
                if (values) {
                    // console.log('values from directive: ', values);

                    var margin = {top: 40, right: 5, bottom: 20, left: 30},
                        width = 400 - margin.left - margin.right,
                        height = 300 - margin.top - margin.bottom,
                        radius = Math.min(width, height) / 2 ;



                    var color = d3.scale.ordinal()
                        .range(["#ff3300", "#0066ff", "#009933", "#8000ff", "#00e6e6", "#004080", "#b35900"]);

                    var arc = d3.svg.arc()
                        .outerRadius(radius - 10)
                        .innerRadius(0);
                    var arcOver = d3.svg.arc()
                        .innerRadius(0)
                        .outerRadius(radius);

                    var pie = d3.layout.pie()
                        .sort(null)
                        .value(function(d) {
                            return d.studentCount;
                        });

                    var svg = d3.select("#piechart").append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


                    var arcs = svg.selectAll(".arc")
                        .data(pie(values))
                        .enter().append("g")
                        .attr("class", "arc");


                    arcs.append("path")
                        .attr("d", arc)
                        .style("fill", function(d) {
                            return color(d.data.branchId);
                        })
                        .on("mouseover", function(d) {
                            d3.select(this).transition()
                                .duration(500)
                                .attr("d", arcOver);
                        })
                        .on("mouseout", function(d) {
                            d3.select(this).transition()
                                .duration(500)
                                .attr("d", arc);
                        });

                    arcs.append("text")
                        .attr("transform", function(d) {
                            return "translate(" + arc.centroid(d) + ")";
                        })
                        .attr("dy", ".35em")
                        .style("text-anchor", "middle")
                        .text(function(d) {
                            return d.data.branchId;
                        });

                }
            })
        }
    }
});

smart_parking.directive('barChart', function() {
    return {
        restrict: 'E',
        scope: {
            values: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('values', function(values) {
                if (values) {
                    // console.log('values from directive: ', values);

                    var margin = {top: 30, right: 5, bottom: 20, left: 50},
                        width = 400 - margin.left - margin.right,
                        height = 300 - margin.top - margin.bottom,
                        barPadding = 5;

                    var color = d3.scale.ordinal()
                        .range(["#00ff00", "#ff9900", "#666633", "#6666ff", "#ff5050", "#006699", "#993333"]);


                    var xScale = d3.scale.linear()
                        .domain([0, values.length])
                        .range([0, width]);


                    var yScale = d3.scale.linear()
                            .domain([0, d3.max(values, function(d) { return d.studentCount; })])
                            .range([height, 0])
                        ;

                    var yAxis = d3.svg.axis()
                        .scale(yScale)
                        //.orient("left")
                        ;

                    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom");

                    var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([-10, 0])
                        .html(function(d) {
                            return "<strong>Branch Id :</strong> <span style='color:red'>" + d.branchId + "</span><br/>"+"<strong>Student Count:</strong> <span style='color:red'>"+ d.studentCount  +"</span>";
                        });

                    var plot = d3.select("#barchart")
                            .append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                        ;
                    plot.call(tip);

                    //var plot = svg

                    plot.selectAll("rect")
                        .data(values)
                        .enter()
                        .append("rect")
                        .attr("x", function(d, i) {	return xScale(i); })
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide)
                        .attr("width", width / values.length - barPadding)
                        .attr("height", 0).transition().duration(500).delay(function (d, i) { return i * 50;	})
                        .attr("y", function(d) { console.log(yScale(d.studentCount));return yScale(d.studentCount); })
                        .attr("height", function(d) { console.log(height);console.log(height-yScale(d.studentCount)); return height-yScale(d.studentCount);})
                        .attr("fill", function(d){
                            return color(d.branchId)
                        });


                    plot.selectAll("text")
                        .data(values)
                        .enter()
                        .append("text")
                        .text(function(d) {
                            return d.studentCount;
                        })
                        .attr("text-anchor", "middle")
                        .attr("x", function(d, i) {
                            return (i * (width / values.length)) + ((width / values.length - barPadding) / 2);
                        })
                        .attr("y", function(d) {
                            console.log(d.studentCount);
                            return yScale(d.studentCount) + 14;
                        })
                        .attr("class", "yAxis")
                    ;
                    var xLabels = plot
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + (margin.top + height)  + ")")
                        ;

                    xLabels.selectAll("text.xAxis")
                        .data(values)
                        .enter()
                        .append("text")
                        .text(function(d) { return d.branchId;})
                        .attr("text-anchor", "middle")
                        .attr("x", function(d, i) {
                            return (i * (width / values.length)) + ((width / values.length - barPadding) / 2);
                        })
                        .attr("y", 15)
                        .style("fill", "yellow")
                        .attr("class", "xAxis")
                    ;


                    /*svg.append("text")
                     .attr("x", (width + margin.left + margin.right)/2)
                     .attr("y", 15)
                     .attr("class","title")
                     .attr("text-anchor", "middle")
                     .style("fill", "steelblue")
                     .style("font-size", "14px")
                     .text("Students growth in a school Bar Chart")
                     ;*/
                }
            })
        }
    }
});

smart_parking.directive('donutChart', function() {
    return {
        restrict: 'E',
        scope: {
            values: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('values', function(values) {
                if (values) {
                    // console.log('values from directive: ', values);

                    var margin = {top: 40, right: 5, bottom: 20, left: 30},
                        width = 400 - margin.left - margin.right,
                        height = 300 - margin.top - margin.bottom,
                        radius = Math.min(width, height) / 2 ;



                    var color = d3.scale.ordinal()
                        .range(["#0000ff", "#ff3300", "#00ff00", "#ff00ff", "#ff0080", "#6600ff", "#ff5500"]);

                    var arc = d3.svg.arc()
                        .outerRadius(radius - 10)
                        .innerRadius(radius/2);
                    var arcOver = d3.svg.arc()
                        .innerRadius(radius/2 - 15)
                        .outerRadius(radius - 10);

                    var pie = d3.layout.pie()
                        .sort(null)
                        .value(function(d) {
                            return d.studentCount;
                        });


                    var svg = d3.select("#donutchart").append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


                    var arcs = svg.selectAll(".arc")
                        .data(pie(values))
                        .enter().append("g")
                        .attr("class", "arc");


                    arcs.append("path")
                        .attr("d", arc)
                        .style("fill", function(d) {
                            return color(d.data.branchId);
                        })
                        .on("mouseover", function(d) {
                            d3.select(this).transition()
                                .duration(500)
                                .attr("d", arcOver);
                        })
                        .on("mouseout", function(d) {
                            d3.select(this).transition()
                                .duration(500)
                                .attr("d", arc);
                        });

                    /*arcs.append("text")
                     .attr("transform", function(d) {
                     return "translate(" + arc.centroid(d) + ")";
                     })
                     .attr("dy", ".35em")
                     .style("text-anchor", "middle")
                     .text(function(d) {
                     return d.data.year;
                     });*/
                    arcs.append("text")
                        .attr("transform", function(d) {
                            return "translate(" + arc.centroid(d) + ")";
                        })
                        .attr("dy", ".35em")
                        .style("text-anchor", "middle")
                        .text(function(d) {
                            return d.data.studentCount;
                        });


                }
            })
        }
    }
});


smart_parking.directive('lineChart', function() {
    return {
        restrict: 'E',
        scope: {
            values: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('values', function(values) {
                if (values) {


                    var values = [{
                        "studentCount": "102",
                        "year": "2000"
                    }, {
                        "studentCount": "215",
                        "year": "2001"
                    }, {
                        "studentCount": "179",
                        "year": "2002"
                    }, {
                        "studentCount": "199",
                        "year": "2003"
                    }, {
                        "studentCount": "134",
                        "year": "2003"
                    }, {
                        "studentCount": "176",
                        "year": "2010"
                    }];

                    console.log('values from directive: ', values);

                    var margin = {top: 30, right: 5, bottom: 20, left: 50},
                        width = 400 - margin.left - margin.right,
                        height = 300 - margin.top - margin.bottom
                        ;

                    var xScale = d3.scale.linear().range([margin.left, width - margin.right]).domain([2000,2010]),
                        yScale = d3.scale.linear().range([height - margin.top, margin.bottom]).domain([0,d3.max(values, function(d) { return d.studentCount; })]),

                        xAxis = d3.svg.axis()
                            .scale(xScale)
                            .ticks(5),

                        yAxis = d3.svg.axis()
                            .scale(yScale)
                            .orient("left");


                    var svg = d3.select("#linechart").append("svg")
                            .attr("width", width)
                            .attr("height", height)
                        ;

                    svg.append("g")
                        .attr("class","axis")
                        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class","axis")
                        .attr("transform", "translate(" + (margin.left) + ",0)")
                        .call(yAxis);

                    var lineGen = d3.svg.line()
                        .x(function(d) {
                            console.log(d.year);
                            return xScale(d.year);
                        })
                        .y(function(d) {
                            console.log(d.studentCount);
                            return yScale(d.studentCount);
                        })
                        .interpolate("basis");

                    svg.append('path')
                        .attr('d', lineGen(values))
                        .attr('stroke', 'green')
                        .attr('stroke-width', 2)
                        .attr('fill', 'none');


                }
            })
        }
    }
});

smart_parking.directive('sunburstChart', function() {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('data', function(data) {
                if (data) {

                    var width = 960,
                        height = 700,
                        radius = Math.min(width, height) / 2;

                    var x = d3.scale.linear()
                        .range([0, 2 * Math.PI]);

                    var y = d3.scale.linear()
                        .range([0, radius]);

                    var color = d3.scale.category20c();

                    var svg = d3.select("#sunburstchart").append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

                    var partition = d3.layout.partition()
                        .value(function(d) { return d.size; });

                    var arc = d3.svg.arc()
                        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
                        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
                        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
                        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

                    var g = svg.selectAll("g")
                        .data(partition.nodes(data))
                        .enter().append("g");

                    var path = g.append("path")
                        .attr("d", arc)
                        .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
                        .on("click", click);

                    var text = g.append("text")
                        .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
                        .attr("x", function(d) { return y(d.y); })
                        .attr("dx", "6") // margin
                        .attr("dy", ".35em") // vertical-align
                        .text(function(d) { return "C-"+d.size+ ", Y-"+ d.name; });

                    function click(d) {

                        text.transition().attr("opacity", 0);

                        path.transition()
                            .duration(750)
                            .attrTween("d", arcTween(d))
                            .each("end", function(e, i) {

                                if (e.x >= d.x && e.x < (d.x + d.dx)) {

                                    var arcText = d3.select(this.parentNode).select("text");

                                    arcText.transition().duration(750)
                                        .attr("opacity", 1)
                                        .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
                                        .attr("x", function(d) { return y(d.y); });
                                }
                            });
                    };

                   // d3.select(self.frameElement).style("height", height + "px");

                    function arcTween(d) {
                        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                            yd = d3.interpolate(y.domain(), [d.y, 1]),
                            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
                        return function(d, i) {
                            return i
                                ? function(t) { return arc(d); }
                                : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
                        };
                    }

                    function computeTextRotation(d) {
                        return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
                    }
                }
            })
        }
    }
});


smart_parking.factory('branchFactory',['$resource','Config', '$window',function($resource,Config, $window){
    var factory = {};
    var fetch_branch_url = Config.getBranchesAPI();
    var authCode = $window.localStorage.getItem("authCode");


    factory.fetchAllBranchList = function(){
        //http://localhost:8080/feesmanagementsystem/org/ORG0000001/branch
        return $resource(fetch_branch_url+'/branch',{},{
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

    factory.createBranch = function(){
        //http://localhost:8080/feesmanagementsystem/org/ORG0000001/branch
        return $resource(fetch_branch_url+'/branch',{},{
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


    factory.updateBranch = function(branchId){
        // branch/BRANCH0001/update
        return $resource(fetch_branch_url+'/branch/'+branchId+'/update',{},{
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
/*
    factory.deleteBranch = function(branchId){
        console.log("branch: "+branchId);
        return $resource(fetch_branch_url+'/branch/'+branchId+'/dectivate',{},{
        	remove:{
                method: 'GET',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor: {
                    response: function (data) {
                        console.log("deleteBranch successful");
                        return data;
                    }
                }
            }
        });
    };*/

    return factory;
}]);

smart_parking.controller('branchController', ['$scope','branchFactory','$state','$modal',function($scope,branchFactory,$state,$modal) {

    var initials = {
        orgName:"",address:"",pincode:"",branchId:"",branchName:"", email:"" ,branchManagerName:"",masterEmailId:"",masterEmailPassword:""
    };

    $scope.fetchBranchList = function(){
        $scope.response_msg = "";
        branchFactory.fetchAllBranchList().fetch({},function(response){
            $scope.branch_list =[];
            if(response.status == 200){
                if(response.data.branches!=undefined){
                    var _data = angular.fromJson(response.data.branches);
                    $scope.branch_list = _data;
                    $scope.$parent.setBaseContentHeight($scope.branch_list.length);
                }
            }
        },function(response){
            $scope.branch_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };


    $scope.addBranch = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };

    $scope.createBranch = function () {
        var add = $scope.add;
        var body = ' { ' +
            '"branchName":"' + add.branchName + '",' +
            '"address" :"' + add.address + '",'+
            '"masterEmailId" :"' + add.masterEmailId + '",'+
            '"masterEmailPassword" :"' + add.masterEmailPassword + '",'+
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
            ']'+','+
            '"pincode" :"'+add.pincode+'"}';

        var response = branchFactory.createBranch();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchBranchList();
            }
            $state.go('^.list');
            $scope.response_msg = "Branch added successfully !!!";
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            } else if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of branch is unsuccessful !!!";
        });
    };

   /* $scope.deleteBranch = function(branch,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        console.log("inside deletebranch");

             var dialogue_message = "Are you sure to delete the branch ??";
                var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
                modalInstance.result.then(function (flag) {
                    console.log("Flag value:"+ flag);
                    if(flag){
                        branchFactory.deleteBranch(branch.branchId).remove({},function(response){
                            if(response.status == 200){
                                $scope.fetchBranchList();
                                console.log("deleted")
                            }
                        },function(response){
                            $scope.response_msg1 = "Branch Deletion failed !!!";
                            console.log(response.status);
                        });
                    }
                    else {
                        console.log("Failed to delete");
                    }
                });
    };*/


    $scope.editBranch = function (branchId) {
        console.log("branch ID:  "+branchId);
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.branch_list, function (branch) {
            console.log("subject: "+branch.branchId);
            if (branchId == branch.branchId) {
                $scope.edit.branchId = branch.branchId;
                $scope.edit.branchName = branch.branchName;
                $scope.edit.address = branch.address;
                $scope.edit.masterEmailId = branch.masterEmailId;
                $scope.edit.masterEmailPassword = branch.masterEmailPassword;
                $scope.edit.email = branch.Emails[0].email;
                $scope.edit.phoneNumber = branch.PhoneNumbers[0].phoneNumber;
                $scope.edit.pincode = branch.pincode;
            }
        });
    };

    $scope.updateBranch = function (branchId) {
        var edit = $scope.edit;
        var body = ' { ' +
            '"branchName":"' + edit.branchName + '",' +
            '"address" :"' + edit.address + '",'+
            '"masterEmailId" :"' + edit.masterEmailId + '",'+
            '"masterEmailPassword" :"' + edit.masterEmailPassword + '",'+
            '"emails"'+':'+
            '['+
                '{'+
                    '"email" :"' + edit.email + '",'+
                    '"type" :"' + edit.type +'"'+
                '}'+
            ']'+','+
            '"phoneNumbers"'+':'+
            '['+
                '{'+
                    '"phoneNumber" :"' + edit.phoneNumber + '",'+
                    '"type" :"' + edit.type +'"'+
                '}'+
            ']'+','+
            '"pincode" :"'+edit.pincode+'"}';
        var  branch = btoa(branchId);
        var response = branchFactory.updateBranch(branch);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchBranchList();
                $state.go('^.list');
            }
            $scope.response_msg = "Branch updated successfully !!!";
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            }else if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Branch is unsuccessful !!!";
        });
    };

    $scope.init = function(){
        $scope.fetchBranchList();
    };

    $scope.init();

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };


}]);
smart_parking.factory('branchManagerFactory',['$resource','Config','$window',function($resource,Config,$window){
    var factory = {};
    var fetch_bm_url = Config.getBranchManagersAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchBranchManagerList = function(){
        return $resource(fetch_bm_url+'/branchmanagers',{},{
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

    // http://localhost:8080/Eshiksha/org/ORG0000001/userName/ravi
    factory.validateUsername = function(userName) {
        return $resource(fetch_bm_url+'/userName/'+userName,{},{
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


     factory.createManager = function(branchId){
         //org/ORG0000001/branch/BRANCH0001/branchmanager
         return $resource(fetch_bm_url+'/branch/'+branchId+'/branchmanager',{},{
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

  /*  factory.updateManager = function(branchId){
        return $resource(fetch_bm_url+'/'+branchId,{},{
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

    factory.deleteManager = function(branchId){
        console.log("branch: "+branchId);
        return $resource(fetch_bm_url+'/branch/'+branchId+'/deactivate',{},{
            remove:{
                method: 'GET',
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

*/
    return factory;
}]);
smart_parking.controller('managerCtrl', ['$scope','branchManagerFactory','branchFactory','$state','$modal',function($scope,branchManagerFactory,branchFactory,$state,$modal) {

    var initials = {
        userName:"",password:"",firstName:"",lastName:"",phoneNumber:"",email:""
    };


    $scope.fetchBranchList = function(){
        branchFactory.fetchAllBranchList().fetch({},function(response){
            $scope.branch_list =[];
            if(response.status == 200){
                if(response.data.branches!=undefined){
                    var _data = angular.fromJson(response.data.branches);
                    $scope.branch_list = _data;
                    if($scope.branch_list.length > 0){
                       // $scope.currentBranch = $scope.branch_list[0];
                       // console.log($scope.currentBranch)
                       // $scope.fetchOperatorManagerList($scope.currentBranch)
                    }
                }
            }
        },function(response){
            $scope.branch_list = [];
            console.log(response.status);
        });
    };

    $scope.fetchBranchManagerList = function(){
        $scope.response_msg = "";
        branchManagerFactory.fetchBranchManagerList().fetch({},function(response){
            $scope.bm_list =[];
            console.log(response);
            if(response.status == 200){
                if(response.data.branchManagers!=undefined){
                    var _data = angular.fromJson(response.data.branchManagers);
                    $scope.bm_list = _data;
                    $scope.$parent.setBaseContentHeight($scope.bm_list.length);
                }
            }
        },function(response){
            $scope.bm_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.validateUsername = function(userName){
        var user = window.btoa(userName);
        branchManagerFactory.validateUsername(user).fetch({}, function(response){
            if(response.status == 200 || response.status == 201){
                $scope.availability = "Available !!"
            }
        }, function(response){
            $scope.availability = response.data.errorMessage;
        })
    };

    $scope.addManager = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };

    $scope.createManager = function () {
        var add = $scope.add;
        var body = ' { ' +
            '"userName":"' + add.userName + '",' +
            '"password" :"' + add.password + '",'+
            '"firstName":"' + add.firstName + '",' +
            '"lastName" :"' + add.lastName + '",'+
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
        var branch = window.btoa(add.branch.branchId);
        var response = branchManagerFactory.createManager(branch);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchBranchManagerList();
            }
            $state.go('^.list');
            $scope.response_msg = "Manager added successfully !!!";
        },function(response){
            $scope.response_msg1 = response.data.errorMessage;
            /*if(response.status == 409){
                $scope.response_msg1 = response.data;
            }
            else
                $scope.response_msg1= "Addition of manager is unsuccessful !!!";*/
        });
    };

   /* $scope.editBranch = function (branchId) {
        console.log("branch ID:  "+branchID);
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.branch_list, function (branch) {
            console.log("subject: "+branch.branchId);
            if (branchId == branch.branchId) {
                $scope.edit.userName = branch.userName;
                $scope.edit.password = branch.password;
                $scope.edit.firstName = branch.firstName;
                $scope.edit.lastName = branch.lastName;
                $scope.edit.emails.email = branch.email;
                $scope.edit.phoneNumbers.phoneNumber = branch.phoneNumber;
                $scope.edit.pincode = branch.pincode;
            }
        });
    };

    $scope.updateManager = function (branchId) {
        var edit = $scope.edit;
        var body = ' { ' +
            '"userName":"' + edit.userName + '",' +
            '"password" :"' + edit.password + '",'+
            '"firstName":"' + edit.firstName + '",' +
            '"lastName" :"' + edit.lastName + '",'+
            '"emails"'+':'+
            '['+
                '{'+
                    '"email" :"' + edit.email + '",'+
                    '"type" :"' + edit.type +'"'+
                '}'+
            ']'+','+
            '"phoneNumbers"'+':'+
            '['+
                '{'+
                    '"phoneNumber" :"' + edit.phoneNumber + '",'+
                    '"type" :"' + edit.type +'"'+
                '}'+
            ']'+','+
            '"pincode" :"'+edit.pincode+'"}';

        var response = branchManagerFactory.updateManager(branchId);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchBranchList();
                $state.go('^.list');
            }
            $scope.response_msg = "Branch updated successfully !!!";
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Branch is unsuccessful !!!";
        });
    };*/

    $scope.init = function(){
       // $scope.fetchBranchManagerList();
    };

    $scope.init();


    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

}]);
smart_parking.factory('branchOperatorFactory',['$resource','Config', '$window',function($resource,Config, $window){
    var factory = {};
    //var fetch_bo_url = 'http://localhost:8080/feesmanagementsystem/org/ORG0001/branch/';
    //var fetch_bo_url = 'http://localhost:8080/feesmanagementsystem/org/ORG0000001/branch/BRANCH0001/branchoperator';
    var fetch_bo_url = Config.getBranchOperatorsAPI();
    var fetch_branch_url = Config.getBranchesAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchOperatorManagerList = function(branchId){
        return $resource(fetch_bo_url+'/branch/'+branchId+'/branchoperator',{},{
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

    factory.validateUsername = function(userName) {
        return $resource(fetch_bo_url+'/userName/'+userName,{},{
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


     factory.createOperator = function(branchId){
         // /branch/BRANCH0001/branchoperator
         return $resource(fetch_bo_url+'/branch/'+branchId+'/branchoperator',{},{
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

    /*factory.updateOperator = function(branchId){
        return $resource(fetch_bo_url+'/'+branchId,{},{
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

    factory.deleteManager = function(branchId){
        console.log("branch: "+branchId);
        return $resource(fetch_bo_url+'/branch/'+branchId+'/deactivate',{},{
            remove:{
                method: 'GET',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor: {
                    response: function (data) {
                        console.log("deleteBranch successful");
                        return data;
                    }
                }
            }
        });
    };*/



    return factory;
}]);
smart_parking.controller('operatorCtrl', ['$scope','branchOperatorFactory','branchFactory','$state','$modal',function($scope,branchOperatorFactory,branchFactory,$state,$modal) {

    var initials = {
        userName:"",password:"",firstName:"",lastName:"",phoneNumber:"",email:""
    };

    $scope.fetchBranchList = function(){
        branchFactory.fetchAllBranchList().fetch({},function(response){
            $scope.branch_list =[];
            if(response.status == 200){
                if(response.data.branches!=undefined){
                    var _data = angular.fromJson(response.data.branches);
                    $scope.branch_list = _data;
                    if($scope.branch_list.length > 0){
                       // $scope.currentBranch = $scope.branch_list[0];
                        //console.log($scope.currentBranch)
                        //$scope.fetchOperatorManagerList($scope.currentBranch)
                    }
                }
            }
        },function(response){
            $scope.branch_list = [];
            console.log(response.status);
        });
    };


    $scope.fetchOperatorManagerList = function(currentBranch){
        $scope.response_msg = "";
        var branch = window.btoa(currentBranch.branchId);
        branchOperatorFactory.fetchOperatorManagerList(branch).fetch({},function(response){
            $scope.bo_list =[];
            if(response.status == 200){
                if(response.data.branchOperators!=undefined){
                    var _data = angular.fromJson(response.data.branchOperators);
                    $scope.bo_list = _data;
                    $scope.$parent.setBaseContentHeight($scope.bo_list.length);
                }
            }
        },function(response){
            $scope.bo_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.validateUsername = function(userName){
        var user = window.btoa(userName);
        branchOperatorFactory.validateUsername(user).fetch({}, function(response){
            if(response.status == 200 || response.status == 201){
                $scope.availability = "Available !!"
            }
        }, function(response){
            $scope.availability = response.data.errorMessage;
        })
    };


    $scope.addOperator = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };

    $scope.createOperator = function () {
        var add = $scope.add;
        var body = ' { ' +
            '"userName":"' + add.userName + '",' +
            '"password" :"' + add.password + '",'+
            '"firstName":"' + add.firstName + '",' +
            '"lastName" :"' + add.lastName + '",'+
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
        var branch = window.btoa(add.branch.branchId);
        var response = branchOperatorFactory.createOperator(branch);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchBranchList();
            }
            $state.go('^.list');
            $scope.response_msg = "Operator added successfully !!!";
        },function(response){
            if(response.status == 409 || response.status == 404){
                $scope.response_msg1 = response.data;
            }
            else
                $scope.response_msg1= "Addition of Operator is unsuccessful !!!";
        });
    };
/*
    $scope.editBranch = function (branchId) {
        console.log("branch ID:  "+branchID);
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.branch_list, function (branch) {
            console.log("subject: "+branch.branchId);
            if (branchId == branch.branchId) {
                $scope.edit.branchId = branch.branchId;
                $scope.edit.branchName = branch.branchName;
                $scope.edit.address = branch.address;
                $scope.edit.emails.email = branch.email;
                $scope.edit.phoneNumbers.phoneNumber = branch.phoneNumber;
              //  $scope.edit.pincode = branch.pincode;
            }
        });
    };

    $scope.updateManager = function (branchId) {
        var edit = $scope.edit;
        var body = ' { ' +
            '"userName":"' + edit.userName + '",' +
            '"password" :"' + edit.password + '",'+
            '"firstName":"' + edit.firstName + '",' +
            '"lastName" :"' + edit.lastName + '",'+
            '"emails"'+':'+
            '['+
                '{'+
                    '"email" :"' + edit.email + '",'+
                    '"type" :"' + edit.type +'"'+
                '}'+
            ']'+','+
            '"phoneNumbers"'+':'+
            '['+
                '{'+
                    '"phoneNumber" :"' + edit.phoneNumber + '",'+
                    '"type" :"' + edit.type +'"'+
                '}'+
            ']'+','+
            '}';

        var response = branchOperatorFactory.updateManager(branchId);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchBranchList();
                $state.go('^.list');
            }
            $scope.response_msg = "operator updated successfully !!!";
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of opeartor is unsuccessful !!!";
        });
    };*/

    $scope.init = function(){
        //$scope.fetchBranchList();
        //$scope.fetchOperatorManagerList();
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

    $scope.init();

}]);

smart_parking.factory('feeFactory',['$resource','Config', '$window',function($resource,Config, $window){
    var factory = {};
    var fetch_fee_url = Config.getFeeAPI();

    var authCode = $window.localStorage.getItem("authCode");

    factory.createFees = function(branchId){
            return $resource(fetch_fee_url+branchId+'/fees',{},{
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

    factory.fetchFeeList = function(branchId,selectedYear, syllabus){
        // branch/BRANCH0001/fees/basic/syllabus/CBSE/year/2016-17
        console.log("auth "+authCode);
        return $resource(fetch_fee_url+branchId+'/fees/basic/syllabus/'+syllabus+'/year/'+selectedYear,{},{
            fetch: {
                method: 'get',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor: {
                    response: function(data){
                        return data;
                    }
                }
            }
        });
    };

    /*factory.updateFeesStructure = function(branchId,feeId){

        return $resource(fetch_fee_url+branchId+'/fees/'+'/'+feeId+'/update',{},{
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

     factory.deleteFee = function(branchId, feeId){
            return $resource(fetch_fee_url+branchId+'/fees/'+feeId+'/deactivate',{},{
                delete: {
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
     };*/

        return factory;
}]);
smart_parking.controller('feeController', ['$scope','feeFactory','branchFactory','$state','$modal',function($scope,feeFactory,branchFactory,$state,$modal) {

    var initials = {
        standard:"",admissionFees:"",monthlyFees:"",sportsFees:"",booksFees:"",vanFees:"",year:"",feesId:""
    };

    $scope.fetchYearList = function(){
        $scope.year_list = ["2015-16","2016-17","2017-18","2018-19"];
        $scope.fee_list =[];
        $scope.syllabus_list=[];
    };
    $scope.fetchStandardList = function(selectedYear){
        $scope.standards= ["First", "Second", "Third", "Fourth","Fifth",
            "Sixth","Seventh","Eighth","Ninth","Tenth"];
        $scope.fee_list =[];
        $scope.syllabus_list =[];
    };
    $scope.fetchSyllabusList = function(selectedYear){
        $scope.syllabus_list = ["CBSE", "ICSE", "State Syllabus"];
        $scope.fee_list =[];
    };

    $scope.fetchBranchList = function(){
        branchFactory.fetchAllBranchList().fetch({},function(response){
           $scope.branch_list =[];
            if(response.status == 200){
                if(response.data.branches != undefined){
                    var _data = angular.fromJson(response.data.branches);
                    $scope.branch_list = _data;
                    if($scope.branch_list.length > 0){
                        //$scope.currentBranch = $scope.branch_list[0];
                        //$scope.selectedYear = $scope.year_list[0];
                        //$scope.fetchFeeList($scope.currentBranch,$scope.selectedYear)
                    }
                }
            }
        },function(response){
            $scope.branch_list = [];
            console.log(response.status);
        });
    };

    $scope.fetchFeeList = function(currentBranch,selectedYear,syllabus){
        $scope.response_msg = "";
        console.log(currentBranch.branchId+" "+selectedYear);
        var branch = window.btoa(currentBranch.branchId);
        var year = window.btoa(selectedYear);
        var syllabus = window.btoa(syllabus);
        feeFactory.fetchFeeList(branch,year,syllabus).fetch({},function(response){
            $scope.fee_list =[];
            console.log(response);
            if(response.status == 200 || response.statu == 201){
                if(response.data.fees!=undefined){
                    var _data = angular.fromJson(response.data.fees);
                    $scope.fee_list = _data;
                    $scope.$parent.setBaseContentHeight($scope.fee_list.length);
                }
            }
        },function(response){
            $scope.fee_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };


    $scope.addFees = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };

    $scope.createFees = function (currentBranch) {
        var add = $scope.add;
        var body = ' { ' +
            '"standard":"' + add.standard + '",' +
            '"syllabus":"' + add.syllabus + '",' +
            '"admissionFees" :"' + add.admissionFees + '",'+
            '"monthlyFees" :"'+add.monthlyFees+ '",'+
            '"sportsFees" :"'+add.sportsFees+ '",'+
            '"booksFees" :"'+add.booksFees+ '",'+
            '"vanFees" :"'+add.vanFees+ '",'+
            '"year" :"'+add.year+ '"}';
        var branch = window.btoa(currentBranch.branchId);
        var response = feeFactory.createFees(branch);
        var data = response.add({}, body, function (response) {
            if(response.status == 200){
                $scope.fetchBranchList();
                $state.go('^.list');
            }
            $scope.response_msg = "Fee added successfully !!!";
        },function(response){
            if(response.status == 409){
               // $scope.add.branchName = "";
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of Fee is unsuccessful !!!";
        });
    };


    /*$scope.editFees = function (feesId) {
        console.log("fees ID:  "+feesId);
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.fee_list, function (fee) {
            console.log("subject: "+fee.feesId);
            if (feesId == fee.feesId) {
                $scope.edit.standard = fee.standard;
                $scope.edit.admissionFees = fee.admissionFees;
                $scope.edit.monthlyFees = fee.monthlyFees;
                $scope.edit.sportsFees = fee.sportsFees;

                $scope.edit.booksFees = fee.booksFees;
                $scope.edit.vanFees = fee.vanFees;
                $scope.edit.year = fee.year;
            }
        });
    };

    $scope.updateFeesStructure = function (feesId) {
        var edit = $scope.edit;
        var body = ' { ' +
            '"standard":"' + edit.standard + '",' +
            '"admissionFees" :"' + edit.admissionFees + '",'+
            '"monthlyFees":"' + edit.monthlyFees + '",' +
            '"sportsFees" :"' + edit.sportsFees + '",'+
            '"booksFees":"' + edit.booksFees + '",' +
            '"vanFees" :"' + edit.vanFees + '",'+
            '"year" :"' + edit.year + '",'+'}';

        var response = feeFactory.updateFeesStructure(feesId);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchBranchList();
                $state.go('^.list');
            }
            $scope.response_msg = "Fee Sturcture updated successfully !!!";
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Fee Sturcture is unsuccessful !!!";
        });
    };
    $scope.deleteFee = function(fee,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        console.log("inside delete Fee");

        var dialogue_message = "Are you sure to delete the Fee ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){/!*
             branchFactory.deleteBranch(branch.branchId),remove({},function(response){
             if(response.status == 200){
             $scope.fetchBranchList();
             console.log("deleted")
             }
             },function(response){
             $scope.response_msg1 = "Branch Deletion failed !!!";
             console.log(response.status);
             }); *!/
                var response = feeFactory.deleteFee(fee.feesId);

                var data = response.remove({}, function(response){
                    if(response.status == 200 || response.status == 201){
                        $scope.fetchBranchList();
                        console.log("deleted")
                    }
                },function(response){
                    $scope.response_msg1 = "Fee Deletion fialed !!";
                    console.log("Fee Deletion fialed "+response.status);
                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };*/

    $scope.init = function(){
       // $scope.fetchBranchList();
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

    $scope.init();

}]);