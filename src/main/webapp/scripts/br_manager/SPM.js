
branchManager.factory('studentPromotionFactory1',['$resource','br_Manager_Config', '$window',function($resource,br_Manager_Config, $window){
    var factory = {};

    var fetch_student_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    // http://localhost:8080/Eshiksha/org/ORG00001/branch/BRANCH0001/expandfeetransactions/year/2016-17/student/STD0000001/isFeePaid
    factory.checkFeesPaid = function(selectedYear,studentId) {
        return $resource(fetch_student_url +'/expandfeetransactions/year/'+ selectedYear+'/student/'+studentId+'/isFeePaid', {}, {
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

    factory.studentPromotion = function(studentId, standard, section, year){
        return $resource(fetch_student_url+'/student/'+studentId+'/studentrecords/standard/'+standard+'/section/'+section+'/year/'+year+'/promote',{},{
            pms: {
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

    factory.fetchStudentList = function( selectedYear, currentStandard, currentSection) {
        //year/2016-17/std/first/sec/A/basicinfo
        return $resource(fetch_student_url+'/student/year/'+selectedYear+'/std/'+
            currentStandard +'/sec/'+currentSection+'/basicinfo',{},{
            fetch : {
                method : 'get',
                isArray : false,
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data) {
                        console.log("student list got: ");
                        return data;
                    }
                }
            }
        });
    };
    factory.listStudents = function( classroom, offset, limit) {
        // student/classroom/4534/std/ispromotedstudents
        return $resource(fetch_student_url+'/student/classroom/'+classroom+'/std/ispromotedstudents?offset='+offset+'&limit='+limit,{},{
            fetch : {
                method : 'get',
                isArray : false,
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data) {
                        console.log("student list got: ");
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
                        console.log("replication");
                        return data;
                    }
                }
            }
        });
    };

    factory.fetchStudentDetails = function(currentStudent,year,standard,section) {
        // http://localhost:8080/Eshiksha/org/org121/branch/bra1231/student/stu1231/year/year1312/standard/std1212/section/sec1212/abstract
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

// classRoom/CL0001/markssheet/student/STD0001/isPassAnnualExam
    factory.isStudentPassed = function(classroom,studentId) {
        return $resource(fetch_student_url+'/classRoom/'+classroom+'/markssheet/student/'+studentId+'/isPassAnnualExam',{},{
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


branchManager.controller('studentPromotionsManagementCtrl1', ['$scope','studentPromotionFactory1','br_manager_appConfig','$state','$modal','$localStorage',function($scope,studentPromotionFactory1,br_manager_appConfig,$state,$modal,$localStorage)
{

    var initials = {
        studentFirstName:"",studentLastName:"",dateOfBirth:"",fatherFirstName:"",fatherLastName:"",
        motherFirstName:"",motherLasttName:"", caste:"", nationality:"",phoneNumber:"",email:"",year:"",
        yearOfJoining:"",classRoomId:"",religion:"",userName:"",password:"",correspondingYear:""
        ,localAddress:"",permanentAddress:"", rollNumber:"",promote:""
    };

    $scope.studentsDetails = {
        student_list: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        $scope.response_msg1 ="";
        $scope.section_list ="";
        $scope.student_list ="";
        $scope.student_details = "";
        var year = window.btoa(selectedYear);
        studentPromotionFactory1.fetchStandardList(year).fetch({},function(response){
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
            //$scope.response_msg1 = "No Standards found for this year.";
            console.log(response.status);
        });
    };

    $scope.fetchSectionList = function(selectedYear, currentStandard){
        $scope.response_msg1 = "";
        $scope.student_list ="";
        $scope.student_details = undefined;
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        studentPromotionFactory1.fetchSectionList(year, standard).fetch({},function(response){
            $scope.section_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.sections!=undefined){
                    var _data = angular.fromJson(response.data.sections);
                    $scope.section_list = _data;
                }
            }
        },function(response){
            $scope.section_List = [];
            //$scope.response_msg1 = "No Section found for this standard.";
            console.log(response.status);

        });
    };

    $scope.listStudents = function(currentSection, offset, limit){
        $scope.response_msg1 = "";
        var section = window.btoa(currentSection.classRoomId);
        studentPromotionFactory1.listStudents(section, offset, limit).fetch({},function(response){
            $scope.student_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                $scope.count = response.data.total;
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    console.log("date:"+ _data);
                    $scope.student_list = _data;
                    $scope.totalPages = Math.ceil($scope.count/$scope.studentsDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.student_list.length);
                }
            }
        },function(response){
            $scope.student_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            //$scope.response_msg1 = "Student not found for this Section.";
            console.log(response.status);
        });
    };

    $scope.fetchStudentList = function(selectedYear, currentStandard, currentSection){
        $scope.response_msg1 = "";
        $scope.student_details = undefined;
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        var section = window.btoa(currentSection.section);
        studentPromotionFactory1.fetchStudentList(year, standard, section).fetch({},function(response){
            $scope.student_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    console.log("date:"+ _data);
                    $scope.student_list = _data;
                }
            }
        },function(response){
            $scope.student_list = [];
            //$scope.response_msg1 = "Student not found for this Section.";
            console.log(response.status);
        });
    };

    // Student Details  not an Array. Update the Below Code
    $scope.fetchStudentDetails = function(currentStudent,year,standard,section){
        //$scope.response_msg = "";
        var student = window.btoa(currentStudent.studentId);
        var year = window.btoa(year);
        var standard = window.btoa(standard.name);
        var section = window.btoa(section);
        studentPromotionFactory1.fetchStudentDetails(student,year,standard,section).fetch({},function(response){
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.student_details = _data;
                }
            }
        },function(response){
            $scope.student_details = undefined;
            console.log(response.status);
        });
    };


    //***************** student Promotion *********************
    $scope.promotion = ["Yes", "No"];
    $scope.promoteStudent = function (selectedYear,classroom,studentId) {

        var year = window.btoa(selectedYear);
        var clas = window.btoa(classroom.classRoomId);
        var student = window.btoa(studentId);
        studentPromotionFactory1.checkFeesPaid(year, student).fetch({},function(response){
            console.log(response);
            if(response.status == 200 || response.status == 201){
                studentPromotionFactory1.isStudentPassed(clas, student).fetch({},function(response){
                    console.log(response);
                    if(response.status == 200 || response.status == 201){

                        $state.go('^.promote');
                        $scope.promote = $scope.promotion[0];
                        $scope.response_msg = "";
                        $scope.pms = angular.copy(initials);
                        angular.forEach($scope.student_list, function (student) {
                            console.log("subject: "+student.studentId);
                            if (studentId == student.studentId) {
                                $scope.pms.studentId = student.studentId;
                                $scope.pms.Fname = student.studentFirstName;
                                $scope.pms.Lname = student.studentLastName;
                                $scope.pms.standard = student.currentClass;
                                $scope.pms.section = student.section;
                                $scope.pms.year = student.year;
                            }
                        });
                    }
                },function(response){
                    if(response.status == 404){
                        alert(response.data.errorMessage);
                    }else{
                        alert("Please Check whether student passed.");
                        //$scope.response_msg1 = "Please Check whether student passed.";
                    }
                });
            }
        },function(response){
            if(response.status == 404){
                alert(response.data.errorMessage);
            }else{
                alert("Please Check whether student paid all fees.");
                //$scope.response_msg1 = "Please Check whether student paid all fees.";
            }
        });
    };



    $scope.studentPromotion = function (studentId, standard, section, year , promote) {
        var pms = $scope.pms;
        var body = ' { ' +
            '"promote":"' + promote + '"' +
            '}';

        var year = window.btoa(year);
        var standard = window.btoa(standard);
        var section = window.btoa(section);
        var student = window.btoa(studentId);
        var response = studentPromotionFactory1.studentPromotion(student, standard, section, year);
        var data = response.pms({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.student_details = undefined;
                $state.go('^.list');
            }
            $scope.response_msg = "Student Promotion successful !!!";
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else if(response.status == 404){
                $scope.response_msg1 = response.data;
            }else
                $scope.response_msg1= "Student Promotion is unsuccessful !!!";

        });
    };

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "spm" && $scope.student_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.student_list.length);
        }
    });

    $scope.init = function(){
        $scope.student_list =[];
        $scope.student_details = undefined;
        $scope.years = $localStorage.years;
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

    $scope.studentDetails = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.studentdetails');
    };

    $scope.pageChanged = function(currentSection){
        $scope.studentsDetails.startValue = (($scope.studentsDetails.currentPage - 1) * $scope.studentsDetails.numPerPage);
        $scope.listStudents(currentSection,$scope.studentsDetails.startValue,$scope.studentsDetails.numPerPage);
    };

    $scope.init();

}]);
