
branchManager.factory('feeManagementFactory',['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
    var factory = {};
    var fetch_fee_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");


    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_fee_url +'/classroom/year/'+ selectedYear, {}, {
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
        return $resource(fetch_fee_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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

    factory.assignFeeClassroom = function(classRoomId, FeesId){
        // http://localhost:8080/Eshiksha/org/fhfdh/branch/56465456/expandfees/fhfdh/classroom/fghfdh/feestructure
        return $resource(fetch_fee_url+'/expandfees/'+FeesId+'/classroom/'+classRoomId+'/feestructure',{},{
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
    };

    factory.fetchSectionList = function(standard, year) {
        return $resource(fetch_fee_url+'/classroom/standard/'+ standard +'/section/year/'
            + year, {}, {
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

    factory.fetchFeesPdfReport = function(classroomId){
        return $resource(fetch_fee_url+'/feesstruture/reports/classroom/'+classroomId+'/feeStructure' ,{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        console.log("Response recieved !!!");
                        return data;
                    }
                }
            }
        });
    };

    factory.fetchFeeList = function(selectedYear, offset,limit){
        return $resource(fetch_fee_url+'//expandfees/year/'+selectedYear+'/feestructuresbasedonmode?offset='+offset+'&limit='+limit,{},{
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
    };


    factory.createBranchFees = function(){
            return $resource(fetch_fee_url+'/expandfees',{},{
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


    factory.addOneTimeFees = function(feesId){
        return $resource(fetch_fee_url+'/expandfees/feeId/'+feesId+'/onetimefee',{},{
            add: {
                method: 'PUT',
                headers: { 'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray: false,
                interceptor: {
                    response: function(data){
                        console.log("Update Successful!!");
                        return data;
                    }
                }
            }
        });
    };

    factory.addRecurringFees = function(feesId){
        return $resource(fetch_fee_url+'/expandfees/feeId/'+feesId+'/recuringfees',{},{
            add: {
                method: 'PUT',
                headers: { 'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray: false,
                interceptor: {
                    response: function(data){
                        console.log("Update Successful!!");
                        return data;
                    }
                }
            }
        });
    };

    factory.updateFees = function(feesId){
        return $resource(fetch_fee_url+'/expandfees/'+feesId+'/feestructure',{},{
            edit: {
                method: 'PUT',
                headers: { 'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray: false,
                interceptor: {
                    response: function(data){
                        console.log("Update Successful!!");
                        return data;
                    }
                }
            }
        });
    };

    factory.deleteFee = function(feeId){
    	 return $resource(fetch_fee_url+'/expandfees/feeStructure/'+feeId+'/deactivatefeeStructure',{},{
    		 remove: {
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

    factory.deactivateRecurringFee = function(recId){
        return $resource(fetch_fee_url+'/expandfees/recurringFee/'+recId+'/deActivateRecurringFee',{},{
            remove: {
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

    factory.deactivateOneTimeFee = function(otfId){
        return $resource(fetch_fee_url+'/expandfees/oneTimeFee/'+otfId+'/deActivateOneTimeFee',{},{
            remove: {
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
branchManager.controller('feeManagementCtrl', ['$scope','$filter','feeManagementFactory','br_manager_appConfig','$state','$modal','$localStorage',function($scope,$filter,feeManagementFactory,br_manager_appConfig,$state,$modal,$localStorage) {

    var initials = {
        standard:"",admissionFees:"",monthlyFees:"",sportsFees:"",booksFees:"",vanFees:""
        ,feesId:"",year:""
    };

    $scope.feesDetails = {
        fee_list: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.mode_list = ["Monthly", "Quarterly", "Half-Yearly", "Yearly"];

    $scope.aDate = '2015-10-31';
    $scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
    }

    $scope.fetchFeeList = function(selectedYear,offset,limit){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        feeManagementFactory.fetchFeeList(year, offset, limit).fetch({},function(response){
            $scope.fee_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                $scope.count = response.data.total;
                if(response.data.feeStructure!=undefined){
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

    $scope.viewDetails = function(fee,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
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

    // ************* Adding Fees Structure ***************
    $scope.addBranchFees = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.choices = [{id: 'choice1'}, {id: 'choice2'}];
        $scope.modes = [{id: 'mode1'}, {id: 'mode2'}];
        $scope.addNewChoice = function() {
            var newChoice = $scope.choices.length+1;
            $scope.choices.push({'id':'choice'+newChoice});
        };
        $scope.removeChoice = function() {
            var lastItem = $scope.choices.length-1;
            $scope.choices.splice(lastItem);
        };
        $scope.addNewMode = function() {
            var newItem = $scope.modes.length+1;
            $scope.modes.push({'id':'mode'+newItem});
        };
        $scope.removeMode = function() {
            var lastMode = $scope.modes.length-1;
            $scope.modes.splice(lastMode);
        };
        $scope.add = angular.copy(initials);
    };



    $scope.createBranchFees = function () {
        $scope.response_msg1 = "";
        var add = $scope.add;
        $scope.choices.forEach(function(v){
            delete v.id;
            v.payByDate = $filter('date')(new Date(v.payByDate),'yyyy-MM-dd');
        });
        $scope.modes.forEach(function(v){
            delete v.id;
        });
        var body ={
            "name": add.feeName,
            "year": $scope.academicYear,
            "oneTimeFees": $scope.choices,
            "recurringFees": $scope.modes
        };
        var response = feeManagementFactory.createBranchFees();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fee_list = [];
                $state.go('^.list');
            }
            $scope.response_msg = "Fee structure added successfully !!!";
        },function(response){
            if(response.status == 404){
                // $scope.add.branchName = "";
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of Fee structure is unsuccessful !!!";
        });
    };

    $scope.readValues = function(feeId){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.choices = [{id: 'choice1'}, {id: 'choice2'}];
        $scope.addNewChoice = function() {
            var newChoice = $scope.choices.length+1;
            $scope.choices.push({'id':'choice'+newChoice});
        };
        $scope.removeChoice = function() {
            var lastItem = $scope.choices.length-1;
            $scope.choices.splice(lastItem);
        };
        $scope.add = angular.copy(initials);
        $scope.feesId = feeId;
    };

    $scope.addOneTimeFees = function(feesId){
        $scope.response_msg1 = "";
        $scope.choices.forEach(function(v){
            delete v.id;
            v.payByDate = $filter('date')(new Date(v.payByDate),'yyyy-MM-dd');
        });
        var body ={
            "oneTimeFees": $scope.choices
        };
        var feeId = window.btoa(feesId);
        var response = feeManagementFactory.addOneTimeFees(feeId);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fee_list =[];
                $state.go('^.list');
            }
            $scope.response_msg = "One Time Fee Added successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of One Time Fee is unsuccessful !!!";
        });
    };

    $scope.readRecurringValues = function(feeId){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.modes = [{id: 'mode1'}, {id: 'mode2'}];
        $scope.addNewMode = function() {
            var newItem = $scope.modes.length+1;
            $scope.modes.push({'id':'mode'+newItem});
        };
        $scope.removeMode = function() {
            var lastMode = $scope.modes.length-1;
            $scope.modes.splice(lastMode);
        };
        $scope.add = angular.copy(initials);
        $scope.feesId = feeId;
    };

    $scope.addRecurringFees = function(feesId){
        $scope.response_msg1 = "";
        $scope.modes.forEach(function(v){
            delete v.id;
        });
        var body = {
            "recurringFees": $scope.modes
        };
        var feeId = window.btoa(feesId);
        var response = feeManagementFactory.addRecurringFees(feeId);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fee_list =[];
                $state.go('^.list');
            }
            $scope.response_msg = "Recurring Fee Added successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of Recurring Fee is unsuccessful !!!";
        });
    };

    $scope.editFees = function (fee,index) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.feeDetails = $scope.fee_list[index];
        $scope.onetime = $scope.fee_list[index].oneTimeFees;

        $scope.rec_monthly = $scope.feeDetails.monthyFees;
        $scope.rec_quaterly = $scope.feeDetails.quterlyFees;
        $scope.rec_half = $scope.feeDetails.halfYearlyFees;
        $scope.rec_year = $scope.feeDetails.yearlyFees;

        $scope.new_list = $scope.rec_monthly.concat($scope.rec_quaterly);
        $scope.new_list = $scope.new_list.concat($scope.rec_half);
        $scope.new_list = $scope.new_list.concat($scope.rec_year);

        $scope.onetime.forEach(function(v){
            v.payByDate = new Date(v.payByDate);
        });

        $scope.updateone = $scope.onetime;
        $scope.recurring =  $scope.new_list;
        $scope.edit = angular.copy(initials);

    };

    $scope.updateFees = function (feeId) {
        $scope.response_msg1 = "";
        var edit = $scope.edit;

        $scope.updateone.forEach(function(v){
            v.payByDate = $filter('date')(new Date(v.payByDate),'yyyy-MM-dd');
        });

        var body ={
            "name": $scope.feeDetails.name,
            "year": $scope.academicYear,
            "oneTimeFees": $scope.updateone,
            "recurringFees": $scope.recurring

        };

        var fee = window.btoa(feeId);
        var response = feeManagementFactory.updateFees(fee);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fee_list =[];
                $state.go('^.list');
            }
            $scope.response_msg = "Fee Structure updated successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Fee Structure is unsuccessful !!!";
        });
    };

    $scope.assignFees = function (fee,index) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.details = $scope.fee_list[index];
        $scope.assign = angular.copy(initials);
        $scope.assign.feeId =  fee.feeId;
        $scope.assign.name =  fee.name;
        $scope.fetchStandardList($scope.academicYear);
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        feeManagementFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            if(response.status == 200 || response.status == 201) {
                if(response.data.classroomnames != undefined){
                    var _data = angular.fromJson(response.data.classroomnames);
                    $scope.standard_list = _data;
                }
            }
        },function(response){
            $scope.standard_list = [];
            $scope.response_msg1 = "No Standards found for this year.";
            console.log(response.status);
        });
    };

    $scope.fetchClassRoomlist = function(selectedYear, currentStandard){
        $scope.response_msg1 = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        feeManagementFactory.fetchClassRoomlist(year, standard).fetch({},function(response){
            $scope.section_list =[];
            if(response.status == 200){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.section_list = _data;
                }
            }
        },function(response){
            $scope.section_list = [];
            $scope.response_msg1 = "No Section found for this standard.";
            console.log(response.status);
        });
    };

    $scope.assignFeeClassroom = function(feesId, classroom){
        $scope.response_msg1 = "";
       if(classroom == undefined){
            alert("Select Year, Class and Section")
       }else{
           $scope.response_msg = "";
           $state.go('^.assign');
           var fees = window.btoa(feesId);
           var classId = window.btoa(classroom.classRoomId);
           feeManagementFactory.assignFeeClassroom(classId, fees).fetch({},function(response){
               if(response.status == 200){
                   if(response.data!=undefined){
                       $scope.fee_list =[];
                       $state.go('^.list');
                   }
                   $scope.response_msg = "Fee structure Assigned Successfully !!!";
               }
           },function(response){
               if(response.status == 404){
                   $scope.response_msg1 = response.data.errorMessage;
               }
               else
                   $scope.response_msg1= "Assigning Fee Structure is unsuccessful !!!";
           });
       }
    };

    $scope.deleteFee = function(fee,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        console.log("inside delete Fee");
        var fee = window.btoa(fee.feeId);
        var dialogue_message = "Are you sure to delete the Fee ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){
                feeManagementFactory.deleteFee(fee).remove({},function(response){
                 if(response.status == 200 || response.status == 201){
                     $scope.fee_list = [];
                     $state.go('^.list');
                 }
                 },function(response){
                    if(response.status == 404){
                        $scope.response_msg = response.data.errorMessage;
                    }
                    else
                         $scope.response_msg = "Fee Deletion failed !!!";
                 });
                }
                else {
                    console.log("Failed to delete");
                }
        });
    };

    $scope.deactivateRecurringFee = function(rec,index){
        $scope.response_msg1 = "";
        var recId = window.btoa(rec.recurringId);
        var dialogue_message = "Are you sure to delete the Fee ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){
                feeManagementFactory.deactivateRecurringFee(recId).remove({},function(response){
                    if(response.status == 200 || response.status == 201){
                        $state.go('^.list');
                        $scope.fee_list = [];
                        $scope.response_msg = "Recurring Fee Deactivated !!!";
                    }
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg1 = "Recurring Fee Deletion failed !!!";
                        console.log(response.status);
                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };
    $scope.deactivateOneTimeFee = function(one,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var oneId = window.btoa(one.oneTimeFeeId);
        var dialogue_message = "Are you sure to delete the One Time Fee ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){
                feeManagementFactory.deactivateOneTimeFee(oneId).remove({},function(response){
                    if(response.status == 200 || response.status == 201){
                        $state.go('^.list');
                        $scope.fee_list = [];
                        $scope.response_msg = "One Time Fee Deactivated !!!";

                    }
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg1 = "One Time Fee Deactivation failed !!!";
                        console.log(response.status);
                });

            }
            else {
                console.log("Failed to delete");
            }
        });
    };

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "fee" && $scope.fee_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.fee_list.length);
        }
    });


    $scope.init = function(){
        $scope.rec_list = [];
        $scope.years = $localStorage.years;
        $scope.academicYear = $localStorage.academicYear.successMessage;
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.rec_list = [];
        $scope.fee_list = [];
        $state.go('^.list');
    };

    $scope.init();

    $scope.pageChanged = function(year){
        $scope.feesDetails.startValue = (($scope.feesDetails.currentPage - 1) * $scope.feesDetails.numPerPage);
        $scope.fetchFeeList(year,$scope.feesDetails.startValue,$scope.feesDetails.numPerPage);
    };

}]);


branchManager.controller('feeStructureReportsCtrl',['$scope','feeManagementFactory','$state','$localStorage',function($scope,feeManagementFactory,$state,$localStorage){

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        feeManagementFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            if(response.status == 200 || response.status == 201) {
                if(response.data.classroomnames != undefined){
                    var _data = angular.fromJson(response.data.classroomnames);
                    $scope.standard_list = _data;
                }
            }
        },function(response){
            $scope.standard_list = [];
            //$scope.response_msg = "No Standards found for this year.";
            console.log(response.status);
        });
    };

    $scope.fetchClassRoomlist = function(selectedYear, currentStandard){
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        feeManagementFactory.fetchClassRoomlist(year, standard).fetch({},function(response){
            $scope.section_list =[];
            console.log(response);
            if(response.status == 200){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.section_list = _data;
                }
            }
        },function(response){
            $scope.section_list = [];
           // $scope.response_msg = "No Section found for this standard.";
            console.log(response.status);
        });
    };

    $scope.generateFeesReport = function(classroom){

        if( classroom == undefined ){
            window.alert("Please Select Year, Class, Section");
        }
        else {
            console.log(classroom.classRoomId);
            var classroomId = window.btoa(classroom.classRoomId);
            feeManagementFactory.fetchFeesPdfReport(classroomId).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        console.log("response status = 0");
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        $scope.file = file;
                        $scope.fileURL = URL.createObjectURL(file);
                        $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                    } else {
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
                    }
                }
            }, function (response) {
                alert("Error Unable to download the page");
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
        saveAs($scope.file, 'Fees Structure Report' + '.pdf');
    };
/*
     $scope.downloadXls = function(){
     var body = '{'+
     '"format": "xls",'+
     '"violationType":"'+$scope.violationType+'",'+
     '"startTime" : "'+$scope.startTime+'",'+
     '"endTime" : "'+$scope.endTime+'"'+
     '}';
     reportFactory.fetchViolationPdfReport('violations').fetch({},body,function(response){
     if(response.status = 200) {
     if (response.data.byteLength > 0) {
     var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'});
     var fileUrl = URL.createObjectURL(file);
     window.open(fileUrl);
     }
     }
     },function(response){
     console.log("downlaod error")
     });
     };*/

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('feeReport.main');
    };

    $scope.init = function () {
      $scope.years = $localStorage.years;
    };

    $scope.init();

}]);