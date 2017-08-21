var branchOperator_login = angular.module('branchOperator_login',['blockUI','config_app','ngRoute','ngResource']);

branchOperator_login.config(['$locationProvider','blockUIConfig',function($locationProvider,blockUIConfig) {
    $locationProvider.html5Mode({enabled:true,requireBase:true});
    blockUIConfig.message =  "Logging In ...";
}]);

branchOperator_login.factory('br_operator_loginFactory', ['$resource','br_Operator_Config',function($resource,br_Operator_Config){
    var factory = {};
    var login_url = br_Operator_Config.getLoginApi();

    factory.getLogin = function(type){
        return $resource(login_url+'/'+type+'/branchOperatorLogin',{},{
            login:{
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                interceptor: {
                    response : function(data){
                        return data;
                    }
                }
            }
        });
    };

    return factory;
}]);

branchOperator_login.controller('bo_loginCtrl',['$scope','br_operator_loginFactory','$window',function($scope,br_operator_loginFactory,$window){

    $scope.username = '';
    $scope.password = '';

    $scope.login = function(){
        var body = '{"userName":"'+$scope.username+'","password":"'+$scope.password+'"}';
        var response = br_operator_loginFactory.getLogin($scope.login_as).login({},body,function(response){
            if(response.status == 200){
                var data = response.data;
                $window.sessionStorage.setItem('orgId',data.orgId);
                $window.sessionStorage.setItem('userId',data.userId);
                $window.sessionStorage.setItem('branchId',data.branchId);
                $window.localStorage.setItem('authCode', data.authCode);
                $window.localStorage.setItem('operatorName', data.operatorName);
                console.log(response);
                $window.location = 'br_operator_main.html';
            }
        },function(response){
            console.log(response);
            if(response.status == 0){
                $window.location = 'system_error.html';
            }else {
                $scope.$parent.$parent.response_message = response.data;
            }
        });
    };

    $scope.clearErrorMsg = function(){
        $scope.$parent.$parent.response_message = "";
    }

}]);

function error(response){
    console.log(response.status);
}
var branchOperator = angular.module('branchOperator',['blockUI','slimScrollDirective','highcharts-ng','angularUtils.directives.dirPagination','config_app','ui.bootstrap','branchOperator_login',"checklist-model",'ui.router']);

branchOperator.factory('branchOperatorFactory',['$resource','br_Operator_Config', '$window',function($resource,br_Operator_Config, $window){
    var factory = {};
    var baseUrl = br_Operator_Config.getBaseUrl();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchBranchInfo = function(){
        return $resource(baseUrl,{},{
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

branchOperator.run([function () {
    $(function () {
        $(document).keydown(function (e) {
            if((e.which || e.keyCode) == 116 || (e.keyCode == 82 && e.ctrlKey)){
                e.preventDefault();
                /*var path = $state.current.name;
                 var subpath = path.split(".");
                 if(subpath.length > 1) {
                 if (subpath[1] == 'list')
                 $state.reload();
                 }else
                 $state.reload();*/
            }else {
                return (e.which || e.keyCode) != 116;
            }
        });
    });
}]);

branchOperator.controller('br_op_mainCtrl',['$scope','$location','br_Operator_Config','$window',function($scope,$location,br_Operator_Config,$window) {
    var flag = br_Operator_Config.setConfig();

    if(flag)
        _init();
    else {
        $window.location = 'index.html';
        $scope.$parent.response_message = 'Please try after some time';
    }
    function _init(){
        $location.path('/dash');
    }
}]);

branchOperator.controller('br_op_companyCtrl',['$scope','branchOperatorFactory','$state','$window','$timeout',function($scope,branchOperatorFactory,$state,$window,$timeout){

    var company = branchOperatorFactory.fetchBranchInfo().fetch({},function(response){
        var userName = $window.localStorage.getItem('operatorName');
        $scope.todaydate = new Date();
        if(response.status == 200) {
            var _data = angular.fromJson(response.data);
            var branch_info = {
                "orgName": _data.orgName,
                "address": _data.address,
                "branchName": _data.branchName,
                "pincode": _data.pincode,
                "branchId": _data.branchId,
                "userName": userName

            };

            $scope.$parent.logo_image = "images/loading5.jpg";

            $scope.$parent.orgName = branch_info.orgName;
            $scope.$parent.branchId = branch_info.branchId;
            $scope.$parent.branchName = branch_info.branchName;
            $scope.$parent.address = branch_info.address;
            $scope.$parent.pincode = branch_info.pincode;
            $scope.$parent.userName = branch_info.userName;
            $state.go('dash');
        }
    },error);

    $scope.setBaseContentHeight = function(id,length,height,minlength){
        if(length > minlength){
            $('#'+id).slimScroll({
                height: height,
                alwaysVisible: false,
                size: "3px"
            }).css("width", "100%");
            $('.table-base .slimScrollDiv').css('min-width','660px');
        }else{
            $('#'+id).slimScroll({
                destroy:true
            });
        }
    };

    $state.go('dash');
}]);

branchOperator.config(['$stateProvider','$urlRouterProvider','$routeProvider','$locationProvider','blockUIConfig',function($stateProvider,$urlRouterProvider,$routeProvider, $locationProvider,blockUIConfig) {
    /*$httpProvider.defaults.useXDomain = true;
     delete $httpProvider.defaults.headers.common['X-Requested-With'];*/

    $urlRouterProvider.otherwise("/#");

    $stateProvider
        .state('dash', {
            url: "/dash",
            templateUrl: 'views/br_operator/br_op_dashboard.html',
            controller:'dashboardController'
        })

        .state('pass',{
            url: "/pass",
            templateUrl: 'views/br_operator/br_op_changePassword.html',
            controller: 'operatorPasswordCtrl'
        })
        .state('vehicle',{
            abstract: true,
            url: "/vehicle",
            template: '<div ui-view style="height:100%"></div>',
            controller: 'op_vehicleManagementCtrl'
         })
        .state('vehicle.list',{
            url: "",
            templateUrl:'views/br_operator/br_op_vehicleManagement.html'
        })
        .state('vehicle.add',{
            url: "",
            templateUrl:'views/br_operator/br_op_addVehicle.html'
        })
        .state('vehicle.edit',{
            url: "",
            templateUrl:'views/br_operator/br_op_editVehicle.html'
        })

        .state('inventory', {
            abstract:true,
            url: "/inventory",
            template: '<div ui-view style="height:100%"></div>',
            controller:'op_inventoryManagementCtrl'
        })
        .state('inventory.list', {
            url: "",
            templateUrl: 'views/br_operator/br_op_inventoryManagemnt.html'
        })
        .state('inventory.edit', {
            url: "",
            templateUrl: 'views/br_operator/br_op_editInventory.html'
        })
        .state('inventory.add', {
            url: "",
            templateUrl: 'views/br_operator/br_op_addInventory.html'
        })

        .state('library', {
            abstract:true,
            url:"/library",
            template: '<div ui-view style ="height:100%"></div>',
            controller: 'libraryManagementController'
        })
        .state('library.assign', {
            url: "",
            templateUrl: 'views/br_operator/br_op_libraryBookAssign.html'
        })
        .state('library.list', {
            url: "",
            templateUrl: 'views/br_operator/br_op_libraryManagement.html'
        })
        .state('library.add', {
            url: "",
            templateUrl: 'views/br_operator/br_op_addLibraryBook.html'
        })
        .state('library.edit', {
            url: "",
            templateUrl: 'views/br_operator/br_op_editLibraryBook.html'
        })
        .state('library.ret', {
            url: "",
            templateUrl: 'views/br_operator/br_op_libraryBookUnissue.html'
        })
        .state('library.search', {
            url: "",
            templateUrl: 'views/br_operator/br_op_libraryManagement.html'
        });




    $locationProvider.html5Mode(true);
    blockUIConfig.message =  "Processing ...";

}]);



branchOperator.controller('operatorPasswordCtrl', ['$scope','branchOperatorFactory','$state','$timeout','$window',function($scope,branchOperatorFactory,$state,$timeout,$window) {

    var initials = {
        username: "", oldPassword: "", newPassword: "", confirmPassword: ""
    };

    $scope.oPasswordChange = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        console.log($scope.userName);
    };
    $scope.changeOperatorPassword = function () {
        var uid = $window.sessionStorage.getItem('userId');
        console.log("udi " + uid);
        var add = $scope.add;
        var body = ' { ' +
            '"username":"' + add.username + '",' +
            '"oldPassword" :"' + add.oldPassword + '",' +
            '"newPassword" :"' + add.newPassword + '",' +
            '"confirmPassword" :"' + add.confirmPassword +
            '"}';
        var user = window.btoa(uid);
        var response = branchOperatorFactory.changeOperatorPassword(user);
        var data = response.pass({}, body, function (response) {
            if (response.status == 200) {
                alert("Password Changed successfully!!!");
                $window.location = 'index.html';
            }
        }, function (response) {
            if (response.status == 409) {
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1 = "Password change is unsuccessful !!!";
        });
    };
    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('dash');
    };
}]);

branchOperator.controller('logoutCtrl', ['$scope','$window',function($scope, $window) {
    $scope.logout = function(){
        $window.sessionStorage.removeItem('psId');
        $window.sessionStorage.removeItem('pcId');
        $window.sessionStorage.removeItem('userId');
        $window.location = 'index.html';
    }
}]);


/*function show_dialoge($modal,$scope,message,html){
 return $modal.open({
 scope: $scope,
 templateUrl: html,
 controller: 'dialogeCtrl',
 resolve :{
 message : function(){
 return message;
 }
 }
 });
 }*/

function show_dialoge($modal,$scope,message,html,title){
    return $modal.open({
        scope: $scope,
        templateUrl: html,
        controller: 'dialogeCtrl',
        resolve :{
            data : function(){
                if(message == undefined || message == null || message == '')
                    return {message:null,title:title};
                else  if(title == undefined || title == null || title == '')
                    return {message:message,title:null};
                else if ((message == undefined || message == null || message == '')&&(title == undefined || title == null || title == ''))
                    return null;
                else
                    return {message:message,title:title};
            }
        }
    });
}

function open_dialoge(size,$modal,$scope,message,html){
    return $modal.open({
        scope: $scope,
        size:size,
        templateUrl: html,
        controller: 'dialogeCtrl',
        resolve :{
            data : function(){
                return message;
            }
        }
    });
}

branchOperator.controller('dialogeCtrl', ['$scope', '$modalInstance','data',function ($scope, $modalInstance,data) {
    if(data.title == null)
        $scope.message = data.message;
    else if(data.message == null)
        $scope.title = data.title;
    else {
        $scope.message = data.message;
        $scope.title = data.title;
    }
    $scope.ok = function () {
        $modalInstance.close(true);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.close = function () {
        $modalInstance.close(false);
    };
}]);

function error(msg,response){
    if(response.status == 404){
        console.log(msg+response.status);
    }
}

function goToHome(){
    $('.sidebar-menu #space a').trigger('click');
}


branchOperator.factory('dashFactory', ['$resource','br_Operator_Config', '$window',function($resource,br_Operator_Config, $window){
    var factory = {};
    var fetch_dashboard_asset_url = br_Operator_Config.getAssetAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchAssetList = function(){
        return $resource(fetch_dashboard_asset_url,{},{
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


branchOperator.controller("dashboardController",['$scope','dashFactory',function($scope,dashFactory){
	
    $scope.fetchAssetList = function(){
        $scope.response_msg = "";
        dashFactory.fetchAssetList().fetch({},function(response){
            $scope.asset_info =[];
            console.log(response);
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.asset_info = _data;
                    console.log(response);
                }
            }
        },function(response){
            $scope.asset_info = [];
            console.log(response.status);
        });
    };
    
    $scope.init = function(){
        $scope.fetchAssetList();
    };
    
    $scope.init();

}]);

branchOperator.factory('inventoryFactory',['$resource', 'br_Operator_Config', '$window',function($resource, br_Operator_Config, $window){
    var factory = {};
    var fetch_inventory_url = br_Operator_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchInventoryList = function(offset,limit){
        return $resource(fetch_inventory_url+'/inventory'+'?offset='+offset+'&limit='+limit,{},{
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

    factory.createInventoryEntry = function(){
        return $resource(fetch_inventory_url+'/inventory',{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data)
                    {
                        return data;
                    }
                }
            }
        });
    };

    factory.updateInventory = function(inventoryId){
        console.log(("id: "+ inventoryId));
        return $resource(fetch_inventory_url+'/inventory/'+inventoryId+'/update',{},{
            edit: {
                method: 'PUT',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray: false,
                interceptor: {
                    response: function(data){
                        console.log("updated !!");
                        return data;
                    }
                }
            }
        });
    };

    factory.deleteInventory = function(inventoryId){
        // BRANCH0001/inventory/INVT000000001/dectivate
        return $resource(fetch_inventory_url+'/inventory/'+inventoryId+'/dectivate',{},{
            remove: {
                method: 'get',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor: {
                    response: function (data)
                    {
                        return data;
                    }
                }
            }
        });
    };

    return factory;
}]);
branchOperator.controller('op_inventoryManagementCtrl', ['$scope','inventoryFactory','$state','$filter','$modal',function($scope,inventoryFactory,$state,$filter,$modal) {

    var initials = {
        inventoryType:"",approximateCost:"",category:"",serialNumber:"",inventoryId:"",yearOfManufacturer:"",dateOfPurchase:""
    };

    $scope.inventoryDetails = {
        inventoryList: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };

    $scope.fetchInventoryList = function(offset,limit) {
        $scope.response_msg1 = "";
        inventoryFactory.fetchInventoryList(offset,limit).fetch({},function(response)
        {
            $scope.year_list = ["2015-16","2016-17","2017-18","2018-19"];
            $scope.inventory_list =[];
            console.log(response);
            if(response.status == 200)
            {
                $scope.count = response.data.total;
                console.log($scope.count);
                if(response.data.inventoryLists!=undefined)
                {
                    var _data = angular.fromJson(response.data.inventoryLists);
                    console.log(_data);
                    $scope.inventory_list = _data;
                    $scope.totalPages = Math.ceil($scope.count/$scope.inventoryDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.inventory_list.length);
                }
            }

        },function(response){
            $scope.inventory_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    // Check Below for Current Name
    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "inventory" && $scope.inventory_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.inventory_list.length);
        }
    });

    $scope.addInventoryEntry = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };

    $scope.category = ["Electronic","Sports","Furniture","General"];
    $scope.createInventoryEntry = function () {
        var add = $scope.add;
        $scope.add.dateOfPurchase.Value = $filter('date')(new Date(add.dateOfPurchase),'yyyy-MM-dd');
        var body = ' { ' +
            '"inventoryType":"' + add.inventoryType + '",' +
            '"yearOfManufacturer":"' + add.yearOfManufacturer + '",' +
            '"dateOfPurchase" :"' + $scope.add.dateOfPurchase.Value + '",'+
            '"approximateCost" :"' + add.approximateCost + '",'+
            '"serialNumber" :"' + add.serialNumber + '",'+
            '"category" :"'+add.category+'"}';

        var response = inventoryFactory.createInventoryEntry();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchInventoryList(0,$scope.inventoryDetails.numPerPage);
            }
            $state.go('^.list');
            $scope.response_msg = "Inventory added successfully !!!";
        },function(response){
            if(response.status == 409){
                // Check for status Code and variable below
                $scope.add.inventoryType = "";
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of Inventory is unsuccessful !!!";
        });
    };

//************************ Updating Inventory **************************

    $scope.editInventoryEntry = function (inventoryId) {
        console.log("inventoryId "+inventoryId);
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.inventory_list, function (inventory) {
            console.log("inventory: "+inventory.inventoryId);
            if (inventoryId == inventory.inventoryId) {
                $scope.edit.inventoryId = inventory.inventoryId;
                $scope.edit.inventoryType = inventory.inventoryType;
                $scope.edit.dateOfPurchase = new Date(inventory.dateOfPurchase);
                $scope.edit.approximateCost = inventory.approximateCost;
                $scope.edit.yearOfManufacturer = inventory.yearOfManufacturer;
                $scope.edit.serialNumber = inventory.serialNumber;
                $scope.edit.category = inventory.category;
            }
        });
    };

    $scope.updateInventory = function (inventoryId)
    {
        var edit = $scope.edit;
        $scope.edit.dateOfPurchase.Value = $filter('date')(new Date(edit.dateOfPurchase),'yyyy-MM-dd');
        var body = ' { ' +
            '"yearOfManufacturer":"' + edit.yearOfManufacturer + '",' +
            '"inventoryType":"' + edit.inventoryType + '",' +
            '"approximateCost" :"' + edit.approximateCost + '",'+
            '"dateOfPurchase" :"' + $scope.edit.dateOfPurchase.Value + '",'+
            '"serialNumber" :"' + edit.serialNumber + '",'+
            '"category" :"'+edit.category+'"}';

        var inventory = window.btoa(inventoryId);
        var response = inventoryFactory.updateInventory(inventory);
        var data = response.edit({}, body, function (response)
        {
            if(response.status == 200)
            {
                console.log("response"+ response.status);
                $scope.fetchInventoryList(0,$scope.inventoryDetails.numPerPage);
            }
            $state.go('^.list');
            $scope.response_msg = "Inventory updated successfully !!!";
        },function(response){
            if(response.status == 409)
            {
                // Check for status Code and variable below
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Inventory is unsuccessful !!!";
        });
    };

    $scope.deleteInventory = function(inventory,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var inventory = window.btoa(inventory.inventoryId);
        console.log("inside delete function !!");

        var dialogue_message = "Are you sure to delete the Inventary ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value: "+ flag);
            if(flag){
                console.log(inventory.inventoryId);
                inventoryFactory.deleteInventory(inventory).remove({},function(response){
                    if(response.status == 200){
                        $scope.fetchInventoryList(0,$scope.inventoryDetails.numPerPage);
                        console.log("deleted")
                    }
                },function(response){
                    $scope.response_msg1 = "inventory Deletion failed !!!";
                    console.log(response.status);
                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };

    $scope.init = function()
    {
        $scope.inventoryDetails.numPerPage = parseInt($scope.inventoryDetails.numPerPage);
        $scope.maxSize = 5;
        $scope.fetchInventoryList(0,$scope.inventoryDetails.numPerPage);
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

    $scope.init();

    $scope.pageChanged = function(){
        $scope.inventoryDetails.startValue = (($scope.inventoryDetails.currentPage - 1) * $scope.inventoryDetails.numPerPage);
        $scope.fetchInventoryList($scope.inventoryDetails.startValue,$scope.inventoryDetails.numPerPage);
    };

}]);


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
        numPerPage:25,
        currentPage:1,
        startValue:0
    };

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

        var body = ' { ' +
            '"vehicleType":"' + add.vehicleType + '",' +
            '"vehicleRegNo" :"' + add.vehicleRegNo + '",'+
            '"vehicleModel" :"'+ add.vehicleModel + '",'+
            '"seatCapacity" :"'+ add.seatCapacity + '",'+
            '"driverName" :"'+ add.driverName + '",'+
            '"routeName" :"'+ add.routeName + '",'+
            '"phoneNumbers"'+':'+
            '{'+
            '"phoneNumber" :"' + add.phoneNumber + '",'+
            '"type" :"' + add.type +'"'+
            '},'+
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
        console.log("vehicleId "+vehicleId);
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.vehicle_list, function (vehicle) {
            console.log("vehicle: "+vehicle.vehicleId);
            if (vehicleId == vehicle.vehicleId) {
                $scope.edit.vehicleId = vehicle.vehicleId;
                $scope.edit.vehicleType = vehicle.vehicleType;
                $scope.edit.vehicleRegNo = vehicle.vehicleRegNo;
                $scope.edit.seatCapacity = vehicle.seatCapacity;
                $scope.edit.driverName = vehicle.driverName;
                $scope.edit.routeName = vehicle.routeName;
                $scope.edit.phoneNumber = vehicle.phoneNumbers.phoneNumber;
                $scope.edit.vehicleModel = vehicle.vehicleModel;
                $scope.edit.yearOfManufacter = vehicle.yearOfManufacter;
                $scope.edit.insuranceRenewal = new Date(vehicle.insuranceRenewal);
                $scope.edit.nextRenewalDate = new Date(vehicle.nextRenewalDate);
            }
        });
    };

    $scope.editVehicleEntry = function (vehicleId) {
        var edit = $scope.edit;
        $scope.edit.insuranceRenewal.Value = $filter('date')(new Date(edit.insuranceRenewal),'yyyy-MM-dd');
        $scope.edit.nextRenewalDate.Value = $filter('date')(new Date(edit.nextRenewalDate),'yyyy-MM-dd');
        var body = ' { ' +
            '"vehicleType":"' + edit.vehicleType + '",' +
            '"vehicleRegNo" :"' + edit.vehicleRegNo + '",'+
            '"vehicleModel" :"'+ edit.vehicleModel + '",'+
            '"seatCapacity" :"'+ edit.seatCapacity + '",'+
            '"driverName" :"'+ edit.driverName + '",'+
            '"routeName" :"'+ edit.routeName + '",'+
            '"phoneNumbers"'+':'+
            '{'+
            '"phoneNumber" :"' + edit.phoneNumber + '",'+
            '"type" :"' + edit.type +'"'+
            '}'+ ','+
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

        var dialogue_message = "Are you sure to delete the Vehicle ??";
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
                    $scope.response_msg1 = "vehicle Deletion failed !!!";
                    console.log(response.status);
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



branchOperator.factory('libraryFactory',['$resource', 'br_Operator_Config', '$window',function($resource, br_Operator_Config, $window){
    var factory = {};
    var fetch_library_url = br_Operator_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_library_url +'/classroom/year/'+ selectedYear, {}, {
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

    factory.fetchClassRoomlist = function(selectedYear, currentStandard) {
        return $resource(fetch_library_url+'/classroom/standard/'+ currentStandard +'/section/year/'
            + selectedYear, {}, {
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

    factory.fetchStudentList = function( selectedYear, currentStandard, currentSection) {
        return $resource(fetch_library_url+'/student/year/'+selectedYear+'/std/'+
            currentStandard +'/sec/'+currentSection+'/basicinfo',{},{
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

    factory.fetchFacultyList = function(offset,limit){
        return $resource(fetch_library_url+'/faculty?offset='+offset+'&limit='+limit,{},{
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

    factory.fetchDefaulterList = function(offset,limit){
        // return $resource(fetch_library_url+'?offset='+offset+'&limit='+limit,{},{
        return $resource(fetch_library_url+'/library/defaulters'+'?offset='+offset+'&limit='+limit,{},{
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

    factory.fetchLibraryReport = function(){
        return $resource(fetch_library_url+'/library/reports',{},{
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

    factory.fetchLibraryList = function(offset,limit){
        // return $resource(fetch_library_url+'?offset='+offset+'&limit='+limit,{},{
        return $resource(fetch_library_url+'/library/UnAssignedBooks'+'?skip='+offset+'&limit='+limit,{},{
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

    factory.searchBooks = function(searchby,inputValue, offset,limit){
        var auth = "Author";
        var pub = "Publication";
        var name = "Book Name";
        var id = "Book Id";
        var url;

        if(angular.equals(searchby,auth)) {
            url = fetch_library_url+'/library/author/'+inputValue+'?skip='+offset+'&limit='+limit;
        }else if(angular.equals(searchby,pub)) {
            url = fetch_library_url+'/library/publication/'+inputValue+'?skip='+offset+'&limit='+limit;
        }else if(angular.equals(searchby,name)) {
            url = fetch_library_url+'/library/book/'+inputValue;
        }/*else if(angular.equals(searchby,id)){
         url = fetch_library_url+'/library/book/'+inputValue;
         }*/
        return $resource(url,{},{
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


    factory.createLibraryBookEntry = function(bookId){
        return $resource(fetch_library_url+'/library/book/'+bookId,{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        console.log("post successful !!");
                        return data;
                    }
                }
            }
        });
    };


    factory.assignTo = function(){
        // branch/BRANCH0001/library/issuedTo
        return $resource(fetch_library_url+'/library/issuedTo',{},{
            assign:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        console.log("post successful !!");
                        return data;
                    }
                }
            }
        });
    };
    factory.unissueBook = function(){
        // branch/BRANCH0001/library/issuedTo
        return $resource(fetch_library_url+'/library/unissue',{},{
            ret:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        console.log("post successful !!");
                        return data;
                    }
                }
            }
        });
    };

    factory.editLibraryBook = function(bookId){
        // BRANCH0001/library/BK00001/update
        return $resource(fetch_library_url+'/library/'+bookId+'/update',{},{
            edit:{
                method:'PUT',
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

    factory.deleteBook = function(bookId)
    {
        return $resource(fetch_library_url+'/library/bookId/'+bookId,{}, {
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
    return factory;
}]);

branchOperator.controller('libraryManagementController', ['$scope','libraryFactory','$state','$filter','$modal',function($scope,libraryFactory,$state,$filter,$modal) {

    var initials = {
        bookId:"", bookName:"",author:"",publication:"",issuedTo:"",
        issuedDate:"",returnDate:"",approximateCost:"",bookVersion:""
    };

    $scope.libraryDetails = {
        libraryList: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };

    $scope.fetchYearList = function(){
        $scope.year_list = ["2015-16","2016-17","2017-18","2018-19"];
        $scope.standard_list =[];
        $scope.section_list =[];
        $scope.student_list =[];
        $scope.fee_list =[];
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        libraryFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            $scope.section_list =[];
            $scope.student_list =[];
            $scope.fee_list =[];
            if(response.status == 200 || response.status == 201)
            {
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                }
            }
        },function(response){
            $scope.standard_list = [];
            $scope.response_msg = "No Standards found for this year.";
            console.log(response.status);
        });
    };

    $scope.fetchClassRoomlist = function(selectedYear, currentStandard){
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        libraryFactory.fetchClassRoomlist(year, standard).fetch({},function(response){
            $scope.section_list =[];
            $scope.student_list =[];
            $scope.fee_list =[];
            console.log(response);
            if(response.status == 200){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.section_list = _data;
                }
            }
        },function(response){
            $scope.section_list = [];
            $scope.response_msg = "No Section found for this standard.";
            console.log(response.status);
        });
    };

    $scope.fetchStudentList = function(selectedYear, currentStandard, currentSection){
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        var section = window.btoa(currentSection.section);
        libraryFactory.fetchStudentList(year,standard,section).fetch({},function(response){
            $scope.student_list =[];
            $scope.fee_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    $scope.student_list = _data;
                }
            }
        },function(response){
            $scope.student_list = [];
            $scope.response_msg = " Studentds not found for this section.";
            console.log(response.status);
        });
    };

    $scope.search_by_list = ["Author","Publication","Book Name"];

    $scope.fetchLibraryList = function(offset,limit)
    {
        $scope.response_msg = "";
        libraryFactory.fetchLibraryList(offset,limit).fetch({},function(response)
        {
            $scope.library_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201)
            {
                $scope.count = response.data.total;
                if(response.data.libraryDetailsLists!=undefined)
                {
                    var _data = angular.fromJson(response.data.libraryDetailsLists);
                    $scope.library_list = _data;
                    $scope.totalPages = Math.ceil($scope.count/$scope.libraryDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.library_list.length);
                }
            }

        },function(response)
        {
            $scope.library_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.searchBooks = function(searchby,inputValue, offset,limit){
        console.log(searchby);
        console.log(inputValue);
        $scope.response_msg = "";
        var value = window.btoa(inputValue);
        libraryFactory.searchBooks(searchby,value, offset,limit).fetch({},function(response) {
            $scope.library_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201) {
                $scope.count = response.data.total;
                if(response.data.libraryDetailsLists!=undefined) {
                    var _data = angular.fromJson(response.data.libraryDetailsLists);
                    $scope.library_list = _data;
                    $scope.totalPages = Math.ceil($scope.count/$scope.libraryDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.library_list.length);
                }
            }

        },function(response)
        {

            if(response.status==409 || response.status==404)
            {
                $scope.library_list = [];
                $scope.$parent.setBaseContentHeight(-1);
                console.log(response.status);
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
            {
                $scope.response_msg1 = "No such books are found !!! ";
            }

        });
    };


    // Check Below for Current Name
    $scope.$on('$viewContentLoaded',function()
    {
        if($state.current.name == "library" && $scope.library_list != undefined)
        {
            $scope.$parent.setBaseContentHeight($scope.library_list.length);
        }
    });

    $scope.addLibraryBook = function()
    {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        console.log("inside addLibraryBook !!")
    };

    $scope.createLibraryBookEntry = function (bookId)
    {
        var add = $scope.add;
        console.log("inside createLibraryBookEntry !!");
        var body = ' { ' +
            '"publication":"' + add.publication + '",' +
            '"bookName" :"' + add.bookName + '",'+
            '"bookVersion" :"' + add.bookVersion + '",'+
            '"author" :"'+add.author + '",'+
            '"approximateCost" :"'+add.approximateCost+
            '"}';
        console.log("read the inputs !!");
        var book = window.btoa(bookId);
        var response = libraryFactory.createLibraryBookEntry(book);
        var data = response.add({}, body, function (response)
        {
            if(response.status == 200 || response.status == 201){
                $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
            }
            $state.go('^.list');
            $scope.response_msg = "LibraryBookEntry added successfully !!!";
        },function(response){
            if(response.status == 409){
                $scope.add.branchName = "";
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of LibraryBookEntry is unsuccessful !!!";
        });
    };

// ******************* Update Library *******************
    $scope.editLibrary = function (bookId) {
        console.log("bookId "+bookId);
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.library_list, function (library) {
            console.log("vehicle: "+library.bookId);
            if (bookId == library.bookId) {
                $scope.edit.bookId = library.bookId;
                $scope.edit.bookName = library.bookName;
                $scope.edit.bookVersion = library.bookVersion;
                $scope.edit.author = library.author;
                $scope.edit.publication = library.publication;
                $scope.edit.approximateCost = library.approximateCost;
                /* $scope.edit.issuedTo = library.issuedTo;
                 $scope.edit.issuedDate = library.issuedDate;
                 $scope.edit.returnDate = library.returnDate;*/
            }
        });
    };

    $scope.editLibraryBook = function (bookId)
    {
        console.log("book id: "+ bookId);
        var edit = $scope.edit;
        var body = ' { ' +

            '"bookName" :"' + edit.bookName + '",'+
            '"bookVersion" :"' + edit.bookVersion + '",'+
            '"author" :"'+edit.author+  '",'+
            '"publication" :"'+edit.publication+  '",'+
            '"approximateCost" :"'+edit.approximateCost+
                /* '"issuedTo" :"'+edit.issuedTo+  '",'+
                 '"issuedDate" :"'+edit.issuedDate+  '",'+
                 '"returnDate" :"'+edit.returnDate+ */
            '"}';
        var book = window.btoa(bookId);
        var response = libraryFactory.editLibraryBook(book);
        var data = response.edit({}, body, function (response)
        {
            if(response.status == 200 || response.status == 201){
                $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
            }
            $state.go('^.list');
            $scope.response_msg = "Library Book updated successfully !!!";
        },function(response)
        {
            if(response.status == 409)
            {
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updating Book is unsuccessful !!!";
        });
    };

    $scope.deleteBook = function(library,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var book = window.btoa(library.bookId);
        console.log("inside delete function !!");

        var dialogue_message = "Are you sure to delete the library ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value: "+ flag);
            if(flag){
                console.log(library.bookId);
                libraryFactory.deleteBook(book).remove({},function(response){
                    if(response.status == 200){
                        $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
                        console.log("deleted")
                        $scope.response_msg = "Book deleted Successfully!!!";
                    }
                },function(response){
                    $scope.response_msg1 = "Book Deletion is failed !!!";
                    console.log(response.status);
                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };

    $scope.isVisibleS = false;
    $scope.isVisibleF = false;
    $scope.toStudent = function(value){
        $scope.isVisibleS = value == 'S';
        $scope.isVisibleF = false;
    };
    $scope.toFaculty = function(value){
        $scope.isVisibleF = value == 'F';
        $scope.fetchFacultyList(0,1000);
        $scope.isVisibleS = false;
    };

    $scope.assignBook = function (bookId) {
        console.log("bookId "+bookId);
        $scope.response_msg = "";
        $scope.assign = angular.copy(initials);

        angular.forEach($scope.library_list, function (library) {
            console.log("book: "+library.bookId);
            if (bookId == library.bookId) {
                $scope.assign.bookId = library.bookId;
                $scope.assign.bookName = library.bookName;
                $scope.assign.author = library.author;
                $scope.assign.publication = library.publication;
                $scope.assign.approximateCost = library.approximateCost;
            }
        });
    };

    $scope.assignTo = function (bookId)
    {
        var issuedTo = function(assign){
            if($scope.isVisibleS == true){
                return assign.student.studentId;
            }
            else if($scope.isVisibleF == true){
                return assign.faculty.facultyId;
            }
        };

        console.log("book id: "+ bookId);
        var assign = $scope.assign;
        $scope.assign.issueDate.Value = $filter('date')(new Date(assign.issueDate),'yyyy-MM-dd');
        $scope.assign.returnByDate.Value = $filter('date')(new Date(assign.returnByDate),'yyyy-MM-dd');
        var body = ' { ' +
            '"bookId" :"' + assign.bookId + '",'+
            '"issuedTo" :"'+ issuedTo(assign) +  '",'+
            '"returnByDate" :"'+ $scope.assign.returnByDate.Value +  '",'+
            '"issueDate" :"'+  $scope.assign.issueDate.Value +
            '"}';
        var book = window.btoa(bookId);
        var response = libraryFactory.assignTo(book);
        var data = response.assign({}, body, function (response)
        {
            if(response.status == 200 || response.status == 201){
                $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
                $scope.isVisibleS = false;
                $scope.isVisibleF = false;
            }
            $state.go('^.list');
            $scope.response_msg = "Book assigned successfully !!!";
        },function(response)
        {
            if(response.status == 409)
            {
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Assigning of book is unsuccessful !!!";
        });
    };


    $scope.returnBook = function(bookId){
        console.log("bookId "+bookId);
        $scope.response_msg = "";
        $scope.ret = angular.copy(initials);
        angular.forEach($scope.library_list, function (library) {
            console.log("library: "+library.bookId);
            if (bookId == library.bookId) {
                $scope.ret.bookId = library.bookId;
                $scope.ret.issuedTo = library.issuedTo;

            }
        });
        console.log("Id Matched with"+$scope.assign.bookId)
    };
    $scope.unissueBook = function (bookId)
    {
        console.log("book id: "+ bookId);
        var ret = $scope.ret;
        $scope.ret.returnDate.Value = $filter('date')(new Date(ret.returnDate),'yyyy-MM-dd');
        var body = ' { ' +
            '"bookId" :"' + ret.bookId + '",'+
            '"studentId" :"'+ret.issuedTo+  '",'+
            '"returnDate" :"'+ $scope.ret.returnDate.Value +
            '"}';
        var book = window.btoa(bookId);
        var response = libraryFactory.unissueBook(book);
        var data = response.ret({}, body, function (response)
        {
            if(response.status == 200 || response.status == 201){
                $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
                $scope.isVisibleS = false;
                $scope.isVisibleF = false;
            }
            $state.go('^.list');
            $scope.response_msg = "Book returned successfully !!!";
        },function(response){
            if(response.status == 409) {
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Book Returning is unsuccessful !!!";
        });
    };


    $scope.init = function()
    {
        $scope.libraryDetails.numPerPage = parseInt($scope.libraryDetails.numPerPage);
        $scope.maxSize = 5;
       // $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

    $scope.init();

    $scope.pageChanged = function()
    {
        $scope.libraryDetails.startValue = (($scope.libraryDetails.currentPage - 1) * $scope.libraryDetails.numPerPage);
        $scope.fetchLibraryList($scope.libraryDetails.startValue,$scope.libraryDetails.numPerPage);
    };

    $scope.init1 = function(searchby,inputValue){

        if(searchby == undefined && inputValue == undefined){
            $scope.libraryDetails.numPerPage = parseInt($scope.libraryDetails.numPerPage);
            $scope.maxSize = 5;
            $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
        }
        else{
            $scope.libraryDetails.numPerPage = parseInt($scope.libraryDetails.numPerPage);
            $scope.maxSize = 5;
            $scope.searchBooks(searchby,inputValue,0,$scope.libraryDetails.numPerPage);
        }

    };

}]);

