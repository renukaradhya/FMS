/**
 * Created by Icarat2 on 5/29/2016.
 */


branchManager.factory('photoFactory',['$resource','br_Manager_Config', '$window','$http',function($resource,br_Manager_Config, $window,$http){
    var factory = {};

    var authCode = $window.localStorage.getItem("authCode");
    var fetch_photo_url = br_Manager_Config.getMainAPI();


    factory.fetchFacultyList = function(offset,limit){
        return $resource(fetch_photo_url+'/faculty'+'?offset='+offset+'&limit='+limit,{},{
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
    factory.studentPhoto = function(studentId){
        return   url = fetch_photo_url+'/image/student/'+studentId;
    };

    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_photo_url +'/classroom/year/'+ selectedYear, {}, {
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

    factory.fetchSectionList = function(selectedYear, currentStandard) {

        return $resource(fetch_photo_url +'/classroom/standard/'+ currentStandard +  '/year/'+ selectedYear+'/sectionnames', {}, {
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

    factory.fetchStudentList = function( selectedYear, currentStandard, currentSection) {
        //year/2016-17/std/first/sec/A/basicinfo
        return $resource(fetch_photo_url+'/student'+'/year/'+selectedYear+'/std/'+
            currentStandard +'/sec/'+currentSection+'/basicinfo',{},{
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

    // http://localhost:8080/feesmanagementsystem/org/ORG0000001/branch/BRANCH0001/image/faculty/FC0000002

    factory.facultyPhoto = function(file, facultyId){
        var fd = new FormData();
        fd.append('file', file);
        console.log("faculty id "+facultyId);
        $http.post(fetch_photo_url+'/image/faculty/'+facultyId, fd, {
            transformRequest: angular.identity,
            headers: { 'Authorization' : authCode,
                'Content-Type': undefined}
        }).then(function(response){
            if(response.status == 200 || response.status == 201){
                alert(response.data.successMessage);
            }
        },function(response){
            if(response.status == 404){
                alert(response.data.errorMessage);
            }else{
                alert("Uploading Failed");
            }
        });
    };

    factory.uploadFileToUrl = function(file, studentId){
        var fd = new FormData();
        fd.append('file', file);
        console.log("student id "+studentId);
        $http.post(fetch_photo_url+'/image/student/'+studentId, fd, {
            transformRequest: angular.identity,
            headers: { 'Authorization' : authCode,
                'Content-Type': undefined}
        }).then(function(response){
            if(response.status == 200 || response.status == 201){
                alert(response.data.successMessage);
            }
        },function(response){
            if(response.status == 404){
                alert(response.data.errorMessage);
            }else{
                alert("Uploading Failed");
            }
        });
    };

    factory.uploadBranchLogo = function(file){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(fetch_photo_url+'/image/schoolphoto', fd, {
            transformRequest: angular.identity,
            headers: { 'Authorization' : authCode,
                'Content-Type': undefined}
        }).then(function(response){
            if(response.status == 200 || response.status == 201){
                alert(response.data.successMessage);
            }
        },function(response){
            if(response.status == 404){
                alert(response.data.errorMessage);
            }else{
                alert("Uploading Failed");
            }
        });
    };

    return factory;
}]);

branchManager.directive('imageModel',['$parse', function($parse){
    return  {
        restrict: 'A',
        link: function(scope, element, attrs){
            var model = $parse(attrs.imageModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                })
            })
        }
    }
}]);


branchManager.controller('photoCtrl',['$scope','photoFactory','br_manager_appConfig','$state','$modal','fileUpload','$localStorage', function($scope,photoFactory,br_manager_appConfig,$state,$modal,fileUpload, $localStorage) {

    $scope.uploadStudentphoto = function(currentStudent){
        $scope.response_msg = "";
        if(currentStudent != undefined){
            if($scope.studentPhoto != undefined){
                var file = $scope.studentPhoto;
                if(file.size <= 102400){
                    var stud = window.btoa(currentStudent.studentId);
                    photoFactory.uploadFileToUrl(file,stud);
                }else{
                    $scope.respnose_msg1= "File size should less than 100Kb";
                    window.alert("File size should less than 100Kb")
                }
            }else{
                window.alert("Please select the file !!");
            }
        }else{
            window.alert("Please select Class, Section and Student !!");
        }
    };

    $scope.uploadFacultyPhoto = function(faculty){
        $scope.respnose_msg1= "";
        if($scope.facultyPhoto != undefined){
            var file = $scope.facultyPhoto;
            if(file.size <= 102400){
                var fac = window.btoa(faculty.facultyId);
                photoFactory.facultyPhoto(file, fac);
            }else{
                //$scope.respnose_msg1= "File size should less than 100Kb";
                window.alert("File size should less than 100Kb")
            }
        }else{
            //$scope.respnose_msg1= "Please select the file !!";
            window.alert("Please select the file !!");
        }

    };

    $scope.uploadBranchLogo = function(){
        if($scope.branchLogo != undefined){
            var file = $scope.branchLogo;
            if(file.size <= 102400){
                photoFactory.uploadBranchLogo(file);
            }else{
                //$scope.respnose_msg1= "File size should less than 100Kb";
                window.alert("File size should less than 100Kb")
            }
        }else{
            window.alert("Please select the file !!");
        }

    };

    $scope.facultyDetails = {
        facultyList: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.fetchFacultyList = function(offset,limit){
        $scope.response_msg = "";
        photoFactory.fetchFacultyList(offset,limit).fetch({},function(response){
            $scope.faculty_list =[];
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.faculties!=undefined){
                    var _data = angular.fromJson(response.data.faculties);
                    $scope.faculty_list = _data;
                }
            }
        },function(response){
            $scope.faculty_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        photoFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            if(response.status == 200 || response.status == 201) {
                if(response.data.classroomnames != undefined){
                    var _data = angular.fromJson(response.data.classroomnames);
                    $scope.standard_list = _data;
                }
            }
        },function(response){
            $scope.standard_list = [];
            $scope.response_msg1 = "No Standards found for this year.";
            console.log(response.status);
        });
    };

    $scope.fetchSectionList = function(selectedYear, currentStandard){
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        photoFactory.fetchSectionList(year, standard).fetch({},function(response){
            $scope.section_list =[];
            if(response.status == 200 || response.status == 201){
                if(response.data.sections!=undefined){
                    var _data = angular.fromJson(response.data.sections);
                    $scope.section_list = _data;
                }
            }
        },function(response){
            $scope.section_list = [];
            $scope.response_msg1 = "No classrooms found for this standard.";
            console.log(response.status);
        });
    };

    $scope.fetchStudentList = function(selectedYear, currentStandard, currentSection){
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        var section = window.btoa(currentSection.section);
        photoFactory.fetchStudentList(year, standard, section).fetch({},function(response){
            $scope.student_list =[];
            if(response.status == 200 || response.status == 201){
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    $scope.student_list = _data;
                }
            }
        },function(response){
            $scope.student_list = [];
            $scope.response_msg1 = "Students Not found";
        });
    };


    $scope.init = function () {
        $scope.years = $localStorage.years;
        $scope.academicYear = $localStorage.academicYear.successMessage;
    };

    $scope.init();

}]);



