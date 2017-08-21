/**
 * Created by Icarat2 on 3/13/2016.
 */
branchManager.factory('assessmentMangementFactory',['$resource','br_Manager_Config','$window',function ($resource,br_Manager_Config,$window){
    var factory = {};

    var fecth_assessment_url =  br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fecthAssesmentList = function(currentClassroom){
        // branch/BRANCH0001/classroom/CL0000002/assessment/fetch
        return $resource(fecth_assessment_url+'/classroom/'+currentClassroom+'/assessment/fetch',{},{
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

    factory.fetchStandardList = function(selectedYear) {
        return $resource(fecth_assessment_url+'/classroom/year/'+ selectedYear, {}, {
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
        return $resource(fecth_assessment_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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

    factory.listExams = function(classroomId, assessmentId){
        // /BRANCH0001/classroom/CL0000002/assessment/ASS0000016
        return $resource(fecth_assessment_url+'/classroom/'+classroomId+'/assessment/'+assessmentId,{},{
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

    factory.fetchSubjectList = function(currentClassroom){
        return $resource(fecth_assessment_url+'/subject/classroom/'+currentClassroom,{},{
            fetch : {
                method : 'get',
                isArray : false,
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function (data) {
                        return data;
                    }
                }
            }
        });
    };

    factory.createAssessment = function(classRoomId){
        // classroom/CL00000001/assessment
        return $resource(fecth_assessment_url+'/classroom/'+classRoomId+'/assessment',{},{
            add:{
                method:'POST',
                headers: { 'Authorization' : authCode,
                            'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data)
                    {
                        console.log("data posted successfully !!");
                        return data;
                    }
                }
            }
        });
    };


    factory.updateAssessment = function(classRoomId, assess){
        return $resource(fecth_assessment_url+'/classroom/'+classRoomId+'/assessment/'+assess,{},{
            add:{
                method:'PUT',
                headers: { 'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data)
                    {
                        console.log("data posted successfully !!");
                        return data;
                    }
                }
            }
        });
    };


    factory.deactivateAssessment = function (classroomId, assessmentId) {
        // /classroom/CL000001/assessment/AS0000001/dectivate
        return $resource(fecth_assessment_url+'/classroom/'+classroomId+'/assessment/'+assessmentId+'/dectivate',{}, {
            remove: {
                method: 'get',
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

    return factory;
}]);

branchManager.controller('assessmentCtrl',['$scope','assessmentMangementFactory','br_manager_appConfig','$state','$filter','$modal','$localStorage',function($scope,assessmentMangementFactory,br_manager_appConfig,$state,$filter,$modal,$localStorage){

    var initials = {
        assesmentName:"",
        year:"",
        classRoomId:"",
        assessmentId:"",
        maxMarks1:"",maxMarks2:"",maxMarks3:"",maxMarks4:"",maxMarks5:"",
        maxMarks6:"",maxMarks7:"",maxMarks8:"",maxMarks9:"",maxMarks10:""
    };
    $scope.assessmentDetails = {
        assessmentList: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };

    $scope.aDate = '2015-10-31';
    $scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
    }



    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.subjects = [];
        var year = window.btoa(selectedYear);
        assessmentMangementFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            console.log( $scope.standard_list);
            if(response.status == 200 || response.status == 201){
                if(response.data.classroomnames != undefined){
                    var _data = angular.fromJson(response.data.classroomnames);
                    $scope.standard_list = _data;
                }
            }
        },function(response){
            $scope.standard_list = [];
            $scope.response_msg1 = "There is no Class found for this year.";
            console.log(response.status);
        });
    };

    $scope.fetchSectionList = function(currentStandard,selectedYear){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        $scope.subjects = [];
        var standard = window.btoa(currentStandard.name);
        var year = window.btoa(selectedYear);
        assessmentMangementFactory.fetchSectionList(standard,year).fetch({},function(response){
            $scope.classroom_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classroom_list = _data;
                }
            }
        },function(response){
            $scope.classroom_list = [];
            $scope.response_msg = "No classrooms found";
            console.log(response.status);
        });
    };

    $scope.fecthAssesmentList = function(currentClassroom){
        $scope.response_msg1 = "";
        var classRoom = window.btoa(currentClassroom.classRoomId);
        assessmentMangementFactory.fecthAssesmentList(classRoom).fetch({},function(response){
            $scope.assessment_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.assessmentLists!=undefined){
                    var _data = angular.fromJson(response.data.assessmentLists);
                    $scope.assessment_list = _data;
                    $scope.$parent.setBaseContentHeight($scope.assessment_list.length);
                }
            }
        },function(response){
            $scope.assessment_list = [];
            $scope.response_msg1 = "There is no Assessments.";
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.fetchSubjectList = function(currentClassroom){
        $scope.response_msg = "";
        var classRoom = window.btoa(currentClassroom.classRoomId);
        assessmentMangementFactory.fetchSubjectList(classRoom).fetch({}, function(response){
            $scope.sub_list = [];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.subjects != undefined){
                    var _data = angular.fromJson(response.data.subjects);
                    $scope.sub_list = _data;
                    $scope.subjects = [];
                    $scope.sub_list.forEach(function(v){
                        $scope.subjects.push(v.subjectName);
                    });
                }
            }
        });
    };


    $scope.listExams = function(classroom, assessment,index,selectedYear){
        $scope.response_msg = "";
        var classRoom = window.btoa(classroom.classRoomId);
        var assess = window.btoa(assessment.assessmentId);
        assessmentMangementFactory.listExams(classRoom,assess).fetch({}, function(response){
            $scope.exams_list = {};
            console.log(response);
            if(response.status == 200){
                if(response.data != undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.exams_list = _data;
                    $scope.assessmentId = assessment.assessmentId;
                    $scope.classRoomId = classroom.classRoomId;
                    $scope.section = assessment.section;
                    $scope.assesmentName = $scope.exams_list.assesmentName;
                    $scope.eyear = selectedYear;
                    $scope.Exams = $scope.exams_list.exams;
                }
            }
        });
    };

// ******************************************************
    $scope.addAssessment =function(){
        $scope.fetchStandardList($scope.academicYear);
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        console.log("inside addAssessment");
        $scope.other= 0;
        $scope.assess = function(assessment){
            name = "Other";
            if(angular.equals(name,assessment)){
                $scope.other = 1;
                console.log("name change");
            }else{
                $scope.other = 0;
                console.log("No change");
            }
        };

        $scope.newExams = [{id: 'ex1'}];
        $scope.addAssess = function() {
            var newItem = $scope.newExams.length+1;
            $scope.newExams.push({'id':'ex'+newItem});
        };

        $scope.removeAssess = function() {
            var lastMode = $scope.newExams.length-1;
            $scope.newExams.splice(lastMode);
        };
    };

    $scope.createAssessment = function(currentClassroom,assessment, selectedYear) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        if(currentClassroom == undefined || selectedYear == undefined || assessment == undefined){
            window.alert("Please select Year, Class, Section and Assessment")
        }else {
            var add = $scope.add;
            var NameOfAssessment = "";
            var assessName = function () {
                name = "Other";
                if (angular.equals(assessment, name)) {
                    NameOfAssessment = add.assessmentName1;
                } else {
                    NameOfAssessment = assessment;
                }
                return NameOfAssessment;
            };

            $scope.newExams.forEach(function (v) {
                delete v.id;
                v.date = $filter('date')(new Date(v.date), 'yyyy-MM-dd');
            });

            var body = {
                assesmentName: assessName(),
                year: selectedYear,
                exams: $scope.newExams
            };
            console.log("data read");
            console.log(body);

            var classRoom = window.btoa(currentClassroom.classRoomId);
            var response = assessmentMangementFactory.createAssessment(classRoom);
            var data = response.add({}, body, function (response) {
                if (response.status == 200 || response.status == 201) {
                    $scope.assessment_list = [];
                    $scope.subjects = [];
                }
                $state.go('^.list');
                $scope.response_msg = "Assessment added successfully !!!";
            }, function (response) {
                //$scope.response_msg1 = response.data.errorMessage;

                if (response.status == 404) {
                    $scope.assessmentName = "";
                    $scope.response_msg1 = response.data.errorMessage;
                }
                else {
                    $scope.response_msg1 = "Addition of Assessment is not successful !!!";
                }
            });
        }
    };


    $scope.editAssessment = function(currentClassroom,  assessment,index, selectedYear, standard){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.edit = angular.copy(initials);
        var classRoom = window.btoa(currentClassroom.classRoomId);
        var assess = window.btoa(assessment.assessmentId);
        $scope.assessmentId = assessment.assessmentId;
        $scope.section = assessment.section;
        assessmentMangementFactory.fetchSubjectList(classRoom).fetch({}, function(response){
            $scope.sub_list = [];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.subjects != undefined){
                    var _data = angular.fromJson(response.data.subjects);
                    $scope.sub_list = _data;
                    assessmentMangementFactory.listExams(classRoom,assess).fetch({}, function(response){
                        $scope.exams_list = {};
                        console.log(response);
                        if(response.status == 200 || response.status == 201){
                            if(response.data != undefined){
                                var _data = angular.fromJson(response.data);
                                $scope.exams_list = _data;
                                $scope.edit.classRoomId = currentClassroom.classRoomId;
                                $scope.assesmentName = $scope.exams_list.assesmentName;
                                $scope.edit.eyear = selectedYear;
                                $scope.edit.standard = standard;

                                $scope.exams_list.exams.forEach(function(v){
                                    v.date = new Date(v.date);
                                });

                                $scope.subjects = [];
                                $scope.sub_list.forEach(function(v){
                                    $scope.subjects.push(v.subjectName);
                                });

                                $scope.removeExams = function(exam) {
                                    // var lastMode = $scope.exams_list.exams.length-1;
                                    var index = $scope.exams_list.exams.indexOf(exam);
                                    var delObj = $scope.exams_list.exams.splice(index, 1);
                                    $scope.deletedExams.push(delObj.pop());
                                    console.log($scope.deletedExams);
                                };
                                /*
                                $scope.remove = function(item) {
                                    var index = $scope.bdays.indexOf(item);
                                    $scope.bdays.splice(index, 1);
                                } */

                                 $scope.NewExams = [{id: 'ex1'}];
                                 $scope.addExam = function() {
                                 var newItem = $scope.NewExams.length+1;
                                 $scope.NewExams.push({'id':'ex'+newItem});
                                 };

                                $scope.deletedExams = [];
                                $scope.removeExam = function() {
                                    var lastMode = $scope.NewExams.length-1;
                                    $scope.NewExams.splice(lastMode);
                                };
                            }
                        }else{
                            console.log(response.status);
                            console.log("Exam list not fiound");
                            $scope.response_msg1 = "Exam list not fiound";
                        }
                    });
                }else{
                    console.log(response.status);
                    console.log("Subject list not fiound");
                    $scope.response_msg1 = "Subject list not fiound";
                }
            }
        });
    };

    $scope.updateAssessment = function() {

        var edit = $scope.edit;
        $scope.exams_list.exams.forEach(function(v){
            v.date = $filter('date')(new Date(v.date),'yyyy-MM-dd');
        });
        $scope.deletedExams.forEach(function(v){
            v.date = $filter('date')(new Date(v.date),'yyyy-MM-dd');
        });
        $scope.NewExams.forEach(function(v){
            delete v.id;
            v.date = $filter('date')(new Date(v.date),'yyyy-MM-dd');
        });
       // $scope.Exams = $scope.exams_list.exams.concat($scope.NewExams );
        var body = {
            assesmentName: $scope.assesmentName,
            year : $scope.edit.eyear ,
            updatedExams : $scope.exams_list.exams,
            addedExams : $scope.NewExams,
            deletedExams : $scope.deletedExams
        };
        var classRoom = window.btoa($scope.edit.classRoomId);
        var assess = window.btoa($scope.assessmentId);
        var response = assessmentMangementFactory.updateAssessment(classRoom,assess);
        var data = response.add({},body, function(response){
            if(response.status == 200 || response.status == 201){
                $scope.subjects = [];
                $scope.assessment_list = [];
            }
            $state.go('^.list');
            $scope.response_msg = "Assessment Updated successfully !!!";
        }, function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else {
                $scope.response_msg = "Updating of Assessment is not successful !!!";
            }
        });
    };


    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "assessment" && $scope.assessment_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.assessment_list.length);
        }
    });

    $scope.init = function () {
        $scope.years = $localStorage.years;
        $scope.academicYear = $localStorage.academicYear.successMessage;
        $scope.assessments_name = $localStorage.assessments;
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.assessment_list =[];
        $scope.subjects = [];
        $state.go('^.list');
    };

    $scope.init();

}]);