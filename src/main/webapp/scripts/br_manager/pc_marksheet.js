/**
 * Created by Icarat2 on 5/1/2016.
 */

branchManager.factory('marksSheetfactory', ['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
    var factory = {};
    var fetch_marksheet_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");


    factory.fecthAssesmentList = function(currentClassroom){
        return $resource(fetch_marksheet_url+'/classroom/'+currentClassroom+'/assessment/fetch',{},{
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
    factory.fetchStudentList = function( selectedYear, currentStandard, currentSection) {
        return $resource(fetch_marksheet_url+'/student/year/'+selectedYear+'/std/'+currentStandard +'/sec/'+currentSection+'/basicinfo',{},{
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

    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_marksheet_url+'/classroom/year/'+ selectedYear, {}, {
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
        return $resource(fetch_marksheet_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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

    factory.fetchclassroomMarksSheet = function(classroomId,assessmentId){
        return $resource(fetch_marksheet_url+'/classRoom/'+classroomId+'/markssheet/report/assessment/'+assessmentId,{},{
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


    factory.fetchstudentMarksheetPerYear = function(year,classroomId,studentId) {
        return $resource(fetch_marksheet_url+'/classRoom/'+classroomId+'/markssheet/report/student/'+studentId+'/year/'+year,{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        console.log("Report Generated !!!");
                        return data;
                    }
                }
            }
        });
    };

    factory.studentMarksListforAssess = function(classroomId,studentId,assessmentId) {
        return $resource(fetch_marksheet_url+'/classRoom/'+classroomId+'/markssheet/student/'+studentId+'/assessment/'+assessmentId,{},{
            fetch : {
                method:'get',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        console.log("result Generated !!!");
                        return data;
                    }
                }
            }
        });
    };


    factory.fetchMarksheetPerAssess = function(classroomId,studentId,assessmentId) {
        return $resource(fetch_marksheet_url+'/classRoom/'+classroomId+'/markssheet/report/student/'+studentId+'/assessment/'+assessmentId,{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        console.log("Report Generated !!!");
                        return data;
                    }
                }
            }
        });
    };
    factory.examHallTicket = function(classroomId,studentId,assessmentId) {
        // http://localhost:8080/Eshiksha/org/5555555555/branch/5555555555/classroom/5555555555/assessment/reports/55555555555/student/5555555555
        return $resource(fetch_marksheet_url+'/classroom/'+classroomId+'/assessment/reports/'+assessmentId+'/student/'+studentId,{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        console.log("Report Generated !!!");
                        return data;
                    }
                }
            }
        });
    };

    factory.listExams = function(classroomId, assessmentId){
        return $resource(fetch_marksheet_url+'/classroom/'+classroomId+'/assessment/'+assessmentId,{},{
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

    factory.addStudentMarks = function(classRoomId, studentId){
        return $resource(fetch_marksheet_url+'/classRoom/'+classRoomId+'/markssheet/student/'+studentId,{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        console.log("inside add student marks !!!");
                        return data;
                    }
                }
            }

        });
    };
    
    factory.fetchMarks = function(classRoomId, assessmentId, studentId){
    return $resource(fetch_marksheet_url+'/classRoom/'+classRoomId+'/markssheet/student/'+studentId+'/assessment/'+assessmentId,{},{
    	fetch:{
	    		method: 'GET',
	    		headers: {'Authorization' : authCode},
	    		interceptor: {
	                response: function (data) {
	                    return data;
	                }
	            }
    		
    	}
    });
    };
    
    factory.updateStudentMarks = function(ClassRoomId, StudentId){
    	 return $resource(fetch_marksheet_url+'/classRoom/'+ClassRoomId+'/markssheet/student/'+StudentId+'/update',{},{
             add:{
                 method:'PUT',
                 headers: {'Authorization' : authCode,
                     'Content-Type': 'application/json'},
                 isArray:false,
                 interceptor: {
                     response: function (data) {
                         console.log("inside update student marks !!!");
                         return data;
                     }
                 }
             }

         });
    };
   
    return factory;
}]);

branchManager.controller('marksSheetCtrl',['$scope','marksSheetfactory','$state','$localStorage',function($scope,marksSheetfactory,$state,$localStorage) {

    var initials = {
        assesmentName:"", assesmentId:"",
        year:"", classRoomId:"", assessmentId:"",
        marks1:"",marks2:"",marks3:"",marks4:"",marks5:"",
        marks6:"",marks7:"",marks8:"",marks9:"",marks10:""
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        marksSheetfactory.fetchStandardList(year).fetch({},function(response){
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
            $scope.response_msg = "No Standards Found";
            console.log(response.status);
        });
    };

    $scope.fetchSectionList = function(currentStandard,selectedYear){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var standard = window.btoa(currentStandard.name);
        var year = window.btoa(selectedYear);
        marksSheetfactory.fetchSectionList(standard,year).fetch({},function(response){
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

    $scope.fetchStudentList = function(selectedYear, currentStandard, currentClassroom){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        var section = window.btoa(currentClassroom.section);
        marksSheetfactory.fetchStudentList(year, standard, section).fetch({},function(response){
            $scope.student_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    $scope.student_list = _data;
                }
            }
        },function(response){
            $scope.response_msg = "No Students Found";
            console.log(response.status);
        });
    };

    $scope.fecthAssesmentList = function(currentClassroom){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var classRoom = window.btoa(currentClassroom.classRoomId);
        marksSheetfactory.fecthAssesmentList(classRoom).fetch({},function(response){
            $scope.assessment_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.assessmentLists!=undefined){
                    var _data = angular.fromJson(response.data.assessmentLists);
                    $scope.assessment_list = _data;
                }
            }
        },function(response){
            $scope.assessment_list = [];
            $scope.response_msg = "No Assessments Found";
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };


    $scope.marksSheet = function (currentClassroom, currentAssesment) {

        if(currentAssesment == undefined || currentClassroom == undefined){
            window.alert("Please Select Year, Class, Section and Assessment");
        }
        var assessId = currentAssesment.assessmentId;
        var classId = currentClassroom.classRoomId;
        $scope.fetchclassroomMarksSheet(classId,assessId);
    };

    $scope.fetchclassroomMarksSheet = function (classId,assessId) {
        var classId = window.btoa(classId);
        var assess = window.btoa(assessId);
            marksSheetfactory.fetchclassroomMarksSheet(classId, assess).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        console.log("response status 200 !!");
                        console.log("Download Complete !!! content length: " + response.data.byteLength);
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        $scope.file = file;
                        $scope.fileURL = URL.createObjectURL(file);
                        $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                    } else {
                        console.log("Reponse data Length = " + response.data.byteLength);
                    }
                }
            }, function (response) {
                console.log("Error Unable to download the page");
            });

    };

   $scope.markssheetEachYear = function (selectedYear, currentClassroom, currentStudent) {
       if( selectedYear == undefined || currentClassroom == undefined || currentStudent == undefined ) {
           window.alert("Please Select Year, Class, Section and Student");
       }
       var year = selectedYear;
        var studId = currentStudent.studentId;
        var classId = currentClassroom.classRoomId;
        $scope.fetchstudentMarksheetPerYear(year,classId,studId);
   };

    $scope.fetchstudentMarksheetPerYear = function (year,classId,studId) {
        console.log("Inside fetchstudentMarksheetPerYear()");
        var classId = window.btoa(classId);
        var studId = window.btoa(studId);
        var year = window.btoa(year);

            marksSheetfactory.fetchstudentMarksheetPerYear(year, classId, studId).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        console.log("response status 200 !!");
                        console.log("Download Complete !!! content length: " + response.data.byteLength);
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        $scope.file = file;
                        $scope.fileURL = URL.createObjectURL(file);
                        $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                    } else {
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
                    }
                }
            }, function (response) {
                console.log("Error Unable to download the page");
            });

    };

    $scope.marksSheetEachAssess = function (currentClassroom,currentStudent,currentAssesment) {
        if( currentClassroom == undefined || currentStudent == undefined || currentAssesment == undefined){
            window.alert("Please Select Year, Class, Section, Student and Assessment");
        }
        var studId = currentStudent.studentId;
        var assessId = currentAssesment.assessmentId;
        var classId = currentClassroom.classRoomId;
        console.log(studId+ " "+ assessId+ " "+ classId);
        $scope.fetchMarksheetPerAssess(classId,studId,assessId);
    };
    $scope.fetchMarksheetPerAssess = function (classId,studId,assessId) {

        var classroomId = window.btoa(classId);
        var studentId = window.btoa(studId);
        var assessmentId = window.btoa(assessId);
            marksSheetfactory.fetchMarksheetPerAssess(classroomId, studentId, assessmentId).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        $scope.file = file;
                        $scope.fileURL = URL.createObjectURL(file);
                        $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                    } else {
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
                    }
                }
            }, function (response) {
                console.log("Error Unable to download the page");
            });
        };

    $scope.examHallTicket = function (x,y,z) {
        if( x == undefined || y == undefined || z == undefined){
            window.alert("Please Select Year, Class, Section, Student and Assessment");
        }else{
            var classroomId = window.btoa(x.classRoomId);
            var studentId = window.btoa(y.studentId);
            var assessmentId = window.btoa(z.assessmentId);
            marksSheetfactory.examHallTicket(classroomId, studentId, assessmentId).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        $scope.file = file;
                        $scope.fileURL = URL.createObjectURL(file);
                        $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                    } else {
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
                    }
                }
            }, function (response) {
                console.log("Error Unable to download the page");
            });
        }
    };


    $scope.renderPDF = function (url, canvasContainer) {
        var scale = 1.7;  //"zoom" factor for the PDF
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
            for (var num = 1; num <= pdfDoc.numPages; num++)
                pdfDoc.getPage(num).then(renderPage);
        }
        //PDFJS.disableWorker = true;
        PDFJS.getDocument(url).then(renderPages);
    };

    $scope.downloadClassroomPdf = function () {
        //window.open($scope.fileURL);
        saveAs($scope.file, 'Classroom Result' + '.pdf');
    };
    $scope.downloadYearPdf = function () {
        //window.open($scope.fileURL);
        saveAs($scope.file, 'Annual Result' + '.pdf');
    };
    $scope.downloadAssessmentPdf = function () {
        //window.open($scope.fileURL);
        saveAs($scope.file, 'Assessment Result' + '.pdf');
    };
    $scope.hallTicketPdf = function () {
        //window.open($scope.fileURL);
        saveAs($scope.file, 'Hall Ticket' + '.pdf');
    };

    $scope.addMarks =function(classroom,assessment,student){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        if(classroom == undefined || assessment == undefined || student == undefined){
            alert("Please Select Year, Class, Section, Student and Assessment");
        }else{
            $state.go('^.add');
            $scope.Exams = [];
            $scope.add = angular.copy(initials);
            var classRoom = window.btoa(classroom.classRoomId);
            var assess = window.btoa(assessment.assessmentId);
            marksSheetfactory.listExams(classRoom,assess).fetch({}, function(response){
                $scope.exams_list = {};
                console.log(response);
                if(response.status == 200){
                    if(response.data != undefined){
                        var _data = angular.fromJson(response.data);
                        $scope.exams_list = _data;
                        $scope.assessmentId = assessment.assessmentId;
                        $scope.classRoomId = classroom.classRoomId;
                        $scope.studentId = student.studentId;
                        $scope.studentFirstName = student.studentFirstName;
                        $scope.currentRollNumber = student.currentRollNumber;
                        $scope.assesmentName = assessment.assessmentName;
                        angular.forEach($scope.exams_list.exams, function(v) {
                            v.obtainedScore = '';
                            v.passed = '';
                        });
                        $scope.Exams = $scope.exams_list.exams;
                    }
                }
            });
        }
    };
    $scope.pass = ["Yes", "No"];
    
    $scope.addStudentMarks = function(){
        var add = $scope.add;
        var classroom = window.btoa($scope.classRoomId );
        var stud = window.btoa($scope.studentId);

        $scope.score = [];
        for(var i=0; i < $scope.Exams.length; i++){
            $scope.score.push({
                subject : $scope.Exams[i].subjectName ,
                obtainedScore: $scope.Exams[i].obtainedScore,
                passed: $scope.Exams[i].passed,
                examId: $scope.Exams[i].examId
            });
        }

        var body = {
            assessmentId : $scope.assessmentId,
            assessmentName : $scope.assesmentName,
            scores : $scope.score,
            passed: add.result,
            comments: add.comments
        };
        var response = marksSheetfactory.addStudentMarks(classroom, stud);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.result1');
            }
            $scope.response_msg = "Marks added successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of Marks is unsuccessful !!!";
        });
    };

    $scope.studentMarksListforAssess = function(classroom,student,assessment){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var classRoomId = window.btoa(classroom.classRoomId);
        var studentId = window.btoa(student.studentId);
        var assessmentId = window.btoa(assessment.assessmentId);
        $scope.marks_list = {};
        $scope.marksObtained = [];
        $scope.scores = [];
        marksSheetfactory.studentMarksListforAssess(classRoomId,studentId,assessmentId).fetch({}, function (response) {
            console.log(response);
            if (response.status = 200 || response.status == 201) {
                var _data = angular.fromJson(response.data);
                $scope.marks_list = _data;
                if($scope.marks_list != undefined){
                    $scope.marksObtained = $scope.marks_list.scores;
                }
            }
        }, function (response) {
            $scope.response_msg = "No Marks available";
            console.log(response.status);
        });
    };

    /*$scope.examHallTicket = function(classroom,student,assessment){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var classRoomId = window.btoa(classroom.classRoomId);
        var studentId = window.btoa(student.studentId);
        var assessmentId = window.btoa(assessment.assessmentId);
        $scope.marks_list = {};
        $scope.scores = [];
        marksSheetfactory.examHallTicket(classRoomId,studentId,assessmentId).fetch({}, function (response) {
            console.log(response);
            if (response.status = 200 || response.status == 201) {
                var _data = angular.fromJson(response.data);
                $scope.marks_list = _data;
                if($scope.marks_list != undefined){
                    $scope.marksObtained = $scope.marks_list.scores;
                }
            }
        }, function (response) {
            $scope.response_msg1 = "No Marks available";
            console.log(response.status);
        });
    };*/

    $scope.updateMarks = function(classroom,assessment,student){

        if(classroom == undefined || assessment == undefined || student == undefined){
            alert("Please Select Year, Class, Section, Student and Assessment");
        }else{
            $state.go('^.editMarks');
            $scope.edit = angular.copy(initials);
            $scope.std = student.studentId;
            $scope.cls = classroom.classRoomId;
            $scope.studentFirstName = student.studentFirstName;
            $scope.studentLastName = student.studentLastName;
            $scope.currentRollNumber = student.currentRollNumber;
            var classRoomId = window.btoa(classroom.classRoomId);
            var assessmentId = window.btoa(assessment.assessmentId);
            var studentId = window.btoa(student.studentId);
            marksSheetfactory.studentMarksListforAssess(classRoomId,studentId,assessmentId).fetch({}, function (response) {
                console.log(response);
                if (response.status = 200 || response.status == 201) {
                    var _data = angular.fromJson(response.data);
                    $scope.marks_list = _data;
                    if($scope.marks_list != undefined){
                        $scope.marks = $scope.marks_list.scores;

                        /*$scope.obtainedMarks = [];
                        $scope.maxMarks = [];
                        for (var i=0; i<$scope.marks.length; i++) {
                           /!* $scope.obtainedMarks[i] = parseInt($scope.marks[i].obtainedScore, 10);
                            $scope.maxMarks[i] = parseInt($scope.marks[i].maxScore, 10);*!/
                            $scope.obtainedMarks[i] = $scope.marks[i].obtainedScore;
                            $scope.maxMarks[i] = $scope.marks[i].maxScore;
                        }*/
                    }
                }
            }, function (response) {
               // $scope.response_msg1 = "No Marks available";
                console.log(response.status);
            });
        }
    };

    $scope.updateStudentMarks = function(){

        var ClassRoomId = window.btoa( $scope.cls);
        var StudentId = window.btoa( $scope.std);

       /* var upScores = function(){
            var markArray = [];
            for(var i=0; i<$scope.marks.length; i++) {
                if(($scope.maxMarks[i] != undefined || $scope.maxMarks[i] != null) && ($scope.obtainedMarks[i] != undefined || $scope.obtainedMarks[i] != null) && ($scope.marks[i].subject != undefined || $scope.marks[i].subject != null) && ($scope.marks[i].passed != undefined )){
                    markArray.push({subject : $scope.marks[i].subject , obtainedScore: $scope.obtainedMarks[i], passed: $scope.marks[i].passed, examId: $scope.marks[i].examId  });
                }
            }
            return markArray;
        };*/

        $scope.scores = angular.copy($scope.marks);
        angular.forEach($scope.scores, function(v) {
            delete v.maxScore;
            delete v.grade;
        });

        console.log($scope.marks);

        var body = {
            assessmentId : $scope.marks_list.assessmentId,
            assessmentName : $scope.marks_list.assessmentName,
            scores : $scope.scores,
            passed: $scope.marks_list.passed,
            comments: $scope.marks_list.comments
        };
        var response = marksSheetfactory.updateStudentMarks(ClassRoomId, StudentId);
        console.log("Response status is: "+response.status);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.marks_list = undefined;
                $scope.marksObtained = undefined;
                $state.go('^.result1');
            }
            $scope.response_msg = "Marks Updated successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Marks are unsuccessful !!!";
        });
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.marksObtained = undefined;
        $state.go('^.result1');
    };
    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.main');
    };

    $scope.init = function () {
      $scope.years = $localStorage.years;
    };

    $scope.init();

}]);