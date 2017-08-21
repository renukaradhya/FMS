/**
 * Created by uidr1063 on 1/10/2016.
 */

branchManager.factory('inventoryManagementFactory',['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
    var factory = {};
    var fetch_inventory_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchInventaryPdfReport = function(catagory){

            return $resource(fetch_inventory_url+'/inventory/reports/category/'+catagory,{},{
                fetch : {
                    method:'get',
                    responseType: 'arraybuffer',
                    headers : { 'Authorization' : authCode },
                    interceptor : {
                        response : function(data){
                            console.log("Report Generated for Inventary !!!");
                            return data;
                        }
                    }
                }
            });
    };

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
branchManager.controller('inventoryManagementCtrl', ['$scope','inventoryManagementFactory','br_manager_appConfig','$state','$filter','$modal',function($scope,inventoryManagementFactory,br_manager_appConfig,$state,$filter,$modal) {

    var initials = {
    		inventoryType:"",approximateCost:"",category:"",serialNumber:"",inventoryId:"",yearOfManufacturer:"",dateOfPurchase:""
    };

    $scope.inventoryDetails = {
        inventoryList: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.aDate = '2015-10-31';
    $scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
    }

    $scope.fetchInventoryList = function(offset,limit) {
        $scope.response_msg1 = "";
        inventoryManagementFactory.fetchInventoryList(offset,limit).fetch({},function(response)
        {
        	$scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
            $scope.inventory_list =[];
            console.log(response);
            if(response.status == 200)
            {
                $scope.count = response.data.total;
                console.log($scope.count);
                if(response.data.inventoryLists!=undefined) {
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

    $scope.category = ["Electronic","Sports","Furniture","Lab Equipments","General","Others"];
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

        var response = inventoryManagementFactory.createInventoryEntry();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchInventoryList(0,$scope.inventoryDetails.numPerPage);
            }
            $state.go('^.list');
            $scope.response_msg = "Inventory added successfully !!!";
        },function(response){
            if(response.status == 404){
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

    $scope.updateInventory = function (inventoryId) {
        var edit = $scope.edit;
        $scope.edit.dateOfPurchase.Value = $filter('date')(new Date(edit.dateOfPurchase),'yyyy-MM-dd');
        var body = ' { ' +
            '"yearOfManufacturer":"' + edit.yearOfManufacturer + '",' +
            '"inventoryType":"' + edit.inventoryType + '",' +
            '"approximateCost" :"' + edit.approximateCost + '",'+
            '"dateOfPurchase" :"' + $scope.edit.dateOfPurchase.Value + '",'+
            '"serialNumber" :"' + edit.serialNumber + '",'+
            '"category" :"'+ edit.category +'"}';

        var inventory = window.btoa(inventoryId);
        var response = inventoryManagementFactory.updateInventory(inventory);
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
            if(response.status == 404) {
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

        var dialogue_message = "Are you sure to delete the Inventory ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value: "+ flag);
            if(flag){
                console.log(inventory.inventoryId);
                inventoryManagementFactory.deleteInventory(inventory).remove({},function(response){
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

branchManager.controller('inventaryReportsCtrl',['$scope','inventoryManagementFactory','$state',function($scope,inventoryManagementFactory,$state){


    $scope.inventaryReport = function(){
        $scope.category = ["Electronic","Sports","Furniture","General"];
        //var category = $scope.cat;
        //$scope.generateInventaryReport(category);
        //console.log("Inside inventaryReports()");
    };
    $scope.generateInventaryReport = function(category){
        if( category == undefined ){
            window.alert("Please select the Category");
        }
        else {
            var category = window.btoa(category);
            inventoryManagementFactory.fetchInventaryPdfReport(category).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        $scope.file = file;
                        $scope.fileURL = URL.createObjectURL(file);
                        $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                    } else {
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
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
            console.log("Render Pages !!");
        }

        //PDFJS.disableWorker = true;
        PDFJS.getDocument(url).then(renderPages);

    };

    $scope.downloadPdf = function(){
        //window.open($scope.fileURL);
        saveAs($scope.file, 'Inventory Report' + '.pdf');
    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('intryreport.main');
    };

}]);