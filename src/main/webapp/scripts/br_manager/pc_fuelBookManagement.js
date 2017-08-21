branchManager.factory('fuelbookManagementFactory',['$resource', 'br_Manager_Config','$window',function($resource, br_Manager_Config,$window){
    var factory = {};
    var fetch_fuelbook_url = br_Manager_Config.getMainAPI();

    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchFuelbookTime = function(currentVehicle,offset,limit){
        // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANHCH001/vehicle/V0000001/fuelbook/fetch
        return $resource(fetch_fuelbook_url+'/vehicle/'+currentVehicle+'/fuelbook/fetch'+'?offset='+offset+'&limit='+limit,{},{
            retrieve: {
                method: 'POST',
                isArray: false,
                headers: {'Authorization' : authCode,
                        'Content-Type': 'application/json'},
                interceptor: {
                    response: function (data) {
                        console.log("data fetched from database");
                        return data;
                    }
                }
            }
        });
    };

    factory.fetchVehicleList = function(offset,limit){
        return $resource(fetch_fuelbook_url+'/vehicle'+'?offset='+offset+'&limit='+limit,{},{
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

    factory.createFuelbookEntry = function(vehicleId){
        // BRANCH0001/vehicle/V0000001/fuelbook
        return $resource(fetch_fuelbook_url+'/vehicle/'+vehicleId+'/fuelbook',{},{
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

    factory.deleteFuelbookEntry = function(vehicleId, kmsReading,date) {
        //vehicle/V0000001/fuelbook/date/2016-04-03/kms/123/dectivate
        return $resource(fetch_fuelbook_url+'/vehicle/'+'/'+vehicleId+'/fuelbook/date/'+date+'/kms/'+kmsReading+'/dectivate',{}, {
            remove:{
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

    factory.fetchNonteachingFaculty = function(role){
        return $resource(fetch_fuelbook_url+'/role/'+role+'/nonteachingstaff',{},{
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
branchManager.controller('fuelbookManagementCtrl', ['$scope','fuelbookManagementFactory','br_manager_appConfig','$state','$filter','$modal',function($scope,fuelbookManagementFactory,br_manager_appConfig,$state,$filter,$modal) {

    var initials = {
        driverName:"",
        date:"",
        kmsReading:"",
        costOfFuel:"",
        typeOfFuel:"",
        startTime:"",
        endTime:"",
        fuelbookId: ""
    };

    $scope.aDate = '2015-10-31';
    $scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
    }

    $scope.fetchNonteachingFaculty = function (role) {
        $scope.response_msg1 = "";
        var role = window.btoa(role);
        fuelbookManagementFactory.fetchNonteachingFaculty(role).fetch({},function(response){
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

    $scope.fetchVehicleList = function(offset,limit){
        $scope.response_msg1 = "";
        fuelbookManagementFactory.fetchVehicleList(offset,limit).fetch({},function(response){
            $scope.vehicle_list =[];
            $scope.fuelbook_lists =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                $scope.count = response.data.total;
                if(response.data.vehicles!=undefined){
                    var _data = angular.fromJson(response.data.vehicles);
                    $scope.vehicle_list = _data;
                }
            }

        },function(response){
            $scope.vehicle_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.fuelbookDetails = {
        fuelBookLists: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.fetchFuelbookTime = function(currentVehicle, startDate, endDate,offset,limit) {
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var startTime = $filter('date')(new Date(startDate),'yyyy-MM-dd');
        var endTime = $filter('date')(new Date(endDate),'yyyy-MM-dd');
        var body = ' { ' +
            '"startTime":"' + startTime + '",' +
            '"endTime" :"' + endTime + '"}';
        var vehicle = window.btoa(currentVehicle.vehicleId);
        var response = fuelbookManagementFactory.fetchFuelbookTime(vehicle,offset,limit);
        var data = response.retrieve({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.count = response.data.total;
                console.log($scope.count);
                if(response.data.fuelBookLists!=undefined){
                    var _data = angular.fromJson(response.data.fuelBookLists);
                    $scope.fuelbook_lists = _data;
                    $scope.$parent.setBaseContentHeight($scope.fuelbook_lists.length);
                }
            }
        },function(response){
            if(response.status == 409){
                $scope.fuelbook_lists = [];
                $scope.$parent.setBaseContentHeight(-1);
                console.log(response.status);
                //$scope.response_msg1 = response.data.errorMessage;
            }
            else{
                $scope.fuelbook_lists = [];
                console.log(response.status);
            }
        });
    };

    // Check Below for Current Name
    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "fuelbook" && $scope.fuelbook_lists != undefined){
            $scope.$parent.setBaseContentHeight($scope.fuelbook_lists.length);
        }
    });


    $scope.fuel_type = ["Petrol","Diesel","Gasoline"];
    $scope.addFuelbookEntry = function(){
        $scope.response_msg = "";
        $scope.add = angular.copy(initials);
        //$scope.fetchNonteachingFaculty("Driver");
        console.log("Inside addFuelbookEntry");
    };


    $scope.createFuelbookEntry = function (currentVehicle) {
        var add = $scope.add;
        $scope.add.date.Value = $filter('date')(new Date(add.date),'yyyy-MM-dd');

        console.log("add object contains: "+ $scope.add);
        var body = ' { ' +
            '"driverName":"' + add.driverName + '",' +
            '"date" :"' + $scope.add.date.Value + '",'+
            '"kmsReading" :"' + add.kmsReading + '",'+
            '"costOfFuel" :"' + add.costOfFuel + '",'+
            '"typeOfFuel" :"'+add.typeOfFuel+'"}';
        var vehicle = window.btoa(currentVehicle.vehicleId);

        var response = fuelbookManagementFactory.createFuelbookEntry(vehicle);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                //$scope.fetchVehicleList(0,$scope.vehicleDetails.numPerPage);
            }
            $scope.response_msg = "Fuel Book Entry added successfully !!!";
        },function(response){
            if(response.status == 409){
                $scope.add.inventoryType = "";
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of Fuel Book Entry is unsuccessful !!!";
        });
    };

//********************* Update Fuelbook *********************

    $scope.editFuelbook = function (date) {
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.fuelbook_lists, function (fuelbook) {
            if (angular.equals(date, fuelbook.date)) {
                $scope.edit.vehicleId = fuelbook.vehicleId;
                $scope.edit.driverName = fuelbook.driverName;
                $scope.edit.date = new Date(fuelbook.date);
                $scope.edit.kmsReading = fuelbook.kmsReading;
                $scope.edit.costOfFuel = fuelbook.costOfFuel;
                $scope.edit.typeOfFuel = fuelbook.typeOfFuel;
            }
        });
    };

  /*  $scope.updateFuelBook = function (vehicleId)
    {
        var edit = $scope.edit;
        console.log(edit.driverName);
        console.log(edit.costOfFuel);
        console.log(edit.kmsReading);
        console.log(edit.typeOfFuel);
        console.log(edit.vehicleId);

        $scope.edit.date.Value = $filter('date')(new Date(edit.date),'yyyy-MM-dd');
        console.log($scope.edit.date.Value);
        var body = ' { ' +
            '"driverName":"' + edit.driverName + '",' +
            '"date" :"' + $scope.edit.date.Value + '",'+
            '"kmsReading" :"' + edit.kmsReading + '",'+
            '"costOfFuel" :"' + edit.costOfFuel + '",'+
            '"vehicleId" :"' + edit.vehicleId + '",'+
            '"typeOfFuel" :"'+edit.typeOfFuel+'"}';

        var vehicle = window.btoa(vehicleId);
        var response = fuelbookManagementFactory.updateFuelBook(vehicle);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchVehicleList(0,$scope.vehicleDetails.numPerPage);
            }
            $state.go('^.list');
            $scope.response_msg = "Fuel Book Entry updated successfully !!!";
        },function(response){
            if(response.status == 409){
                //$scope.add.inventoryType = "";
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Fuel Book Entry is unsuccessful !!!";
        });
    };

*/

    $scope.deleteFuelbookEntry = function(fuelbook,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        console.log("inside delete function !!");

        var dialogue_message = "Are you sure to delete the entry ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value: "+ flag);
            if(flag){

                console.log(fuelbook.vehicleId);
                 var value = $filter('date')(new Date(fuelbook.date),'yyyy-MM-dd');
                console.log(value);
                console.log(fuelbook.vehicleId);
                console.log(fuelbook.kmsReading);
                var date = window.btoa(value);
                var vehicleId = window.btoa(fuelbook.vehicleId);
                var kmsReading = window.btoa(fuelbook.kmsReading);

                fuelbookManagementFactory.deleteFuelbookEntry(vehicleId,kmsReading,date).remove({},function(response){
                    if(response.status == 200 || response.status == 201){
                        $scope.fetchVehicleList(0,100);
                        $scope.response_msg = "Fuelbook Entry  Deletion Successfull !!!";
                    }
                   // $state.go('^.list');
                },function(response){
                    $scope.response_msg = "Fuelbook Entry  Deletion failed !!!";
                    console.log(response.status);
                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "vehicle" && $scope.vehicle_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.vehicle_list.length);
        }
    });

    $scope.init = function() {
       $scope.fuelbookDetails.numPerPage = parseInt($scope.fuelbookDetails.numPerPage);
       $scope.maxSize = 5;
       $scope.fuelbook_lists =[];
      // $scope.fetchVehicleList(0,$scope.vehicleDetails.numPerPage);
    };

    $scope.onChanged = function(){
      $scope.fuelbook_lists = [];
        $scope.startDate = '';
        $scope.endDate = '';
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };
    
    $scope.init();

    $scope.pageChanged = function(currentVehicle, startDate, endDate){
        $scope.fuelbookDetails.startValue = (($scope.fuelbookDetails.currentPage - 1) * $scope.fuelbookDetails.numPerPage);
        $scope.fetchFuelbookTime(currentVehicle, startDate, endDate, $scope.fuelbookDetails.startValue,$scope.fuelbookDetails.numPerPage);
    };

}]);