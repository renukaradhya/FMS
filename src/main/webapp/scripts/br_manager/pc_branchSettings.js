/**
 * Created by Icarat2 on 11/9/2016.
 */
branchManager.factory('branchSettingsFactory', ['$resource','br_Manager_Config','$window', function($resource,br_Manager_Config,$window){
    var factory = {};
    var fecth_main_url =  br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.postStandards = function(){
        return $resource(fecth_main_url+'/branchsettings/standards',{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        console.log("posting  branch fees successful!!!");
                        return data;
                    }
                }
            }
        });
    };
    factory.setSections = function(){
        return $resource(fecth_main_url+'/branchsettings/sections',{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        console.log("posting  branch fees successful!!!");
                        return data;
                    }
                }
            }
        });
    };

    factory.getStandards = function(){
        return $resource(fecth_main_url+'/branchsettings/standards',{},{
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
        return $resource(fecth_main_url+'/branchsettings/standardssections',{},{
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
    //http://localhost:8080/Eshiksha/org/243535/branch/46756/branchsettings/standard
    // http://localhost:8080/Eshiksha/org/46345634/branch/534535/branchsettings/sections
    factory.deleteStandard = function(){
        return $resource(fecth_main_url+'/branchsettings/standard',{},{
            remove: {
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
    factory.deleteSection = function(){
        return $resource(fecth_main_url+'/branchsettings/sections',{},{
            remove: {
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
branchManager.controller('branchSettingsController',['$scope','branchSettingsFactory','br_manager_appConfig','$state','$filter','$modal','$localStorage', function($scope,branchSettingsFactory,br_manager_appConfig,$state,$filter,$modal,$localStorage){

    var initials = {
        standard:"", year:"",isEnableEmail:"",isEnableFees:""
    };

    $scope.addSettings = function(){
        $scope.response_msg = "";
        $scope.standards = [{id: 'std1'}];
        $scope.addStandard = function() {
            var newItem = $scope.standards.length+1;
            $scope.standards.push({'id':'std'+newItem});
        };
        $scope.removeStandard = function() {
            var lastMode = $scope.standards.length-1;
            $scope.standards.splice(lastMode);
        };
        $scope.add = angular.copy(initials);
    };

    $scope.postStandards = function () {
        $scope.response_msg1 = "";
        var add = $scope.add;
        $scope.stds = [];
        $scope.standards.forEach(function(v){
            delete v.id;
            $scope.stds.push(v.std);
        });

        var body ={
            "standard": $scope.stds
        };
        var response = branchSettingsFactory.postStandards();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                $scope.init();
            }
            $scope.response_msg = "Class posted successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Something went wrong !!!";
        });
    };

    $scope.addSections = function(){
        $scope.response_msg = "";
        $scope.sections = [{id: 'sec1'}];
        $scope.addSec = function() {
            var newItem = $scope.sections.length+1;
            $scope.sections.push({'id':'sec'+newItem});
        };
        $scope.removeSec = function() {
            var lastMode = $scope.sections.length-1;
            $scope.sections.splice(lastMode);
        };
        $scope.add = angular.copy(initials);
    };
    $scope.setSections = function (standard) {
        $scope.response_msg1 = "";
        var add = $scope.add;
        $scope.secs = [];
        $scope.sections.forEach(function(v){
            delete v.id;
            $scope.secs.push(v.sec);
        });

        var body ={
            "standardId": standard.id,
            "sections": $scope.secs
        };
        var response = branchSettingsFactory.setSections();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                $scope.init();
            }
            $scope.response_msg = "Sections posted successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Something went wrong !!!";
        });
    };

    $scope.getStandards = function () {
        $scope.response_msg1 = "";
        branchSettingsFactory.getStandards().fetch({},function(response){
            $scope.standard_list =[];
            console.log(response);
            if(response.status == 200){
                if(response.data.standards!=undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                    $localStorage.standards = $scope.standard_list;
                }
            }
        },function(response){
            $scope.standard_list =[];
            console.log(response.status);
        });
    };
    $scope.getSections = function () {
        $scope.response_msg1 = "";
        branchSettingsFactory.getSections().fetch({},function(response){
            $scope.section_list =[];
            console.log(response);
            if(response.status == 200){
                if(response.data.standards!=undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.section_list = _data;
                    $localStorage.sections = $scope.section_list;
                }
            }
        },function(response){
            $scope.section_list =[];
            console.log(response.status);
        });
    };

    $scope.listSections = function (obj) {
        $scope.list_sections = obj.sections;
    };

    $scope.deleteSection = function (obj, index) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var dialogue_message = "Are you sure to delete the Section?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                var body = {
                    id: obj.sectionId
                };
                var response = branchSettingsFactory.deleteSection();
                var data = response.remove({}, body, function (response) {
                    if(response.status == 200 || response.status == 201) {
                        $state.go('^.list');
                        $scope.list_sections = [];
                        $scope.init();
                    }
                    $scope.response_msg =  "Section deleted successfully !!!";
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg = "Section Deletion failed !!!";
                });
            }
            else {
                $scope.response_msg = "Section Deletion failed !!!";
            }
        });
    };
    $scope.deleteStandard = function (obj, index) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var dialogue_message = "Are you sure to delete the Standard?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                var body = {
                    id: obj.id
                };
                var response = branchSettingsFactory.deleteStandard();
                var data = response.remove({}, body, function (response) {
                    if(response.status == 200 || response.status == 201) {
                        $state.go('^.list');
                        $scope.init();
                    }
                    $scope.response_msg =  "Standard deleted successfully !!!";
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg = "Standard Deletion failed !!!";
                });
            }
            else {
                $scope.response_msg = "Standard Deletion failed !!!";
            }
        });
    };

    $scope.init = function () {
        $scope.getStandards();
        $scope.getSections();
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

    $scope.init();

}]);