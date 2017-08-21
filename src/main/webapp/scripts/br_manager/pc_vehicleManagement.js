/**
  Created by uidr1063 on 1/10/2016.
 */

branchManager.factory('vehicleManagementFactory',['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
    var factory = {};
    var fetch_vehicle_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");



    factory.fetchVehiclePdfReport = function(){
            return $resource(fetch_vehicle_url+'/vehicle/reports',{},{
                fetch : {
                    method:'get',
                    responseType: 'arraybuffer',
                    headers : { 'Authorization' : authCode },
                    interceptor : {
                        response : function(data){
                            console.log("Report Generated for Vehicle !!!");
                            return data;
                        }
                    }
                }
            });
    };

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
    // http://localhost:8080/Eshiksha/org/345345/branch/45345343/vehicle/vehicleRoute
    factory.postRoute = function(){
        return $resource(fetch_vehicle_url+'/vehicle/vehicleRoute',{},{
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

    factory.RouteForVehicle = function(){
        return $resource(fetch_vehicle_url+'/vehicle/vehicleroutenumber',{},{
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

    factory.listRoutes = function(){
        return $resource(fetch_vehicle_url+'/vehicle/vehicleRoute',{},{
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

    // http://localhost:8080/Eshiksha/org/55555/branch/555555/vehicle/5555555/nonteachingstaffs
    factory.listVehicleStaff = function(vehicle){
        return $resource(fetch_vehicle_url+'/vehicle/'+vehicle+'/nonteachingstaffs',{},{
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

    factory.studendsForVehicle = function(routeId){
        return $resource(fetch_vehicle_url+'/vehicle/reports/routeName/'+routeId,{},{
            fetch: {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor: {
                    response: function (data) {
                        return data;
                    }
                }
            }
        });
    };

    factory.postBoardingPoints = function(){
        return $resource(fetch_vehicle_url+'/vehicle/boardingpoints',{},{
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

    factory.assignRouteVehicle = function(vehicle){
        return $resource(fetch_vehicle_url+'/vehicle/'+vehicle+'//vehicleRoute',{},{
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
    factory.fetchNonteachingFaculty = function(role){
        return $resource(fetch_vehicle_url+'/role/'+role+'/nonteachingstaff',{},{
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

    factory.postVehicleStaff = function(vehicle, staff){
        return $resource(fetch_vehicle_url+'/vehicale/'+vehicle+'/nonteachingstaff/'+staff,{},{
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

    factory.updateRoutes = function () {
        return $resource(fetch_vehicle_url+'/vehicle/boardingpoint',{},{
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

    factory.vehicleRouteDetails = function(vehicle){
        return $resource(fetch_vehicle_url+'/vehicle/'+vehicle+'/boardingpoint',{},{
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
branchManager.controller('vehicleManagementCtrl', ['$scope','vehicleManagementFactory','br_manager_appConfig','$state','$filter','$modal',function($scope,vehicleManagementFactory,br_manager_appConfig,$state,$filter,$modal) {

    var initials = {
        vehicleId: "", vehicleType:"",vehicleRegNo:"",vehicleModel:"",yearOfManufacter:"",insuranceRenewal:"",nextRenewalDate:""
        ,seatCapacity:"",routeName:"",routeNumber:"",startingPoint:"",name:"",endingPoint:""
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
        //$scope.response_msg = "";
        $scope.response_msg1 = "";
        vehicleManagementFactory.fetchVehicleList(offset,limit).fetch({},function(response){
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

    $scope.vehicleRouteDetails = function (vehicle, index) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var vehicle = window.btoa(vehicle.vehicleId);
        vehicleManagementFactory.vehicleRouteDetails(vehicle).fetch({},function(response){
            $scope.vehicle_route_details =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.vehicle_route_details = _data;
                    $scope.point_boarding = $scope.vehicle_route_details.boardingPoints;
                    $scope.staff_details = $scope.vehicle_route_details.nonTeachStaffs;

                    console.log($scope.point_boarding);
                    console.log($scope.staff_details);

                }
            }
        },function(response){
            $scope.vehicle_route_details = [];
            console.log(response.status);
        });
    };

    $scope.listVehicleStaff = function (vehicle, index) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var vehicle = window.btoa(vehicle.vehicleId);
        vehicleManagementFactory.listVehicleStaff(vehicle).fetch({},function(response){
            $scope.staff_details =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.nonTeachStaffs!=undefined){
                    var _data = angular.fromJson(response.data.nonTeachStaffs);
                    $scope.staff_details = _data;
                    //$scope.staff_details = $scope.vehicle_staff;
                    console.log($scope.staff_details);

                }
            }
        },function(response){
            $scope.staff_details = [];
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
        $scope.add.dateOfPurchase.Value = $filter('date')(new Date(add.dateOfPurchase),'yyyy-MM-dd');
        $scope.add.insuranceRenewal.Value = $filter('date')(new Date(add.insuranceRenewal),'yyyy-MM-dd');
        $scope.add.nextRenewalDate.Value = $filter('date')(new Date(add.nextRenewalDate),'yyyy-MM-dd');

        var body = ' { ' +
            '"vehicleType":"' + add.vehicleType + '",' +
            '"vehicleRegNo" :"' + add.vehicleRegNo + '",'+
            '"vehicleModel" :"'+ add.vehicleModel + '",'+
            '"seatCapacity" :"'+ add.seatCapacity + '",'+
            '"yearOfManufacter" :"' + add.yearOfManufacter + '",'+
            '"dateOfPurchase" :"' + $scope.add.dateOfPurchase.Value + '",'+
            '"insuranceRenewal" :"' +  $scope.add.insuranceRenewal.Value + '",'+
            '"nextRenewalDate" :"' + $scope.add.nextRenewalDate.Value + '"}';
   
        var response = vehicleManagementFactory.createVehicleEntry();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                 $state.go('^.list');
            	// $scope.fetchVehicleList(0,$scope.vehicleDetails.numPerPage);
            }
            $scope.response_msg = "Vehicle added successfully !!!";
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of Vehicle is unsuccessful !!!";
        });
    };

//*************** Update Vehicle **********************

    $scope.editVehicle = function (vehicle) {
        $scope.obj = vehicle;
        $scope.response_msg = "";
    };

    $scope.editVehicleEntry = function () {
        //var edit = $scope.edit;

        $scope.dateOfPurchase = $filter('date')(new Date($scope.obj.dateOfPurchase),'yyyy-MM-dd');
        $scope.insuranceRenewal = $filter('date')(new Date($scope.obj.insuranceRenewal),'yyyy-MM-dd');
        $scope.nextRenewalDate = $filter('date')(new Date($scope.obj.nextRenewalDate),'yyyy-MM-dd');
        var body = ' { ' +
            '"vehicleType":"' + $scope.obj.vehicleType + '",' +
            '"vehicleRegNo" :"' + $scope.obj.vehicleRegNo + '",'+
            '"vehicleModel" :"'+ $scope.obj.vehicleModel + '",'+
            '"seatCapacity" :"'+ $scope.obj.seatCapacity + '",'+
            '"yearOfManufacter" :"' + $scope.obj.yearOfManufacter + '",'+
            '"dateOfPurchase" :"' + $scope.dateOfPurchase + '",'+
            '"insuranceRenewal" :"' + $scope.insuranceRenewal + '",'+
            '"nextRenewalDate" :"' + $scope.nextRenewalDate + '"}';
        var vehicle = window.btoa($scope.obj.vehicleId);
        var response = vehicleManagementFactory.editVehicleEntry(vehicle);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                $scope.response_msg = "Vehicle Details Updated successfully !!!";
                // $scope.fetchVehicleList(0,$scope.vehicleDetails.numPerPage);
            }
        },function(response){
            if(response.status == 404){
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
        var dialogue_message = "Are you sure to delete the Vehicle ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                vehicleManagementFactory.deleteVehicle(vehicle).remove({},function(response){
                 if(response.status == 200 || response.status == 201){
                      $scope.fetchVehicleList(0,$scope.vehicleDetails.numPerPage);
                 }
                    $scope.response_msg = "Vehicle deleted successfully !!!";
                 },function(response){
                    if(response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg1= "Deletion of Vehicle details is unsuccessful !!!";
                 });
            }
            else {
                alert("Failed to delete");
            }
        });
    };

    $scope.listRoutes = function(){
        $scope.response_msg1 = "";
        //$scope.response_msg = "";
        vehicleManagementFactory.listRoutes().fetch({},function(response){
            $scope.route_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.vehicleRoutes!=undefined){
                    var _data = angular.fromJson(response.data.vehicleRoutes);
                    $scope.route_list = _data;
                }
            }

        },function(response){
            $scope.route_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };
    $scope.viewRoutes = function (route, index) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.boarding_details = route.boardingPoints;
    };

    $scope.addRoutes = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        $scope.boardingPoints = [];

        $scope.addNew = function() {
            var newItem = $scope.boardingPoints.length+1;
            $scope.boardingPoints.push({'id':'id'+newItem});
        };
        $scope.remove = function() {
            var lastMode = $scope.boardingPoints.length-1;
            $scope.boardingPoints.splice(lastMode);
        };
    };

    $scope.postRoute = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var add = $scope.add;
        $scope.boardingPoints.forEach(function(v){
            delete v.id;
        });
        var body = {
            "name": add.name,
            "routeNumber": add.routeNumber,
            "startingPoint": add.startingPoint,
            "endingPoint": add.endingPoint,
            "boardingPoints": $scope.boardingPoints
        };
        var response = vehicleManagementFactory.postRoute();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.route');
                 $scope.listRoutes();
            }
            $scope.response_msg = "Route Posted successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Posting Route is unsuccessful !!!";
        });
    };

    $scope.AddNewRoutes = function (route, index) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.boardingPoints = [{id: 'id1'}];
        $scope.veicleRouteId = route.vehicleRouteId;
        $scope.addMore = function() {
            var newItem = $scope.boardingPoints.length+1;
            $scope.boardingPoints.push({'id':'id'+newItem});
        };
        $scope.removeOne = function() {
            var lastMode = $scope.boardingPoints.length-1;
            $scope.boardingPoints.splice(lastMode);
        };
    };

    $scope.postBoardingPoints = function () {
        $scope.boardingPoints.forEach(function(v){
            delete v.id;
        });
        var body = {
            "veicleRouteId":  $scope.veicleRouteId,
            "boardingPoints": $scope.boardingPoints
        };
        var response = vehicleManagementFactory.postBoardingPoints();
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.route');
                $scope.listRoutes();
            }
            $scope.response_msg = "Boarding Point Posted successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Posting Boarding Point is unsuccessful !!!";
        });
    };

    $scope.assignRoute = function (vehicle, index) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.id = vehicle.vehicleId;
        $scope.listRoutes();

    };
    $scope.assignRouteVehicle = function (route) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var vehicle = window.btoa($scope.id);
        var body = {
           "id": route.vehicleRouteId
        };
        var response = vehicleManagementFactory.assignRouteVehicle(vehicle);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                $scope.fetchVehicleList(0,$scope.vehicleDetails.numPerPage);
            }
            $scope.response_msg = "Route Assigned successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Assigning Route is unsuccessful !!!";
        });
    };

    $scope.fetchNonteachingFaculty = function (role) {
        $scope.response_msg1 = "";
        var role = window.btoa(role);
        vehicleManagementFactory.fetchNonteachingFaculty(role).fetch({},function(response){
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

    $scope.assignDriver = function (vehicle, index) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.id = vehicle.vehicleId;
    };
    $scope.postVehicleStaff = function (staff) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var staff = window.btoa(staff.nonTeachStaffUserId);
        var vehicle = window.btoa($scope.id);
        vehicleManagementFactory.postVehicleStaff(vehicle, staff).fetch({},function(response){
            if(response.status == 200){
                $state.go('^.list');
                $scope.fetchVehicleList(0,$scope.vehicleDetails.numPerPage);
            }
            $scope.response_msg = "Assigning is successful !!!";
        },function(response){
           $scope.response_msg1 = "Assigning is unsuccessful !!!";
        });
    };

    $scope.editRoutes = function (route, index) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.obj = route;
        $scope.points = $scope.obj.boardingPoints;
    };
    $scope.updateRoutes = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var body = {
            "vehicleRouteId": $scope.obj.vehicleRouteId,
            "name": $scope.obj.name,
            "routeNumber": $scope.obj.routeNumber,
            "startingPoint": $scope.obj.startingPoint,
            "endingPoint": $scope.obj.endingPoint,
            "boardingPoints": $scope.points
        };
        var response = vehicleManagementFactory.updateRoutes();
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.route');
                $scope.listRoutes();
            }
            $scope.response_msg = "Route Updated successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updating Route is unsuccessful !!!";
        });
    };

    $scope.init = function(){
        $scope.point_boarding = [];
        $scope.staff_details = [];
        $scope.vehicleDetails.numPerPage = parseInt($scope.vehicleDetails.numPerPage);
        $scope.maxSize = 5;
        $scope.fetchVehicleList(0,$scope.vehicleDetails.numPerPage);
        $scope.listRoutes();
        $scope.role_list = ["Driver", "Helper"];
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.point_boarding = [];
        $scope.staff_details = [];
        $state.go('^.list');
    };

    $scope.init();

    $scope.pageChanged = function(){
        $scope.vehicleDetails.startValue = (($scope.vehicleDetails.currentPage - 1) * $scope.vehicleDetails.numPerPage);
        $scope.fetchVehicleList($scope.vehicleDetails.startValue,$scope.vehicleDetails.numPerPage);
    };

}]);


branchManager.controller('vehicleReportsCtrl',['$scope','vehicleManagementFactory','$state',function($scope,vehicleManagementFactory,$state){

    $scope.vehicleReport = function(){
        $scope.generateVehicleReport();
    };
    $scope.generateVehicleReport = function(){
        vehicleManagementFactory.fetchVehiclePdfReport().fetch({},function(response){
            $scope.success = false;
            if(response.status = 200){
                if(response.data.byteLength>0){
                    $scope.success = true;
                    var file = new Blob([response.data], { type: 'application/pdf' });
                    $scope.file = file;
                    $scope.fileURL = URL.createObjectURL(file);
                    $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                }else{
                    console.log("Content length = " + response.data.byteLength);
                }
            }
        },function(response){
            console.log("Error Unable to download the page");
        });

    };

    $scope.RouteForVehicle = function(){
        $scope.response_msg = "";
        vehicleManagementFactory.RouteForVehicle().fetch({},function(response){
            $scope.route_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.routes!=undefined){
                    var _data = angular.fromJson(response.data.routes);
                    $scope.route_list = _data;
                }
            }
        },function(response){
            $scope.route_list = [];
            console.log(response.status);
        });
    };

    $scope.studendsForVehicle = function(route){
        if( vehicle == undefined ){
            window.alert("Please select the Route Name");
        }
        else {
            var routeId = window.btoa(route.vehicaleRouteId);
            vehicleManagementFactory.studendsForVehicle(routeId).fetch({}, function (response) {
                $scope.success = false;
                if (response.status == 200 || response.status == 201) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        $scope.file = file;
                        $scope.fileURL = URL.createObjectURL(file);
                        $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                    } else {
                        console.log("content length = " + response.data.byteLength);
                    }
                }
            }, function (response) {
                console.log("Error Unable to download the page");
            });
        }
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
        saveAs($scope.file, 'Vehicle Report' + '.pdf');
    };

    $scope.downloadStudentPdf = function(){
        //window.open($scope.fileURL);
        saveAs($scope.file, 'Students for vehicle Report' + '.pdf');
    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('vehiclereports.main');
    };

}]);