/**
 * Created by $anthu on 12/20/2015.
 */

smart_parking.factory('branchManagerFactory',['$resource','Config','$window',function($resource,Config,$window){
    var factory = {};
    var fetch_bm_url = Config.getBranchManagersAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchBranchManagerList = function(){
        return $resource(fetch_bm_url+'/branchmanagers',{},{
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

    // http://localhost:8080/Eshiksha/org/ORG0000001/userName/ravi
    factory.validateUsername = function(userName) {
        return $resource(fetch_bm_url+'/userName/'+userName,{},{
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


     factory.createManager = function(branchId){
         //org/ORG0000001/branch/BRANCH0001/branchmanager
         return $resource(fetch_bm_url+'/branch/'+branchId+'/branchmanager',{},{
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

  /*  factory.updateManager = function(branchId){
        return $resource(fetch_bm_url+'/'+branchId,{},{
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

    factory.deleteManager = function(branchId){
        console.log("branch: "+branchId);
        return $resource(fetch_bm_url+'/branch/'+branchId+'/deactivate',{},{
            remove:{
                method: 'GET',
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

*/
    return factory;
}]);
smart_parking.controller('managerCtrl', ['$scope','branchManagerFactory','branchFactory','$state','$modal',function($scope,branchManagerFactory,branchFactory,$state,$modal) {

    var initials = {
        userName:"",password:"",firstName:"",lastName:"",phoneNumber:"",email:"",type:""
    };


    $scope.fetchBranchList = function(){
        branchFactory.fetchAllBranchList().fetch({},function(response){
            $scope.branch_list =[];
            if(response.status == 200){
                if(response.data.branches!=undefined){
                    var _data = angular.fromJson(response.data.branches);
                    $scope.branch_list = _data;
                    if($scope.branch_list.length > 0){
                       // $scope.currentBranch = $scope.branch_list[0];
                       // console.log($scope.currentBranch)
                       // $scope.fetchOperatorManagerList($scope.currentBranch)
                    }
                }
            }
        },function(response){
            $scope.branch_list = [];
            console.log(response.status);
        });
    };

    $scope.fetchBranchManagerList = function(){
        $scope.response_msg = "";
        $scope.availability = "";
        branchManagerFactory.fetchBranchManagerList().fetch({},function(response){
            $scope.bm_list =[];
            console.log(response);
            if(response.status == 200){
                if(response.data.branchManagers!=undefined){
                    var _data = angular.fromJson(response.data.branchManagers);
                    $scope.bm_list = _data;
                    $scope.$parent.setBaseContentHeight($scope.bm_list.length);
                }
            }
        },function(response){
            $scope.bm_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.validateUsername = function(userName){
        var user = window.btoa(userName);
        branchManagerFactory.validateUsername(user).fetch({}, function(response){
            if(response.status == 200 || response.status == 201){
                $scope.availability = "Available !!"
            }
        }, function(response){
            $scope.availability = response.data.errorMessage;
        })
    };

    $scope.addManager = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        $scope.add.gender = "Male";
    };

    $scope.createManager = function () {
        var add = $scope.add;
        var body = ' { ' +
            '"userName":"' + add.userName + '",' +
            '"password" :"' + add.password + '",'+
            '"firstName":"' + add.firstName + '",' +
            '"lastName" :"' + add.lastName + '",'+
            '"gender" :"' + add.gender + '",'+
            '"blood" :"' + add.blood + '",'+
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
        var branch = window.btoa(add.branch.branchId);
        var response = branchManagerFactory.createManager(branch);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchBranchManagerList();
            }
            $state.go('^.list');
            $scope.response_msg = "Manager added successfully !!!";
        },function(response){
            $scope.response_msg1 = response.data.errorMessage;
            /*if(response.status == 409){
                $scope.response_msg1 = response.data;
            }
            else
                $scope.response_msg1= "Addition of manager is unsuccessful !!!";*/
        });
    };

   /* $scope.editBranch = function (branchId) {
        console.log("branch ID:  "+branchID);
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.branch_list, function (branch) {
            console.log("subject: "+branch.branchId);
            if (branchId == branch.branchId) {
                $scope.edit.userName = branch.userName;
                $scope.edit.password = branch.password;
                $scope.edit.firstName = branch.firstName;
                $scope.edit.lastName = branch.lastName;
                $scope.edit.emails.email = branch.email;
                $scope.edit.phoneNumbers.phoneNumber = branch.phoneNumber;
                $scope.edit.pincode = branch.pincode;
            }
        });
    };

    $scope.updateManager = function (branchId) {
        var edit = $scope.edit;
        var body = ' { ' +
            '"userName":"' + edit.userName + '",' +
            '"password" :"' + edit.password + '",'+
            '"firstName":"' + edit.firstName + '",' +
            '"lastName" :"' + edit.lastName + '",'+
            '"emails"'+':'+
            '['+
                '{'+
                    '"email" :"' + edit.email + '",'+
                    '"type" :"' + edit.type +'"'+
                '}'+
            ']'+','+
            '"phoneNumbers"'+':'+
            '['+
                '{'+
                    '"phoneNumber" :"' + edit.phoneNumber + '",'+
                    '"type" :"' + edit.type +'"'+
                '}'+
            ']'+','+
            '"pincode" :"'+edit.pincode+'"}';

        var response = branchManagerFactory.updateManager(branchId);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchBranchList();
                $state.go('^.list');
            }
            $scope.response_msg = "Branch updated successfully !!!";
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Branch is unsuccessful !!!";
        });
    };*/

    $scope.init = function(){
       // $scope.fetchBranchManagerList();
        $scope.bg_list = ["A +ve","A -ve","B +ve","B -ve","AB +ve","AB -ve","O +ve","O -ve"];
    };

    $scope.init();


    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

}]);