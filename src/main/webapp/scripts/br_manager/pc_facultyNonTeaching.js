/**
 * Created by Icarat2 on 11/23/2016.
 */

branchManager.factory('nonTeachingFacultyFactory',['$resource', 'br_Manager_Config','$window',function($resource, br_Manager_Config,$window){
    var factory = {};
    var fetch_faculty_url = br_Manager_Config.getMainAPI();
    var main_url = br_Manager_Config.getBranchesAPI();
    var authCode = $window.localStorage.getItem("authCode");


    http://localhost:8080/Eshiksha/org/358374583/branch/548684845/role/684684689/nonteachingstaff
    factory.fetchNonteachingFaculty = function(role){
        return $resource(fetch_faculty_url+'/role/'+role+'/nonteachingstaff',{},{
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

    factory.updateStaff = function(userId){
        // http://localhost:8080/Eshiksha/org/56456456/branch/456456/userId/5646456/nonteachingstaff
        return $resource(fetch_faculty_url+'/userId/'+userId+'/nonteachingstaff',{},{
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

    factory.deleteStaff = function(userId) {
        // http://localhost:8080/Eshiksha/org/54646757/branch/8679879/userId/797978/nonteachingstaff
        return $resource(fetch_faculty_url+'/userId/'+userId+'/nonteachingstaff',{},{
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

    factory.postNonTeachingFaculty = function(){
        return $resource(fetch_faculty_url+'/nonteachingstaff',{},{
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

    factory.fetchRoles = function(){
        return $resource(main_url+'/orgsettings/nonteachingStaff',{},{
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

branchManager.controller('nonTeachingFacultyController',['$scope','nonTeachingFacultyFactory','br_manager_appConfig','$state','$filter','$modal','$localStorage',function ($scope,nonTeachingFacultyFactory,br_manager_appConfig,$state,$filter,$modal,$localStorage) {
    var initials = {
        firstName:"",lastName:"",qualification:"",dateOfJoining:"",dateOfBirth:"",gender:"",phonenumber:"",bloodGroup:"",fatherFirstName:"",fatherLastName:"",
        drivingLicenseNumber:"",licenseExpiryDate:"",noOfExperience:"", localAddress:"",permanentAddress:"",secondryPhonenumber:""
    };

    $scope.aDate = '2015-10-31';
    $scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
    }

    $scope.staffDetails = {
        staffList: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };


    $scope.fetchNonteachingFaculty = function (role) {
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var role = window.btoa(role.designation);
        nonTeachingFacultyFactory.fetchNonteachingFaculty(role).fetch({},function(response){
            $scope.staff_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.nonTeachStaffs!=undefined){
                    var _data = angular.fromJson(response.data.nonTeachStaffs);
                    $scope.staff_list = _data;
                }
            }
        },function(response){
            $scope.staff_list = [];
            console.log(response.status);
        });
    };

    $scope.fetchRoles = function () {
        $scope.response_msg1 = "";
        nonTeachingFacultyFactory.fetchRoles().fetch({},function(response){
            $scope.roles_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.designations!=undefined){
                    var _data = angular.fromJson(response.data.designations);
                    $scope.roles_list = _data;
                }
            }
        },function(response){
            $scope.roles_list = [];
            console.log(response.status);
        });
    };

    $scope.addNonTeachingFaculty = function(){
        $scope.response_msg = "";
        $scope.noOfExperience = 0;
        $scope.isPermanent = {
            value: false
        };
        $scope.add = angular.copy(initials);
        $scope.add.gender = "Male";
    };

    $scope.postNonTeachingFaculty = function (noOfExperience) {
        var add = $scope.add;
        $scope.joiningDate = $filter('date')(new Date(add.dateOfJoining),'yyyy-MM-dd');
        $scope.birthDate = $filter('date')(new Date(add.dateOfBirth),'yyyy-MM-dd');
        $scope.expiryDate = $filter('date')(new Date(add.licenseExpiryDate),'yyyy-MM-dd');

        var body = ' { ' +
            '"staffId":"' + add.staffId + '",' +
            '"firstName":"' + add.firstName + '",' +
            '"lastName" :"' + add.lastName + '",'+
            '"dateOfBirth" :"' + $scope.birthDate  + '",'+
            '"dateOfJoining" :"'+ $scope.joiningDate + '",'+
            '"gender" :"' + add.gender + '",'+
            '"permanent" :"' + $scope.isPermanent.value + '",'+
            '"qualification" :"' + add.qualification + '",'+
            '"fatherFirstName" :"' + add.fatherFirstName + '",'+
            '"fatherLastName" :"' + add.fatherLastName + '",'+
            '"bloodGroup" :"' + add.blood + '",'+
            '"noOfExperience" :"' +  noOfExperience + '",'+
            '"drivingLicenseNumber" :"' + add.drivingLicenseNumber + '",'+
            '"licenseExpiryDate" :"' + $scope.expiryDate + '",'+
            '"localAddress" :"' + add.localAddress + '",'+
            '"permanentAddress" :"' + add.permanentAddress + '",'+
            '"phonenumber" :"' + add.phonenumber + '",'+
            '"secondryPhonenumber" :"' + add.secondryPhonenumber + '",'+
            '"role" :"'+add.x.designation + '"'+
            '}';
        var response = nonTeachingFacultyFactory.postNonTeachingFaculty();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201) {
                $state.go('^.list');
                $scope.staff_list =[];
                //$scope.fetchNonteachingFaculty();
            }
            $scope.response_msg = "Faculty added successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }else
                $scope.response_msg1= "Addition of Faculty is unsuccessful !!!";
        });
    };

    $scope.deleteStaff = function(staff,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var staff = window.btoa(staff.nonTeachStaffUserId);

        var dialogue_message = "Are you sure to delete the Faculty ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){
                nonTeachingFacultyFactory.deleteStaff(staff).remove({},function(response){
                    if(response.status == 200 || response.status == 201){
                        $state.go('^.list');
                        $scope.fetchRoles();
                        $scope.staff_list = [];
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

    $scope.editStaff = function (staff, index) {
        $scope.response_msg = " ";
        $scope.obj = staff;
        $scope.permanent = {
            value: staff.permanent
        };
    };

    $scope.updateStaff = function (noOfExperience) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var staff = window.btoa($scope.obj.nonTeachStaffUserId);
        $scope.joiningDate = $filter('date')(new Date($scope.obj.dateOfJoining),'yyyy-MM-dd');
        $scope.birthDate = $filter('date')(new Date($scope.obj.dateOfBirth),'yyyy-MM-dd');
        $scope.expiryDate = $filter('date')(new Date($scope.obj.licenseExpiryDate),'yyyy-MM-dd');

        var body = ' { ' +
            '"firstName":"' + $scope.obj.firstName + '",' +
            '"lastName" :"' + $scope.obj.lastName + '",'+
            '"staffId" :"' + $scope.obj.staffId + '",'+
            '"dateOfBirth" :"' + $scope.birthDate  + '",'+
            '"dateOfJoining" :"'+ $scope.joiningDate + '",'+
            '"gender" :"' + $scope.obj.gender + '",'+
            '"permanent" :"' + $scope.permanent.value + '",'+
            '"bloodGroup" :"' + $scope.obj.bloodGroup + '",'+
            '"qualification" :"' + $scope.obj.qualification + '",'+
            '"fatherFirstName" :"' + $scope.obj.fatherFirstName + '",'+
            '"fatherLastName" :"' + $scope.obj.fatherLastName + '",'+
            '"noOfExperience" :"' +  $scope.obj.noOfExperience + '",'+
            '"drivingLicenseNumber" :"' + $scope.obj.drivingLicenseNumber + '",'+
            '"licenseExpiryDate" :"' + $scope.expiryDate + '",'+
            '"localAddress" :"' + $scope.obj.localAddress + '",'+
            '"permanentAddress" :"' + $scope.obj.permanentAddress + '",'+
            '"phonenumber" :"' + $scope.obj.phonenumber + '",'+
            '"secondryPhonenumber" :"' + $scope.obj.secondryPhonenumber + '",'+
            '"role" :"'+ $scope.obj.role + '"'+
            '}';
        var response = nonTeachingFacultyFactory.updateStaff(staff);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201) {
                $state.go('^.list');
                $scope.staff_list =[];
            }
            $scope.response_msg = "Faculty Updated successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }else
                $scope.response_msg1= "Updating of Faculty is unsuccessful !!!";
        });
    };

    $scope.init = function(){
        $scope.staff_list = [];
        $scope.bg_list = ["A +ve","A -ve","B +ve","B -ve","AB +ve","AB -ve","O +ve","O -ve"];
        $scope.fetchRoles();
    };
    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.staff_list = [];
        $state.go('^.list');
    };
    $scope.init();

}]);