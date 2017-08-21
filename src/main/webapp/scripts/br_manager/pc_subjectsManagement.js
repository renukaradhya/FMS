/**
 * Created by Icarat2 on 3/7/2016.
 */

branchManager.factory('subjectFactory',['$resource','br_Manager_Config', '$window',function($resource,br_Manager_Config, $window){
    var factory = {};
    var fetch_subjects_url = br_Manager_Config.getMainAPI();
    var main_url = br_Manager_Config.getPasswordApi();

    var authCode = $window.localStorage.getItem("authCode");


    factory.fetchSubjectsPdfReport = function(classroom){
        return $resource(fetch_subjects_url+'/subject/reports/classroom/'+classroom,{},{
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
        return $resource(fetch_subjects_url+'/classroom/year/'+ selectedYear, {}, {
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
        return $resource(fetch_subjects_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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

    factory.createSubject = function(bookId){
        return $resource(fetch_subjects_url+'/subject',{},{
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

    factory.fetchSubjectList = function(currentStandard,syllabusType) {
        console.log("authorize "+ authCode);
        return $resource(fetch_subjects_url+'/subject/std/'+currentStandard+'/syllubus/'+syllabusType, {}, {
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

    factory.updateSubject = function(subjectId){
        return $resource(fetch_subjects_url+'/subject/'+subjectId+'/update',{},{
            edit: {
                method: 'PUT',
                headers: { 'Authorization' : authCode,
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

    factory.deleteSubject = function (subjectId) {
        return $resource(fetch_subjects_url+'/subject/'+subjectId+"/deactivate",{}, {
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

    factory.assigntoClassroom = function (subjectId, classroom) {
        return $resource(fetch_subjects_url+'/subject/'+subjectId+"/classroom/"+classroom,{}, {
            assign: {
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
    factory.getCategory = function(){
        return $resource(main_url+'/orgsettings/subjectcategorysettings',{},{
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

branchManager.controller('subjectManagementCtrl', ['$scope','subjectFactory','br_manager_appConfig','$state','$modal','$localStorage',function($scope,subjectFactory,br_manager_appConfig,$state,$modal,$localStorage) {

    var initials = {
        subjectId: "", year:"",subjectName:"",syllubusType:"",standard:"",subjectCode:"",category:"",type:""
    };

    $scope.subjectDetails = {
        subjectLists: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };

    $scope.getCategory = function () {
        //$scope.response_msg = "";
        $scope.response_msg1 = "";
        subjectFactory.getCategory().fetch({},function(response){
            console.log(response);
            $scope.categories =[];
            if(response.status == 200 || response.status ==201){
                if(response.data.categories!=undefined){
                    var _data = angular.fromJson(response.data.categories);
                    $scope.categories = _data;
                }
            }
        },function(response){
            $scope.categories =[];
            console.log(response.status);
        });
    };

   /* $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        subjectFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            $scope.subjects_list = [];
            if(response.status == 200 || response.status == 201){
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                    console.log("standards:- "+ $scope.standard_list);
                }
            }
        },function(response){
            $scope.standard_list = undefined;
            $scope.response_msg1 = "There is no Standards found for this year.";
            console.log(response.status);
        });
    };*/

    $scope.fetchSectionList = function(currentStandard,selectedYear){
        $scope.response_msg = "";
        var standard = window.btoa(currentStandard);
        var year = window.btoa(selectedYear);
        subjectFactory.fetchSectionList(standard,year).fetch({},function(response){
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
            $scope.response_msg1 = "No classrooms found for this Standard.";
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.fetchSyllabusList = function(){
        $scope.subjects_list = [];
        $scope.syllabus_list = $localStorage.syllabus;
        $scope.response_msg = "";
        $scope.response_msg1 = "";
    };

    $scope.fetchSubjectList = function (currentStandard,syllabusType) {
        var standard = window.btoa(currentStandard);
        var syllabus = window.btoa(syllabusType);
        subjectFactory.fetchSubjectList(standard,syllabus).fetch({}, function (response) {
            $scope.subjects_list = [];
            if (response.status == 200) {
                if (response.data.subjects != undefined) {
                    var _data = angular.fromJson(response.data.subjects);
                    $scope.subjects_list = _data;
                }
            }
        }, function (response) {
            $scope.subjects_list = undefined;
            $scope.response_msg = "Subjects Not Found.";
        });
    };


    // ************** Posting **********************

    $scope.addSubject = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };

    $scope.createSubject = function (syllabusType) {
        var add = $scope.add;
        var body = ' { ' +
            '"standard":"' + add.standard.name + '",' +
            '"subjectName" :"' + add.subjectName + '",'+
            '"syllubusType" :"' + add.x.syllabus + '",'+
            '"subjectCode" :"' + add.subjectCode + '",'+
            '"category" :"' + add.c.name +
             '"}';

        var response = subjectFactory.createSubject();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
            }
            $scope.response_msg = "Subject added successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            } else{
                $scope.response_msg1 = "Addition of subject is failed";
            }
        });
    };


    $scope.assignSubject = function (subject, index, std) {
        $scope.response_msg = "";
        $scope.standard = std;
        $scope.sub = subject;
        $scope.fetchSectionList($scope.standard.name, $scope.year);
    };


    $scope.assigntoClassroom = function(subjectId, classroom) {
        var sub = window.btoa(subjectId);
        var classRoom = window.btoa(classroom);
        var response =  subjectFactory.assigntoClassroom(sub, classRoom).assign({},function(response){
            if(response.status == 200){
                $scope.subjects_list = [];
                $state.go('^.list');
            }
            $scope.response_msg = "Subject assigned to classroom successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            } else{
                $scope.response_msg1 = "Assigning subject to classroom failed";
            }
        });
    };


    // ****************** Updating the Classroom *****************

    $scope.editSubject = function (subjectId) {
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);
        angular.forEach($scope.subjects_list, function (subject) {
            console.log("subject: "+subject.subjectId);
            if (subjectId == subject.subjectId) {
                $scope.edit.subjectId = subject.subjectId;
                $scope.edit.subjectName = subject.subjectName;
                $scope.edit.syllubusType = subject.syllubusType;
                $scope.edit.subjectCode = subject.subjectCode;
                $scope.edit.standard = subject.standard;
                $scope.edit.category.name = subject.category;
                $scope.edit.year = subject.year;
            }
        });
    };

    $scope.updateSubject = function (subjectId) {
        var edit = $scope.edit;
        var body = ' { ' +
            '"standard":"' + edit.standard + '",' +
            '"subjectName" :"' + edit.subjectName + '",'+
            '"syllubusType" :"' + edit.syllubusType + '",'+
            '"subjectCode" :"' + edit.subjectCode + '",'+
            '"category" :"' + edit.category.name +
            '"}';

        var sub = window.btoa(subjectId);
        var response = subjectFactory.updateSubject(sub);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.subjects_list = [];
                $state.go('^.list');
            }
            $scope.response_msg = "Subject updated successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            } else{
                $scope.response_msg1 = "Updating subject failed";
            }
        });
    };

    $scope.deleteSubject = function(subject,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var sub = window.btoa(subject.subjectId);

        var dialogue_message = "Are you sure to delete the Subject ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                subjectFactory.deleteSubject(sub).remove({},function(response){
                    if(response.status == 200){
                        $scope.subjects_list = [];
                        $scope.init();
                    }
                },function(response){
                    $scope.response_msg = "Subject assigned to a classroom can't deactivate !!!";
                });
            }
            else {
                alert("Failed to delete");
            }
        });
    };

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "subject" && $scope.subjects_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.subjects_list.length);
        }
    });

    $scope.init = function(){
       /* $scope.subjects_list = [];*/
        $scope.year = $localStorage.academicYear.successMessage;
        $scope.standards = $localStorage.standards;
       /* $scope.years = $localStorage.years;*/
        $scope.getCategory();
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.subjects_list = [];
        $state.go('^.list');
    };
    $scope.init();

}]);


branchManager.controller('subjectReportsCtrl',['$scope','subjectFactory','$state','$localStorage',function($scope,subjectFactory,$state,$localStorage){

    $scope.fetchStandardList = function(selectedYear){
        var year = window.btoa(selectedYear);
        subjectFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            $scope.classroom_list =[];
            console.log( $scope.standard_list);
            if(response.status == 200 || response.status == 201){
                if(response.data.classroomnames != undefined){
                    var _data = angular.fromJson(response.data.classroomnames);
                    $scope.standard_list = _data;
                }
            }
        },function(response){
            $scope.standard_list = undefined;
            console.log(response.status);
        });

    };

    $scope.fetchSectionList = function(currentStandard,selectedYear){
        $scope.response_msg = "";
        var standard = window.btoa(currentStandard.name);
        var year = window.btoa(selectedYear);
        subjectFactory.fetchSectionList(standard,year).fetch({},function(response){
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

    $scope.classroomSucjectReport = function(classroom){
        console.log("Inside classStudent Report()");
        var classRoom = window.btoa(classroom);
        if( classroom == undefined ){
            window.alert("Please Select Year, Class, Section");
        }
        else {
            subjectFactory.fetchSubjectsPdfReport(classRoom).fetch({}, function (response) {
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
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
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
        saveAs($scope.file, 'Subject Report' + '.pdf');
    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('subjects.main');
    };

    $scope.init = function () {
      $scope.years = $localStorage.years;
    };

    $scope.init();

}]);