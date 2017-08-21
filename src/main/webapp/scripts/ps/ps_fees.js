
smart_parking.factory('feeFactory',['$resource','Config', '$window',function($resource,Config, $window){
    var factory = {};
    var fetch_fee_url = Config.getFeeAPI();
    var main_url = Config.getBranchesAPI();

    var authCode = $window.localStorage.getItem("authCode");

    factory.createBranchFees = function(){
        return $resource(fetch_fee_url+branchId+'/expandfees',{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        console.log("posting  branch fees successful!!!");
                        return data;
                    }
                }
            }
        });
    };

    factory.fetchYears = function(){
        return $resource(main_url+'/orgsettings/years',{},{
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

    factory.fetchFeeList = function(branchId,selectedYear,offset,limit){
        return $resource(fetch_fee_url+branchId+'//expandfees/year/'+selectedYear+'/feestructuresbasedonmode?offset='+offset+'&limit='+limit,{},{
            fetch: {
                method: 'get',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor: {
                    response: function(data){
                        return data;
                    }
                }
            }
        });
    };

    /*factory.fetchFeeList = function(selectedYear){
        // http://localhost:8080/Eshiksha/org/orgId/branch/branchID/fees/basic/syllabus/Syllabus/year/year
        return $resource(fetch_fee_url+branchId+'//expandfees/year/'+selectedYear+'/feestructuresbasedonmode',{},{
            fetch: {
                method: 'get',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor: {
                    response: function (data){
                        return data;
                    }
                }
            }
        });
    };*/

        return factory;
}]);
smart_parking.controller('feeController', ['$scope','feeFactory','branchFactory','$state','$modal','$localStorage',function($scope,feeFactory,branchFactory,$state,$modal,$localStorage) {

    var initials = {
        standard:"",admissionFees:"",monthlyFees:"",sportsFees:"",booksFees:"",vanFees:"",year:"",feesId:""
    };

    $scope.fetchBranchList = function(){
        branchFactory.fetchAllBranchList().fetch({},function(response){
            $scope.branch_list =[];
            if(response.status == 200){
                if(response.data.branches != undefined){
                    var _data = angular.fromJson(response.data.branches);
                    $scope.branch_list = _data;
                }
            }
        },function(response){
            $scope.branch_list = [];
            console.log(response.status);
        });
    };

   /* $scope.fetchStandardList = function(selectedYear){
        $scope.standards= ["L.K.G","U.K.G","M0","M1","M2","M3","First", "Second", "Third", "Fourth","Fifth",
            "Sixth","Seventh","Eighth","Ninth","Tenth"];
        $scope.fee_list =[];
        $scope.syllabus_list =[];
    };
    $scope.fetchSyllabusList = function(selectedYear){
        $scope.syllabus_list = ["CBSE", "ICSE", "State Syllabus"];
        $scope.fee_list =[];
    };*/

    $scope.feesDetails = {
        fee_list: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.fetchFeeList = function(currentBranch,selectedYear,offset, limit){
        $scope.response_msg = "";
        console.log(currentBranch.branchId+" "+selectedYear);
        var branch = window.btoa(currentBranch.branchId);
        var year = window.btoa(selectedYear);
        feeFactory.fetchFeeList(branch,year, offset, limit).fetch({},function(response){
                /*$scope.fee_list =[];*/
            console.log(response);
            if(response.status == 200 || response.status == 201){
                $scope.count = response.data.total;
                if(response.data.feeStructure!=undefined){
                    console.log(response.data.feeStructure);
                    var _data = angular.fromJson(response.data.feeStructure);
                    $scope.fee_list = _data;
                    $scope.totalPages = Math.ceil($scope.count/$scope.feesDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.fee_list.length);
                }
            }
        },function(response){
            $scope.fee_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.listYears = function(){
        feeFactory.fetchYears().fetch({},function(response){
            console.log(response);
            $scope.year_list =[];
            if(response.status == 200){
                if(response.data.yearsDetails!=undefined){
                    var _data = angular.fromJson(response.data.yearsDetails);
                    $scope.year_list = _data;
                    $localStorage.years = $scope.year_list;
                }
            }
        },function(response){
            $scope.year_list =[];
            console.log(response.status);
        });
    };

    /*$scope.fetchFeeList = function(selectedYear){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var year = window.btoa(selectedYear);
        //var syllabus = window.btoa(syllabus);
        feeFactory.fetchFeeList(year).fetch({},function(response){
            $scope.fee_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.feeStructure!=undefined){
                    var _data = angular.fromJson(response.data.feeStructure);
                    $scope.fee_list = _data;
                    $scope.$parent.setBaseContentHeight($scope.fee_list.length);
                }
            }
        },function(response){
            $scope.fee_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };*/

    $scope.viewDetails = function(fee,index){

        $scope.feeDetails = $scope.fee_list[index];
        $scope.totalOneTimeFees = 0;
        for(i=0; i<$scope.feeDetails.oneTimeFees.length; i++){
            $scope.totalOneTimeFees = $scope.totalOneTimeFees + $scope.feeDetails.oneTimeFees[i].amount;
        }

        $scope.onModeChange = function(recMode){
            $scope.rec_list = [];
            $scope.totalRecurringFees = 0;
            if(recMode == 'Monthly'){
                $scope.rec_list = $scope.feeDetails.monthyFees;
                for(i=0;i<$scope.feeDetails.monthyFees.length; i++){
                    $scope.totalRecurringFees =  $scope.totalRecurringFees + ($scope.feeDetails.monthyFees[i].amount * $scope.feeDetails.monthyFees[i].noOfInstalments);
                }console.log( $scope.totalRecurringFees);
            }
            else if(recMode == 'Quarterly'){
                $scope.rec_list = $scope.feeDetails.quterlyFees;
                for(i=0;i<$scope.feeDetails.quterlyFees.length; i++){
                    $scope.totalRecurringFees =  $scope.totalRecurringFees + ($scope.feeDetails.quterlyFees[i].amount *$scope.feeDetails.quterlyFees[i].noOfInstalments);
                }console.log( $scope.totalRecurringFees);
            }
            else if(recMode == 'Half-Yearly'){
                $scope.rec_list = $scope.feeDetails.halfYearlyFees;
                for(i=0;i<$scope.feeDetails.halfYearlyFees.length; i++){
                    $scope.totalRecurringFees =  $scope.totalRecurringFees + ($scope.feeDetails.halfYearlyFees[i].amount * $scope.feeDetails.halfYearlyFees[i].noOfInstalments);
                }console.log( $scope.totalRecurringFees);

            }
            else if(recMode == 'Yearly'){
                $scope.rec_list = $scope.feeDetails.yearlyFees;
                for(i=0;i<$scope.feeDetails.yearlyFees.length; i++){
                    $scope.totalRecurringFees =  $scope.totalRecurringFees + ($scope.feeDetails.yearlyFees[i].amount * $scope.feeDetails.yearlyFees[i].noOfInstalments);
                }console.log( $scope.totalRecurringFees);
            }
        };
    };

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "fee" && $scope.fee_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.fee_list.length);
        }
    });

    $scope.mode_list = ["Monthly", "Quarterly", "Half-Yearly", "Yearly"];

    $scope.init = function(){
        $scope.fee_list = [];
        $scope.fetchBranchList();
        $scope.listYears();
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.fee_list = [];
        $state.go('^.list');
    };

    $scope.pageChanged = function(currentBranch,year){
        $scope.feesDetails.startValue = (($scope.feesDetails.currentPage - 1) * $scope.feesDetails.numPerPage);
        $scope.fetchFeeList(currentBranch, year, $scope.feesDetails.startValue, $scope.feesDetails.numPerPage);
    };

    $scope.init();

}]);