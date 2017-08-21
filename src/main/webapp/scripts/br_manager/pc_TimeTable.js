/**
 * Created by Icarat2 on 5/1/2016.
 */

branchManager.factory('timeTableFactory',['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
   var factory = {};
    var fetch_timetable_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");



    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_timetable_url +'/classroom/year/'+ selectedYear, {}, {
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
        return $resource(fetch_timetable_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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


    factory.fetchTimeTable = function(classRoomId){
        console.log("class "+ classRoomId);
        return $resource(fetch_timetable_url+'/classRoom/'+classRoomId+'/timetable',{},{
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

    factory.createTimeTable = function(classroomId){
        console.log("class: "+fetch_timetable_url+'/classRoom/'+classroomId+'/timetable');
        return $resource(fetch_timetable_url+'/classRoom/'+classroomId+'/timetable',{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        console.log("posted successfully");
                        return data;
                    }
                }
            }
        });
    };

    factory.deleteTimetable = function(classRoom){
        return $resource(fetch_timetable_url+'/classRoom/'+classRoom+'/timetable',{},{
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

branchManager.controller('timeTableCtrl', ['$scope','timeTableFactory','br_manager_appConfig','$state','$modal','$localStorage',function($scope,timeTableFactory,br_manager_appConfig,$state,$modal,$localStorage) {

    var initials = {
            monday:"",tuesday:"",year:"" ,wednesday:"",thursday:"",friday:"",saturday:"",
            subject:"", firstStart:"",secondStart:"",thirdStart:"",fourthStart:"",
            fifthStart:"",sixthStart:"",seventhStart:"",periodStartTime:""
    };

    $scope.timetableDetails = {
        timetable_lists: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        $scope.timetable = "";
        $scope.section_list =[];
        var year = window.btoa(selectedYear);
        timeTableFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            if(response.status == 200 || response.status == 201){
                if(response.data.classroomnames != undefined){
                    var _data = angular.fromJson(response.data.classroomnames);
                    $scope.standard_list = _data;
                    console.log( $scope.standard_list);
                }
            }
        },function(response){
            $scope.standard_list = "";
            $scope.timetable = "";
            $scope.response_msg = "No classes found for this year.";
            console.log(response.status);
        });
    };

    $scope.fetchSectionList = function(selectedYear, currentStandard){
        $scope.response_msg = "";
        $scope.timetable = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        console.log(selectedYear);
        console.log(selectedYear);
        timeTableFactory.fetchSectionList(year, standard).fetch({},function(response){
            $scope.section_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.section_list = _data;
                }
            }
        },function(response){
            $scope.section_List = "";
            $scope.timetable = "";
            $scope.response_msg = "No Section found for this standard.";
            console.log(response.status);
        });
    };

    $scope.fetchTimeTable = function(currentClassroom) {
        $scope.response_msg = "";
        var classRoom = window.btoa(currentClassroom.classRoomId);
        timeTableFactory.fetchTimeTable(classRoom).fetch({},function(response) {
            $scope.timetable ={};
            console.log(response);
            if(response.status == 200 || response.statu == 201) {
                if(response.data!=undefined) {
                    var _data = angular.fromJson(response.data);
                    console.log(_data);
                    $scope.timetable = _data;
                }
            }
        },function(response){
            $scope.response_msg = "Time table not found";
            $scope.timetable = "";
        });
    };


    $scope.addTimetable = function(){
        $scope.response_msg = "";
        $scope.fetchStandardList($scope.academicYear);

        $scope.monday = [
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''}
        ];
        $scope.tuesday = [
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''}
        ];
        $scope.wednesday = [
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''}
        ];
        $scope.thursday = [
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''}
        ];
        $scope.friday = [
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''}
        ];
        $scope.saturday = [
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''},
            {subject:'',periodStartTime:'',periodEndTime:''}
        ];
    };

    $scope.createTimeTable = function (currentClassroom) {
        $scope.response_msg1 = "";
        if(currentClassroom == undefined){
            window.alert("Please select Year, Class and Section")
        }else{
            $scope.mon = [];$scope.tue = [];$scope.wed = [];$scope.thu = [];$scope.fri = [];$scope.sat = [];

            for(i=0; i<$scope.monday.length; i++){
                $scope.tuesday[i].periodStartTime = $scope.monday[i].periodStartTime;
                $scope.tuesday[i].periodEndTime = $scope.monday[i].periodEndTime;

                $scope.wednesday[i].periodStartTime = $scope.monday[i].periodStartTime;
                $scope.wednesday[i].periodEndTime = $scope.monday[i].periodEndTime;

                $scope.thursday[i].periodStartTime = $scope.monday[i].periodStartTime;
                $scope.thursday[i].periodEndTime = $scope.monday[i].periodEndTime;

                $scope.friday[i].periodStartTime = $scope.monday[i].periodStartTime;
                $scope.friday[i].periodEndTime = $scope.monday[i].periodEndTime;
            }

            for(i=0; i<$scope.monday.length; i++){
                if($scope.monday[i].periodStartTime != undefined || $scope.monday[i].periodStartTime != ""){
                    $scope.mon.push($scope.monday[i]);
                }
                if($scope.tuesday[i].periodStartTime != undefined || $scope.tuesday[i].periodStartTime != ""){
                    $scope.tue.push($scope.tuesday[i]);
                }
                if($scope.wednesday[i].periodStartTime != undefined || $scope.wednesday[i].periodStartTime != ""){
                    $scope.wed.push($scope.wednesday[i]);
                }
                if($scope.thursday[i].periodStartTime != undefined || $scope.thursday[i].periodStartTime != ""){
                    $scope.thu.push($scope.thursday[i]);
                }
                if($scope.friday[i].periodStartTime != undefined || $scope.friday[i].periodStartTime != ""){
                    $scope.fri.push($scope.friday[i]);
                }
            }
            for(i=0; i<$scope.saturday.length; i++){
                if($scope.saturday[i].periodStartTime != undefined || $scope.saturday[i].periodStartTime != ''){
                    $scope.sat.push($scope.saturday[i]);
                }
            }
            var monday  = [], tuesday  = [], wednesday  = [], thursday  = [], friday  = [], saturday  = [];
            for(var i=0; i<$scope.mon.length; i++){
                if($scope.mon[i].periodStartTime != ''){
                    monday.push($scope.mon[i]);
                }
            }
            for(var i=0; i<$scope.tue.length; i++){
                if($scope.tue[i].periodStartTime != ''){
                    tuesday.push($scope.tue[i]);
                }
            }
            for(var i=0; i<$scope.wed.length; i++){
                if($scope.wed[i].periodStartTime != ''){
                    wednesday.push($scope.wed[i]);
                }
            }
            for(var i=0; i<$scope.thu.length; i++){
                if($scope.thu[i].periodStartTime != ''){
                    thursday.push($scope.thu[i]);
                }
            }
            for(var i=0; i<$scope.fri.length; i++){
                if($scope.fri[i].periodStartTime != ''){
                    friday.push($scope.fri[i]);
                }
            }
            for(var i=0; i<$scope.sat.length; i++){
                if($scope.sat[i].periodStartTime != ''){
                    saturday.push($scope.sat[i]);
                }
            }
            var body = {};
            if( saturday.length == 0){
                body = {
                    monday: monday,
                    tuesday: tuesday,
                    wednesday: wednesday,
                    thursday: thursday,
                    friday: friday
                };
            }else{
                body = {
                    monday: monday,
                    tuesday: tuesday,
                    wednesday: wednesday,
                    thursday: thursday,
                    friday: friday,
                    saturday: saturday
                };
            }

            var classRoom = window.btoa(currentClassroom.classRoomId);
            var response = timeTableFactory.createTimeTable(classRoom);
            var data = response.add({}, body, function (response) {
                if(response.status == 200 || response.status == 201) {
                    $state.go('^.list');
                }
                $scope.response_msg = "Time table added successfully !!!";
            },function(response){
                if(response.status == 404)
                {
                    $scope.response_msg1 = response.data.errorMessage;
                }
                else
                    $scope.response_msg1= "Addition of time table is unsuccessful !!!";
            });
        }
    };

    $scope.deleteTimetable = function(classRoom){
        var classRoom = window.btoa(classRoom);
        var dialogue_message = "Are you sure to delete the Time Table ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                timeTableFactory.deleteTimetable(classRoom).remove({},function(response){
                    console.log(response.status);
                    if(response.status == 200 || response.status == 201 || response.status == 204 ){
                        $scope.timetable =undefined;
                        $scope.monday = [];
                        $scope.tuesday = [];
                        $scope.wednesday = [];
                        $scope.thursday = [];
                        $scope.friday = [];
                        $scope.saturday = [];
                    }
                    $state.go('^.list');
                    $scope.response_msg = "Time table deleted successfully !!!";
                },function(response){
                    if(response.status = 404){
                        $scope.response_msg = response.data.errorMessage;
                    }else{
                        $scope.response_msg = "Deletion of time table unsuccessful !!";
                    }
                    console.log(response.status);
                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };

    $scope.init = function() {
        $scope.years = $localStorage.years;
        $scope.academicYear = $localStorage.academicYear.successMessage;
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

    $scope.init();

}]);
