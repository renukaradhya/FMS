/**
 * Created by uidr1063 on 1/11/2016.
 */


smart_parking.factory('branchOperatorFactory',['$resource','Config', '$window',function($resource,Config, $window){
    var factory = {};
    var fetch_bo_url = Config.getBranchOperatorsAPI();
    var fetch_branch_url = Config.getBranchesAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchOperatorManagerList = function(branchId){
        return $resource(fetch_bo_url+'/branch/'+branchId+'/branchoperator',{},{
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

    factory.validateUsername = function(userName) {
        return $resource(fetch_bo_url+'/userName/'+userName,{},{
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


     factory.createOperator = function(branchId){
         // /branch/BRANCH0001/branchoperator
         return $resource(fetch_bo_url+'/branch/'+branchId+'/branchoperator',{},{
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

    /*factory.updateOperator = function(branchId){
        return $resource(fetch_bo_url+'/'+branchId,{},{
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
        return $resource(fetch_bo_url+'/branch/'+branchId+'/deactivate',{},{
            remove:{
                method: 'GET',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor: {
                    response: function (data) {
                        console.log("deleteBranch successful");
                        return data;
                    }
                }
            }
        });
    };*/



    return factory;
}]);
smart_parking.controller('operatorCtrl', ['$scope','branchOperatorFactory','branchFactory','$state','$modal',function($scope,branchOperatorFactory,branchFactory,$state,$modal) {

    var initials = {
        userName:"",password:"",firstName:"",lastName:"",phoneNumber:"",email:"",type:""
    };

    $scope.fetchBranchList = function(){
        $scope.availability = "";
        branchFactory.fetchAllBranchList().fetch({},function(response){
            $scope.branch_list =[];
            $scope.bo_list = [];
            if(response.status == 200){
                if(response.data.branches!=undefined){
                    var _data = angular.fromJson(response.data.branches);
                    $scope.branch_list = _data;
                }
            }
        },function(response){
            $scope.branch_list = [];
            console.log(response.status);
        });
    };


    $scope.fetchOperatorManagerList = function(currentBranch){
        $scope.response_msg = "";
        var branch = window.btoa(currentBranch.branchId);
        branchOperatorFactory.fetchOperatorManagerList(branch).fetch({},function(response){
            $scope.bo_list =[];
            if(response.status == 200){
                if(response.data.branchOperators!=undefined){
                    var _data = angular.fromJson(response.data.branchOperators);
                    $scope.bo_list = _data;
                    $scope.$parent.setBaseContentHeight($scope.bo_list.length);
                }
            }
        },function(response){
            $scope.bo_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.validateUsername = function(userName){
        var user = window.btoa(userName);
        branchOperatorFactory.validateUsername(user).fetch({}, function(response){
            if(response.status == 200 || response.status == 201){
                $scope.availability = "Available !!"
            }
        }, function(response){
            $scope.availability = response.data.errorMessage;
        })
    };


    $scope.addOperator = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        $scope.add.gender = "Male";
    };

    $scope.createOperator = function () {
        var add = $scope.add;
        var body = ' { ' +
            '"userName":"' + add.userName + '",' +
            '"password" :"' + add.password + '",'+
            '"firstName":"' + add.firstName + '",' +
            '"gender" :"' + add.gender + '",'+
            '"blood" :"' + add.blood + '",'+
            '"lastName" :"' + add.lastName + '",'+
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
        var response = branchOperatorFactory.createOperator(branch);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.bo_list =[];
                $scope.fetchBranchList();
            }
            $state.go('^.list');
            $scope.response_msg = "Operator added successfully !!!";
        },function(response){
            if(response.status == 409 || response.status == 404){
                $scope.response_msg1 = response.data;
            }
            else
                $scope.response_msg1= "Addition of Operator is unsuccessful !!!";
        });
    };
    /*
    $scope.editBranch = function (branchId) {
        console.log("branch ID:  "+branchID);
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.branch_list, function (branch) {
            console.log("subject: "+branch.branchId);
            if (branchId == branch.branchId) {
                $scope.edit.branchId = branch.branchId;
                $scope.edit.branchName = branch.branchName;
                $scope.edit.address = branch.address;
                $scope.edit.emails.email = branch.email;
                $scope.edit.phoneNumbers.phoneNumber = branch.phoneNumber;
              //  $scope.edit.pincode = branch.pincode;
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
            '}';

        var response = branchOperatorFactory.updateManager(branchId);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchBranchList();
                $state.go('^.list');
            }
            $scope.response_msg = "operator updated successfully !!!";
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of opeartor is unsuccessful !!!";
        });
    };*/

    $scope.init = function(){
        $scope.bo_list = [];
        $scope.bg_list = ["A +ve","A -ve","B +ve","B -ve","AB +ve","AB -ve","O +ve","O -ve"];
        //$scope.fetchBranchList();
        //$scope.fetchOperatorManagerList();
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.bo_list =[];
        $state.go('^.list');
    };

    $scope.init();

}]);