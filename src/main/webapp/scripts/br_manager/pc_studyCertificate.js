/**
 * Created by uidr1063 on 1/10/2016.
 */

branchManager.factory('studyCertificateManagementFactory',['$resource', 'br_Manager_Config',function($resource, br_Manager_Config){
    var factory = {};
    var fetch_studyCertificate_url = br_Manager_Config.getStudyCertificateAPI();

    factory.fetchStudyCertificateList = function(){
    	return $resource(fetch_studyCertificate_url,{},{
            fetch: {
                method: 'get',
                isArray: false,
                interceptor: {
                    response: function (data) {
                        return data;
                    }
                }
            }
        });
    };
    /*

     factory.createBranch = function(){
     return $resource(fetch_branch_url,{},{
     add:{
     method:'POST',
     headers: {'Content-Type': 'application/json'},
     isArray:false,
     interceptor: {
     response: function (data) {
     return data;
     }
     }
     }
     });
     };

     factory.deleteBranch = function(branchId){
     return $resource(fetch_branch_url+'/branch/'+branchId+'/deactivate',{},{
     delete: {
     method: 'get',
     isArray: false,
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
branchManager.controller('studyCertificateManagementCtrl', ['$scope','studyCertificateManagementFactory','br_manager_appConfig','$state','$modal',function($scope,studyCertificateManagementFactory,br_manager_appConfig,$state,$modal) {

    var initials = {
        firstName:"",lastName:"",qualification:"",dateOfJoining:"",dateOfBirth:"",comments:"",emails:"",phoneNumber:""
    };

    

    $scope.fetchStudyCertificateList = function(){
        $scope.response_msg = "";
        studyCertificateManagementFactory.fetchStudyCertificateList().fetch({},function(response){
            $scope.studyCertificate_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.studyCertificate!=undefined){
                    var _data = angular.fromJson(response.data.studyCertificate);
                    $scope.studyCertificate_list = _data;
                    $scope.$parent.setBaseContentHeight($scope.studyCertificate_list.length);
                }
            }

        },function(response){
            $scope.studyCertificate_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };


    $scope.init = function(){     
        $scope.fetchStudyCertificateList();
    };

    $scope.init();

   

}]);