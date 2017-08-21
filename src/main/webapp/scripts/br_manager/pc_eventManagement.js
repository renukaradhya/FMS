/**
 * Created by Icarat2 on 2/16/2016.
 */

branchManager.factory('eventManagementFactory',['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
    var factory = {};
    var fetch_event_url = br_Manager_Config.getMainAPI();

    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchEventsPdfReport = function(year){
        // /branch/BRANCH0001/event/reports/year/2015-16/fetch
        // branch/BRANCH0001/event/reports/year/2015-16/fetch
        return $resource(fetch_event_url+'/event/reports/year/'+year+'/fetch',{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        console.log("Report Generated  !!!");
                        return data;
                    }
                }
            }
        });
    };

    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_event_url+'/classroom/year/'+ selectedYear, {}, {
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

    factory.fetchSectionList = function(currentStandard, year) {
        return $resource(fetch_event_url+'/classroom/standard/'+ currentStandard +'/section/year/'
            + year, {}, {
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


    factory.fetchEventList = function(year,offset,limit){
        return $resource(fetch_event_url+'/event/year/'+year+'/events?offset='+offset+'&limit='+limit,{},{
            fetch: {
                method: 'get',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor:{
                    response: function(data){
                        return data;
                    }
                }
            }
        });
    };

    factory.createEventEntry = function(){
        // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/event
        return $resource(fetch_event_url+'/event',{},{
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

    factory.updateEvents = function(eventId){
        return $resource(fetch_event_url+'/event/'+eventId,{},{
            edit: {
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

    factory.deleteEvent = function(eventId) {
    	return $resource(fetch_event_url+'/event/'+eventId,{},{
    		remove: {
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


branchManager.controller('eventManagementCtrl',['$scope','eventManagementFactory','br_manager_appConfig','$state','$filter','$modal','$localStorage',function($scope,eventManagementFactory,br_manager_appConfig,$state,$filter,$modal,$localStorage){

    var initials = {
        eventType:"",date:"",time:"",standard:"",dressType:"",eventId:""
    };

    $scope.eventDetails = {
        eventList: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.aDate = '2015-10-31';
    $scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
    }


    $scope.fetchEventList = function(year,offset,limit) {
        $scope.response_msg ="";
        $scope.response_msg1 ="";
        var year = window.btoa(year);
        eventManagementFactory.fetchEventList(year,offset,limit).fetch({},function(response) {
            console.log(response);
            if(response.status==200) {
                $scope.count = response.data.total;
                console.log($scope.count);
                if(response.data.eventList != undefined) {
                    var _data= angular.fromJson(response.data.eventList);
                    $scope.event_list = _data;
                    $scope.totalPages = Math.ceil($scope.count/$scope.eventDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.event_list.length);
                }
            }
        }, function(response){
            $scope.event_list = [];
            $scope.response_msg1 = "No Events found for this year.";
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };



    $scope.fetchStandardList = function(year){
        $scope.response_msg1 ="";
        var year = window.btoa(year);
        eventManagementFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classroomnames != undefined){
                    var _data = angular.fromJson(response.data.classroomnames);
                    $scope.standard_list = _data;
                }
            }
        },function(response){
            $scope.standard_list = [];
            //$scope.response_msg1 = "No Classes found for this year.";
            console.log(response.status);
        });
    };

    $scope.fetchSectionList = function(currentClass,year){
        $scope.response_msg1 = "";
        console.log(currentClass);
        var standard = window.btoa(currentClass.name);
        var year = window.btoa(year);
        eventManagementFactory.fetchSectionList(standard,year).fetch({},function(response){
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
           // $scope.response_msg1 = "No Classrooms  found for this Class.";
            console.log(response.status);
        });
    };



    $scope.addEvent = function(){
        $scope.fetchStandardList($scope.academicYear);
        $scope.response_msg = "";
        $scope.add = angular.copy(initials);
    };

    $scope.other= 0;
    $scope.event = function(to){
        hol_to = "Class room";
        hol_to1 = "Class";
        if(angular.equals(hol_to,to)){
            $scope.other = 1;
            console.log("all change");
        }else if(angular.equals(hol_to1,to)){
            $scope.other = 2;
            console.log("two change");
        }else{
            $scope.other = 0;
            console.log("No change");
        }
    };

    $scope.createEventEntry = function() {
        var add = $scope.add;
        $scope.add.date.Value = $filter('date')(new Date(add.date),'yyyy-MM-dd');

        var input = function(){
            var formData = {};
            if(angular.equals(add.to, "Class room")){
                formData ={
                    eventType: add.eventType,
                    date: $scope.add.date.Value,
                    time: add.time,
                    description: add.description,
                    to: add.to,
                    year: $scope.academicYear ,
                    standard: add.standard.name,
                    classRoomId: add.classroom.classRoomId,
                    dressType: add.dressType
                }
            }else if(angular.equals(add.to, "Class")){
                formData ={
                    eventType: add.eventType,
                    date: $scope.add.date.Value,
                    time: add.time,
                    description: add.description,
                    to: add.to,
                    year: $scope.academicYear ,
                    standard: add.standard.name,
                    dressType: add.dressType
                }
            }else{
                formData ={
                    eventType: add.eventType,
                    date: $scope.add.date.Value,
                    time: add.time,
                    description: add.description,
                    to: add.to,
                    year: $scope.academicYear ,
                    dressType: add.dressType
                }
            }
            return formData;
        };
        var body = input();

        var response = eventManagementFactory.createEventEntry();
        var data = response.add({},body, function (response)
        {
            if (response.status == 200 || response.status == 201) {
                $scope.event_list = [];
                $state.go('^.list');
            }
            $scope.response_msg = "Event added Successfully !!!";
        },function(response) {
            //$scope.response_msg1= response.data.errorMessage;
                if(response.status == 404) {
                    $scope.response_msg1= response.data.errorMessage;
                } else {
                    $scope.response_msg1 = "Addition of Event is Failed !!! "
                }
        });
    };


    // ***************** Update Operation ****************
    $scope.editEvents = function (eventId) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.event_list, function (event) {
            if (eventId == event.eventId) {
                $scope.edit.eventId = event.eventId;
                $scope.edit.eventType = event.eventType;
                $scope.edit.date = new Date(event.date);
                $scope.edit.time = event.time;
                $scope.edit.description = event.description;
                $scope.edit.standard = event.standard;
                $scope.edit.section = event.section;
                $scope.edit.dressType = event.dressType;
                console.log("eventId "+eventId);
            }
        });
    };

    $scope.updateEvents = function (eventId) {
        var edit = $scope.edit;
        $scope.edit.date.Value = $filter('date')(new Date(edit.date),'yyyy-MM-dd');

        var body = ' { ' +
            '"eventType":"' + edit.eventType + '",' +
            '"date" :"' + $scope.edit.date.Value + '",'+
            '"time" :"' + edit.time + '",'+
            '"description" :"' + edit.description + '",'+
            '"standard" :"' + edit.standard + '",'+
            '"dressType" :"' + edit.dressType + '"}';

        var eve = window.btoa(eventId);
        var response = eventManagementFactory.updateEvents(eve);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.event_list = [];
                $state.go('^.list');
            }
            $scope.response_msg = "Event updated successfully !!!";
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Event is unsuccessful !!!";
        });
    };

    $scope.deleteEvent = function(event,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var eve = window.btoa(event.eventId);
        var dialogue_message = "Are you sure to delete the event ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value: "+ flag);
            if(flag){
                eventManagementFactory.deleteEvent(eve).remove({},function(response){

                    if(response.status == 200 || response.status == 201){
                        $scope.event_list = [];
                        $state.go('^.list');
                    }
                    $scope.response_msg = "Event Deletion failed !!!";
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg1 = "Event Deletion failed !!!";

                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };

    $scope.$on('$viewContentLoaded',function(){

        if($state.current.name == "event" && $scope.event_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.event_list.length);
        }
    });

    $scope.init = function() {
        $scope.years = $localStorage.years;
        $scope.academicYear = $localStorage.academicYear.successMessage;
        $scope.eventDetails.numPerPage = parseInt($scope.eventDetails.numPerPage);
        $scope.maxSize = 5;
        $scope.event_list = [];
        $scope.events_to = ['School', 'Class', 'Class room'];
    };

    $scope.cancel = function () {
        $scope.event_list = [];
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };
    
    $scope.init();

    $scope.pageChanged = function(year){
        $scope.eventDetails.startValue = (($scope.eventDetails.currentPage - 1) * $scope.eventDetails.numPerPage);
        $scope.fetchEventList(year,$scope.eventDetails.startValue,$scope.eventDetails.numPerPage);
    };

}]);


branchManager.controller('eventReportsCtrl',['$scope','eventManagementFactory','$state','$localStorage',function($scope,eventManagementFactory,$state,$localStorage){



    $scope.generateEventsReport = function(year){
        console.log("Inside event Report()");
        console.log(year);
        if( year == undefined ){
            window.alert("Please select the Year");
        }
        else {
            var year = window.btoa(year);
            eventManagementFactory.fetchEventsPdfReport(year).fetch({}, function (response) {
                $scope.success = false;
                if (response.status == 200 || response.status == 201) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        console.log("response status 200 !!");
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        $scope.file = file;
                        $scope.fileURL = URL.createObjectURL(file);
                        $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                    } else {
                        console.log("data Length = " + response.data.byteLength);
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
        saveAs($scope.file, 'Event Report' + '.pdf');
    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('events.main');
    };

    $scope.init = function () {
        $scope.years = $localStorage.years;
    };

    $scope.init();
}]);