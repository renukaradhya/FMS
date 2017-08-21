/**
 * Created by Icarat2 on 5/26/2016.
 */

branchManager.factory('fileUploadFactory', ['$resource', 'br_Manager_Config', '$window','$http',function($resource, br_Manager_Config, $window,$http){
    var factory ={};
    var authCode = $window.localStorage.getItem("authCode");
    var main_url = br_Manager_Config.getMainAPI();

    factory.fecthAssesmentList = function(currentClassroom){
        // branch/BRANCH0001/classroom/CL0000002/assessment/fetch
        return $resource(main_url+'/classroom/'+currentClassroom+'/assessment/fetch',{},{
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

    factory.fetchStandardList = function(selectedYear) {
        return $resource(main_url+'/classroom/year/'+ selectedYear, {}, {
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
        return $resource(main_url +'/classroom/standard/'+ currentStandard +  '/section/year/'+ selectedYear, {}, {
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

    factory.uploadUrls = function(){
        return $resource(main_url+'/videourl',{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data)
                    {
                        return data;
                    }
                }
            }
        });
    };

    factory.uploadInventory = function(){
        return url = main_url+'/inventory/bulkupload';
    };
    factory.uploadVehicle = function(){
        return url = main_url+'/vehicle/bulkupload';
    };
    factory.uploadLibrary = function(){
        return url = main_url+'/library/bulkupload';
    };
    factory.uploadStudents = function(classRoomId){
        return url = main_url+'/classroom/'+classRoomId+'/bulkupload';
    };
    factory.uploadMarksheet = function(classRoomId,assessmentId){
        return url = main_url+'/classroom/'+classRoomId+'/assessment/'+assessmentId+'/marksheet/bulkupload';
    };

    factory.downloadInventory = function(){
        return $resource(main_url+'/inventory/xlsSheet',{},{
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

    factory.downloadVehicle = function(){
        return $resource(main_url+'/vehicle/vehiclexls',{},{
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
    factory.downloadLibrary = function(){
        return $resource(main_url+'/library/xlsSheet',{},{
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
    factory.downloadFaculty = function(){
        return $resource(main_url+'/faculty/xlsSheet',{},{
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
    factory.downloadStudents = function(classRoomId){
        return $resource(main_url+'/student/classroom/'+classRoomId+'/studentXls',{},{
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
    factory.downloadMarksheet = function(classRoomId, assessmentId){
        return $resource(main_url+'/classRoom/'+classRoomId+'/markssheet/assessment/'+assessmentId+'/xlsSheet',{},{
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

    factory.studentExelsheet = function(){
        return $resource(main_url+'/student/xlsheettemplate',{},{
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

    factory.marksExelsheet = function(){
        return $resource(main_url+'/xlsSheettemplate',{},{
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

    factory.inventoryExelsheet = function(){
        return $resource(main_url+'/inventory/xlsSheetTemplate',{},{
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

    factory.vehicleExelsheet = function(){
        return $resource(main_url+'/vehicle/xlsheettemplate',{},{
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

    factory.libraryExelsheet = function(){
        return $resource(main_url+'/library/xlsSheetTemplate',{},{
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


    return factory;
}]);

branchManager.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

branchManager.service('fileUpload', ['$http','$window', function ($http, $window) {
    var authCode = $window.localStorage.getItem("authCode");
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Authorization' : authCode,
                        'Content-Type': undefined}
        }).then(function(response){
        	if(response.status == 200 || response.status == 201){
                alert(response.data.successMessage);
            }
        },function(response){
        	if(response.status == 404){
                alert(response.data.errorMessage);
            }else{
                alert("Uploading Failed");
            }
        });
    }
}]);

branchManager.controller('fileUploadCtrl', ['$scope', 'fileUpload','fileUploadFactory','br_manager_appConfig','$state','$localStorage', function($scope, fileUpload,fileUploadFactory,br_manager_appConfig,$state,$localStorage){

    var initials = {
        videoName:"",imageUrl:"",videoUrl:"",eventName:""
    };

    $scope.fetchStandardList = function(selectedYear){
        var year = window.btoa(selectedYear);
        fileUploadFactory.fetchStandardList(year).fetch({},function(response){
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
            $scope.response_msg1 = "There is no Standards found for this year.";
            console.log(response.status);
        });

    };
    $scope.fetchSectionList = function(currentStandard,selectedYear){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        fileUploadFactory.fetchSectionList(standard,year).fetch({},function(response){
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
            $scope.response_msg1 = "There is no classrooms found for this year.";
            console.log(response.status);
        });
    };
    $scope.fecthAssesmentList = function(currentClassroom){
        $scope.response_msg = "";
        var classRoom = window.btoa(currentClassroom.classRoomId);
        fileUploadFactory.fecthAssesmentList(classRoom).fetch({},function(response){
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
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };


    $scope.addUrl = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };

    $scope.uploadUrls = function(){
        var add = $scope.add;
        var body = ' { ' +
            '"videoName":"' + add.videoName + '",' +
            '"imageUrl":"' + add.imageUrl + '",' +
            '"videoUrl" :"' +add.videoUrl + '",'+
            '"eventName" :"'+add.eventName+'"}';

        var response = fileUploadFactory.uploadUrls();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.response_msg2 = "Url Saved Successfully !!!";
            }
        },function(response){
            if(response.status == 404){
                $scope.response_msg2 = response.data.errorMessage;
            }
            else
                $scope.response_msg2 = "Url Saving is Unsuccessful !!!";
        });
    };


    $scope.uploadInventory = function(){
        var file ={};
        if($scope.xlsInventory == undefined){
            window.alert("Please select the file");
        }else{
            file = $scope.xlsInventory;
            console.log('file is ' );
            console.dir(file);
            if(file.size <= 2097152){
                var uploadUrl = fileUploadFactory.uploadInventory();
                fileUpload.uploadFileToUrl(file, uploadUrl);
                $scope.response_msg1 = "File uploaded successfully!!!";
            }else{
                $scope.respnose_msg1= "File size should less than 2Mb";
                window.alert("File size should less than 2Mb")
            }
        }

    };

    $scope.uploadVehicle = function(){
        var file ={};
        if($scope.xlsVehicle == undefined){
            window.alert("Please select the file");
        }else{
            file = $scope.xlsVehicle;
            console.log('file is ' );
            console.dir(file);
            if(file.size <= 2097152){
                var uploadUrl = fileUploadFactory.uploadVehicle();
                fileUpload.uploadFileToUrl(file, uploadUrl);
                $scope.response_msg1 = "File uploaded successfully!!!";
            }else{
                $scope.respnose_msg1= "File size should less than 2Mb";
                window.alert("File size should less than 2Mb")
            }
        }
    };

    $scope.uploadLibrary = function(){
        var file ={};
        if($scope.xlsLibrary == undefined){
            window.alert("Please select the file");
        }else{
            file = $scope.xlsLibrary;
            console.log('file is ' );
            console.dir(file);
            if(file.size <= 2097152){
                var uploadUrl = fileUploadFactory.uploadLibrary();
                fileUpload.uploadFileToUrl(file, uploadUrl);
                $scope.response_msg1 = "File uploaded successfully!!!";
            }else{
                $scope.respnose_msg1= "File size should less than 2Mb";
                window.alert("File size should less than 2Mb")
            }
        }

    };

    /*$scope.isUpload = {
        value: false
    };*/
    $scope.isUpload = false;
    $scope.isDownload = false;
    $scope.toUpload = function(value){
        $scope.isUpload = value == 'U';
        $scope.isDownload = false;
    };
    $scope.toDownload = function(value){
        $scope.isDownload = value == 'D';
        $scope.isUpload = false;
    };



    $scope.uploadStudents = function(currentClassroom){
        if(currentClassroom == undefined){
            window.alert("Please select Year, Class and Section");
        }else{
            var classRoom = window.btoa(currentClassroom.classRoomId);
            var file ={};
            if($scope.xlsStudents == undefined){
                window.alert("Please select the file");
            }else{
                file = $scope.xlsStudents;
                //var file = $scope.xlsStudents;
                console.log('file is ' );
                console.dir(file);
                if(file.size <= 2097152){
                    var uploadUrl = fileUploadFactory.uploadStudents(classRoom);
                    fileUpload.uploadFileToUrl(file, uploadUrl);
                    $scope.response_msg1 = "File uploaded successfully!!!";
                }else{
                    $scope.respnose_msg1= "File size should less than 2Mb";
                    window.alert("File size should less than 2Mb")
                }
            }
        }
    };

    $scope.uploadMarksheet = function(currentClassroom, currentAssessment){
        if(currentAssessment == undefined){
            window.alert("Please select Year,Class,Section and Assessment");
        }else{
            var classRoom = window.btoa(currentClassroom.classRoomId);
            console.log(currentClassroom.classRoomId);
            console.log(currentAssessment.assessmentName);
            var assess = window.btoa(currentAssessment.assessmentId);
            var file ={};
            if($scope.xlsMarksheet == undefined){
                window.alert("Please select the file");
            }else{
                file = $scope.xlsMarksheet;
                console.log('file is ' );
                console.dir(file);
                if(file.size <= 2097152){
                    var uploadUrl = fileUploadFactory.uploadMarksheet(classRoom, assess);
                    fileUpload.uploadFileToUrl(file, uploadUrl);
                    $scope.response_msg = "File uploaded successfully!!!";
                }else{
                    $scope.respnose_msg1= "File size should less than 2Mb";
                    window.alert("File size should less than 2Mb")
                }
            }
        }
    };


    $scope.downloadStudents = function(classRoomId){
        if(classRoomId == undefined){
            window.alert("Please select Year, Class and Section");
        }else{
            $scope.response_msg = "";
            var classRoom = window.btoa(classRoomId);
            fileUploadFactory.downloadStudents(classRoom).fetch({},{},function(response){
                if(response.status == 200) {
                    if (response.data.byteLength > 0) {
                        var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'});
                        saveAs(file, 'Students' + '.xlsx');
                        /*var fileUrl = URL.createObjectURL(file);
                        window.open(fileUrl);*/
                    }
                }
            },function(response){
                console.log("downlaod error")
            });
        }
    };

    $scope.downloadMarksheet = function(classRoomId, assessmentId){

        if(assessmentId == undefined){
            window.alert("Please select Year, Class, Section and Assessment");
        }else{
            $scope.response_msg = "";
            var classRoom = window.btoa(classRoomId);
            var assess = window.btoa(assessmentId);
            fileUploadFactory.downloadMarksheet(classRoom, assess).fetch({},{},function(response){
                if(response.status == 200) {
                    if (response.data.byteLength > 0) {
                        var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'});
                        saveAs(file, 'Marksheet' + '.xlsx');
                        /*var fileUrl = URL.createObjectURL(file);
                        window.open(fileUrl);*/
                    }
                }
            },function(response){
                console.log("downlaod error")
            });
        }
    };
    $scope.downloadLibrary = function(){
        $scope.response_msg = "";
        //fileUploadFactory.downloadLibrary();
        fileUploadFactory.downloadLibrary().fetch({},{},function(response){
            if(response.status == 200) {
                if (response.data.byteLength > 0) {
                    var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'});
                    saveAs(file, 'Library' + '.xlsx');
                   /* var fileUrl = URL.createObjectURL(file);
                    window.open(fileUrl);*/
                }
            }
        },function(response){
            console.log("downlaod error")
        });
    };

    $scope.downloadInventory = function(){
        $scope.response_msg = "";
        //fileUploadFactory.downloadLibrary();
        fileUploadFactory.downloadInventory().fetch({},{},function(response){
            if(response.status == 200) {
                if (response.data.byteLength > 0) {
                    var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'});
                    saveAs(file, 'Inventories' + '.xlsx');
                    /*var fileUrl = URL.createObjectURL(file);
                    window.open(fileUrl);*/
                }
            }
        },function(response){
            console.log("downlaod error")
        });
    };

    $scope.downloadVehicle = function(){
        $scope.response_msg = "";
        //fileUploadFactory.downloadLibrary();
        fileUploadFactory.downloadVehicle().fetch({},{},function(response){
            if(response.status == 200) {
                if (response.data.byteLength > 0) {
                    var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'});
                    saveAs(file, 'Vehicles' + '.xlsx');
                   /* var fileUrl = URL.createObjectURL(file);
                    window.open(fileUrl);*/
                }
            }
        },function(response){
            console.log("downlaod error")
        });
    };
    $scope.downloadFaculty = function(){
        $scope.response_msg = "";
        //fileUploadFactory.downloadLibrary();
        fileUploadFactory.downloadFaculty().fetch({},{},function(response){
            if(response.status == 200) {
                if (response.data.byteLength > 0) {
                    var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'});
                    saveAs(file, 'Faculties' + '.xlsx');
                   /* var fileUrl = URL.createObjectURL(file);
                    window.open(fileUrl);*/
                }
            }
        },function(response){
            console.log("downlaod error");
        });
    };

    $scope.studentExelsheet = function () {
        $scope.response_msg = "";
        fileUploadFactory.studentExelsheet().fetch({},{},function(response){
            if(response.status == 200 || response.status == 201) {
                if (response.data.byteLength > 0) {
                    var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'});
                    saveAs(file, 'Students Template' + '.xlsx');
                    /* var fileUrl = URL.createObjectURL(file);
                     window.open(fileUrl);*/
                }
            }
        },function(response){
            console.log("downlaod error");
        });
    };
    $scope.marksExelsheet = function () {
        $scope.response_msg = "";
        fileUploadFactory.marksExelsheet().fetch({},{},function(response){
            if(response.status == 200 || response.status == 201) {
                if (response.data.byteLength > 0) {
                    var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'});
                    saveAs(file, 'Marksheet Template' + '.xlsx');
                    /* var fileUrl = URL.createObjectURL(file);
                     window.open(fileUrl);*/
                }
            }
        },function(response){
            console.log("downlaod error");
        });
    };
    $scope.inventoryExelsheet = function () {
        $scope.response_msg = "";
        fileUploadFactory.inventoryExelsheet().fetch({},{},function(response){
            if(response.status == 200 || response.status == 201) {
                if (response.data.byteLength > 0) {
                    var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'});
                    saveAs(file, 'Inventory Template' + '.xlsx');
                    /* var fileUrl = URL.createObjectURL(file);
                     window.open(fileUrl);*/
                }
            }
        },function(response){
            console.log("downlaod error");
        });
    };
    $scope.vehicleExelsheet = function () {
        $scope.response_msg = "";
        fileUploadFactory.vehicleExelsheet().fetch({},{},function(response){
            if(response.status == 200 || response.status == 201) {
                if (response.data.byteLength > 0) {
                    var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'});
                    saveAs(file, 'Vehicle Template' + '.xlsx');
                    /* var fileUrl = URL.createObjectURL(file);
                     window.open(fileUrl);*/
                }
            }
        },function(response){
            console.log("downlaod error");
        });
    };
    $scope.libraryExelsheet = function () {
        $scope.response_msg = "";
        fileUploadFactory.libraryExelsheet().fetch({},{},function(response){
            if(response.status == 200 || response.status == 201) {
                if (response.data.byteLength > 0) {
                    var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'});
                    saveAs(file, 'Library Template' + '.xlsx');
                    /* var fileUrl = URL.createObjectURL(file);
                     window.open(fileUrl);*/
                }
            }
        },function(response){
            console.log("downlaod error");
        });
    };

    $scope.init = function(){
        $scope.orgLogo = "";
        $scope.branchLogo = "";
        $scope.classroom_list =[];
        $scope.standard_list =[];
        $scope.isUpload = false;
        $scope.isDownload = false;
        $scope.years = $localStorage.years;
        $scope.academicYear = $localStorage.academicYear.successMessage;
        $scope.fetchStandardList($scope.academicYear);
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('xlsfiles.files');
    };

    $scope.init();

}]);