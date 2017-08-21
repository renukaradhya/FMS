/**
 * Created by Icarat3 on 9/15/2016.
 */
facultyApp.factory('leaveFactory',['$resource','faculty_config', '$window',function($resource,faculty_config, $window) {
    var factory = {};
    var fetch_leave_url = faculty_config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");


    factory.fetchLeaveList = function(faculty,year,offset,limit){
        return $resource(fetch_leave_url+'/facultyleave/'+faculty+'/year/'+year+'?offset='+offset+'&limit='+limit,{},{
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

    factory.fetchApprovalList = function(faculty,year,offset,limit){
        return $resource(fetch_leave_url+'/facultyleave/'+faculty+'/year/'+year+'/statuslist?offset='+offset+'&limit='+limit,{},{
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

    factory.submitLeaveRequest = function(uid){
        return $resource(fetch_leave_url+'/facultyleave/'+uid,{},{
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

    factory.leaveCancel = function (leaveId, facultyId, Cancel) {
        return $resource(fetch_leave_url+'/facultyleave/'+facultyId+'/leave/'+leaveId+'/state/'+Cancel+'/cancel',{}, {
            remove: {
                method: 'put',
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

    factory.editLeaveEntry = function(facultyId){
        return $resource(fetch_leave_url+'/facultyleave/'+facultyId+'/update',{},{
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

    factory.getLeaveSummary = function (faculty) {
        return $resource(fetch_leave_url+'/faculty/'+faculty+'/leavesummary',{},{
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
    factory.getLeaveTransaction = function (faculty) {
        return $resource(fetch_leave_url+'/faculty/'+faculty+'/leavetransactions',{},{
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


facultyApp.controller('leaveManagementCtrl', ['$scope','leaveFactory','faculty_appConfig','$state','$filter','$modal','$window','$localStorage',function($scope,leaveFactory,faculty_appConfig,$state,$filter,$modal,$window,$localStorage) {
    var initials = {fromDate:"", toDate:"", reason:"", year:"",timeFrame:"" };
    $scope.leaveDetails = {
        leaveList: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.aDate = '2015-10-31';
    $scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
    }

    $scope.getLeaveSummary = function () {
       // $scope.response_msg = "";
        $scope.response_msg1 = "";
        var faculty = $window.sessionStorage.getItem('facultyId');
        var faculty1 = window.btoa(faculty);
        leaveFactory.getLeaveSummary(faculty1).fetch({},function(response){
            $scope.leave_summary ={};
            console.log(response);
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.leave_summary = _data;
                    console.log($scope.leave_summary);

                }
            }

        },function(response){
            $scope.leave_summary = {};
            console.log(response.status);
        });
    };
    $scope.getLeaveTransaction = function () {
        //$scope.response_msg = "";
        $scope.response_msg1 = "";
        var faculty = $window.sessionStorage.getItem('facultyId');
        var faculty1 = window.btoa(faculty);
        leaveFactory.getLeaveTransaction(faculty1).fetch({},function(response){
            $scope.leave_transaction =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.leaveTransactionsDTOs!=undefined){
                    var _data = angular.fromJson(response.data.leaveTransactionsDTOs);
                    $scope.leave_transaction = _data;
                }
            }

        },function(response){
            $scope.leave_transaction = [];
            console.log(response.status);
        });
    };


    $scope.fetchLeaveList = function(year,offset,limit){
        //$scope.response_msg = "";
        $scope.response_msg1 = "";
        var faculty = $window.sessionStorage.getItem('facultyId');
        var faculty1 = window.btoa(faculty);
        var year1 = window.btoa(year);

        leaveFactory.fetchLeaveList(faculty1,year1,offset,limit).fetch({},function(response){
            $scope.leave_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.facultyLeaveResponseDTO!=undefined){
                    var _data = angular.fromJson(response.data.facultyLeaveResponseDTO);
                    $scope.leave_list = _data;
                 //   console.log("leave_list"+$scope.leave_list.state);
                   $scope.totalPages = Math.ceil($scope.count/$scope.leaveDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.leave_list.length);
                }
            }

        },function(response){
            $scope.leave_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.requestLeave = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.halfDay = {
            value: false
        };
        $scope.half = "1st Half";
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };

    $scope.submitLeaveRequest = function(){
        var add = $scope.add;
        var uid = $window.sessionStorage.getItem('facultyId');
        var faculty1 = window.btoa(uid);
        $scope.add.fromDate.Value = $filter('date')(new Date(add.fromDate),'yyyy-MM-dd');
        $scope.add.toDate.Value = $filter('date')(new Date(add.toDate),'yyyy-MM-dd');
        $scope.time = function () {
            if($scope.halfDay.value == true){
                return add.timeFrame;
            }else {
                return "";
            }
        };
        var body = ' { ' +
            '"fromDate" :"' + $scope.add.fromDate.Value + '",' +
            '"toDate" :"' + $scope.add.toDate.Value + '",' +
            '"type":"' + add.type + '",' +
            '"halfDay":"' + $scope.halfDay.value + '",' +
            '"timeFrame":"' + $scope.time() + '",' +
            '"year":"' + $scope.academicYear + '",' +
            '"reason" :"' + add.reason +
            '"}';
        var response = leaveFactory.submitLeaveRequest(faculty1);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.leave_list =[];
            }
            $state.go('^.list');
            $scope.response_msg = "Addition of Leave Is Successful !!!";
        },function(response){
            if(response.status == 409 || response.status == 404){
                // Check for status Code and variable below
               $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition Of Leave Is Unsuccessful !!!";
        });
    };

    $scope.leaveCancel = function(leave,index,year){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var cancel = window.btoa("Cancel");
        var leave = window.btoa(leave.leaveId);
        var year1 = window.btoa($scope.academicYear);
        var facultyID1 = $window.sessionStorage.getItem('facultyId');
        var faculty = window.btoa(facultyID1);

        var dialogue_message = "Are you sure you want to Cancel the Leave ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){

                leaveFactory.leaveCancel(leave,faculty,cancel).remove({},function(response){
                    if(response.status == 200 || response.status == 201){
                        $scope.leave_list =[];
                        console.log("Cancelled")
                    }
                    $state.go("^.list");
                    $scope.response_msg = "Leave Cancelled successfully !!!";
                },function(response){
                    if(response.status == 409 || response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }else{
                        $scope.response_msg1 = "Leave Cancellation failed !!!";
                        console.log(response.status);
                    }

                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };


    $scope.editLeave = function (leaveId) {
        console.log("leaveId :"+leaveId);
        //$scope.edit.leaveId = leaveId;
        //console.log($scope.edit.leaveId);
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.leave_list, function (leave) {
            console.log("Leave: "+leave.leaveId);
            if (leaveId == leave.leaveId) {
                $scope.edit.leaveId = leave.leaveId;
                $scope.edit.fromDate = new Date(leave.fromDate);
                $scope.edit.toDate = new Date(leave.toDate);
                $scope.edit.year = leave.year;
                $scope.edit.type = leave.type;
                $scope.edit.halfDay = leave.halfDay;
                $scope.edit.timeFrame = leave.timeFrame;
                $scope.edit.reason = leave.reason;
            }
        });
    };

    $scope.editLeaveEntry = function (leaveId,year) {
        var facultyId = $window.sessionStorage.getItem('facultyId');
        var faculty = window.btoa(facultyId);
        var leave = window.btoa(leaveId);
        var year1 = window.btoa(year);
        var edit = $scope.edit;
        $scope.edit.fromDate.Value = $filter('date')(new Date(edit.fromDate),'yyyy-MM-dd');
        $scope.edit.toDate.Value = $filter('date')(new Date(edit.toDate),'yyyy-MM-dd');
        var body = ' { ' +
            '"fromDate" :"' +$scope.edit.fromDate.Value + '",' +
            '"toDate" :"' + $scope.edit.toDate.Value + '",' +
            '"year":"' + $scope.academicYear + '",' +
            '"reason" :"' + edit.reason+ '",' +
            '"type" :"' + edit.type+ '",' +
            '"halfDay" :"' + edit.halfDay+ '",' +
            '"timeFrame" :"' + edit.timeFrame+ '",' +
            '"leaveId":"' + leaveId + '"' +
            ' } ';
       // var leave = window.btoa(leaveId);
        var response = leaveFactory.editLeaveEntry(faculty);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.leave_list =[];
            }
            $state.go("^.list");
             $scope.response_msg = "Leave Details are Updated successfully !!!";

        },function(response){
            if(response.status == 409 || response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Leave details are unsuccessful !!!";
        });
    };

    $scope.init = function(year){
        $scope.leave_list =[];
        $scope.years = $localStorage.years;
        $scope.academicYear = $localStorage.academicYear.successMessage;
        $scope.leaveDetails.numPerPage = parseInt($scope.leaveDetails.numPerPage);
        $scope.maxSize = 5;
         $scope.fetchLeaveList(year,0,$scope.leaveDetails.numPerPage);
        $scope.getLeaveSummary();
        $scope.getLeaveTransaction();
    };

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "leave" && $scope.leave_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.leave_list.length);
        }
    });


    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.leave_list =[];
        $state.go('^.list');
    };

    $scope.init();

    $scope.pageChanged = function(year){
        $scope.leaveDetails.startValue = (($scope.leaveDetails.currentPage - 1) * $scope.leaveDetails.numPerPage);
        $scope.fetchLeaveList(year,$scope.leaveDetails.startValue,$scope.leaveDetails.numPerPage);
    };
}]);
facultyApp.controller('leaveStatusCtrl', ['$scope','leaveFactory','faculty_appConfig','$state','$filter','$modal','$window','$localStorage',function($scope,leaveFactory,faculty_appConfig,$state,$filter,$modal,$window,$localStorage)
{
    $scope.approvalDetails = {
        leaveList: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };


    $scope.fetchApprovalList = function(year,offset,limit){
        var faculty = $window.sessionStorage.getItem('facultyId');
        var faculty1 = window.btoa(faculty);
        console.log("FacultyId in Approval: "+faculty1);
        var year1 = window.btoa(year);
        console.log("Year in Approval: "+year1);
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        leaveFactory.fetchApprovalList(faculty1,year1,offset,limit).fetch({},function(response){
            $scope.approval_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                $scope.count = response.data.total;
                console.log("Total Leaves Count: "+ response.data.total);
                if(response.data.facultyLeaveResponseDTO!=undefined){
                    var _data = angular.fromJson(response.data.facultyLeaveResponseDTO);
                    $scope.approval_list = _data;
                    // console.log("leave_list"+$scope.leave_list);
                    $scope.totalPages = Math.ceil($scope.count/$scope.approvalDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.approval_list.length);
                }
            }

        },function(response){
            $scope.approval_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "status" && $scope.approval_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.approval_list.length);
        }
    });

    $scope.init = function(year){
        $scope.years = $localStorage.years;
        $scope.approvalDetails.numPerPage = parseInt($scope.approvalDetails.numPerPage);
        $scope.maxSize = 5;
         $scope.fetchApprovalList(year,0,$scope.approvalDetails.numPerPage);
    };

    $scope.init();

    $scope.pageChanged = function(year){
        $scope.approvalDetails.startValue = (($scope.approvalDetails.currentPage - 1) * $scope.approvalDetails.numPerPage);
        $scope.fetchApprovalList(year,$scope.approvalDetails.startValue,$scope.approvalDetails.numPerPage);
    };

}]);

