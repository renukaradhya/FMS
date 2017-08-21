/**
 * Created by uidr1063 on 1/10/2016.
 */

branchManager.factory('transferCertificateFactory',['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
    var factory = {};
    var fetch_transferCertificate_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchStudentList = function( selectedYear, currentStandard, currentSection) {
        return $resource(fetch_transferCertificate_url+'/student/year/'+selectedYear+'/std/'+currentStandard +'/sec/'+currentSection+'/basicinfo',{},{
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
        return $resource(fetch_transferCertificate_url+'/classroom/year/'+ selectedYear, {}, {
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
        return $resource(fetch_transferCertificate_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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


    factory.fetchTransferCertificateList = function(){
    	return $resource(fetch_transferCertificate_url,{},{
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
    factory.transferCertificate = function(studentId){
        // http://localhost:8080/feesmanagementsystem/org/ORG0000001/branch/BRANCH0001/student/SDT00000001/reports\
        console.log("student Id "+ studentId);
        return $resource(fetch_transferCertificate_url+'/student/'+studentId+'/reports',{},{
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
    factory.studyCertificate = function(studentId){
        //http://localhost:8080/Eshiksha/org/555555/branch/555555/student/555555/reportsstudycertificate
        return $resource(fetch_transferCertificate_url+'/student/'+studentId+'/reports/studycertificate',{},{
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

    factory.downloadEyeCard = function(classroom){
        // http://localhost:8080/Eshiksha/org/45646/branch/4564645/classroom/reports/classroom/5465464
        return $resource(fetch_transferCertificate_url+'/classroom/reports/classroom/'+classroom,{},{
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

    return factory;
}]);


branchManager.controller('transferCertificateCtrl', ['$scope','transferCertificateFactory','$state','$localStorage',function($scope,transferCertificateFactory,$state,$localStorage) {

    $scope.fetchStandardList = function(selectedYear){
        var year = window.btoa(selectedYear);
        transferCertificateFactory.fetchStandardList(year).fetch({},function(response){
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
        $scope.response_msg = "";
        var standard = window.btoa(currentStandard.name);
        var year = window.btoa(selectedYear);
        transferCertificateFactory.fetchSectionList(standard,year).fetch({},function(response){
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
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.fetchStudentList = function(selectedYear, currentStandard, currentClassroom){
        $scope.response_msg1 = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        var section = window.btoa(currentClassroom.section);
        transferCertificateFactory.fetchStudentList(year, standard, section).fetch({},function(response){
            $scope.student_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    $scope.student_list = _data;
                }
            }
        },function(response){
            console.log(response.status);
        });
    };


    $scope.transferCertificate = function (stud) {
        var student = window.btoa(stud);
        if( stud == undefined){
            window.alert("Please Select Year, Class, Section and Student");
        }
        else {
            transferCertificateFactory.transferCertificate(student).fetch({}, function (response) {
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
        }
    };

    $scope.studyCertificate = function (stud) {
        var student = window.btoa(stud);
        if( stud == undefined){
            window.alert("Please Select Year, Class, Section and Student");
        }
        else {
            transferCertificateFactory.studyCertificate(student).fetch({}, function (response) {
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
        }
    };

    $scope.downloadEyeCard = function (y) {
        if( y == undefined){
            window.alert("Please Select Year, Class, Section and Student");
        }
        else {
            var cls = window.btoa(y.classRoomId);
            transferCertificateFactory.downloadEyeCard(cls).fetch({}, function (response) {
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
            console.log("Render Pages !!");
        }

        //PDFJS.disableWorker = true;
        PDFJS.getDocument(url).then(renderPages);

    };

    $scope.transferPdf = function () {
        //window.open($scope.fileURL);
        saveAs($scope.file, 'Transfer Certificate' + '.pdf');
    };
    $scope.studyPdf = function () {
        //window.open($scope.fileURL);
        saveAs($scope.file, 'Study Certificate' + '.pdf');
    };
    $scope.eyecardPdf = function () {
        //window.open($scope.fileURL);
        saveAs($scope.file, 'Eye Cards' + '.pdf');
    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('reports.main');
    };

    $scope.init = function () {
      $scope.years = $localStorage.years;
    };

    $scope.init();

}]);

