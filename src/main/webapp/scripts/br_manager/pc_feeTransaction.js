/**
 * Created by Icarat2 on 3/3/2016.
 */

branchManager.factory('feeTransactionFactory',['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
    var factory = {};
    var fetch_fee_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");



   //                   expandfeetransactions/student/{studentId}/classroom/----/fee/----/recurringFee/------/mode/-----/stallmentDetail/------/type----/transaactions

    factory.checkRecurringDues = function (classroom, feeId, rcfId,mode,stallmentDetail,type) {
        return $resource(fetch_fee_url +'/expandfeetransactions/classroom/'+classroom+'/fee/'+feeId+'/recurringFee/'+rcfId+'/mode/'+mode+'/stallmentDetail/'+stallmentDetail+'/type/'+type+'/transaactions', {}, {
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

    factory.checkDues = function (classroom, feeId, otfId,type) {
        return $resource(fetch_fee_url +'/expandfeetransactions/classroom/'+classroom+'/fee/'+feeId+'/oneTimeFee/'+otfId+'/type/'+type+'/transaactions', {}, {
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

    factory.fetchStudentList = function( selectedYear, currentStandard, currentSection) {
        return $resource(fetch_fee_url+'/student/year/'+selectedYear+'/std/'+
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


    factory.fetchTransactionList = function(selectedYear){
       // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/expandfeetransactions/year/2016-17/branchfeestructures
        return $resource(fetch_fee_url+'/expandfeetransactions/year/'+selectedYear+'/branchfeestructures',{},{
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
    factory.fetchStudentFeeList = function(selectedYear, student){
        return $resource(fetch_fee_url+'/expandfeetransactions/year/'+selectedYear+'/student/'+student+'/studentfeestructures',{},{
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

    factory.fecthfeeMode = function(studentId){
        return $resource(fetch_fee_url+'/student/'+studentId+'/feesmodes',{},{
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


    factory.festchStudentFeesStructure = function(section,studentId){
        return $resource(fetch_fee_url+'/expandfees/student/'+studentId+'/clasroom/'+section+'/studentfeestructure',{},{
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

    factory.classroomFeeStructure = function(classroom){
        return $resource(fetch_fee_url+'/expandfees/classroom/'+classroom+'/classroomfeestructurenew',{},{
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


    factory.createFeesTransaction = function(studentId,classroomId){
        return $resource(fetch_fee_url+'/expandfeetransactions/student/'+studentId+'/classroom/'+classroomId,{},{
            add : {
                method: 'POST',
                isArray: false,
                headers: { 'Authorization' : authCode,
                        'Content-Type': 'application/json'},
                interceptor:{
                    response: function (data){
                        console.log("posting of fees transaction !!!");
                        return data;
                    }
                }
            }
        });
    };



   /* factory.updateTransaction = function(transactionId, studentId){
        // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/expandfeetransactions/transaction/STD0001
        return $resource(fetch_fee_url+'/expandfeetransactions/transaction/'+transactionId,{},{
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
    };*/


    factory.deleteTransaction = function(transactionId,studentId){
        return $resource(fetch_fee_url+'/student/'+studentId+'/feestransactions/'+transactionId,{},{
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

    factory.checkDuesReport = function(classroom,fee,otfId,type) {
        ///reports/classroom/456/feeId/654/oneTimeFeeId/987/type/789/oneTimeFee
        return $resource(fetch_fee_url+'/reports/classroom/'+ classroom +'/feeId/'+fee+'/oneTimeFeeId/'+otfId+'/type/'+type+'/oneTimeFee', {}, {
            fetch : {
                method : 'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data) {
                        return data;
                    }
                }
            }
        });
    };
    factory.checkRecurringDuesReport = function(classroom,fee,mode,recId,inst,type) {
        // branch/321/reports/classroom/classroom/fee/fee/recurringFee/recId/mode/mode/stallmentDetail/inst/type/type/recurringFee
        return $resource(fetch_fee_url+'/reports/classroom/'+ classroom +'/fee/'+fee+'/recurringFee/'+recId+'/mode/'+mode+'/stallmentDetail/'+inst+'/type/'+type+'/recurringFee', {}, {
            fetch : {
                method : 'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data) {
                        return data;
                    }
                }
            }
        });
    };

    return factory;
}]);
branchManager.controller('feeTransactionCtrl', ['$scope','feeTransactionFactory','br_manager_appConfig','$state','$modal','$localStorage',function($scope,feeTransactionFactory,br_manager_appConfig,$state,$modal,$localStorage) {

    var initials = {
        admissionFees:"",academicYear:"",transactionId:"",amount:"",transactionDate:"",
        studentId:"",standard:"",section:"",periodicity:"",period:""
    };
    $scope.transaction_type = ["One Time Fees", "Recurring Fees"];
    $scope.payment_type = ["Cash", "Cheque", "Demand Draft", "Other"];

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var year = window.btoa(selectedYear);
        feeTransactionFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            $scope.section_list =[];
            $scope.student_list =[];
            $scope.fee_list =[];
            $scope.structure_list = [];
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
        feeTransactionFactory.fetchClassRoomlist(year, standard).fetch({},function(response){
            $scope.section_list =[];
            $scope.student_list =[];
            $scope.fee_list =[];
            $scope.structure_list = [];
            console.log(response);
            if(response.status == 200){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.section_list = _data;
                }
            }
        },function(response){
            $scope.section_list = [];
            //$scope.response_msg = "No Section found for this standard.";
            console.log(response.status);
        });
    };

    $scope.fetchStudentList = function(selectedYear, currentStandard, currentSection){
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
        var section = window.btoa(currentSection.section);
        feeTransactionFactory.fetchStudentList(year,standard,section).fetch({},function(response){
            $scope.student_list =[];
            $scope.structure_list = [];
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
            //$scope.response_msg = " Studentds not found for this section.";
            console.log(response.status);
        });
    };


    $scope.fetchTransactionList = function(selectedYear){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        feeTransactionFactory.fetchTransactionList(year).fetch({},function(response){
            $scope.fee_list = [];
            console.log(response);
            if(response.status == 200){
                if(response.data.transactions!=undefined){
                    var _data = angular.fromJson(response.data.transactions);
                    $scope.fee_list = _data;
                    $scope.$parent.setBaseContentHeight($scope.fee_list.length);
                }
            }
        },function(response){
            $scope.fee_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };
    $scope.fetchStudentFeeList = function(selectedYear,currentStudent){
        $scope.structure_list = [];
        var year = window.btoa(selectedYear);
        var student = window.btoa(currentStudent.studentId);
        feeTransactionFactory.fetchStudentFeeList(year,student).fetch({},function(response){
            console.log(response);
            if(response.status == 200){
                if(response.data.transactions!=undefined){
                    var _data = angular.fromJson(response.data.transactions);
                    $scope.fee_list = _data;
                    $scope.$parent.setBaseContentHeight($scope.fee_list.length);
                }
            }
        },function(response){
            $scope.fee_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.viewTransaction = function(fee,index){
        $scope.respnose_msg = "";
        $scope.trans_list = fee.feeDetails;
        console.log(fee);
        console.log($scope.trans_list);
    };

    $scope.festchStudentFeesStructure = function(currentSection, student){
        var stud = window.btoa(student.studentId);
        var section = window.btoa(currentSection.classRoomId);
        feeTransactionFactory.festchStudentFeesStructure(section, stud).fetch({},function(response){
            $scope.structure_list = "";
            if(response.status == 200 || response.status == 201){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.structure_list = _data;
                    $scope.onetime_type = $scope.structure_list.oneTimeFees;
                    $scope.recurring_type = $scope.structure_list.recurringFees;
                }
            }
        },function(response){
            $scope.structure_list = [];
        });
    };

    $scope.classroomFeeStructure = function (classroom) {
        var id = window.btoa(classroom.classRoomId);
        feeTransactionFactory.classroomFeeStructure(id).fetch({}, function(response){
            $scope.classroom_fees = [];
            if(response.status == 200 || response.status == 201){
                if(response.data !=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.classroom_fees = _data;
                    $scope.fee_id = $scope.classroom_fees.feeId;
                    $scope.one_time_fee = $scope.classroom_fees.oneTimeFees;
                    $scope.modes = $scope.classroom_fees.modes;
                }
            }
        },function(response){
            $scope.classroom_fees = [];
        });
    };

    $scope.notIn = 'due';

    $scope.checkboxClick = function(check){
        if($scope.notIn == 'paid'){
          $scope.notIn = 'due';
          $scope.due_list = [];
         }else{
          $scope.notIn = 'paid';
          $scope.due_list = [];
        }
        if(check != false){
            $scope.Theader = "Paid Student List";
        }else{
            $scope.Theader = "Unpaid Student List";
        }
    };

    $scope.isVisibleS = false;
    $scope.isVisibleF = false;
    $scope.toOnetime = function(value){
        $scope.isVisibleS = value == 'O';
        $scope.isVisibleF = false;
        $scope.notIn = 'due';
        $scope.Theader = "Unpaid Student List";
        $scope.due_list = [];
    };
    $scope.toRecurring = function(value){
        $scope.isVisibleF = value == 'R';
        $scope.isVisibleS = false;
        $scope.Theader = "Unpaid Student List";
        $scope.notIn = 'due';
        $scope.due_list = [];
    };

    $scope.checkDues = function (section, fee_id, otf) {
        var classroom = window.btoa(section.classRoomId);
        var feeId = window.btoa(fee_id);
        var type = window.btoa($scope.notIn);
        var otfId = window.btoa(otf.oneTimeFeeId); //recurringId
        feeTransactionFactory.checkDues(classroom, feeId, otfId,type).fetch({}, function(response){
            $scope.due_list = [];
            if(response.status == 200 || response.status == 201){
                if(response.data.students !=undefined){
                    var _data = angular.fromJson(response.data.students);
                    $scope.due_list = _data;
                }
            }
        },function(response){
            $scope.due_list = [];
        });
    };

    $scope.checkRecurringDues = function (section,fee_id,rcf,obj,instalment) {
        var classroom = window.btoa(section.classRoomId);
        var feeId = window.btoa(fee_id);
        var rcfId = window.btoa(obj.recurringId);
        var inst = window.btoa(instalment);
        var mode = window.btoa(rcf.mode);
        var type = window.btoa($scope.notIn);
        feeTransactionFactory.checkRecurringDues(classroom, feeId, rcfId,mode,inst,type).fetch({}, function(response){
            console.log(response);
            $scope.due_list = [];
            if(response.status == 200 || response.status == 201){
                if(response.data.students !=undefined){
                    var _data = angular.fromJson(response.data.students);
                    $scope.due_list = _data;
                }
            }
        },function(response){
            $scope.due_list = [];
        });
    };

    $scope.getDetails = function(structure) {
        $scope.response_msg1 = "";
        $scope.feestructure = structure;
        $scope.onetimes = structure.oneTimeFees;
        $scope.recurrings = structure.recurringFees;
        $scope.oneTimeDiscountTotal = structure;
        $scope.recurringDiscountTotal = structure;
    };


    $scope.addFeesTransaction = function(){
        $scope.fetchStandardList($scope.academicYear);
        $scope.response_msg = "";

        $scope.installments = function(installment){
            $scope.installment_list = installment.installmentDetails;
        };

        $scope.otfs = [];
        $scope.modes = [];

        $scope.addOneTime = function() {
            var newItem = $scope.otfs.length+1;
            $scope.otfs.push({'id':'otf'+newItem,'mode':'OneTimeFee','type': ''});
        };
        $scope.removeOneTime = function() {
            var lastMode = $scope.otfs.length-1;
            $scope.otfs.splice(lastMode);
        };

        $scope.addNewMode = function() {
            var newItem = $scope.modes.length+1;
            $scope.modes.push({'id':'mode'+newItem,'type': ''});
        };
        $scope.removeMode = function() {
            var lastMode = $scope.modes.length-1;
            $scope.modes.splice(lastMode);
        };
        $scope.add = angular.copy(initials);

    };

    $scope.createFeesTransaction = function(student,ptype,currentStd){
        $scope.response_msg = "";
        $scope.response_msg1 = "";

        $scope.otfs.forEach(function(v){
            delete v.id;
            v.type = v.feeId.type;
            v.feeId = v.feeId.oneTimeFeeId;
        });

        $scope.modes.forEach(function(v){
            delete v.id;
            v.type = v.feeId.type;
            v.feeId = v.feeId.recurringId;
        });

        $scope.transaction = $scope.modes.concat($scope.otfs);

        var add = $scope.add;
        var body = {
            "year": $scope.academicYear,
            "paymentDetails": add.paymentDetails,
            "modeOfpayment": ptype,
            "receivedBy": add.recievedBy,
            //"receiptId": add.recieptId,
            "feeDetails": $scope.transaction
        };

        var student = window.btoa(student.studentId);
        var classroomId = window.btoa(currentStd);
        var response = feeTransactionFactory.createFeesTransaction(student,classroomId);
        var data = response.add({}, body,function (response){
            if(response.status == 200 || response.status == 201){
                $scope.onetime_type = [];
                $scope.recurring_type = [];
                $state.go('^.lists');
            }
            $scope.response_msg = "Fee transaction done successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1 = "Fee Transaction incomplete !!!";
        });
    };

   /* $scope.deleteTransaction = function(fee,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var student = window.btoa(fee.studentId);
        var transaction = window.btoa(fee.transactionId);

        var dialogue_message = "Are you sure to delete the Transaction ?";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                console.log(fee.transactionId);
                feeTransactionFactory.deleteTransaction(transaction,student).remove({},function(response){
                    if(response.status == 200){
                        $state.go('^.lists');
                    }
                },function(response){
                    $scope.response_msg = "Fee Transaction Deletion Failed !!";
                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };*/



    $scope.checkDuesReport = function(section,fee_id,otf){
        var sec = window.btoa(section.classRoomId);
        var feeId = window.btoa(fee_id);
        var otfId = window.btoa(otf.oneTimeFeeId);
        var type = window.btoa($scope.notIn);

        if( otf == undefined){
            window.alert("Please fill all the details correctly");
        }
        else {
            feeTransactionFactory.checkDuesReport(sec,feeId,otfId,type).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200 || response.status == 201) {
                    console.log("Reponse.data.byteLength = "+response.data.byteLength);
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        $scope.fileURL = URL.createObjectURL(file);
                        $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                    } else {
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
                    }
                }
            }, function (response) {
                console.log("errorrrrrr")
            });
        }
    };
    $scope.checkRecurringDuesReport = function(section,fee_id,rcf,obj,instalment){
        var sec = window.btoa(section.classRoomId);
        var feeId = window.btoa(fee_id);
        var mode = window.btoa(rcf.mode);
        var recFee = window.btoa(obj.recurringId);
        var insta = window.btoa(instalment);
        var type = window.btoa($scope.notIn);

        if( instalment == undefined || obj == undefined){
            window.alert("Please All the Details Correctly");
        }
        else {
            feeTransactionFactory.checkRecurringDuesReport(sec, feeId, mode, recFee, insta,type).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200 || response.status == 201) {
                    console.log("Reponse.data.byteLength = "+response.data.byteLength);
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
                console.log("errorrrrrr");
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
        saveAs($scope.file, 'Fees Due Unpaid or Paid Report' + '.pdf');
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.structure_list = [];
        $scope.fee_list = [];
        $state.go('feeTran.lists');
    };
    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.structure_list = [];
        $scope.fee_list = [];
        $scope.due_list = [];
        $state.go('feeTran.lists');
        $state.go('reports.main');
    };

    $scope.init = function(){
        $scope.years = $localStorage.years;
        $scope.academicYear = $localStorage.academicYear.successMessage;
        $scope.structure_list = [];
        $scope.fee_list = [];
        $scope.due_list = [];
    };

    $scope.init();

}]);
