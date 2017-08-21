/**
 * Created by Icarat2 on 3/5/2016.
 */
branchManager.factory('holidayManagementFactory',['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
    var factory = {};
    var fetch_holidaylist_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_holidaylist_url+'/classroom/year/'+ selectedYear, {}, {
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
        return $resource(fetch_holidaylist_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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


    factory.fetchHolidayList = function(selectedYear,offset,limit){
        // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/holidaylist/year/2016-17/holidays
        return $resource(fetch_holidaylist_url+'/holidaylist/year/'+selectedYear+'/holidays?offset='+offset+'&limit='+limit,{},{
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

    factory.createHoliday = function(){
        return $resource(fetch_holidaylist_url+'/holidaylist',{},{
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

    factory.updateHoliday = function(startTime, to){
        return $resource(fetch_holidaylist_url+'/holidaylist/startTime/'+startTime+'/to/'+to,{},{
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

    factory.deleteHoliday = function(year,startDate,endDate){
        return $resource(fetch_holidaylist_url+'/holidaylist?startDate='+startDate+'&endDate='+endDate+'&year='+year,{},{
            remove: {
                method: 'Delete',
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
branchManager.controller('holidaysManagementCtrl', ['$scope','holidayManagementFactory','br_manager_appConfig','$state','$filter','$modal','$localStorage',function($scope,holidayManagementFactory,br_manager_appConfig,$state,$filter,$modal,$localStorage) {

    var initials = {
        type:"",reason:"",classroomId:"",startTime:"",endTime:"",year:""
    };

    $scope.holidayDetails = {
        holiday_lists: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.aDate = '2015-10-31';
    $scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
    }




    $scope.fetchHolidayList = function(selectedYear,offset,limit) {
        $scope.response_msg ="";
        $scope.response_msg1 = "";
        var year = window.btoa(selectedYear);
        holidayManagementFactory.fetchHolidayList(year,offset,limit).fetch({},function(response) {
            $scope.holiday_lists =[];
            console.log(response);
            if(response.status == 200) {
                $scope.count = response.data.total;
                console.log($scope.count);
                if(response.data.holidayLists!=undefined) {
                    var _data = angular.fromJson(response.data.holidayLists);
                    console.log(_data);
                    $scope.holiday_lists = _data;
                    $scope.totalPages = Math.ceil($scope.count/$scope.holidayDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.holiday_lists.length);
                }
            }
        },function(response){
            $scope.holiday_lists = [];
            $scope.response_msg1 = "No Holidays found for this year.";
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    // Check Below for Current Name
    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "holiday" && $scope.holidays_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.holidays_list.length);
        }
    });

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg1 = "";
        var year = window.btoa(selectedYear);
        holidayManagementFactory.fetchStandardList(year).fetch({},function(response){
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
            //$scope.response_msg1 = "No Classes found for this year.";
            console.log(response.status);
        });

    };

    $scope.fetchSectionList = function(currentStandard,selectedYear){
        $scope.response_msg1 = "";
        var standard = window.btoa(currentStandard.name);
        var year = window.btoa(selectedYear);
        holidayManagementFactory.fetchSectionList(standard,year).fetch({},function(response){
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
           // $scope.response_msg1 = "No Classrooms found for this year.";
            console.log(response.status);
        });
    };

    $scope.addHoliday = function(){
        $scope.fetchStandardList($scope.academicYear);
        $scope.response_msg = "";
        $scope.add = angular.copy(initials);
        $scope.other= 0;
        $scope.holiday = function(to){
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

    };


    $scope.holiday_type = ["National Holiday","Study Holidays","Festival","Summer Holidays","Winter Holidays","Regional Holiday"];
    $scope.holiday_to = ['School', 'Class', 'Class room'];

    $scope.createHoliday = function () {
        var add = $scope.add;

        $scope.add.startTime.Value = $filter('date')(new Date(add.startTime),'yyyy-MM-dd');
        $scope.add.endTime.Value = $filter('date')(new Date(add.endTime),'yyyy-MM-dd');

        var input = function(){
            var formData = {};
            if(angular.equals(add.to, "Class room")){
                formData ={
                    type: add.type,
                    reason: add.reason,
                    startTime: $scope.add.startTime.Value,
                    endTime: $scope.add.endTime.Value,
                    to: add.to,
                    standard: add.standard.name,
                    classroomId: add.classroom.classRoomId,
                    //section: add.classroom.section,
                    year: $scope.academicYear
                }
            }else if(angular.equals(add.to, "Class")){
                formData ={
                    type: add.type,
                    reason: add.reason,
                    startTime: $scope.add.startTime.Value,
                    endTime: $scope.add.endTime.Value,
                    to: add.to,
                    standard: add.standard.name,
                    year: $scope.academicYear
                }
            }else{
                formData ={
                    type: add.type,
                    reason: add.reason,
                    startTime: $scope.add.startTime.Value,
                    endTime: $scope.add.endTime.Value,
                    to: add.to,
                    year: $scope.academicYear
                }
            }
            return formData;
        };

        var body = input();
        var response = holidayManagementFactory.createHoliday();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.holiday_lists =[];
                $state.go('^.list');
            }
            $scope.response_msg = "Holiday added successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }else
                $scope.response_msg1= "Addition of Holiday is unsuccessful !!!";
        });
    };

//************************ Updating Inventory **************************

    $scope.editHoliday = function (holiday, index) {
        $scope.response_msg = "";
        $scope.edit =holiday;
        $scope.edit.prevStartTime = holiday.startTime;
        $scope.edit.prevEndTime = holiday.endTime;
        $scope.edit.startTime = new Date(holiday.startTime);
        $scope.edit.endTime = new Date(holiday.endTime);
    };


    $scope.updateHoliday = function () {
        var edit = $scope.edit;
        $scope.edit.startTime = $filter('date')(new Date($scope.edit.startTime),'yyyy-MM-dd');
        $scope.edit.endTime = $filter('date')(new Date($scope.edit.endTime),'yyyy-MM-dd');

        var body = ' { ' +
            '"type":"' + edit.type + '",' +
            '"reason":"' + edit.reason + '",' +
            '"to":"' + edit.to + '",' +
            '"standard":"' + edit.standard + '",' +
            '"classroomId" :"' + edit.classRoomId + '",'+
            '"year" :"' + $scope.academicYear + '",'+
            '"startTime" :"' + $scope.edit.startTime + '",'+
            '"endTime" :"'+ $scope.edit.endTime +'"}';

        var start = window.btoa($scope.edit.prevStartTime);
        var to = window.btoa(edit.to);
        var response = holidayManagementFactory.updateHoliday(start,to);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.holiday_lists =[];
                $state.go('^.list');
            }
            $scope.response_msg = "Holiday updated successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updating of Holiday is unsuccessful !!!";
        });
    };

    $scope.deleteHoliday = function(holiday,index,year){
        $scope.response_msg = "";
        var startTime = window.btoa(holiday.startTime);
        var endTime = window.btoa(holiday.endTime);
        var year = window.btoa(holiday.year);

        var dialogue_message = "Are you sure to delete the Holiday Entry ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){
                holidayManagementFactory.deleteHoliday(year,startTime,endTime).remove({},function(response){
                    console.log(response.status);
                    if(response.status == 200 || response.status == 201 || response.status == 204){
                        $scope.holiday_lists =[];
                        $state.go('^.list');
                        $scope.response_msg = "Holiday Entry Deleted successfully !!!";
                    }
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg1 = "Deletion of holiday unsuccessful !!";
                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };


    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "holiday" && $scope.holiday_lists != undefined){
            $scope.$parent.setBaseContentHeight($scope.holiday_lists.length);
        }
    });

    $scope.init = function() {
        $scope.years = $localStorage.years;
        $scope.academicYear = $localStorage.academicYear.successMessage;
        $scope.holidayDetails.numPerPage = parseInt($scope.holidayDetails.numPerPage);
        $scope.maxSize = 5;
       // $scope.fetchFacultyList(0,$scope.facultyDetails.numPerPage);
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.holiday_lists =[];
        $state.go('^.list');
    };

    $scope.init();

    $scope.pageChanged = function(year){
        $scope.holidayDetails.startValue = (($scope.holidayDetails.currentPage - 1) * $scope.holidayDetails.numPerPage);
        $scope.fetchHolidayList(year,$scope.holidayDetails.startValue,$scope.holidayDetails.numPerPage);
    };

}]);