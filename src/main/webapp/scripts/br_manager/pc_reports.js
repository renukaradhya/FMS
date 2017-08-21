/**
 * Created by santhoshkumar.k on 01-07-2015.
 */
branchManager.factory('reportFactory',['$resource','br_Manager_Config', '$window',function($resource,br_Manager_Config, $window){
    var factory = {};

    var fetchReportUrl = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchBranchFeePdfReport = function(year,startDate,endDate){
        return $resource(fetchReportUrl+'/reports/year/'+year+'/startDate/'+startDate+'/endDate/'+endDate,{},{
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

    factory.feesReportForYear = function(year, studentId){
      //  http://localhost:8080/feesmanagementsystem/org/ORG0000001/branch/BRANCH0001/reports/student/STD0000002/year/2015-16
        return $resource(fetchReportUrl+'/reports/student/'+studentId+'/year/'+year,{},{
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



    factory.fetchViolationXlsReport = function(){
        return $resource(fetchReportUrl+'/reports/'+'xls',{},{
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
        })
    };

    factory.fetchStudentList = function( selectedYear, currentStandard, currentSection) {
        return $resource(fetchReportUrl+'/student/year/'+selectedYear+'/std/'+currentStandard +'/sec/'+currentSection+'/basicinfo',{},{
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
        return $resource(fetchReportUrl+'/classroom/year/'+ selectedYear, {}, {
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
        return $resource(fetchReportUrl+'/classroom/standard/'+ currentStandard +'/section/year/'
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

    factory.fetchClassroomTransactionReport = function(classroom) {
        return $resource(fetchReportUrl+'/reports/classroom/'+ classroom , {}, {
            fetch : {
                method : 'get',
                responseType: 'arraybuffer',
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


branchManager.controller('reportCtrl',['$scope','reportFactory','$state','$filter','$localStorage',function($scope,reportFactory,$state,$filter,$localStorage){

   $scope.fetchStandardList = function(selectedYear){
        var year = window.btoa(selectedYear);
        reportFactory.fetchStandardList(year).fetch({},function(response){
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

    $scope.fetchClassRoomlist = function(currentStandard,selectedYear){
        $scope.response_msg = "";
        var standard = window.btoa(currentStandard.name);
        var year = window.btoa(selectedYear);
        reportFactory.fetchClassRoomlist(standard,year).fetch({},function(response){
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
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        var section = window.btoa(currentClassroom.section);
        reportFactory.fetchStudentList(year, standard, section).fetch({},function(response){
            $scope.student_list =[];
            if(response.status == 200 || response.status == 201){
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    $scope.student_list = _data;
                }
            }
        },function(response){
            $scope.student_list =[];
        });
    };

    $scope.fetchClassroomTransactionReport = function (classroom) {
        var classroom = window.btoa(classroom.classRoomId);
        console.log(classroom.classRoomId);
        if( classroom == undefined){
            window.alert("Please Select Year, Class, Section");
        }
        else {
            reportFactory.fetchClassroomTransactionReport(classroom).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200 || response.status == 201) {
                    console.log("Reponse.data.byteLength = "+response.data.byteLength);
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
                console.log("errorrrrrr")
            });
        }
    };

    /*$scope.generateReport = function(reportType,year,startDate,endDate){
         console.log(year);
         if(reportType==undefined || year == undefined || startDate == undefined || endDate == undefined){
             window.alert("Please Select Year, StartDate and EndDate");
         }
         else if(reportType == 'branchFee'){
             var year = window.btoa(year);
             var startTime = $filter('date')(new Date(startDate),'yyyy-MM-dd');
             var endTime = $filter('date')(new Date(endDate),'yyyy-MM-dd');
             console.log(startTime);
             console.log(endTime);
             var start = window.btoa(startTime);
             var end = window.btoa(endTime);
             reportFactory.fetchBranchFeePdfReport(year,start,end).fetch({},function(response){
                 $scope.success = false;
                 console.log(response);
                 console.log("Inside the gerearteReport Function");
                 if(response.status = 200 || response.status == 201){
                     if(response.data.byteLength>0){
                         $scope.success = true;
                         console.log("Reponse.data.byteLength = "+response.data.byteLength);
                         var file = new Blob([response.data], { type: 'application/pdf' });
                         $scope.fileURL = URL.createObjectURL(file);
                         $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                     }else{
                         console.log("Reponse.data.byteLength = "+response.data.byteLength);
                     }
                 }
             },function(response){
                 console.log("errorrrrrr")
             });
         }
    };*/

    $scope.feesReportForYear = function(selectedYear, studentId){
        console.log(selectedYear);
        console.log(studentId);
        var year = window.btoa(selectedYear);
        var studentId = window.btoa(studentId);
        if( selectedYear == undefined || studentId == undefined ){
            window.alert("Please Select Year, Class, Section and Student");
        }
        else {
            reportFactory.feesReportForYear(year, studentId).fetch({}, function (response) {
                $scope.success = false;
                console.log(response);
                console.log("Inside the gerearteReport Function");
                if (response.status = 200 || response.status == 201) {
                    console.log("Response code is 200 !!");
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        console.log("Response is True !!");
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        $scope.file = file;
                        $scope.fileURL = URL.createObjectURL(file);
                        $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                        console.log("Call to render pdf !!");
                    } else {
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
                    }
                }
            }, function (response) {
                console.log("errorrrrrr")
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
        saveAs($scope.file, 'Classrooms Fees Transaction Report' + '.pdf');
    };
    $scope.savePdf = function(){
        //window.open($scope.fileURL);
        saveAs($scope.file, 'Student Fees Transaction Report' + '.pdf');
    };

   /* $scope.downloadXls = function(){
        var body = '{'+
            '"format": "xls",'+
            '"violationType":"'+$scope.violationType+'",'+
            '"startTime" : "'+$scope.startTime+'",'+
            '"endTime" : "'+$scope.endTime+'"'+
            '}';
        reportFactory.fetchViolationPdfReport('violations').fetch({},body,function(response){
            if(response.status = 200) {
                if (response.data.byteLength > 0) {
                    var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'});
                    var fileUrl = URL.createObjectURL(file);
                    window.open(fileUrl);
                }
            }
        },function(response){
            console.log("downlaod error")
        });
    };*/

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('reports.back');
    };

    $scope.init = function () {
      $scope.years = $localStorage.years;
    };

    $scope.init();

}]);