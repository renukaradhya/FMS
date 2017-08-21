/**
 * Created by Icarat2 on 10/7/2016.
 */
branchManager.factory('classroomFactory',['$resource','br_Manager_Config','$window',function($resource,br_Manager_Config,$window){
    var factory = {};
    var fetch_classroom_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");


    factory.assignFaculty = function(facultyId,classRoomId){
        return $resource(fetch_classroom_url+'/faculty/'+facultyId+'/classRoom/'+classRoomId,{},{
            assign : {
                method : 'get',
                isArray : false,
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data) {
                        return data;
                    }
                }
            }
        })
    };
    factory.removeTeacher = function(classRoomId){
        return $resource(fetch_classroom_url+'/classroom/'+classRoomId+'/faculty',{},{
            remove : {
                method : 'delete',
                isArray : false,
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data) {
                        return data;
                    }
                }
            }
        })
    };

    factory.getFacultyList = function(){
        return $resource(fetch_classroom_url+'/faculty/getFacultyId',{},{
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
        })
    };
    factory.listSubjects = function(classRoomId){
        return $resource(fetch_classroom_url+'/subject/classroom/'+classRoomId,{},{
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

    factory.fetchClassroomPdfReport = function(selcectedYear){
        return $resource(fetch_classroom_url+'/classroom/reports/year/'+selcectedYear,{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        console.log("Report Generated for Vehicle !!!");
                        return data;
                    }
                }
            }
        });
    };

    factory.createClassroom = function(){
        console.log(authCode);
        return $resource(fetch_classroom_url+'/classroom',{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        console.log("inside createClassroom !!!");
                        return data;
                    }
                }
            }

        });
    };

    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_classroom_url+'/classroom/year/'+ selectedYear, {}, {
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
        return $resource(fetch_classroom_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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

    factory.updateClassroom = function(classRoomId){
        return $resource(fetch_classroom_url+'/classroom/'+classRoomId+"/update",{},{
            edit:{
                method:'PUT',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        console.log("update success!!!!");
                        return data;
                    }
                }
            }
        });
    };


    factory.deleteClassroom = function(classRoomId){
        console.log("Classroom Id: "+ classRoomId);
        return $resource(fetch_classroom_url+'/classroom/'+classRoomId+'/deactivate',{},{
            remove : {
                method: 'get',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor: {
                    response: function (data) {
                        console.log("deleted success!!!!");
                        return data;
                    }
                }
            }
        });
    };

    factory.feeStructure = function(classRoomId){
        return $resource(fetch_classroom_url+'/expandfees/classroom/'+classRoomId+'/classroomfeestructurenew',{},{
            fetch : {
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

branchManager.controller('classroomManagementCtrl',['$scope','classroomFactory','br_manager_appConfig','$state','$window','$modal','$localStorage',function($scope,classroomFactory,br_manager_appConfig,$state,$window,$modal,$localStorage){

    var initials = {
        syllabus:"",section:"",standard:"",year:"",classRoomId:"",maxcount:"",maxCount:""
    };


    $scope.fetchStandardList = function(selectedYear){
        //$scope.response_msg="";
        $scope.response_msg1 = "";
        var year = window.btoa(selectedYear);
        classroomFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list = [];
            if(response.status == 200 || response.status == 201){
                if(response.data.classroomnames != undefined){
                    var _data = angular.fromJson(response.data.classroomnames);
                    $scope.standard_list = _data;
                }
            }
        }, function(response){
            $scope.standard_list = [];
            $scope.classroom_list = [];
            $scope.respnose_msg = "No classes found"
        });
    };

    $scope.fetchSectionList = function (currentStandard,selectedYear) {
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        //$scope.response_msg = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        classroomFactory.fetchSectionList(standard,year).fetch({},function(response){
            $scope.classroom_list = [];
            if(response.status == 200 || response.status ==201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classroom_list = _data;
                    $scope.$parent.setBaseContentHeight($scope.classroom_list.length);
                }
            }
        },function(response){
            $scope.classroom_list = [];
            $scope.response_msg = "No sections found";
            $scope.$parent.setBaseContentHeight(-1);
        })
    };

    $scope.listSubjects =function(classroom,index){
        $scope.response_msg1 = "";
        var classRoom = window.btoa(classroom.classRoomId);
        classroomFactory.listSubjects(classRoom).fetch({},function(response){
            $scope.sub_list = [];
            if(response.status == 200 || response.status == 201){
                if(response.data.subjects!=undefined){
                    var _data = angular.fromJson(response.data.subjects);
                    $scope.sub_list = _data;
                }
            }
        },function(response){
            $scope.sub_list = [];
            $scope.response_msg = "No Subjects Found";
        });
    };

    $scope.feeStructure = function (classroom,index) {
        $scope.response_msg1 = "";
        var classRoom = window.btoa(classroom.classRoomId);
        classroomFactory.feeStructure(classRoom).fetch({},function(response){
            $scope.fees = {};
            if(response.status == 200 || response.status == 201){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.fees = _data;
                    $scope.rec_list = {};
                }
            }
        },function(response){
            $scope.fees = {};
            $scope.response_msg = "No Fees Structure Found";
        });
    };

    $scope.assignClassTeacher = function (classRoomId) {
        $scope.assign = angular.copy(initials);
        angular.forEach($scope.classroom_list, function(classroom){
            if(classRoomId == classroom.classRoomId){
                $scope.assign.classRoomId = classroom.classRoomId;
                $scope.assign.standard = classroom.standard;
                $scope.assign.section = classroom.section;
                $scope.assign.year = classroom.year;
                $scope.getFacultyList();
            }
        });
    };

    $scope.assignFaculty = function (classRoomId, faculty) {
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var classRoomId = window.btoa(classRoomId);
        var facultyId = window.btoa(faculty.facultyId);
        classroomFactory.assignFaculty(facultyId,classRoomId).assign({},function(response){
            $scope.classroom_list =[];
            if(response.status == 200 || response.status == 201){
                $scope.standard_list = [];
            }
            $state.go('^.list');
            $scope.response_msg = "Class Teacher assigned successfully !!!.";
        },function(response){
            $scope.response_msg = "Class Teacher assigning is  Unsuccessful !!!.";

        });
    };

    $scope.removeTeacher = function (classroom,index) {
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var classRoomId = window.btoa(classroom.classRoomId);
        var dialogue_message = "Are you sure to Remove the Class Teacher ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                console.log(classroom.classRoomId);
                classroomFactory.removeTeacher(classRoomId).remove({},function(response){
                    if(response.status == 200 || response.status == 201){
                        $scope.classroom_list = [];
                        $scope.standard_list = [];
                        console.log("deleted")
                    }
                    $scope.response_msg = "Teacher Removed successfully!!!";
                },function(response){
                    console.log(response.status);
                    if(response.status == 404){
                        $scope.response_msg = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg =  "Removing the class teacher is failed !!!";
                });
            }
            else {
                $scope.response_msg =  "Removing the class teacher is failed !!!";
            }
        });
    };

    $scope.getFacultyList = function () {
        classroomFactory.getFacultyList().fetch({},function(response){
            $scope.faculty_list = [];
            if(response.status == 200 || response.status == 201){
                if(response.data.faculties!=undefined){
                    var _data = angular.fromJson(response.data.faculties);
                    $scope.faculty_list = _data;
                    $scope.faculty = $scope.faculty_list[0];
                }
            }
        },function(response){
            $scope.faculty_list = [];
            $scope.response_msg1 = "No Faculties Found";
        });
    };

    $scope.addClassroom = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };

    $scope.createClassroom = function () {
        $scope.response_msg1 = "";
        var add = $scope.add;
        var body = ' { ' +
            '"standard":"' + add.standard.standard + '",' +
            '"section" :"' + add.section.name + '",'+
            '"maxcount" :"' + add.maxcount + '",'+
            '"syllabus" :"' + add.x.syllabus + '",'+
            '"year" :"'+ $scope.academicYear.successMessage + '"},';
        var response = classroomFactory.createClassroom();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.classroom_list = [];
                $state.go('^.list');
            }
            $scope.response_msg = "Classroom added successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of classroom is unsuccessful !!!";
        });
    };

    $scope.editClassroom = function(classRoomId){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.edit = angular.copy(initials);
        angular.forEach($scope.classroom_list, function(classroom){
            if(classRoomId == classroom.classRoomId){
                $scope.edit.classRoomId = classroom.classRoomId;
                $scope.edit.standard = classroom.standard;
                $scope.edit.section = classroom.section;
                $scope.edit.maxcount = classroom.maxCount;
                $scope.edit.syllabus = classroom.syllabus;
                $scope.edit.year = classroom.year;
            }
        });
    };

    $scope.updateClassroom = function(classRoomId){
        $scope.response_msg1 = "";
        var edit = $scope.edit;
        var body = ' { ' +
            '"standard":"' + edit.standard + '",' +
            '"section" :"' + edit.section + '",'+
            '"maxcount" :"' + edit.maxcount + '",'+
            '"syllabus" :"' + edit.syllabus + '",'+
            '"year" :"'+ $scope.academicYear.successMessage + '"}';
        var classRoom = window.btoa(classRoomId);
        var response = classroomFactory.updateClassroom(classRoom);
        var data = response.edit({},body, function(response) {
            console.log(response);
            if(response.status == 200 || response.status == 201){
                $scope.classroom_list = [];
                $state.go('^.list');
            }
            $scope.response_msg = "Classroom Updated Successfully !!";
        }, function(response) {
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }else{
                $scope.response_msg1 = "Updation of Classroom is unsuccessful !!"
            }
        });
    };

    $scope.deleteClassroom = function(classroom,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var dialogue_message = "Are you sure to delete the Classroom ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                var classRoom = window.btoa(classroom.classRoomId);
                classroomFactory.deleteClassroom(classRoom).remove({},function(response){
                    if(response.status == 200 || response.status == 201){
                        $scope.classroom_list = [];
                        $scope.response_msg = "Classroom deleted successfully !!!";
                    }
                    $state.go('^.list');
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg = "Classroom deletion failed !!!";
                });
            }
            else {
                $scope.response_msg = "Classroom deletion failed !!!";
            }
        });
    };

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "classroom" && $scope.classroom_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.classroom_list.length);
        }
    });

    $scope.getSectionList = function (obj) {
        $scope.sec_list = obj.sections;
    };

    $scope.init = function () {
        $scope.classroom_list = [];
        $scope.years = $localStorage.years;
        $scope.assessments = $localStorage.assessments;
        $scope.standards = $localStorage.standards;
        $scope.sections = $localStorage.sections;
        $scope.syllabus_list = $localStorage.syllabus;
        $scope.academicYear = $localStorage.academicYear;
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.classroom_list = [];
        $state.go('^.list');
    };

    $scope.init();
}]);

branchManager.controller('classroomReportsCtrl', ['$scope','classroomFactory','$state','$window','$localStorage', function($scope,classroomFactory,$state,$window,$localStorage){

    $scope.generateClassroomReport = function(classYear){
        if( classYear == undefined ){
            window.alert("Please select the Year");
        }
        else {
            var year = window.btoa(classYear);
            classroomFactory.fetchClassroomPdfReport(year).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
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


    $scope.renderPDF = function(url, canvasContainer) {
        var scale= 1.7;  // "zoom" factor for the PDF
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
        saveAs($scope.file, 'Classroom Report' + '.pdf');
    };

   /* $scope.saveFile = function (file) {
        saveAs(file, 'Classrooms' + '.pdf');
    };*/

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('classroomreports.main');
    };

    $scope.init = function () {
      $scope.years = $localStorage.years;
    };

    $scope.init();
}]);