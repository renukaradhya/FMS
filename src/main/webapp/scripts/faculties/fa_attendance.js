/**
 * Created by Icarat2 on 11/16/2016.
 */
facultyApp.factory('attendanceFactory',['$resource','faculty_config', '$window',function($resource,faculty_config, $window){
    var factory = {};
    var fetch_main_url = faculty_config.getMainAPI();
    var baseUrl = faculty_config.getBaseUrl();
    var authCode = $window.localStorage.getItem("authCode");


    factory.fetchClassList = function (facultyId) {
        return $resource(baseUrl+'/faculty/'+facultyId+'/getClassRooms' , {}, {
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

    factory.fetchStudentList = function(year, standard, section, offset, limit) {
        return $resource(baseUrl+'/student/year/'+year+'/std/'+standard +'/sec/'+section+'/students'+'?offset='+offset+'&limit='+limit,{},{
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
    factory.postAttendance = function () {
        return $resource(baseUrl+'/studentattendance',{},{
            add:{
                method:'POST',
                headers: { 'Authorization' : authCode,
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

facultyApp.controller('stdAttendanceCtrl',['$scope','attendanceFactory','$state','$timeout','$window','$localStorage','$filter',function($scope,attendanceFactory,$state,$timeout,$window,$localStorage,$filter){

    var initials = {
        date:"", status:""
    };

    $scope.aDate = '2015-10-31';
    $scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
    }

    $scope.fetchClassList = function(){
        var fid = $window.sessionStorage.getItem('facultyId');
        var faculty = window.btoa(fid);
        attendanceFactory.fetchClassList(faculty).fetch({},function(response){
            $scope.completeList = [];
            console.log(response);
            if(response.status == 200 || response.status == 201) {
                if(response.data.classRoomLists != undefined) {
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.completeList = _data;
                }
            }
            console.log(response);

        }, function(response) {
            $scope.completeList = [];
           // $scope.respnose_msg = "Faculty Not Yet Assigned To Any Classroom!!!";
        })
    };

    $scope.fetchStudentList = function (classroom) {
        var year = window.btoa(classroom.year);
        var standard = window.btoa(classroom.standard);
        var section = window.btoa(classroom.section);
        var offset = 0;
        var limit = classroom.maxCount;
        attendanceFactory.fetchStudentList(year, standard, section, offset, limit).fetch({},function(response){
            $scope.student_list = [];
            if(response.status == 200 || response.status == 201) {
                if(response.data.students != undefined) {
                    var _data = angular.fromJson(response.data.students);
                    $scope.student_list = _data;
                }
            }
        }, function(response) {
            $scope.student_list = [];
            $scope.respnose_msg1 = "Faculty Not Yet Assigned To Any Classroom!!!";
        })
    };



    $scope.listAttendance = function (classroom, index) {
        $scope.add = angular.copy(initials);
        $scope.clr = classroom;
        var year = window.btoa($scope.clr.year);
        var standard = window.btoa($scope.clr.standard);
        var section = window.btoa($scope.clr.section);
        var offset = 0;
        var limit = classroom.maxCount;
        attendanceFactory.fetchStudentList(year, standard, section, offset, limit).fetch({},function(response){
            $scope.student_list = [];
            if(response.status == 200 || response.status == 201) {
                if(response.data.students != undefined) {
                    var _data = angular.fromJson(response.data.students);
                    $scope.student_list = _data;
                    console.log(response);
                    console.log($scope.student_list.length);
                    for(var i = 0; i < $scope.student_list.length; i++){
                        $scope.attendance_list.push({rollNumber:$scope.student_list[i].currentRollNumber,fName:$scope.student_list[i].studentFirstName, lName:$scope.student_list[i].studentLastName, studentId:$scope.student_list[i].studentId, status:''});
                    };
                }
            }
        }, function(response) {
            $scope.student_list = [];
        })
    };

    $scope.postAttendance = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";

        $scope.status_list = [];
        for(i = 0; i<$scope.attendance_list.length; i++){
            if($scope.attendance_list[i].status != ''){
                $scope.status_list.push($scope.attendance_list[i]);
            }else{
                window.alert("Attendance status missing for "+ $scope.attendance_list[i].rollNumber+" "+ $scope.attendance_list[i].fName+ " "+ $scope.attendance_list[i].lName);
                break;
             }
        }
        if($scope.status_list.length == $scope.attendance_list.length){
            var add = $scope.add;

            $scope.attendanceDte = $filter('date')(new Date(add.date),'yyyy-MM-dd');
            var body = {
                date:  $scope.attendanceDte,
                classRoomId:$scope.clr.classRoomId,
                status: $scope.status_list
            };
            var response = attendanceFactory.postAttendance();
            var data = response.add({}, body, function (response) {
                if(response.status == 200 || response.status == 201){
                    $state.go('^.list');
                    $scope.attendance_list = [];
                }
                $scope.response_msg = "Attendance added successfully !!!";
            },function(response){
                $scope.status_list =[];
                if(response.status == 404){
                    $scope.response_msg1 = response.data.errorMessage;
                }
                else
                    $scope.response_msg1= "Addition of Attendance is unsuccessful !!!";
            });
        }else{
            $scope.respnose_msg1 = "Select attendance status for all students";
        }
    };

    $scope.init = function(){
        $scope.attendance_list = [];
        $scope.status_list = [];
        $scope.years = $localStorage.years;
        $scope.academicYear = $localStorage.academicYear.successMessage;
        $scope.fetchClassList();
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.attendance_list = [];
        $state.go('^.list');
    };

    $scope.init();

}]);
