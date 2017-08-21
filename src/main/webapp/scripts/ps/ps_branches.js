
smart_parking.factory('branchFactory',['$resource','Config', '$window',function($resource,Config, $window){
    var factory = {};
    var fetch_branch_url = Config.getBranchesAPI();
    var authCode = $window.localStorage.getItem("authCode");


    factory.fetchAllBranchList = function(){
        //http://localhost:8080/feesmanagementsystem/org/ORG0000001/branch
        return $resource(fetch_branch_url+'/branch',{},{
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

    factory.createBranch = function(){
        //http://localhost:8080/feesmanagementsystem/org/ORG0000001/branch
        return $resource(fetch_branch_url+'/branch',{},{
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


    factory.updateBranch = function(branchId){
        // branch/BRANCH0001/update
        return $resource(fetch_branch_url+'/branch/'+branchId+'/update',{},{
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
/*
    factory.deleteBranch = function(branchId){
        console.log("branch: "+branchId);
        return $resource(fetch_branch_url+'/branch/'+branchId+'/dectivate',{},{
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

smart_parking.controller('branchController', ['$scope','branchFactory','$state','$modal',function($scope,branchFactory,$state,$modal) {

    var initials = {
        orgName:"",address:"",pincode:"",branchId:"",branchName:"", email:"",type:""
        ,branchManagerName:"",masterEmailId:"",masterEmailPassword:"",phoneNumber:"",faxNumber:""
    };

    $scope.fetchBranchList = function(){
        $scope.response_msg = "";
        branchFactory.fetchAllBranchList().fetch({},function(response){
            $scope.branch_list =[];
            if(response.status == 200){
                if(response.data.branches!=undefined){
                    var _data = angular.fromJson(response.data.branches);
                    $scope.branch_list = _data;
                    $scope.$parent.setBaseContentHeight($scope.branch_list.length);
                }
            }
        },function(response){
            $scope.branch_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };


    $scope.addBranch = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };

    $scope.createBranch = function () {
        $scope.response_msg1 = "";
        var add = $scope.add;
        var body = ' { ' +
            '"branchName":"' + add.branchName + '",' +
            '"address" :"' + add.address + '",'+
            '"masterEmailId" :"' + add.masterEmailId + '",'+
            '"masterEmailPassword" :"' + add.masterEmailPassword + '",'+
            '"faxNumber" :"' + add.faxNumber + '",'+
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
            ']'+','+
            '"pincode" :"'+add.pincode+'"}';

        var response = branchFactory.createBranch();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchBranchList();
            }
            $state.go('^.list');
            $scope.response_msg = "Branch added successfully !!!";
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            } else if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of branch is unsuccessful !!!";
        });
    };

   /* $scope.deleteBranch = function(branch,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        console.log("inside deletebranch");

             var dialogue_message = "Are you sure to delete the branch ??";
                var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
                modalInstance.result.then(function (flag) {
                    console.log("Flag value:"+ flag);
                    if(flag){
                        branchFactory.deleteBranch(branch.branchId).remove({},function(response){
                            if(response.status == 200){
                                $scope.fetchBranchList();
                                console.log("deleted")
                            }
                        },function(response){
                            $scope.response_msg1 = "Branch Deletion failed !!!";
                            console.log(response.status);
                        });
                    }
                    else {
                        console.log("Failed to delete");
                    }
                });
    };*/


    $scope.editBranch = function (branchId) {
        console.log("branch ID:  "+branchId);
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.branch_list, function (branch) {
            console.log("subject: "+branch.branchId);
            if (branchId == branch.branchId) {
                $scope.edit.branchId = branch.branchId;
                $scope.edit.branchName = branch.branchName;
                $scope.edit.address = branch.address;
                $scope.edit.masterEmailId = branch.masterEmailId;
                $scope.edit.masterEmailPassword = branch.masterEmailPassword;
                $scope.edit.email = branch.Emails[0].email;
                $scope.edit.phoneNumber = branch.PhoneNumbers[0].phoneNumber;
                $scope.edit.pincode = branch.pincode;
                $scope.edit.faxNumber = branch.faxNumber;
            }
        });
    };

    $scope.updateBranch = function (branchId) {
        $scope.response_msg1 = "";
        var edit = $scope.edit;
        var body = ' { ' +
            '"branchName":"' + edit.branchName + '",' +
            '"address" :"' + edit.address + '",'+
            '"masterEmailId" :"' + edit.masterEmailId + '",'+
            '"masterEmailPassword" :"' + edit.masterEmailPassword + '",'+
            '"faxNumber" :"' + edit.faxNumber + '",'+
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
        var  branch = btoa(branchId);
        var response = branchFactory.updateBranch(branch);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchBranchList();
                $state.go('^.list');
            }
            $scope.response_msg = "Branch updated successfully !!!";
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            }else if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Branch is unsuccessful !!!";
        });
    };

    $scope.init = function(){
        $scope.fetchBranchList();
    };

    $scope.init();

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };


}]);