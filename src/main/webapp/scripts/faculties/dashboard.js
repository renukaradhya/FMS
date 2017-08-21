/**
 * Created by Icarat2 on 5/22/2016.
 */

facultyApp.factory('dashboardFactory', ['$resource', 'faculty_config', '$window',function($resource, faculty_config, $window){
    var factory = {};
    var dashboard_url = faculty_config.getAssetAPI();
    var fetch_assessment_url = faculty_config.getAssessmentAPI();
    var fetch_main_url = faculty_config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchYears = function(){
        return $resource(fetch_assessment_url+'/orgsettings/years',{},{
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
    factory.fetchAcademicYear = function(){
        return $resource(fetch_assessment_url+'/orgsettings',{},{
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
    factory.assessmentlist = function(){
        return $resource(fetch_assessment_url+'/orgsettings/assessments',{},{
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

    factory.getStandards = function(){
        return $resource(fetch_main_url+'/branchsettings/standards',{},{
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
    factory.getSections = function(){
        return $resource(fetch_main_url+'/branchsettings/standardssections',{},{
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

facultyApp.controller('dashboardCtrl', ['$scope','dashboardFactory','$localStorage',function($scope,dashboardFactory,$localStorage){



    $scope.fetchAcademicYear = function(){
        //$scope.response_msg = "";
        $scope.response_msg1 = "";
        dashboardFactory.fetchAcademicYear().fetch({},function(response){
            $scope.academicYear ="";
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.academicYear = _data;
                    $localStorage.academicYear = $scope.academicYear;
                    console.log($scope.academicYear);
                }
            }
        },function(response){
            $scope.academicYear ="";
        });
    };

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

    $scope.listYears = function(){
        dashboardFactory.fetchYears().fetch({},function(response){
            $scope.year_list =[];
            console.log(response);
            if(response.status == 200){
                if(response.data.yearsDetails!=undefined){
                    var _data = angular.fromJson(response.data.yearsDetails);
                    $scope.years = [];
                    $scope.year_list = _data;
                    $localStorage.years = $scope.year_list;
                    console.log($localStorage.years);
                }
            }
        },function(response){
            $scope.year_list =[];
            console.log(response.status);
        });
    };
    $scope.assessmentlist = function(){
        dashboardFactory.assessmentlist().fetch({},function(response){
            $scope.assessment_list ="";
            console.log(response);
            if(response.status == 200){
                if(response.data.assessments!=undefined){
                    var _data = angular.fromJson(response.data.assessments);
                    $scope.assessment_list = _data;
                    $localStorage.assessments = $scope.assessment_list;
                    console.log($localStorage.assessments);
                }
            }
        },function(response){
            $scope.assessment_list ="";
            console.log(response.status);
        });
    };
    $scope.getStandards = function(){
        dashboardFactory.getStandards().fetch({},function(response){
            $scope.standard_list ="";
            console.log(response);
            if(response.status == 200){
                if(response.data.standards!=undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                    $localStorage.standards = $scope.standard_list;
                    console.log($localStorage.standards);
                }
            }
        },function(response){
            $scope.assessment_list ="";
            console.log(response.status);
        });
    };
    $scope.getSections = function(){
        dashboardFactory.getSections().fetch({},function(response){
            $scope.section_list ="";
            console.log(response);
            if(response.status == 200){
                if(response.data.standards!=undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.section_list = _data;
                    $localStorage.sections = $scope.section_list;
                    console.log($localStorage.sections);
                }
            }
        },function(response){
            $scope.assessment_list ="";
            console.log(response.status);
        });
    };

    $scope.init = function(){
        $scope.fetchAssetList();
        $scope.listYears();
        $scope.assessmentlist();
        $scope.getStandards();
        $scope.getSections();
        $scope.fetchAcademicYear();
    };

    $scope.init();
}]);
