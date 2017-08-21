/**
 * Created by Icarat2 on 5/19/2016.
 *
  */


branchManager.factory('notificationFactory',['$resource', 'br_Manager_Config', 'Config', '$window',function($resource, br_Manager_Config,Config,$window){
   var factory = {};
   var fetch_notification_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");
   //var fetch_branch_url = Config.getBranchesAPI();


    factory.sendMail = function(studentId){
        // http://localhost:8080/Eshiksha/org/erwer/branch/werwerwer/email/student/werwerwer/mail
        //var url =  fetch_notification_url+'/email/student/'+studentId+'/mail';
        return $resource(fetch_notification_url+'/email/student/'+studentId+'/mail',{},{
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

    factory.fetchFacultyList = function(offset,limit){
        return $resource(fetch_notification_url+'/faculty?offset='+offset+'&limit='+limit,{},{
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


    factory.notifyOneFaculty = function(facultyId){
        // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/email/faculty/FAC46/facultymail
        return $resource(fetch_notification_url+'/email/faculty/'+facultyId+'/facultymail',{},{
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

    factory.notifyAllFaculty = function(){
        // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/email/facultymail
        return $resource(fetch_notification_url+'/email/facultymail',{},{
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

    factory.sendMailNotification = function(classRoomId){
      //  http://localhost:8080/Eshiksha/org/rtert/branch/gdfgdfg/email/classroom/dfgdfgdfg/emailToclassroom
        return $resource(fetch_notification_url+'/email/classroom/'+classRoomId+'/emailToclassroom',{},{
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

    factory.schoolMailNotification = function(year){
        return $resource(fetch_notification_url+'/email/year/'+year+"/mail",{},{
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

    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_notification_url+'/classroom/year/'+ selectedYear, {}, {
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
        return $resource(fetch_notification_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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



    factory.fetchStudentList = function( selectedYear, currentStandard, currentSection) {
        return $resource(fetch_notification_url+'/student/year/'+selectedYear+'/std/'+currentStandard +'/sec/'+currentSection+'/basicinfo',{},{
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

    return factory;
}]);

branchManager.controller('notificationCtrl', ['$scope','notificationFactory','br_manager_appConfig','$state','$modal','$localStorage',function($scope,notificationFactory,br_manager_appConfig,$state,$modal,$localStorage){

    var initials = {
        studetId:"", subject:"", description:"",classRoomId:""
    };
    var initials1 = {
        branchId:"", subject:"", description:""
    };

    $scope.fetchStandardList = function(selectedYear){
        var year = window.btoa(selectedYear);
        notificationFactory.fetchStandardList(year).fetch({},function(response){
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
            console.log(response.status);
        });
    };

    $scope.fetchSectionList = function(currentStandard,selectedYear){
        $scope.response_msg1 = "";
        var standard = window.btoa(currentStandard.name);
        var year = window.btoa(selectedYear);
        notificationFactory.fetchSectionList(standard,year).fetch({},function(response){
            $scope.classroom_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classroom_list = _data;
                    if($scope.classroom_list.length > 0){
                        //       $scope.currentClassroom = $scope.classroom_list[0];
                        //       $scope.fecthAssesmentList($scope.currentClassroom);
                    }
                    //$scope.$parent.setBaseContentHeight($scope.classroom_list.length);

                }
            }
        },function(response){
            $scope.classroom_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.fetchStudentList = function(selectedYear, currentStandard, currentSection){
        $scope.response_msg1 = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        var section = window.btoa(currentSection.section);
        console.log(selectedYear+":"+currentStandard+":"+currentSection.section);
        notificationFactory.fetchStudentList(year, standard, section).fetch({},function(response){
            $scope.student_list =[];
            $scope.student_details = {};
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    $scope.student_list = _data;
                    console.log("data:-"+ $scope.student_list.length);
                }
            }
        },function(response){
            $scope.student_list = [];
            $scope.response_msg1 = "No students found for this section.";
            console.log(response.status);
        });
    };

    $scope.fetchFacultyList = function(offset,limit){
        $scope.response_msg1 = "";
        notificationFactory.fetchFacultyList(offset,limit).fetch({},function(response){
            $scope.faculty_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.faculties!=undefined){
                    var _data = angular.fromJson(response.data.faculties);
                    $scope.faculty_list = _data;
                }
            }
        },function(response){
            $scope.faculty_list = [];
            console.log(response.status);
        });
    };

    $scope.mailNotify = function() {
        $scope.fetchStandardList($scope.academicYear);
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        console.log("inside mailTo !!")
    };

    $scope.sendMail = function (student1) {

        var add = $scope.add;
        console.log("inside sendMail !!");
        var body = ' { ' +
                '"subject":"' + add.subject + '",' +
                '"description" :"' + add.description +
            '"}';
        console.log("read the inputs !!");
        var student = window.btoa(student1.studentId);
        console.log(student1);
        var response = notificationFactory.sendMail(student);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
               // $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
                $scope.response_msg1 = "Mails sent to student successfully !!!";
                console.log("Sent successfully");
            }
            $state.go('^.email');
            $scope.response_msg1 = "Mail sent to student successfully !!!";
        },function(response){
            if(response.status == 409){
                // $scope.add.branchName = "";
                $scope.response_msg1 = response.data.errorMessage;
                console.log("409 error");
            }else if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Sending mail to faculties unsuccessful !!!";
                console.log("Error in sending");
        });
    };

    // ClassRoom Notification
     $scope.sendMailNotification = function (year,standard,classRoom) {
        var add = $scope.add;
        var body = ' { ' +
                '"subject":"' + add.subject + '",' +
                '"description" :"' + add.description +
            '"}';
        console.log("read the inputs !!");
        console.log(classRoom.classRoomId);
        var classRoom = window.btoa(classRoom.classRoomId);
        var response = notificationFactory.sendMailNotification(classRoom);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
               // $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
                $scope.response_msg1 = "Mails sent to all students successfully !!!";
            }
            $state.go('^.email');
            $scope.response_msg1 = "Mails sent to all students successfully !!!";
        },function(response){
            if(response.status == 409){
                // $scope.add.branchName = "";
                $scope.response_msg1 = response.data.errorMessage;
                console.log("409 error");
            }else if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Sending mail to faculties unsuccessful !!!";
        });
    };
    //School Notification
    $scope.schoolMailNotification = function (selectedYear) {

        var add = $scope.add;
        console.log("inside schoolMailNotification !!");
        var body = ' { ' +
            '"subject":"' + add.subject + '",' +
            '"description" :"' + add.description +
            '"}';
        var year = window.btoa($scope.academicYear);
        var response = notificationFactory.schoolMailNotification(year);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.email');
                $scope.response_msg1 = "Mails sent to School successfully !!!";
            }
        },function(response){
            if(response.status == 409){
                // $scope.add.branchName = "";
                $scope.response_msg1 = response.data.errorMessage;
                console.log("409 error");
            }else if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Sending mail to faculties unsuccessful !!!";
        });
    };

    $scope.notifyAllFaculty = function(){

        var add = $scope.add;
        console.log("inside sendMail !!");
        var body = ' { ' +
            '"subject":"' + add.subject + '",' +
            '"description" :"' + add.description +
            '"}';
        console.log("read the inputs !!");

        var response = notificationFactory.notifyAllFaculty();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.response_msg1 = "Mails sent to faculties successfully !!!";
                console.log("Sent successfully");
            }
            $state.go('^.email');
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 ="Sending mail to faculties unsuccessful !!!";
            }else if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Sending mail to faculties unsuccessful !!!";
            console.log("Error in sending");
        });
    };
    $scope.notifyOneFaculty = function(faculty){

        var add = $scope.add;
        console.log("inside sendMail !!");
        var body = ' { ' +
            '"subject":"' + add.subject + '",' +
            '"description" :"' + add.description +
            '"}';
        console.log("read the inputs !!");
        var facId = window.btoa(faculty.facultyId);

        var response = notificationFactory.notifyOneFaculty(facId);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.response_msg1 = "Mails sent to student successfully !!!";
                console.log("Sent successfully");
            }
            $state.go('^.email');
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = "Sending mail to faculties unsuccessful !!!";
                console.log("409 error");
            }else if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Sending mail to faculties unsuccessful !!!";
            console.log("Error in sending");
        });
    };

    $scope.init = function() {
       /* $scope.libraryDetails.numPerPage = parseInt($scope.libraryDetails.numPerPage);
        $scope.maxSize = 5;
        $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);*/
        $scope.academicYear = $localStorage.academicYear.successMessage;
        $scope.years = $localStorage.years;
    };

    $scope.cancel1 = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.email');
    };


    $scope.init();
}]);

branchManager.directive('fileModel',['$parse', function($parse){
    return  {
        restrict: 'A',
        link: function(scope, element, attrs){
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                })
            })
        }
    }
}]);

branchManager.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })

        .error(function(){
        });
    }
}]);

branchManager.controller('myCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = notificationFactory.url;
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };
}]);

