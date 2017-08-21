/**
 * Created by uidr1063 on 1/10/2016.
 */

branchManager.factory('facultyManagementFactory',['$resource', 'br_Manager_Config','$window',function($resource, br_Manager_Config,$window){
    var factory = {};
    var fetch_faculty_url = br_Manager_Config.getMainAPI();
    var main_url = br_Manager_Config.getBranchesAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchLeaveList = function(year,offset,limit){
        return $resource(fetch_faculty_url+'/facultyleave/year/'+year+'/newState?offset='+offset+'&limit='+limit,{},{
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

    factory.rejectLeave = function (leaveId,rejected) {
        return $resource(fetch_faculty_url+'/facultyleave/'+leaveId+'/state/'+rejected+'/approvalorrejected',{}, {
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

    factory.approveLeave = function (leaveId,approval) {
        return $resource(fetch_faculty_url+'/facultyleave/'+leaveId+'/state/'+approval+'/approvalorrejected',{}, {
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

    factory.fetchPhoto = function(facultyId) {
        return $resource(fetch_faculty_url+'/image/faculty/'+facultyId,{},{
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

    factory.validateUsername = function(userName) {
        return $resource(fetch_faculty_url+'/faculty/userName/'+userName,{},{
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

    factory.fetchClassrooms = function(facultyId) {
        return $resource(fetch_faculty_url+'/faculty/'+facultyId+'/getClassRooms',{},{
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

    factory.fetchFacultyList = function(offset,limit){
        return $resource(fetch_faculty_url+'/faculty?offset='+offset+'&limit='+limit,{},{
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

    factory.fetchFacultyPdfReport = function(){
        return $resource(fetch_faculty_url+'/faculty/reports',{},{
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

    factory.updateFacultyEntry = function(facultyId){
    	return $resource(fetch_faculty_url+'/faculty/'+facultyId,{},{
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

    factory.deleteFaculty = function(facultyId) {
        console.log("Id: "+ facultyId);
    	return $resource(fetch_faculty_url+'/faculty/'+facultyId+'/deactivate',{},{
    		remove: {
    			method: 'get',
    			isArray: false,
                headers : { 'Authorization' : authCode },
    			interceptor: {
    				response: function (data) {
                        console.log("Data: "+ data);
    					return data;
    				}
    			}
    		}
    	});
    };

    factory.createFacultyEntry = function(){
        return $resource(fetch_faculty_url+'/faculty',{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data)
                    {
                        console.log("data posted successfully !!");
                        return data;
                    }
                }
            }
        });
    };

    factory.postLeaveState = function(faculty, state){
        return $resource(fetch_faculty_url+'/faculty/'+faculty+'/state/'+state,{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        console.log("data posted successfully !!");
                        return data;
                    }
                }
            }
        });
    };

    factory.listDesignation = function(){
        return $resource(main_url+'/orgsettings/desiganation',{},{
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

    factory.setDeafultLeaves = function (role) {
        return $resource(fetch_faculty_url+'/facultyleave/role/'+role+'/addadminleaves',{},{
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

    factory.leaveSummary = function (faculty) {
        return $resource(fetch_faculty_url+'/faculty/'+faculty+'/leavesummary',{},{
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
branchManager.controller('facultyManagementCtrl', ['$scope','facultyManagementFactory','br_manager_appConfig','$state','$filter','$modal','$localStorage',function($scope,facultyManagementFactory,br_manager_appConfig,$state,$filter,$modal,$localStorage) {

    var initials = {
        firstName:"",lastName:"",qualification:"",dateOfJoining:"",dateOfBirth:"",gender:"",comments:"",emails:"",phoneNumber:"",
        phoneNumbers:"",fatherFirstName:"",fatherlastName:"",email:"",blood:"", localAddress:"",permanentAddress:"",type:""
    };


    $scope.aDate = '2015-10-31';
    $scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
    }

    $scope.facultyDetails = {
        facultyList: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.addLeaveState = function (faculty, index) {
        $scope.respnose_msg = "";
        $scope.states = ["New","Adding"];
        $scope.id = faculty.facultyId;
        $scope.add = angular.copy(initials);
    };

    $scope.postLeaveState = function () {
        var add = $scope.add;
        var body = ' { ' +
            '"noOfSickLeaves":"' + add.sick + '",' +
            '"noOfCasualLeaves":"' + add.casual + '",' +
            '"noOfEarnedLeave":"' + add.earned + '"' +
            '}';
        var state = window.btoa(add.state);
        var faculty = window.btoa($scope.id);
        var response = facultyManagementFactory.postLeaveState(faculty, state);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201) {
                $state.go('^.list');
                $scope.fetchFacultyList(0,$scope.facultyDetails.numPerPage);
            }
            $scope.response_msg = "Leave States added successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }else
                $scope.response_msg1= "Addition of Leave States is unsuccessful !!!";
        });
    };

    $scope.fetchFacultyList = function(offset,limit){
        $scope.response_msg1 = "";
        facultyManagementFactory.fetchFacultyList(offset,limit).fetch({},function(response){
            $scope.faculty_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.faculties!=undefined){
                    var _data = angular.fromJson(response.data.faculties);
                    $scope.faculty_list = _data;
                    $scope.totalPages = Math.ceil($scope.count/$scope.facultyDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.faculty_list.length);
                }
            }
        },function(response){
            $scope.faculty_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.fetchFacultyInfo = function(facultyId){
        console.log("facultyId "+facultyId);
        $scope.response_msg = "";
        $scope.info={};
        $scope.classrooms = [];
        angular.forEach($scope.faculty_list, function (faculty) {
            if (facultyId == faculty.facultyId) {
                $scope.info = faculty;
                $scope.classrooms =  $scope.fetchClassrooms(facultyId);
                $scope.fetchPhoto($scope.info.facultyId);
            }
        });
    };

    $scope.image = false;
    $scope.fetchPhoto = function(facultyId) {
        $scope.photo = [];
        var faculty = window.btoa(facultyId);
        facultyManagementFactory.fetchPhoto(faculty).fetch({},function(response){
            //$scope.photo = [];
            $scope.success = false;
            console.log(response);
            console.log("Response length"+response.data.byteLength);
            if(response.status = 200 || response.status == 201){
                $scope.photo = response.data;
                $scope.image = true;
            }
        },function(response){
            $scope.image = false;
            console.log("errorrrrrr")
        });
    };
    $scope.fetchClassrooms = function(facultyId) {
        var classes = [];
        var faculty = window.btoa(facultyId);
        console.log(facultyId);
        facultyManagementFactory.fetchClassrooms(faculty).fetch({},function(response){
            console.log(response);
            if(response.status = 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classes = _data;
                    console.log($scope.classes);
                }
                return classes;
            }
        },function(response){
            console.log("errorrrrrr");
        });
    };

    $scope.setDeafultLeaves = function(role) {
        var role = window.btoa(role.designation);
        facultyManagementFactory.setDeafultLeaves(role).fetch({},function(response){
            console.log(response);
            if(response.status = 200 || response.status == 201){
                $state.go('^.list');
                $scope.fetchFacultyList(0,$scope.facultyDetails.numPerPage);
                $scope.response_msg = "Leaves state set to selected role successfully"
            }
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }else
                $scope.response_msg1= "Leave setting is unsuccessful !!!";
        });
    };

    $scope.listDesignation = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        facultyManagementFactory.listDesignation().fetch({},function(response){
            $scope.designation_list =[];
            if(response.status == 200){
                if(response.data.designations!=undefined){
                    var _data = angular.fromJson(response.data.designations);
                    $scope.designation_list = _data;
                    $localStorage.designations = $scope.designation_list;
                }
            }
        },function(response){
            $scope.designation_list =[];
        });
    };

    $scope.validateUsername = function(userName){
        var user = window.btoa(userName);
        facultyManagementFactory.validateUsername(user).fetch({}, function(response){
            if(response.status == 200 || response.status == 201){
                $scope.availability = "Available !!"
            }
        }, function(response){
            $scope.availability = response.data.errorMessage;
        })
    };

    $scope.addFacultyEntry = function(){
        $scope.response_msg = "";
        $scope.noOfExperience = 0;
        $scope.isPermanent = {
            value: false
        };
        $scope.add = angular.copy(initials);
        $scope.add.gender = "Male";
    };

// Creating Faculty to add into database
    $scope.createFacultyEntry = function (noOfExperience) {
         $scope.availability = "";
         var add = $scope.add;
         $scope.add.dateOfJoining.Value = $filter('date')(new Date(add.dateOfJoining),'yyyy-MM-dd');
         $scope.add.dateOfBirth.Value = $filter('date')(new Date(add.dateOfBirth),'yyyy-MM-dd');

         var body = ' { ' +
         '"staffId":"' + add.staffId + '",' +
         '"firstName":"' + add.firstName + '",' +
         '"lastName" :"' + add.lastName + '",'+
         '"dateOfBirth" :"' + $scope.add.dateOfBirth.Value  + '",'+
         '"gender" :"' + add.gender + '",'+
         '"blood" :"' + add.blood + '",'+
         '"permanent" :"' + $scope.isPermanent.value + '",'+
         '"qualification" :"' + add.qualification + '",'+
         '"designation" :"' + add.x.designation + '",'+
         '"noOfExperience" :"' +  noOfExperience + '",'+
         '"dateOfJoining" :"'+ $scope.add.dateOfJoining.Value + '",'+
         '"fatherFirstName" :"' + add.fatherFirstName + '",'+
         '"fatherlastName" :"' + add.fatherlastName + '",'+
         '"localAddress" :"' + add.localAddress + '",'+
         '"permanentAddress" :"' + add.permanentAddress + '",'+
         '"userName" :"' + add.userName + '",'+
         '"password" :"' + add.password + '",'+

         '"comments" :"'+add.comments + '",'+
             '"emails"'+':'+
             '['+
                 '{'+
                     '"email" :"' + add.email + '",'+
                     '"type" :"' + add.type +'"'+
                 '}'+
             ']'+','+
             '"phoneNumbers"'+':'+
             '['+
                 '{'+
                     '"phoneNumber" :"' + add.phoneNumber + '",'+
                     '"type" :"' + add.type +'"'+
                 '}'+
             ']'+
             '}';
         var response = facultyManagementFactory.createFacultyEntry();
         var data = response.add({}, body, function (response) {
             if(response.status == 200 || response.status == 201)
             {
                 $state.go('^.list');
                 $scope.fetchFacultyList(0,$scope.facultyDetails.numPerPage);
             }
             $scope.response_msg = "Faculty added successfully !!!";
             },function(response){
             if(response.status == 404){
                 $scope.response_msg1 = response.data.errorMessage;
             }else
                 $scope.response_msg1= "Addition of Faculty is unsuccessful !!!";
         });
     };
// ********************* Update Faculty *********************
    $scope.editFaculty = function (faculty, index) {
        $scope.response_msg = "";

        $scope.obj = faculty;

        /*$scope.facultyId = $scope.obj.facultyId;
        $scope.firstName = $scope.obj.firstName;
        $scope.lastName = $scope.obj.lastName;
        $scope.staffId = $scope.obj. staffId;
        $scope.dateOfJoining = $scope.obj.dateOfJoining;
        $scope.dateOfBirth = $scope.obj.dateOfBirth;

        $scope.qualification = $scope.obj.qualification;
        $scope.noOfExperience = $scope.obj.noOfExperience;
        $scope.designation = $scope.obj.designation;
        $scope.gender = $scope.obj.gender;
        $scope.blood = $scope.obj.blood;

        $scope.permanent = $scope.obj.permanent;
        $scope.fatherFirstName = $scope.obj.fatherFirstName;
        $scope.fatherLastName = $scope.obj.fatherLastName;
        $scope.localAddress = $scope.obj.localAddress;
        $scope.permanentAddress = $scope.obj.permanentAddress;

        $scope.comments = $scope.obj.comments;
        $scope.email = $scope.obj.emails[0].email;
        $scope.type1 = $scope.obj.emails[0].type;
        $scope.phoneNumber =$scope.obj.phoneNumbers[0].phoneNumber;
        $scope.type2 = $scope.obj.phoneNumbers[0].type;*/
    };

  $scope.updateFacultyEntry = function () {

        $scope.joinDate = $filter('date')(new Date($scope.obj.dateOfJoining),'yyyy-MM-dd');
        $scope.birthDate = $filter('date')(new Date($scope.obj.dateOfBirth),'yyyy-MM-dd');
        var body = ' { ' +
            '"firstName":"' + $scope.obj.firstName + '",' +
            '"lastName" :"' + $scope.obj.lastName + '",'+
            '"staffId" :"' + $scope.obj.staffId + '",'+
            '"dateOfBirth" :"' + $scope.birthDate + '",'+
            '"qualification" :"' + $scope.obj.qualification + '",'+
            '"dateOfJoining" :"'+ $scope.joinDate + '",'+
            '"noOfExperience" :"'+ $scope.obj.noOfExperience + '",'+
            '"designation" :"'+ $scope.obj.designation + '",'+
            '"gender" :"'+ $scope.obj.gender + '",'+
            '"blood" :"'+ $scope.obj.blood + '",'+
            '"permanent" :"'+ $scope.obj.permanent + '",'+
            '"fatherFirstName" :"' + $scope.obj.fatherFirstName + '",'+
            '"fatherLastName" :"' + $scope.obj.fatherLastName + '",'+
            '"localAddress" :"' + $scope.obj.localAddress + '",'+
            '"permanentAddress" :"' + $scope.obj.permanentAddress + '",'+
            '"comments" :"'+ $scope.obj.comments + '",'+
            '"emails"'+':'+
                '['+
                    '{'+
                        '"email" :"' + $scope.obj.emails[0].email + '",'+
                        '"type" :"' + $scope.obj.emails[0].type +'"'+
                    '}'+
                ']'+','+
            '"phoneNumbers"'+':'+
                '['+
                    '{'+
                        '"phoneNumber" :"' + $scope.obj.phoneNumbers[0].phoneNumber + '",'+
                        '"type" :"' + $scope.obj.phoneNumbers[0].type +'"'+
                    '}'+
                ']'+
            '}';
        var faculty = window.btoa($scope.obj.facultyId);
        var response = facultyManagementFactory.updateFacultyEntry(faculty);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201) {
                $state.go('^.list');
                //$scope.fetchFacultyList(0,$scope.facultyDetails.numPerPage);
            }
            $scope.response_msg = "Faculty updated successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Faculty is unsuccessful !!!";
        });
    };

    $scope.deleteFaculty = function(faculty,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var faculty = window.btoa(faculty.facultyId);

        var dialogue_message = "Are you sure to delete the Faculty ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){
                console.log(faculty.facultyId);
                facultyManagementFactory.deleteFaculty(faculty).remove({},function(response){
                    if(response.status == 200 || response.status == 201){
                        $state.go('^.list');
                        $scope.fetchFacultyList(0,$scope.facultyDetails.numPerPage);
                        console.log("deleted");
                    }
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg1= "Faculty deletion unsuccessful !!!";
                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };

    /*$scope.setFacultyLeaves = function(faculty,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var faculty = window.btoa(faculty.facultyId);

        var dialogue_message = "Are you sure to set the Faculty Leaves ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){
                console.log(faculty.facultyId);
                facultyManagementFactory.deleteFaculty(faculty).remove({},function(response){
                    if(response.status == 200 || response.status == 201){
                        $state.go('^.list');
                        $scope.fetchFacultyList(0,$scope.facultyDetails.numPerPage);
                        console.log("deleted");
                    }
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg1= "Faculty deletion unsuccessful !!!";
                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };*/

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "faculty" && $scope.faculty_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.faculty_list.length);
        }
    });

    $scope.init = function(){
        $scope.bg_list = ["A +ve","A -ve","B +ve","B -ve","AB +ve","AB -ve","O +ve","O -ve"];
        $scope.facultyDetails.numPerPage = parseInt($scope.facultyDetails.numPerPage);
        $scope.maxSize = 5;
        $scope.fetchFacultyList(0,$scope.facultyDetails.numPerPage);
        $scope.listDesignation();
    };
    
    $scope.cancel = function () {
        $scope.availability = "";
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.photo = [];
        $state.go('^.list');
    };
    
    $scope.init();

    $scope.pageChanged = function(){
        $scope.facultyDetails.startValue = (($scope.facultyDetails.currentPage - 1) * $scope.facultyDetails.numPerPage);
        $scope.fetchFacultyList($scope.facultyDetails.startValue,$scope.facultyDetails.numPerPage);
    };

}]);


branchManager.controller('facultyLeaveCtrl', ['$scope','facultyManagementFactory','br_manager_appConfig','$state','$filter','$modal','$localStorage',function($scope,facultyManagementFactory,br_manager_appConfig,$state,$filter,$modal,$localStorage)
{

    $scope.leaveDetails = {
        leaveList: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };
    $scope.fetchLeaveList = function(year,offset,limit){
        // var faculty = $window.sessionStorage.getItem('facultyId');
        var year1 = window.btoa(year);
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        facultyManagementFactory.fetchLeaveList(year1,offset,limit).fetch({},function(response){
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

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "leave" && $scope.leave_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.leave_list.length);
        }
    });

    $scope.rejectLeave = function(leaveId, year){
        var rejected = window.btoa("Rejected");
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var leave = window.btoa(leaveId);
        var year1 = window.btoa(year);
        var dialogue_message = "Are you sure you want to Reject the Leave ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){

                facultyManagementFactory.rejectLeave(leave,rejected).remove({},function(response){
                    if(response.status == 200){
                        $scope.fetchLeaveList(year1,0,$scope.leaveDetails.numPerPage);
                        console.log("Cancelled")
                    }
                    $state.go("^.list");
                    $scope.response_msg = "Leave Rejected successfully !!!";
                },function(response){
                    if(response.status == 409){
                        $scope.response_msg1 = "Leave Rejection failed !!!";
                    }else if( response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }
                    else{
                        $scope.response_msg1 = "Leave Rejection failed !!!";
                        console.log(response.status);
                    }
                });
            }
            else {
                console.log("Failed to Reject");
            }
        });
    };



    $scope.approveLeave = function(leaveId, year){
        var approval = window.btoa("Approval");
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var leave = window.btoa(leaveId);
        var year1 = window.btoa(year);
        var dialogue_message = "Are you sure you want to Approve the Leave ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){

                facultyManagementFactory.approveLeave(leave,approval).remove({},function(response){
                    if(response.status == 200){
                        $scope.fetchLeaveList(year1,0,$scope.leaveDetails.numPerPage);
                        console.log("Approved");
                    }
                    $state.go("^.list");
                    $scope.response_msg = "Leave Approval is successfully !!!";
                },function(response){
                    if(response.status == 409){
                        $scope.response_msg1 = "Leave Approval is failed !!!";
                    }else if(response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }
                    else{
                        $scope.response_msg1 = "Leave Approval is failed !!!";
                        console.log(response.status);
                    }
                });
            }
            else {
                console.log("Failed to Approve");
            }
        });

    };
    $scope.leaveSummary = function (faculty, $index) {
        var faculty = window.btoa(faculty.facultyId);
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        facultyManagementFactory.leaveSummary(faculty).fetch({},function(response){
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

    $scope.init = function(year){
        $scope.leave_list = [];
        $scope.leaveDetails.numPerPage = parseInt($scope.leaveDetails.numPerPage);
        $scope.maxSize = 5;
        $scope.fetchLeaveList(year,0,$scope.leaveDetails.numPerPage);
        $scope.years = $localStorage.years;
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.leave_list = [];
        $state.go('^.list');
    };

    $scope.init();

    $scope.pageChanged = function(year){
        $scope.leaveDetails.startValue = (($scope.leaveDetails.currentPage - 1) * $scope.leaveDetails.numPerPage);
        $scope.fetchLeaveList(year,$scope.leaveDetails.startValue,$scope.leaveDetails.numPerPage);
    };

}]);

branchManager.controller('facultyReportCtrl',['$scope','facultyManagementFactory','$state',function($scope,facultyManagementFactory,$state){

    $scope.generateFacultyReport = function(){
        console.log("Inside generateFacultyReport()");
        facultyManagementFactory.fetchFacultyPdfReport().fetch({},function(response){
            $scope.success = false;
            if(response.status = 200){
                if(response.data.byteLength>0){
                    $scope.success = true;
                    console.log("response status 200 !!");
                    console.log("Reponse.data.byteLength = " + response.data.byteLength);
                    var file = new Blob([response.data], { type: 'application/pdf' });
                    $scope.file = file;
                    $scope.fileURL = URL.createObjectURL(file);
                    $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                }else{
                    console.log("Reponse.data.byteLength = "+response.data.byteLength);
                }
            }
        },function(response){
            console.log("Error Unable to download the page");
        });
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
        saveAs($scope.file, 'Faculty Report' + '.pdf');

    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('facultyreports.main');
    };


}]);