/**
 * Created by Icarat3 on 7/14/2016.
 */

branchOperator.factory('vehicleFactory',['$resource', 'br_Operator_Config', '$window',function($resource, br_Operator_Config, $window){
    var factory = {};
    var fetch_vehicle_url = br_Operator_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchVehicleList = function(offset,limit){
        return $resource(fetch_vehicle_url+'/vehicle'+'?offset='+offset+'&limit='+limit,{},{
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

    factory.createVehicleEntry = function(){
        return $resource(fetch_vehicle_url+'/vehicle',{},{
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


    factory.editVehicleEntry = function(vehicleId){
        return $resource(fetch_vehicle_url+'/vehicle'+'/'+vehicleId+'/update',{},{
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

    factory.deleteVehicle = function (vehicleId) {
        // branch/BRANCH0001/vehicle/VEHICLE001/deactivate
        return $resource(fetch_vehicle_url+'/vehicle/'+vehicleId+'/deactivate',{}, {
            remove: {
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
    };

    return factory;
}]);
branchOperator.controller('op_vehicleManagementCtrl', ['$scope','vehicleFactory','$state','$filter','$modal',function($scope,vehicleFactory,$state,$filter,$modal) {

    var initials = {
        vehicleId: "", vehicleType:"",vehicleRegNo:"",vehicleModel:"",yearOfManufacter:"",insuranceRenewal:"",nextRenewalDate:""
        ,seatCapacity:"",routeName:""
    };

    $scope.vehicleDetails = {
        vehicleList: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.aDate = '2015-10-31';
    $scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
    }

    $scope.fetchVehicleList = function(offset,limit){
        $scope.response_msg1 = "";
        vehicleFactory.fetchVehicleList(offset,limit).fetch({},function(response){
            $scope.vehicle_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.vehicles!=undefined){
                    var _data = angular.fromJson(response.data.vehicles);
                    $scope.vehicle_list = _data;
                    $scope.totalPages = Math.ceil($scope.count/$scope.vehicleDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.vehicle_list.length);
                }
            }

        },function(response){
            $scope.vehicle_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };


    // Check Below for Current Name
    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "vehicle" && $scope.vehicle_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.vehicle_list.length);
        }
    });

    $scope.addVehicle = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };

    $scope.createVehicleEntry = function () {
        var add = $scope.add;

        $scope.add.insuranceRenewal.Value = $filter('date')(new Date(add.insuranceRenewal),'yyyy-MM-dd');
        $scope.add.nextRenewalDate.Value = $filter('date')(new Date(add.nextRenewalDate),'yyyy-MM-dd');
        $scope.add.dateOfPurchase = $filter('date')(new Date(add.dateOfPurchase),'yyyy-MM-dd');

        var body = ' { ' +
            '"vehicleType":"' + add.vehicleType + '",' +
            '"vehicleRegNo" :"' + add.vehicleRegNo + '",'+
            '"vehicleModel" :"'+ add.vehicleModel + '",'+
            '"seatCapacity" :"'+ add.seatCapacity + '",'+
            '"dateOfPurchase" :"'+ $scope.add.dateOfPurchase + '",'+
            '"yearOfManufacter" :"' + add.yearOfManufacter + '",'+
            '"insuranceRenewal" :"' +  $scope.add.insuranceRenewal.Value + '",'+
            '"nextRenewalDate" :"' + $scope.add.nextRenewalDate.Value + '"}';

        var response = vehicleFactory.createVehicleEntry();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                // $scope.fetchVehicleList(0,$scope.vehicleDetails.numPerPage);
            }
            $scope.response_msg = "Vehicle added successfully !!!";
        },function(response){
            if(response.status == 409){
                // Check for status Code and variable below
                $scope.add.vehicle = "";
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of Vehicle is unsuccessful !!!";
        });
    };
//*************** Update Vehicle **********************

    $scope.editVehicle = function (vehicleId) {
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.vehicle_list, function (vehicle) {
            console.log("vehicle: "+vehicle.vehicleId);
            if (vehicleId == vehicle.vehicleId) {
                $scope.edit.vehicleId = vehicle.vehicleId;
                $scope.edit.vehicleType = vehicle.vehicleType;
                $scope.edit.vehicleRegNo = vehicle.vehicleRegNo;
                $scope.edit.seatCapacity = vehicle.seatCapacity;
                $scope.edit.vehicleModel = vehicle.vehicleModel;
                $scope.edit.yearOfManufacter = vehicle.yearOfManufacter;
                $scope.edit.insuranceRenewal = new Date(vehicle.insuranceRenewal);
                $scope.edit.nextRenewalDate = new Date(vehicle.nextRenewalDate);
                $scope.edit.dateOfPurchase = new Date(vehicle.dateOfPurchase);
            }
        });
    };

    $scope.editVehicleEntry = function (vehicleId) {
        var edit = $scope.edit;
        $scope.edit.insuranceRenewal.Value = $filter('date')(new Date(edit.insuranceRenewal),'yyyy-MM-dd');
        $scope.edit.nextRenewalDate.Value = $filter('date')(new Date(edit.nextRenewalDate),'yyyy-MM-dd');
        $scope.dateOfPurchase = $filter('date')(new Date(edit.dateOfPurchase),'yyyy-MM-dd');
        var body = ' { ' +
            '"vehicleType":"' + edit.vehicleType + '",' +
            '"vehicleRegNo" :"' + edit.vehicleRegNo + '",'+
            '"vehicleModel" :"'+ edit.vehicleModel + '",'+
            '"seatCapacity" :"'+ edit.seatCapacity + '",'+
            '"dateOfPurchase" :"'+ $scope.dateOfPurchase + '",'+
            '"yearOfManufacter" :"' + edit.yearOfManufacter + '",'+
            '"insuranceRenewal" :"' + $scope.edit.insuranceRenewal.Value + '",'+
            '"nextRenewalDate" :"' + $scope.edit.nextRenewalDate.Value + '"}';
        var vehicle = window.btoa(vehicleId);
        var response = vehicleFactory.editVehicleEntry(vehicle);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200){
                $state.go('^.list');
                // $scope.fetchVehicleList(0,$scope.vehicleDetails.numPerPage);
            }
            $scope.response_msg = "Vehicle Details Updated successfully !!!";
        },function(response){
            if(response.status == 409){
                // Check for status Code and variable below
                $scope.edit.vehicle = "";
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Vehicle details is unsuccessful !!!";
        });
    };

    // delete vehicle
    $scope.deleteVehicle = function(vehicle,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var vehicle = window.btoa(vehicle.vehicleId);
        console.log("inside delete function !!");

        var dialogue_message = "Are you sure to delete the Vehicle ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){
                console.log(vehicle.vehicleId);
                vehicleFactory.deleteVehicle(vehicle).remove({},function(response){
                    if(response.status == 200){
                        $scope.fetchVehicleList(0,$scope.vehicleDetails.numPerPage);
                        console.log("deleted")
                    }
                    $scope.response_msg = "Vehicle deleted successfully !!!";
                },function(response){
                   if(response.status == 404){
                       $scope.response_msg = response.data.errorMessage;
                   }else{
                       $scope.response_msg = "vehicle Deletion failed !!!";
                       console.log(response.status);
                   }
                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };


    $scope.init = function(){
        $scope.vehicleDetails.numPerPage = parseInt($scope.vehicleDetails.numPerPage);
        $scope.maxSize = 5;
        $scope.fetchVehicleList(0,$scope.vehicleDetails.numPerPage);
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

    $scope.init();

    $scope.pageChanged = function(){
        $scope.vehicleDetails.startValue = (($scope.vehicleDetails.currentPage - 1) * $scope.vehicleDetails.numPerPage);
        $scope.fetchVehicleList($scope.vehicleDetails.startValue,$scope.vehicleDetails.numPerPage);
    };

}]);


