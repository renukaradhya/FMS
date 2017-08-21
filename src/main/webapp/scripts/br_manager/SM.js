
branchManager.factory('studentManageFactory',['$resource','br_Manager_Config', '$window','$http',function($resource,br_Manager_Config, $window,$http){
    var factory = {};

    var fetch_student_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");


    factory.studentPhoto = function(studentId){
      return   url = fetch_student_url+'/image/student/'+studentId;
    };

    factory.fetchStudentsPdfReport = function(classroom){
        var studentReportUrl;
        if(classroom != null) {
            studentReportUrl =fetch_student_url+'/student/reports/classroom/'+classroom
        }
        return $resource(studentReportUrl,{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        return data;
                    }
                }
            }
        });
    };

    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_student_url +'/classroom/year/'+ selectedYear, {}, {
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
    factory.fetchClassRoomlist = function(currentStandard, selectedYear) {
        return $resource(fetch_student_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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

    factory.fetchSectionList = function(selectedYear, currentStandard) {
        return $resource(fetch_student_url +'/classroom/standard/'+ currentStandard +  '/year/'+ selectedYear+'/sectionnames', {}, {
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

    //http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/student/year/2016-17/std/First/sec/A/students
    factory.fetchStudents = function( selectedYear, currentStandard, currentSection,offset,limit) {
        return $resource(fetch_student_url+'/student/year/'+selectedYear+'/std/'+currentStandard +'/sec/'+currentSection+'/students'+'?offset='+offset+'&limit='+limit,{},{
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
        return $resource(fetch_student_url+'/student/year/'+selectedYear+'/std/'+currentStandard +'/sec/'+currentSection+'/basicinfo',{},{
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

    // http://localhost:8080/Eshiksha/org/org121/branch/bra1231/student/stu1231/year/year1312/standard/std1212/section/sec1212/abstract
    factory.fetchStudentDetails = function(currentStudent,year,standard,section) {
        return $resource(fetch_student_url+'/student/'+currentStudent+'/year/'+year+'/standard/'+standard+'/section/'+section+'/abstract',{},{
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


    factory.validateUsername = function(userName) {
        // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/student/userName/ravi
        return $resource(fetch_student_url+'/student/userName/'+userName,{},{
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

    factory.fetchPhoto = function(currentStudent) {
        //branch/BRANCH0001/image/student/STD0000002
        return $resource(fetch_student_url+'/image/student/'+currentStudent,{},{
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

    factory.createStudent = function(){
        return $resource(fetch_student_url+'/student',{},{
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

    factory.studentReadmission = function(studentId){
        return $resource(fetch_student_url+'/student/'+studentId+'/readmission',{},{
            read:{
                method: 'POST',
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

   // http://localhost:8080/Eshiksha/org/wr/branch/wrr/student/wrewr/vehicle/erwr/assign
    factory.assignStudentsVehicle = function(studentId, vehicleId){
        return $resource(fetch_student_url+'/student/'+studentId+'/vehicle/'+vehicleId+'/assign',{},{
            assign: {
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

  //  http://localhost:8080/Eshiksha/org/ORG00000001/branch/BRANCH0001/vehicle/getVehicleIds
    factory.getVehicles = function(){
            console.log("Autorize: "+ authCode);
        return $resource(fetch_student_url+'/vehicle/getVehicleIds',{},{
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


    factory.fetchMode = function(ClassRoomId){
        console.log("Autorize: "+ authCode);
        return $resource(fetch_student_url+'/expandfees/classroom/'+ClassRoomId+'/studentfeestructuretype',{},{
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

    factory.choosePaymentMode = function(studentId){
        return $resource(fetch_student_url+'/student/'+studentId+'/feesmode',{},{
            add:{
                method: 'POST',
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

    factory.boardingInfo = function(studentId,point){
        return $resource(fetch_student_url+'/student/'+studentId+'/boardingPoint/'+point+'/assign',{},{
            assign: {
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
    factory.listRoutes = function(){
        return $resource(fetch_student_url+'/vehicle/vehicleRoute',{},{
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


branchManager.controller('studentManageCtrl',['$scope','studentManageFactory','br_manager_appConfig','$state','$filter','$modal','fileUpload','$localStorage', function($scope,studentManageFactory,br_manager_appConfig,$state,$filter,$modal,fileUpload,$localStorage) {

    var initials = {
        studentId:"",studentFirstName:"",studentLastName:"",dateOfBirth:"",fatherFirstName:"",fatherLastName:"",
        motherFirstName:"",motherLastName:"", caste:"", nationality:"",gender:"",blood:"",phoneNumber:"",email:"",year:"",rollnumber:"",
        yearOfJoining:"",classRoomId:"",religion:"",userName:"",password:"",correspondingYear:""
        ,localAddress:"",permanentAddress:"",admissionDate:"",vehicleRegNumber:"",type:""
    };
    $scope.aDate = '2015-10-31';
    $scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
    }
    $scope.studentDetails = {
        studentList: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        $scope.section_list ="";
        $scope.student_list ="";
        $scope.student_details = {};
        var year = window.btoa(selectedYear);
        studentManageFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            if(response.status == 200 || response.status == 201)
            {
                if(response.data.classroomnames != undefined){
                    var _data = angular.fromJson(response.data.classroomnames);
                    $scope.standard_list = _data;
                }
            }
        },function(response){
            $scope.standard_list = [];
            $scope.response_msg = "No Standards found for this year.";
            console.log(response.status);
        });
    };
    $scope.fetchSectionList = function(selectedYear, currentStandard){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        studentManageFactory.fetchSectionList(year, standard).fetch({},function(response){
            $scope.section_list =[];
            $scope.student_list =[];
            $scope.student_details = {};
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.sections!=undefined){
                    var _data = angular.fromJson(response.data.sections);
                    $scope.section_list = _data;
                }
            }
        },function(response){
            $scope.section_List = [];
            $scope.response_msg1 = "No Section found for this standard.";
            console.log(response.status);
        });
    };

    $scope.fetchStudents = function(selectedYear, currentStandard, currentSection,offset,limit){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        var section = window.btoa(currentSection.section);
        studentManageFactory.fetchStudents(year, standard, section,offset,limit).fetch({},function(response){
            $scope.student_list =[];
            $scope.student_details = {};
            console.log(response);
            if(response.status == 200 || response.status == 201){
                $scope.count = response.data.total;
                console.log($scope.count);
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    $scope.student_list = _data;
                    $scope.totalPages = Math.ceil($scope.count/$scope.studentDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.student_list.length);
                }
            }
        },function(response){
            $scope.student_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.fetchStudentList = function(selectedYear, currentStandard, currentSection,offset,limit){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        var section = window.btoa(currentSection.section);
        console.log(selectedYear+":"+currentStandard+":"+currentSection.section);
        studentManageFactory.fetchStudentList(year, standard, section,offset,limit).fetch({},function(response){
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
            $scope.response_msg = "No students found for this section.";
            console.log(response.status);
        });
    };

    $scope.fetchStudentDetails = function(currentStudent,year,standard,section){
        $scope.response_msg = "";
        var student = window.btoa(currentStudent.studentId);
        var year = window.btoa(year);
        var standard = window.btoa(standard.name);
        var section = window.btoa(section);
        studentManageFactory.fetchStudentDetails(student,year,standard,section).fetch({},function(response){
            $scope.student_details = {};
            if(response.status == 200 || response.status == 201){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.student_details = _data;
                    $scope.stud = $scope.student_details;
                    $scope.studentId = $scope.student_details.studentId;
                    $scope.fname = $scope.student_details.studentFirstName;
                    $scope.lname = $scope.student_details.studentLastName;
                    $scope.fatherFname = $scope.student_details.fatherFirstName;
                    $scope.fatherLname = $scope.student_details.fatherLastName;
                    $scope.motherFname = $scope.student_details.motherFirstName;
                    $scope.motherLname = $scope.student_details.motherLastName;
                    $scope.class = $scope.student_details.currentClass;
                    $scope.branchName = $scope.student_details.branchName;
                    $scope.currentYear =$scope.student_details.currentYear;
                    $scope.joiningYear =$scope.student_details.yearOfJoining;
                    $scope.gender = $scope.student_details.gender;
                    $scope.blood = $scope.student_details.blood;
                    $scope.routeNumber = $scope.student_details.routeNumber;
                    $scope.phoneNumber = $scope.student_details.phoneNumbers[0].phoneNumber;
                    $scope.email = $scope.student_details.emails[0].email;
                    $scope.result = $scope.student_details.promote;
                    $scope.dob = $scope.student_details.dob;
                    $scope.caste = $scope.student_details.caste;
                    $scope.religion = $scope.student_details.religion;
                    $scope.nationality = $scope.student_details.nationality;
                    $scope.rollNumber = $scope.student_details.rollNumber;
                    $scope.section = $scope.student_details.section;
                    $scope.localAddress = $scope.student_details.localAddress;
                    $scope.permanentAddress = $scope.student_details.permanentAddress;
                }
                $scope.student_details = undefined;
            }
        },function(response){
            $scope.student_details = undefined;
            console.log(response.status);
        });
    };



    $scope.listRoutes = function(){
        $scope.response_msg1 = "";
        studentManageFactory.listRoutes().fetch({},function(response){
            $scope.route_list =[];
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.vehicleRoutes!=undefined){
                    var _data = angular.fromJson(response.data.vehicleRoutes);
                    $scope.route_list = _data;
                }
            }

        },function(response){
            $scope.route_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.postPlace = function(student, index){
        $scope.response_msg = "";
        $scope.obj = student;
        $scope.listRoutes();
    };
    $scope.boardingInfo = function (boardPoint) {
        var point = window.btoa(boardPoint.boardingPointId);
        var studentId = window.btoa($scope.obj.studentId);
        studentManageFactory.boardingInfo(studentId,point).assign({},function(response){
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                $scope.student_list = [];
            }
            $scope.response_msg = "Boarding Details Saved Successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            } else{
                $scope.response_msg1 = "Assigning boarding point is unsuccessful !!!";
            }
        });
    };

    /*  $scope.getVehicles = function(){
     $scope.response_msg1 = "";
     studentManageFactory.getVehicles().fetch({},function(response){
     $scope.vehicle_list = [];
     if(response.status == 200 || response.status == 201){
     if(response.data.vehicles!=undefined){
     var _data = angular.fromJson(response.data.vehicles);
     $scope.vehicle_list = _data;
     $scope.vehicle = $scope.vehicle_list[0];
     }
     }
     });
     };*/

   /* $scope.assignVehicle = function(studentId){
        $scope.response_msg="";
        $scope.assign = angular.copy(initials);
        angular.forEach($scope.student_list, function(student){
            if(studentId == student.studentId){
                $scope.assign.studentFirstName = student.studentFirstName;
                $scope.assign.studentId = student.studentId;
                $scope.assign.standard = student.currentClass;
                $scope.assign.year = student.year;
                $scope.assign.section = student.section;
                $scope.getVehicles();
            }
        });
    };

    $scope.assignStudentsVehicle = function(studentId, vehicle){
        var studentId = window.btoa(studentId);
        var vehicleId = window.btoa(vehicle.vehicleId);
        studentManageFactory.assignStudentsVehicle(studentId,vehicleId).assign({},function(response){
            $scope.classroom_list =[];
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
            }
            $scope.response_msg = "Student assigned to vehicle successfully !!!.";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            } else{
                $scope.response_msg1 = "Assigning to vehicle is unsuccessful !!";
            }
        });
    };*/

    $scope.chooseMode = function(student, index, section){
        $scope.mode_list = [];
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.name = student.studentFirstName;
        $scope.studId = student.studentId;
        var classroomId = window.btoa(section.classRoomId);
        studentManageFactory.fetchMode(classroomId).fetch({},function(response){
            $scope.mode_list = [];
            if(response.status == 200 || response.status == 201){
                if(response.data.feeTypes!=undefined){
                    var _data = angular.fromJson(response.data.feeTypes);
                    $scope.mode_list = _data;
                }
            }
        },function(response){
            console.log("errorrrrrr")
        });
        $scope.add = angular.copy(initials);
    };

    $scope.choosePaymentMode = function(mode){
        var body =' { ' +
                '"mode" :"' + mode + '"'+
            '}';
        var studentId = window.btoa($scope.studId);
        var response = studentManageFactory.choosePaymentMode(studentId);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201) {
                $state.go('^.list');
                $scope.mode_list = [];
                $scope.student_list = [];
            }
            $scope.response_msg = "Fees Mode Added Successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            } else{
                $scope.response_msg1 = "Selecting Fees Mode is unsuccessful !!!";
            }
        });
    };
    $scope.image = false;
    $scope.fetchPhoto = function(studentId) {
        $scope.photo = {};
        var student = window.btoa(studentId);
        studentManageFactory.fetchPhoto(student).fetch({},function(response){
            $scope.success = false;
            if(response.status == 200 || response.status == 201){
                $scope.photo = response.data;
                $scope.image = true;
            }
        },function(response){
            $scope.image = false;
            console.log("errorrrrrr")
        });
    };

    $scope.validateUsername = function(userName){
        var user = window.btoa(userName);
        studentManageFactory.validateUsername(user).fetch({}, function(response){
            if(response.status == 200 || response.status == 201){
                $scope.availability = "Available !!"
            }
        }, function(response){
            $scope.availability = response.data.errorMessage;
        })
    };

    $scope.addStudent = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.fetchStandardList($scope.academicYear);
        $scope.discountAmount = 0;
        $scope.add = angular.copy(initials);
        $scope.add.gender = "Male";
    };

    $scope.createStudent = function (selectedYear, standard, classroom,discountAmount) {
        $scope.availability = "";
        var add = $scope.add;
        $scope.add.dateOfBirth.Value = $filter('date')(new Date(add.dateOfBirth),'yyyy-MM-dd');
        $scope.add.admissionDate.Value = $filter('date')(new Date(add.admissionDate),'yyyy-MM-dd');
        var body = ' { ' +
            '"yearOfJoining" :"' + $scope.academicYear + '",' +
            '"section" :"' + classroom.section + '",' +
            '"standard" :"' + standard.name + '",' +
            '"studentFirstName":"' + add.studentFirstName + '",' +
            '"studentLastName" :"' + add.studentLastName + '",' +
            '"dateOfBirth" :"' + $scope.add.dateOfBirth.Value + '",' +
            '"gender" :"' + add.gender + '",' +
            '"blood" :"' + add.blood + '",' +
            '"admissionDate" :"' + $scope.add.admissionDate.Value + '",' +
            '"discountAmount" :"' + discountAmount + '",'+
            '"fatherFirstName" :"' + add.fatherFirstName + '",'+
            '"fatherLastName" :"'+add.fatherLastName + '",'+
            '"motherFirstName" :"' + add.motherFirstName + '",'+
            '"motherLastName" :"' + add.motherLastName + '",'+
            '"localAddress" :"' + add.localAddress + '",'+
            '"permanentAddress" :"' + add.permanentAddress + '",'+
            '"religion" :"'+add.religion + '",'+
            '"nationality" :"'+add.nationality + '",'+
            '"caste" :"'+add.caste + '",'+
            '"correspondingYear" :"'+$scope.academicYear + '",'+
            '"classRoomId" :"'+ classroom.classRoomId + '",'+
            '"rollnumber" :"'+add.rollnumber + '",'+
            '"userName" :"' + add.userName + '",' +
            '"password" :"' + add.password + '",' +

            '"emails"' + ':' +
                '[' +
                    '{' +
                        '"email" :"' + add.email + '",' +
                        '"type" :"' + add.type + '"' +
                    '}' +
                ']' +',' +
            '"phoneNumbers"' + ':' +
                '[' +
                    '{' +
                        '"phoneNumber" :"' + add.phoneNumber + '",' +
                        '"type" :"' + add.type + '"' +
                    '}' +
                ']' +
            '}';

        console.log("Inputs read  !!");
        var response = studentManageFactory.createStudent();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201) {
                $scope.response_msg = "Student Admission done successfully !!!";
                $scope.student_list = [];
                $state.go('^.list');
            }
            $scope.response_msg = "Student Admission done successfully !!!";
        },function(response){
             if(response.status == 404){
                 $scope.response_msg1 = response.data.errorMessage;
            }else{
                $scope.response_msg1 = "Admission of student is unsuccessful !!!";
            }
        });
    };

    //********************* Readmission *******************
    $scope.readStudent = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.discountPercentage = 0;
        $scope.read = angular.copy(initials);
    };

    $scope.studentReadmission = function (currentStudent,discount,standard,section) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var read = $scope.read;
        var body = ' { ' +
            '"rollnumber" :"' + read.rollnumber + '",' +
            '"correspondingYear" :"' + read.x.year + '",' +
            '"standard" :"' + read.y.standard + '",' +
            '"discountAmount" :"' + discount + '",' +
            '"section":"' + read.z.name + '"' +
            '}';
        var student = window.btoa(currentStudent.studentId);
        var response = studentManageFactory.studentReadmission(student);
        var data = response.read({}, body, function (response) {
            if(response.status == 200 || response.status == 201) {
                $state.go('^.list');
                $scope.stud = {};
                $scope.student_list = [];
            }
            $scope.response_msg = "Student Re-Admission done successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }else{
                $scope.response_msg1= "Re-Admission of student is unsuccessful !!!";
            }
        });
    };
    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "student" && $scope.student_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.student_list.length);
        }
    });
    $scope.getSectionList = function (obj) {
        $scope.sec_list = obj.sections;
    };
    $scope.init = function(){
        $scope.mode_list = [];
        $scope.bg_list = ["A +ve","A -ve","B +ve","B -ve","AB +ve","AB -ve","O +ve","O -ve"];
        $scope.studentDetails.numPerPage = parseInt($scope.studentDetails.numPerPage);
        $scope.maxSize = 5;
        $scope.years = $localStorage.years;
        $scope.list_years = $localStorage.years;
        $scope.standards = $localStorage.sections;
        $scope.academicYear = $localStorage.academicYear.successMessage;
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.availability = "";
        $scope.photo =[];
        $scope.stud = {};
        $scope.student_list = [];
        $state.go('sm.list');
    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.photo = [];
        $scope.student_list = [];
        $state.go('sm.list');
    };

    $scope.init();

    $scope.pageChanged = function(selectedYear,currentStandard, currentSection){
        $scope.studentDetails.startValue = (($scope.studentDetails.currentPage - 1) * $scope.studentDetails.numPerPage);
        $scope.fetchStudents(selectedYear,currentStandard,currentSection,$scope.studentDetails.startValue,$scope.studentDetails.numPerPage);
    };

}]);


branchManager.controller('studentReportsCtrl',['$scope','studentManageFactory','$state','$localStorage',function($scope,studentManageFactory,$state,$localStorage){

    $scope.fetchStandardList = function(selectedYear){
        var year = window.btoa(selectedYear);
        studentManageFactory.fetchStandardList(year).fetch({},function(response){
            $scope.classroom_list =[];
            $scope.standard_list =[];
            console.log( $scope.standard_list);
            if(response.status == 200 || response.status == 201){
                if(response.data.classroomnames != undefined){
                    var _data = angular.fromJson(response.data.classroomnames);
                    $scope.standard_list = _data;
                    if($scope.standard_list.length > 0){
                        console.log("standard list");
                    }
                }
            }
        },function(response){
            $scope.standard_list = [];
            console.log(response.status);
        });

    };

    $scope.fetchClassRoomlist = function(currentStandard,selectedYear){
        $scope.response_msg = "";
        var standard = window.btoa(currentStandard.name);
        var year = window.btoa(selectedYear);
        studentManageFactory.fetchClassRoomlist(standard,year).fetch({},function(response){
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
            console.log(response.status);
        });
    };

    $scope.generateStudentReport = function(classroom){
        var classRoom = window.btoa(classroom);
        if( classroom == undefined ){
            window.alert("Please Select Year, Class, Section ");
        }
        else {
            studentManageFactory.fetchStudentsPdfReport(classRoom).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        console.log("response status 200 !!");
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        $scope.file = file;
                        $scope.fileURL = URL.createObjectURL(file);
                        $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                    } else {
                        console.log("Reponse Length = " + response.data.byteLength);
                    }
                }
            }, function (response) {
                console.log("Error Unable to download the page");
            });
        }
        };

    $scope.renderPDF = function(url, canvasContainer) {
        var scale= 1.7;  //"zoom" factor for the PDF
        console.log("Render PDF !!");
        function renderPage(page) {
            var viewport = page.getViewport(scale);
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvasContainer.appendChild(canvas);
            page.render(renderContext);
        }

        function renderPages(pdfDoc) {
            for(var num = 1; num <= pdfDoc.numPages; num++)
                pdfDoc.getPage(num).then(renderPage);
        }

        //PDFJS.disableWorker = true;
        PDFJS.getDocument(url).then(renderPages);

    };

    $scope.downloadPdf = function(){
        //window.open($scope.fileURL);
        saveAs($scope.file, 'Student Report' + '.pdf');
    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('students.main');
    };

    $scope.init = function () {
        $scope.years = $localStorage.years;
    };

    $scope.init();

}]);

