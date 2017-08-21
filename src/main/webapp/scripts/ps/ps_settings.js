/**
 * Created by Icarat2 on 11/9/2016.
 */
smart_parking.factory('settingsFactory',['$resource','Config','$window','$http',function($resource,Config,$window,$http){
    var factory = {};
    var main_url = Config.getBranchManagersAPI();
    var authCode = $window.localStorage.getItem("authCode");


    // http://localhost:8080/Eshiksha/org/gdsgfsdg/branch/dfsgdfg/image/orglogo
    factory.uploadOrgLogo = function(file){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(main_url+'/branch/branchId/image/orglogo', fd, {
            transformRequest: angular.identity,
            headers: { 'Authorization' : authCode,
                'Content-Type': undefined}
        }).success(function(){
                alert("Photo uploaded Successfully !!!");
        }).error(function(){
                alert("Uploading photo is unsuccessful !!!");
        });
    };

    factory.initialSetup = function(){
        return $resource(main_url+'/orgsettings/booleans',{},{
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
    factory.initialSettings = function(){
        return $resource(main_url+'/orgsettings',{},{
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
    factory.postAcademicYear = function(){
        return $resource(main_url+'/orgsettings/academicyear',{},{
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
    factory.postAssessments = function () {
        return $resource(main_url+'/orgsettings/assessments',{},{
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

    factory.fetchYears = function(){
        return $resource(main_url+'/orgsettings/years',{},{
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
        return $resource(main_url+'/orgsettings',{},{
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
        return $resource(main_url+'/orgsettings/assessments',{},{
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
    factory.deleteYear = function(){
        return $resource(main_url+'/orgsettings/changeyears',{},{
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

    factory.listDesignation = function(){
        return $resource(main_url+'/orgsettings/desiganation',{},{
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
    factory.postDesignation = function(roleType){
        // http://localhost:8080/Eshiksha/org/rtyee54/orgsettings/rolrfor/54646546/desiganation
        return $resource(main_url+'/orgsettings/rolefor/'+roleType+'/desiganation',{},{
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
    factory.deleteDesignation = function(){
        return $resource(main_url+'/orgsettings/desiganation',{},{
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

    factory.deleteAssessment = function(){
        return $resource(main_url+'/orgsettings/assessments',{},{
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
        // http://localhost:8080/Eshiksha/org/tgfgtt/orgsettings
    factory.postYearEnd = function(){
        return $resource(main_url+'/orgsettings',{},{
            add: {
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

    // http://localhost:8080/Eshiksha/org/5956956/orgsettings/facultyleavesettings post
    // http://localhost:8080/Eshiksha/org/0965569/orgsettings/facultyleavesettings get

    factory.listLeaves = function(){
        return $resource(main_url+'/orgsettings/facultyleavesettings',{},{
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
    factory.setLeaves = function(){
        return $resource(main_url+'/orgsettings/facultyleavesettings',{},{
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
    factory.deleteLeave = function(){
        return $resource(main_url+'/orgsettings/facultyfettings',{},{
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
    factory.getSyllabus = function(){
        return $resource(main_url+'/orgsettings/syllabussettings',{},{
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
    factory.syllabusSetting = function(){
        return $resource(main_url+'/orgsettings/syllabussettings',{},{
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
    factory.deleteSyllabus = function(){
        return $resource(main_url+'/orgsettings/syllabussettings',{},{
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


    factory.getCategory = function(){
        return $resource(main_url+'/orgsettings/subjectcategorysettings',{},{
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
    factory.getNonTeachingStaff = function(){
        //http://localhost:8080/Eshiksha/org/456465/orgsettings/nonteachingStaff
        return $resource(main_url+'/orgsettings/nonteachingStaff',{},{
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
    factory.categorySetting = function(){
        return $resource(main_url+'/orgsettings/subjectcategorysettings',{},{
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
    factory.deleteCategory = function(){
        return $resource(main_url+'/orgsettings/subjectcategorysettings',{},{
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

    // http://localhost:8080/Eshiksha/org/0000000000/orgsettings/grade
    factory.postGrades = function(){
        return $resource(main_url+'/orgsettings/grade',{},{
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
    // http://localhost:8080/Eshiksha/org/7777777777/orgsettings/grade
    factory.getGrades = function(){
        return $resource(main_url+'/orgsettings/grade',{},{
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
    // http://localhost:8080/Eshiksha/org/5555555555/orgsettings/grade
    factory.deleteGrades = function(){
        return $resource(main_url+'/orgsettings/grade',{},{
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

smart_parking.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                })
            })
        }
    };
}]);



smart_parking.controller('settingsController', ['$scope','settingsFactory','$state','$modal','$localStorage',function($scope,settingsFactory,$state,$modal,$localStorage) {

    var initials = {
        academic:"",year:""
    };
    $scope.uploadOrgLogo = function(){
        var file ={};
        if($scope.orgLogo != undefined){
            file = $scope.orgLogo;
            if(file.size <= 102400){
                settingsFactory.uploadOrgLogo(file);
            }else{
                $scope.respnose_msg1= "File size should less than 100Kb";
                alert("File size should less than 100Kb")
            }
        }else{
            window.alert("Please select the file !!");
        }

    };

    $scope.terms = ["Quarterly","Half-Yearly", "Yearly"];

    $scope.addGrades = function(){
        $scope.response_msg = "";
        $scope.grades = [{id: 'gd1'}];
        $scope.addGrade = function() {
            var newItem = $scope.grades.length+1;
            $scope.grades.push({'id':'gd'+newItem});
        };
        $scope.removeGrade = function() {
            var lastMode = $scope.grades.length-1;
            $scope.grades.splice(lastMode);
        };
    };

    $scope.postGrades = function () {
        $scope.response_msg = "";
        $scope.grades.forEach(function(v){
            delete v.id;
        });

        var body ={
            "grades": $scope.grades
        };
        var response = settingsFactory.postGrades();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.getGrades();
                $state.go('^.list');
            }
            $scope.response_msg = "Grades Posted Successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Something went wrong !!!";
        });
    };

    $scope.addLeaves = function(){
        $scope.response_msg = "";
        $scope.roles = $localStorage.designations;

        $scope.leave_list = [{id: 'leave1'}];
        $scope.addLeave = function() {
            var newItem = $scope.leave_list.length+1;
            $scope.leave_list.push({'id':'leave'+newItem});
        };
        $scope.removeLeave = function() {
            var lastMode = $scope.leave_list.length-1;
            $scope.leave_list.splice(lastMode);
        };
    };

    $scope.setLeaves = function () {
        $scope.leave_list.forEach(function(v){
            delete v.id;
            v.designation= v.x.designation;
            delete v.x;
        });
        var body = {
            "leaveSettings": $scope.leave_list
        };
        var response = settingsFactory.setLeaves();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.listLeaves();
               $state.go('^.leavelist');
            }
            $scope.response_msg4 = "Leave Posted Successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Something went wrong !!!";
        });
    };

    $scope.addDesignation = function(){
        $scope.response_msg = "";
        $scope.add = angular.copy(initials);
        $scope.desiglist = [{id: 'des1'}];
        $scope.addRole = function() {
            var newItem = $scope.desiglist.length+1;
            $scope.desiglist.push({'id':'des'+newItem});
        };
        $scope.removeRole = function() {
            var lastMode = $scope.desiglist.length-1;
            $scope.desiglist.splice(lastMode);
        };
    };

    $scope.postDesignation = function () {
        var add = $scope.add;
        var roleType = window.btoa(add.roleType);
        $scope.des_list = [];
        $scope.desiglist.forEach(function(v){
            delete v.id;
            $scope.des_list.push(v.designation);
        });

        var body = {
            "designations": $scope.des_list
        };
        var response = settingsFactory.postDesignation(roleType);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.listDesignation();
                $scope.getNonTeachingStaff();
            }
            $scope.response_msg3 = "Designation Posted Successfully !!!";
            $state.go('^.designation');
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Something went wrong !!!";
        });
    };

    $scope.addYearInfo = function(){
        $scope.response_msg = "";
        $scope.yearlist = [{id: 'year1'}];
        $scope.addYear = function() {
            var newItem = $scope.yearlist.length+1;
            $scope.yearlist.push({'id':'year'+newItem});
        };
        $scope.removeYear = function() {
            var lastMode = $scope.yearlist.length-1;
            $scope.yearlist.splice(lastMode);
        };
    };

    $scope.initialSettings = function () {
        $scope.year = [];
        $scope.yearlist.forEach(function(v){
            delete v.id;
            $scope.year.push(v.year);
        });
        var body = {
            "years": $scope.year
        };
        var response = settingsFactory.initialSettings();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.listYears();
            }
            $scope.response_msg = "Years posted successfully !!!";
            $state.go('^.list');
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Something went wrong !!!";
        });
    };

    $scope.postAcademicYear = function (ayear) {
        var body = {
            "academicYear": ayear
        };
        var response = settingsFactory.postAcademicYear();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                settingsFactory.fetchAcademicYear().fetch({},function(response){
                    $scope.academicYear ="";
                    if(response.status == 200){
                        if(response.data!=undefined){
                            var _data = angular.fromJson(response.data);
                            $scope.academicYear = _data;
                        }
                    }
                },function(response){
                    $scope.academicYear ="";
                    console.log(response.status);
                });
            }
            $state.go('^.list');
            $scope.response_msg = "Academic Year set successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Something went wrong !!!";
        });
    };
    $scope.addAssessment = function(){
        $scope.response_msg = "";
        $scope.assessments = [{id: 'ass1'}];
        $scope.addAssess = function() {
            var newItem = $scope.assessments.length+1;
            $scope.assessments.push({'id':'ass'+newItem});
        };
        $scope.removeAssess = function() {
            var lastMode = $scope.assessments.length-1;
            $scope.assessments.splice(lastMode);
        };
    };
    $scope.postAssessments = function () {
        $scope.names = [];
        $scope.assessments.forEach(function(v){
            delete v.id;
            $scope.names.push(v.assess);
        });

        var body = {
            "assessments": $scope.names
        };

        var response = settingsFactory.postAssessments();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.assessmentlist();
            }
            $scope.response_msg = "Assessment Names Posted Successfully !!!";
            $state.go('^.list');
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Something went wrong !!!";
        });
    };
    $scope.postYearEnd = function(assessId){
        $scope.response_msg = " ";
        var body = {
            "id" : assessId
        };
        var response = settingsFactory.postYearEnd();
        var data = response.add({}, body, function (response) {
            if (response.status == 200 || response.status == 201) {
                $scope.assessmentlist();
            }
            $scope.response_msg = "Final assessment set successfully !!!";
            $state.go('^.list');
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Something went wrong !!!";
        });
    };

    $scope.setValues = function () {
        $scope.response_msg = "";
        $scope.response_msg2 = "";
        $scope.add = angular.copy(initials);
     };
     $scope.initialSetup = function () {
         var add = $scope.add;
         var body ={
             "isEmailEnabled": add.isEnableEmail,
             "isFeeStructureVisible": add.isEnableFees
         };
         var response = settingsFactory.initialSetup();
         var data = response.add({}, body, function (response) {
             if(response.status == 200 || response.status == 201){
                $state.go('^.basic');
             }
             $scope.response_msg2 = "Properties set successfully !!!";
             },function(response){
             if(response.status == 404){
                 $scope.response_msg1 = response.data.errorMessage;
             }
             else
             $scope.response_msg1= "Something went wrong !!!";
         });
     };

    $scope.basicSetting = function () {
        $scope.response_msg = "";
        $scope.response_msg2 = "";
        $scope.list_syllabus = [{id: 'sys1'}];
        $scope.addSys = function() {
            var newItem = $scope.list_syllabus.length+1;
            $scope.list_syllabus.push({'id':'sys'+newItem});
        };
        $scope.removeSys = function() {
            var lastMode = $scope.list_syllabus.length-1;
            $scope.list_syllabus.splice(lastMode);
        };
        $scope.category = [{id: 'cate1'}];
        $scope.addCat = function() {
            var newItem = $scope.category.length+1;
            $scope.category.push({'id':'cate'+newItem});
        };
        $scope.removeCat = function() {
            var lastMode = $scope.category.length-1;
            $scope.category.splice(lastMode);
        };
    };
    $scope.syllabusSetting = function () {
        $scope.response_msg = "";
        $scope.syll = [];
        $scope.list_syllabus.forEach(function(v){
            delete v.id;
            $scope.syll.push(v.sys);
        });
        var body ={
            "syllabus": $scope.syll
        };
        var response = settingsFactory.syllabusSetting();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.getSyllabus();
            }
            $state.go('^.basic');
            $scope.response_msg2 = "Syllabus posted successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Something went wrong !!!";
        });
    };
    $scope.categorySetting = function () {
        $scope.response_msg = "";
        $scope.cate = [];
        $scope.category.forEach(function(v){
            delete v.id;
            $scope.cate.push(v.cat);
        });
        var body ={
            "subjectCategories": $scope.cate
        };
        var response = settingsFactory.categorySetting();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.getCategory();
            }
            $state.go('^.basic');
            $scope.response_msg2 = "Category posted successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Something went wrong !!!";
        });
    };

    $scope.deleteAssessment = function (obj, index) {
        $scope.response_msg = "";
        var dialogue_message = "Are you sure to delete the Assessment?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                var body = {
                    id: obj.id,
                    name: obj.name
                };
                var response = settingsFactory.deleteAssessment();
                var data = response.remove({}, body, function (response) {
                    if(response.status == 200 || response.status == 201) {
                        $state.go('^.list');
                        $scope.init();
                    }
                    $scope.response_msg =  "Assessment deleted successfully !!!";
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg= "Assessment Deletion failed !!!";
                });
            }
            else {
                $scope.response_msg = "Assessment Deletion failed !!!";
            }
        });
    };
    $scope.deleteYear = function (obj, index) {
        $scope.response_msg = "";
        var dialogue_message = "Are you sure to delete the Year ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                var body = {
                    id: obj.id,
                    year: obj.year
                };
                var response = settingsFactory.deleteYear();
                var data = response.remove({}, body, function (response) {
                    if(response.status == 200 || response.status == 201) {
                        $state.go('^.list');
                        $scope.init();
                    }
                    $scope.response_msg =  "Year deleted successfully !!!";
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg = "Year Deletion failed !!!";
                });
            }
            else {
                $scope.response_msg = "Year Deletion failed !!!";
            }
        });
    };
    $scope.deleteDesignation = function (obj, index) {
        $scope.response_msg = "";
        var dialogue_message = "Are you sure to delete the Designation ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                var body = {
                    id: obj.id
                };
                var response = settingsFactory.deleteDesignation();
                var data = response.remove({}, body, function (response) {
                    if(response.status == 200 || response.status == 201) {
                        $state.go('^.designation');
                        $scope.listDesignation();
                        $scope.getNonTeachingStaff();
                    }
                    $scope.response_msg3 =  "Designation deleted successfully !!!";
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg3 = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg3 = "Designation Deletion failed !!!";
                });
            }
            else {
                $scope.response_msg3 = "Designation Deletion failed !!!";
            }
        });
    };

    $scope.deleteLeave = function (obj, index) {
        $scope.response_msg = "";
        var dialogue_message = "Are you sure to delete the Designation ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                var body = {
                    id: obj.id
                };
                var response = settingsFactory.deleteLeave();
                var data = response.remove({}, body, function (response) {
                    if(response.status == 200 || response.status == 201) {
                        $state.go('^.leavelist');
                        $scope.listLeaves();
                    }
                    $scope.response_msg4 =  "Leave Settings deleted successfully !!!";
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg4 = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg4 = "Leave Settings Deletion failed !!!";
                });
            }
            else {
                $scope.response_msg4 = "Leave Settings Deletion failed !!!";
            }
        });
    };


    $scope.deleteSyllabus = function (obj, index) {
        $scope.response_msg2 = "";
        $scope.response_msg = "";
        var dialogue_message = "Are you sure to delete the Syllabus Type?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                var body = {
                    id: obj.id
                };
                var response = settingsFactory.deleteSyllabus();
                var data = response.remove({}, body, function (response) {
                    if(response.status == 200 || response.status == 201) {
                        $state.go('^.basic');
                        $scope.init();
                    }
                    $scope.response_msg2 =  "Syllabus Type deleted successfully !!!";
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg2 = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg2 = "Syllabus Type Deletion failed !!!";
                });
            }
            else {
                $scope.response_msg2 = "Syllabus Type Deletion failed !!!";
            }
        });
    };
    $scope.deleteCategory = function (obj, index) {
        $scope.response_msg = "";
        $scope.response_msg2 = "";
        var dialogue_message = "Are you sure to delete the Category Type?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                var body = {
                    id: obj.id
                };
                var response = settingsFactory.deleteCategory();
                var data = response.remove({}, body, function (response) {
                    if(response.status == 200 || response.status == 201) {
                        $state.go('^.basic');
                        $scope.init();
                    }
                    $scope.response_msg2 =  "Category deleted successfully !!!";
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg2 = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg2 = "Category Deletion failed !!!";
                });
            }
            else {
                $scope.response_msg2 = "Category Deletion failed !!!";
            }
        });
    };

    $scope.deleteGrades = function (obj, index) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var dialogue_message = "Are you sure to delete the Grade?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                var body = {
                    id: obj.id
                };
                var response = settingsFactory.deleteGrades();
                var data = response.remove({}, body, function (response) {
                    if(response.status == 200 || response.status == 201) {
                        $state.go('^.list');
                        $scope.init();
                    }
                    $scope.response_msg =  "Grade deleted successfully !!!";
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg = "Grade Deletion failed !!!";
                });
            }
            else {
                $scope.response_msg = "Grade Deletion failed !!!";
            }
        });
    };

    $scope.listYears = function(){
        $scope.response_msg1 = "";
        settingsFactory.fetchYears().fetch({},function(response){
            $scope.year_list =[];
            if(response.status == 200){
                if(response.data.yearsDetails!=undefined){
                    var _data = angular.fromJson(response.data.yearsDetails);
                    $scope.year_list = _data;
                    $localStorage.years = $scope.year_list;
                }
            }
        },function(response){
            $scope.year_list =[];
            console.log(response.status);
        });
    };

    $scope.fetchAcademicYear = function(){
        $scope.response_msg1 = "";
        settingsFactory.fetchAcademicYear().fetch({},function(response){
            $scope.academicYear ="";
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.academicYear = _data;
                }
            }
        },function(response){
            $scope.academicYear ="";
        });
    };

    $scope.assessmentlist = function(){
        $scope.response_msg1 = "";
        settingsFactory.assessmentlist().fetch({},function(response){
            $scope.assessment_list ="";
            if(response.status == 200){
                if(response.data.assessments!=undefined){
                    var _data = angular.fromJson(response.data.assessments);
                    $scope.assessment_list = _data;
                }
            }
        },function(response){
            $scope.assessment_list ="";
        });
    };
    $scope.listLeaves = function () {
        $scope.response_msg1 = "";
        settingsFactory.listLeaves().fetch({},function(response){
            $scope.leaves_list =[];
            if(response.status == 200){
                if(response.data.facultySettings!=undefined){
                    var _data = angular.fromJson(response.data.facultySettings);
                    $scope.leaves_list = _data;
                    $localStorage.leaves = $scope.leaves_list;
                }
            }
        },function(response){
            $scope.leaves_list =[];
        });
    };
    $scope.listDesignation = function () {
        $scope.response_msg1 = "";
        settingsFactory.listDesignation().fetch({},function(response){
            $scope.designation_list =[];
            if(response.status == 200){
                if(response.data.designations!=undefined){
                    var _data = angular.fromJson(response.data.designations);
                    $scope.designation_list = _data;
                    $localStorage.designations = $scope.designation_list;
                }
            }
        },function(response){
            $scope.designation_list =[];
        });
    };
    $scope.getSyllabus = function () {
        $scope.response_msg1 = "";
        settingsFactory.getSyllabus().fetch({},function(response){
            $scope.syllabus_list =[];
            if(response.status == 200 || response.status ==201){
                if(response.data.syllabusDetails!=undefined){
                    var _data = angular.fromJson(response.data.syllabusDetails);
                    $scope.syllabus_list = _data;
                }
            }
        },function(response){
            $scope.syllabus_list =[];
        });
    };

    $scope.getCategory = function () {
        $scope.response_msg1 = "";
        settingsFactory.getCategory().fetch({},function(response){
            $scope.categories =[];
            if(response.status == 200 || response.status ==201){
                if(response.data.categories!=undefined){
                    var _data = angular.fromJson(response.data.categories);
                    $scope.categories = _data;
                }
            }
        },function(response){
            $scope.categories =[];
        });
    };

    $scope.getNonTeachingStaff = function () {
        $scope.response_msg1 = "";
        settingsFactory.getNonTeachingStaff().fetch({},function(response){
            $scope.non_teaching_staff =[];
            if(response.status == 200 || response.status ==201){
                if(response.data.designations!=undefined){
                    var _data = angular.fromJson(response.data.designations);
                    $scope.non_teaching_staff = _data;
                }
            }
        },function(response){
            $scope.non_teaching_staff =[];
            console.log(response.status);
        });
    };

    $scope.getGrades = function () {
        $scope.response_msg1 = "";
        settingsFactory.getGrades().fetch({},function(response){
            $scope.grade_list =[];
            if(response.status == 200 || response.status ==201){
                if(response.data.grades!=undefined){
                    var _data = angular.fromJson(response.data.grades);
                    $scope.grade_list = _data;
                }
            }
        },function(response){
            $scope.grade_list =[];
            console.log(response.status);
        });
    };

    $scope.init = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.listYears();
        $scope.assessmentlist();
        $scope.fetchAcademicYear();
        $scope.listDesignation();
        $scope.listLeaves();
        $scope.getSyllabus();
        $scope.getCategory();
        $scope.getNonTeachingStaff();
        $scope.getGrades();
    };

    $scope.init();

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.response_msg2 = "";
        $scope.response_msg3 = "";
        $scope.response_msg4 = "";
        $state.go('^.list');
    };
    $scope.cancel1 = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.response_msg2 = "";
        $scope.response_msg3 = "";
        $scope.response_msg4 = "";
        $state.go('^.basic');
    };

}]);