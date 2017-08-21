/**
 * Created by uidr1063 on 1/10/2016.
 */

branchManager.factory('applicationRegistrationFactory',['$resource','br_Manager_Config',function($resource, br_Manager_Config){
    var factory = {};
    var fetch_faculty_url = br_Manager_Config.getFacultyAPI();

    factory.fetchFacultyList = function(offset,limit){
        return $resource(fetch_faculty_url+'?offset='+offset+'&limit='+limit,{},{
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
branchManager.controller('applicationRegistrationCtrl',['$scope','facultyManagementFactory','br_manager_appConfig','$state','$modal', function($scope,facultyManagementFactory,br_manager_appConfig,$state,$modal) {

    var initials = {
        firstName:"",lastName:"",qualification:"",dateOfJoining:"",dateOfBirth:"",comments:"",emails:"",phoneNumber:""
    };

    $scope.facultyDetails = {
        facultyList: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };

    $scope.fetchFacultyList = function(offset,limit){
        $scope.response_msg = "";
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

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "faculty" && $scope.faculty_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.faculty_list.length);
        }
    });

    $scope.init = function(){
        $scope.facultyDetails.numPerPage = parseInt($scope.facultyDetails.numPerPage);
        $scope.maxSize = 5;
        $scope.fetchFacultyList(0,$scope.facultyDetails.numPerPage);
    };

    $scope.init();

    $scope.pageChanged = function(){
        $scope.facultyDetails.startValue = (($scope.facultyDetails.currentPage - 1) * $scope.facultyDetails.numPerPage);
        $scope.fetchFacultyList($scope.facultyDetails.startValue,$scope.facultyDetails.numPerPage);
    };

}]);