/**
 * Created by Icarat2 on 5/18/2016.
 */

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

facultyApp.controller('assignmentCtrl', ['$scope','assignmentFactory','faculty_appConfig','$state','$filter','$modal','$window','$localStorage',function($scope,assignmentFactory,faculty_appConfig,$state,$filter,$modal,$window,$localStorage){
    var initials = {
        assignmentId:"",assignmentName:"",subjectName:"",description:"",startDate:"",endDate:""
    };

    $scope.assignmentDetails = {
        assignment_list: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.aDate = '2015-10-31';
    $scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
    }

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        assignmentFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            if(response.status == 200 || response.status == 201){
                if(response.data.classroomnames != undefined){
                    var _data = angular.fromJson(response.data.classroomnames);
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
        var standard = window.btoa(currentStandard.name);
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
            $scope.response_msg = "No classrooms found";
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
        $scope.response_msg1 = "";
        if(currentClassroom === undefined || startDate == undefined || endDate == undefined){
            window.alert("Please select the Year, CLass, Section, Start Date and End Date");
        }else{
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
                $scope.response_msg = "No assignments found for this classroom.";
                $scope.$parent.setBaseContentHeight(-1);
                console.log(response.status);
            });
        }
    };

    $scope.addAssignment = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        $scope.fetchStandardList($scope.academicYear);
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
                $scope.assignment_list =[];
                $scope.response_msg = "Assignment created successfully !!!";
            }
            $state.go('^.list');
            $scope.response_msg = "Assignment created successfully !!!";
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

    };

    $scope.updateAssignment = function(){
        var edit = $scope.edit;

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
                $scope.assignment_list =[];
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
        $scope.assignment_list =[];
        $state.go('^.list');
    };

    $scope.init = function(){
        $scope.years = $localStorage.years;
        $scope.sections = $localStorage.sections;
        $scope.academicYear = $localStorage.academicYear.successMessage;
    };

    $scope.init();

}]);


