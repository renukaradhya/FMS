
var branchManager = angular.module('branchManager',['ui.date','ui.bootstrap','blockUI','slimScrollDirective','highcharts-ng','angularUtils.directives.dirPagination','config_app','ui.bootstrap','branchManager_login',"checklist-model",'ui.router', 'ngRoute', 'ngResource','ngStorage','ui.bootstrap.modal']);

branchManager.factory('branchManagerFactory',['$resource','br_Manager_Config','$window',function($resource,br_Manager_Config,$window){
    var factory = {};
    var baseUrl = br_Manager_Config.getBaseUrl();
    var password_url= br_Manager_Config.getPasswordApi();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchBranchInfo = function(){
        return $resource(baseUrl,{},{
            fetch: {
                method: 'get',
                isArray: false,
                headers:{'Authorization' : authCode},
                interceptor: {
                    response: function (data) {
                        return data;
                    }
                }
            }
        });
    };

    factory.changePassword = function(uid){
        // http://localhost:8080/feesmanagementsystem/org/sdfaf/user/dsafa/password
        return $resource(password_url+'/user/'+uid+'/password',{},{
            pass:{
                method:'PUT',
                headers:{ 'Authorization' :authCode, 'Content-Type': 'application/json'},
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

branchManager.run([function () {

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

branchManager.controller('mainCtrl',['$scope','$location','br_Manager_Config','$window',function($scope,$location,br_Manager_Config,$window) {
    var flag = br_Manager_Config.setConfig();

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

branchManager.controller('companyCtrl',['$scope','branchManagerFactory','$state','$timeout','$window',function($scope,branchManagerFactory,$state,$timeout,$window){

     var company = branchManagerFactory.fetchBranchInfo().fetch({},function(response){
         $scope.todaydate = new Date();
         console.log(response);
       if(response.status == 200) {
           var _data = angular.fromJson(response.data);
           var branch_info = {
               "orgName": _data.orgName,
               "address": _data.address,
               "branchName": _data.branchName,
               "pincode": _data.pincode,
               "branchId": _data.branchId,
               "managerName": _data.branchManagerName

           };
           $scope.$parent.logo_image = "images/loading5.jpg";

           $scope.$parent.orgName = branch_info.orgName;
           $scope.$parent.branchId = branch_info.branchId;
           $scope.$parent.branchName = branch_info.branchName;
           $scope.$parent.address = branch_info.address;
           $scope.$parent.pincode = branch_info.pincode;
           $scope.$parent.managerName = branch_info.managerName;
           $state.go('dash');
       }
    },error);

    $scope.setBaseContentHeight = function(length){
        if(length > 10){
            $('.base-content').css({'height':'100%'});
            $('.slim-content').slimScroll({
                height: "95%",
                alwaysVisible: false,
                size: "3px"
            }).css("width", "100%");
            $('.table-base .slimScrollDiv').css('min-width','660px');
        }else{
            $('.base-content').height('auto');
            $('.slim-content').slimScroll({
                destroy:true
            });
        }
    };

    $state.go('dash');
}]);

branchManager.config(['$stateProvider','$urlRouterProvider','$routeProvider','$locationProvider','blockUIConfig',function($stateProvider,$urlRouterProvider,$routeProvider, $locationProvider,blockUIConfig) {
   /*$httpProvider.defaults.useXDomain = true;
   delete $httpProvider.defaults.headers.common['X-Requested-With'];*/

  $urlRouterProvider.otherwise("/#");

  $stateProvider
      .state('dash', {
          url: "/dash",
          templateUrl: 'views/br_manager/pc_dashboard.html',
          controller:'dashCtrl'
      })
      .state('pass', {
          url: "/pass",
          templateUrl: 'views/br_manager/change_password.html',
          controller:'passwordCtrl'
      })

      // ******************* Vehicle Management *******************
      .state('vehicle', {
    	  abstract:true,
          url: "/vehicle",
          template: '<div ui-view style="height:100%"></div>',          
          controller:'vehicleManagementCtrl'
      })
      .state('vehicle.list', {
            url: "",          
            templateUrl: 'views/br_manager/mg_vehicleManagement.html'
      })
      .state('vehicle.add', {
            url: "",
            templateUrl: 'views/br_manager/mg_addVehicle.html'
      })
      .state('vehicle.edit', {
          url: "",
          templateUrl: 'views/br_manager/mg_editVehicle.html'
      })
      .state('vehicle.delete', {
            url: "",
            templateUrl: 'views/br_manager/mg_vehicleManagement.html'
      })
      .state('vehicle.route', {
            url: "",
            templateUrl: 'views/br_manager/mg_VehicleRoutes.html'
      })
      .state('vehicle.addroute', {
            url: "",
            templateUrl: 'views/br_manager/mg_addRoute.html'
      })
      .state('vehicle.points', {
          url: "",
          templateUrl: 'views/br_manager/mg_BoardingPoints.html'
      })
      .state('vehicle.addpoints', {
          url: "",
          templateUrl: 'views/br_manager/mg_addBoardingPoints.html'
      })
      .state('vehicle.assign', {
          url: "",
          templateUrl: 'views/br_manager/mg_assignRoute.html'
      })
      .state('vehicle.assign1', {
          url: "",
          templateUrl: 'views/br_manager/mg_assignDriver.html'
      })
      .state('vehicle.editroute', {
          url: "",
          templateUrl: 'views/br_manager/mg_editRoute.html'
      })
      .state('vehicle.view', {
          url: "",
          templateUrl: 'views/br_manager/mg_vehicleRouteDetails.html'
      })

      .state('assess',{
               abstract:true,
               url: "/assess",
               template: '<div ui-view style="height:100%"></div>',
               controller: 'assessmentCtrl'
      })
      .state('assess.list',{
          url: "",
          templateUrl: 'views/br_manager/mg_assessment.html'
      })
      .state('assess.create',{
          url: "",
          templateUrl: 'views/br_manager/mg_addAsessments.html'
      })
      .state('assess.view',{
          url: "",
          templateUrl: 'views/br_manager/mg_assessmentDetails.html'
      })
      .state('assess.edit',{
          url: "",
          templateUrl: 'views/br_manager/mg_editAssessment.html'
      })


      .state('fuelbook', {
          abstract:true,
          url: "/fuelbook",
          template: '<div ui-view style="height:100%"></div>',
          controller:'fuelbookManagementCtrl'
      })
      .state('fuelbook.list', {
          url: "",
          templateUrl: 'views/br_manager/mg_FuelBookManagement.html'
      })
      .state('fuelbook.add', {
          url: "",
          templateUrl: 'views/br_manager/mg_addFuelbookEntry.html'
      }).state('fuelbook.edit', {
          url: "",
          templateUrl: 'views/br_manager/mg_editFuelbook.html'
      })
      .state('fuelbook.delete', {
          url: "",
          templateUrl: 'views/br_manager/mg_FuelBookManagement.html'
      })

      //  ****************** Strudent Management *****************
      .state('sm', {
          abstract:true,
          url: "/sm",
          template: '<div ui-view style="height:100%"></div>',
          controller:'studentManageCtrl'
      })
      .state('sm.list', {
          url: "",
          templateUrl: 'views/br_manager/SM.html'
      })
      .state('sm.add', {
          url: "",
          templateUrl: 'views/br_manager/mg_newAdmission1.html'
      })
      .state('sm.read', {
          url: "",
          templateUrl: 'views/br_manager/mg_reAdmisson.html'
      })
      .state('sm.view', {
          url: "",
          templateUrl: 'views/br_manager/mg_studentCompleteDetails.html'
      })
      .state('sm.assign', {
          url: "",
          templateUrl: 'views/br_manager/mg_assignStudent.html'
      })
      .state('sm.board', {
          url: "",
          templateUrl: 'views/br_manager/mg_ studentRouteInfo.html'
      })
      .state('sm.choose', {
          url: "",
          templateUrl: 'views/br_manager/mg_studentFeesMode.html'
      })

      .state('photo',{
          abstract: true,
          url: "/photo",
          template: '<div ui-view style="height:100%"></div>',
          controller: 'photoCtrl'
      })
      .state('photo.img', {
          url: "",
          templateUrl: 'views/br_manager/mg_uploadPhoto.html'
      })
      .state('photo.facultyphoto', {
          url: "",
          templateUrl: 'views/br_manager/mg_facultyPhoto.html'
      })
      .state('photo.logo',{
          url:"",
          templateUrl: 'views/br_manager/logo.html'
      })

      .state('spm', {
          abstract:true,
          url: "/spm",
          template: '<div ui-view style="height:100%"></div>',
          controller:'studentPromotionsManagementCtrl1'
      })
      .state('spm.list', {
          url: "",
          templateUrl: 'views/br_manager/mg_studentPromotionManagement.html'
      })
      .state('spm.promo', {
          url: "",
          templateUrl: 'views/br_manager/mg_promotionDetails.html'
      })
      .state('spm.promote', {
          url: "",
          templateUrl: 'views/br_manager/mg_studentPromotion.html'
      })

      // *****************  Promotion Controller *****************
       .state('promotion', {
          abstract:true,
          url: "/promotion",
          template: '<div ui-view style="height:100%"></div>',
          controller:'studentPromotionsManagementCtrl'
      })
      .state('promotion.list', {
          url: "",
          templateUrl: 'views/br_manager/mg_studentPromotionManagement.html'
      })
      .state('promotion.studentdetails', {
          url: "",
          templateUrl: 'views/br_manager/mg_studentDetails.html'
      })
      .state('promotion.read', {
          url: "",
          templateUrl: 'views/br_manager/mg_readmission.html'
      })
       .state('promotion.studentadmission', {
          url: "",
          templateUrl: 'views/br_manager/mg_studentPromotion.html'
      })

      // **************** Classroom Management *****************
      
      .state('classroom', {
            abstract:true,
            url: "/classroom",
            template: '<div ui-view style="height:100%"></div>',
            controller:'classroomManagementCtrl'
      })
      .state('classroom.list', {
            url: "",
            templateUrl: 'views/br_manager/mg_classroom.html'
        })
      .state('classroom.add', {
            url: "",
            templateUrl: 'views/br_manager/mg_addClassroom.html'
        })
      .state('classroom.edit', {
          url: "",
          templateUrl: 'views/br_manager/mg_editClassroom.html'
      })
      .state('classroom.view', {
          url: "",
          templateUrl: 'views/br_manager/mg_classroomSubjects.html'
      })
      .state('classroom.delete', {
            url: "",
            templateUrl: 'views/br_manager/CR.html'
        })
      .state('classroom.assign', {
          url: "",
          templateUrl: 'views/br_manager/mg_assignFaculty.html'
      })

      // **************** Faculty Management ****************
      .state('faculty', {
    	  abstract:true,
          url: "/faculty",
          template: '<div ui-view style="height:100%"></div>',          
          controller:'facultyManagementCtrl'
      })
      .state('faculty.list', {
            url: "",
            templateUrl: 'views/br_manager/mg_facultyManagement.html'
        })
      .state('faculty.add', {
            url: "",
            templateUrl: 'views/br_manager/mg_addFaculty.html'
      })
      .state('faculty.edit', {
            url: "",
            templateUrl: 'views/br_manager/mg_editFaculty.html'
      })
      .state('faculty.view', {
            url: "",
            templateUrl: 'views/br_manager/mg_FacultyCompleteInfo.html'
      })
      .state('faculty.addleave', {
          url: "",
          templateUrl: 'views/br_manager/mg_SetLeaveState.html'
      })
      .state('faculty.setleave', {
          url: "",
          templateUrl: 'views/br_manager/mg_defaultFacultyLeaves.html'
      })

      .state('staff', {
          abstract:true,
          url: "/staff",
          template: '<div ui-view style="height:100%"></div>',
          controller:'nonTeachingFacultyController'
      })
      .state('staff.list', {
          url: "",
          templateUrl: 'views/br_manager/mg_nonTeachingStaff.html'
      })
      .state('staff.add', {
          url: "",
          templateUrl: 'views/br_manager/mg_addNonTeachingFaculty.html'
      })
      .state('staff.edit', {
          url: "",
          templateUrl: 'views/br_manager/mg_editNonTeachingStaff.html'
      })

      .state('leave', {
          abstract:true,
          url: "/leave",
          template: '<div ui-view style="height:100%"></div>',
          controller:'facultyLeaveCtrl'
      })
      .state('leave.list', {
          url: "",
          templateUrl: 'views/br_manager/mg_facultyLeaveManagement.html'
      })
      .state('leave.details', {
          url: "",
          templateUrl: 'views/br_manager/mg_leaveSummary.html'
      })

      // *************** Inventary Managerment ******************
       .state('inventory', {
    	  abstract:true,
          url: "/inventory",
          template: '<div ui-view style="height:100%"></div>',          
          controller:'inventoryManagementCtrl'
      })
      .state('inventory.list', {
            url: "",
            templateUrl: 'views/br_manager/mg_inventoryManagement.html'
      })
      .state('inventory.edit', {
          url: "",
          templateUrl: 'views/br_manager/mg_editIventary.html'
      })
      .state('inventory.add', {
            url: "",
            templateUrl: 'views/br_manager/mg_addInventory.html'
        })

    //******************  library management ********************
      .state('library', {
          abstract:true,
          url:"/library",
          template: '<div ui-view style ="height:100%"></div>',
          controller: 'libraryManagementCtrl'
      })
      .state('library.assign', {
          url: "",
          templateUrl: 'views/br_manager/mg_libraryAssign.html'
      })
      .state('library.list', {
          url: "",
          templateUrl: 'views/br_manager/mg_libraryManagement.html'
      })
      .state('library.delist', {
          url: "",
          templateUrl: 'views/br_manager/mg_libraryDefaulter.html'
      })
      .state('library.add', {
          url: "",
          templateUrl: 'views/br_manager/mg_addLibraryBook.html'
      })
      .state('library.edit', {
            url: "",
          templateUrl: 'views/br_manager/mg_editLibraryBook.html'
      })
      .state('library.ret', {
          url: "",
          templateUrl: 'views/br_manager/mg_libraryUnissue.html'
      })
      .state('library.search', {
          url: "",
          templateUrl: 'views/br_manager/mg_libraryManagement.html'
      })
      .state('library.report', {
          url: "",
          templateUrl: 'views/br_manager/mg_library_report.html'
      })

      // ********************* Fee Management ********************
      .state('fee', {
    	  abstract:true,
          url: "/fee",
          template: '<div ui-view style="height:100%"></div>',  
          controller:'feeManagementCtrl'
      })
      .state('fee.list', {
            url: "",
            templateUrl: 'views/br_manager/mg_feeManagement.html'
        })
      .state('fee.add', {
            url: "",
            templateUrl: 'views/br_manager/mg_addFee.html'
        })
      .state('fee.edit', {
          url: "",
          templateUrl: 'views/br_manager/mg_editFeesStructure.html'
      })
      .state('fee.assign', {
          url: "",
          templateUrl: 'views/br_manager/mg_assignFees.html'
      })
      .state('fee.details', {
          url: "",
          templateUrl: 'views/br_manager/mg_feeStructureDetails.html'
      })
      .state('fee.oneTimeFee', {
          url: "",
          templateUrl: 'views/br_manager/mg_addFeesOneTime.html'
      })
      .state('fee.recurringFee', {
          url: "",
          templateUrl: 'views/br_manager/mg_addFeesRecurring.html'
      })

      .state('feeTran', {
          abstract:true,
          url: "/feeTran",
          template: '<div ui-view style="height:100%"></div>',
          controller:'feeTransactionCtrl'
      })
      .state('feeTran.lists', {
          url: "",
          templateUrl: 'views/br_manager/mg_FeeTransaction.html'
      })
      .state('feeTran.stlist', {
          url: "",
          templateUrl: 'views/br_manager/mg_feeStructureStudent.html'
      })
      .state('feeTran.details', {
          url: "",
          templateUrl: 'views/br_manager/mg_transactionDetails.html'
      })
      .state('feeTran.addTran', {
          url: "",
          templateUrl: 'views/br_manager/mg_addfeesTransaction.html'
      })
      .state('feeTran.see', {
          url: "",
          templateUrl: 'views/br_manager/mg_feesDetailsStudent.html'
      })
      .state('feeTran.due', {
          url: "",
          templateUrl: 'views/br_manager/mg_FeesDueList.html'
      })
      .state('feeTran.duereport', {
          url: "",
          templateUrl: 'views/br_manager/mg_classroomOneTimeFeeReport.html'
      })

//**************** Holiday Management ************************
      .state('holiday',{
          url:"/holiday",
          template: '<div ui-view style="height:100%"></div>',
          controller:'holidaysManagementCtrl'
      })
      .state('holiday.list',{
          url:"",
          templateUrl:"views/br_manager/mg_holidaysManagement.html"
      })
      .state('holiday.add',{
          url:"",
          templateUrl:"views/br_manager/mg_addHoliday.html"
      })
      .state('holiday.edit',{
          url:"",
          templateUrl:"views/br_manager/mg_editHolidays.html"
      })

//****************** Subjects Management *********************
      .state('subject',{
          url:"/subject",
          template: '<div ui-view style="height:100%"></div>',
          controller:'subjectManagementCtrl'
      })
      .state('subject.list',{
          url:"",
          templateUrl:"views/br_manager/mg_subjectList.html"
      })
      .state('subject.add',{
          url:"",
          templateUrl:"views/br_manager/mg_addSubject.html"
      })
      .state('subject.edit',{
          url:"",
          templateUrl:"views/br_manager/mg_editSubject.html"
      })
      .state('subject.assign',{
          url:"",
          templateUrl:"views/br_manager/mg_assignsubject.html"
      })

      // ***************** Report Controller *****************
      .state('reports', {
          url: "/reports",
          template: '<div ui-view style="height:100%"></div>',
          controller:'reportCtrl'
      })
      .state('reports.main',{
          url:"",
          templateUrl:"views/br_manager/mg_reportdashbord.html"
      })
      .state('reports.branchFee',{
          url:"",
          templateUrl:"views/br_manager/mg_branchFee_report.html"
      })
      .state('reports.studentFee',{
          url:"",
          templateUrl:"views/br_manager/mg_branchFee_report_year.html"
      })
      .state('reports.back',{
          url:"",
          templateUrl:"views/br_manager/mg_reportdashbord.html"
      })
      .state('reports.classFees',{
          url:"",
          templateUrl:"views/br_manager/mg_classroomTransactions.html"
      })


      .state('classroomreports', {
          url: "/classroomreports",
          template: '<div ui-view style="height:100%"></div>',
          controller:'classroomReportsCtrl'
      })
      .state('classroomreports.classroom',{
          url:"",
          templateUrl:"views/br_manager/mg_classroomReport.html"
      })
      .state('classroomreports.main',{
          url:"",
          templateUrl:"views/br_manager/mg_reportdashbord.html"
      })

      .state('students', {
          url: "/students",
          template: '<div ui-view style="height:100%"></div>',
          controller:'studentReportsCtrl'
      })
      .state('students.student',{
          url:"",
          templateUrl:"views/br_manager/mg_studentReports.html"
      })
      .state('students.main',{
          url:"",
          templateUrl:"views/br_manager/mg_reportdashbord.html"
      })

      .state('subjects', {
          url: "/subjects",
          template: '<div ui-view style="height:100%"></div>',
          controller:'subjectReportsCtrl'
      })
      .state('subjects.sub',{
          url:"",
          templateUrl:"views/br_manager/mg_subjectsReport.html"
      })
      .state('subjects.main',{
          url:"",
          templateUrl:"views/br_manager/mg_reportdashbord.html"
      })

      .state('facultyreports', {
          url: "/facultyreports",
          template: '<div ui-view style="height:100%"></div>',
          controller:'facultyReportCtrl'
      })
      .state('facultyreports.faculty',{
          url:"",
          templateUrl:"views/br_manager/mg_facultyReport.html"
      })
      .state('facultyreports.main',{
          url:"",
          templateUrl:"views/br_manager/mg_reportdashbord.html"
      })

      .state('vehiclereports', {
          url: "/vehiclereports",
          template: '<div ui-view style="height:100%"></div>',
          controller:'vehicleReportsCtrl'
      })
      .state('vehiclereports.vehicle',{
          url:"",
          templateUrl:"views/br_manager/mg_vehicleReport.html"
      })
      .state('vehiclereports.students',{
          url:"",
          templateUrl:"views/br_manager/mg_VehicleStudentReports.html"
      })
      .state('vehiclereports.main',{
          url:"",
          templateUrl:"views/br_manager/mg_reportdashbord.html"
      })

      .state('feeReport', {
          url: "/feeReport",
          template: '<div ui-view style="height:100%"></div>',
          controller:'feeStructureReportsCtrl'
      })
      .state('feeReport.fee',{
          url:"",
          templateUrl:"views/br_manager/mg_feesStructureReports.html"
      })
      .state('feeReport.main',{
          url:"",
          templateUrl:"views/br_manager/mg_reportdashbord.html"
      })

      .state('events', {
          url: "/vehiclereports",
          template: '<div ui-view style="height:100%"></div>',
          controller:'eventReportsCtrl'
      })
      .state('events.eve',{
          url:"",
          templateUrl:"views/br_manager/mg_eventReports.html"
      })
      .state('events.main',{
          url:"",
          templateUrl:"views/br_manager/mg_reportdashbord.html"
      })


      .state('intryreport', {
          url: "/intryreport",
          template: '<div ui-view style="height:100%"></div>',
          controller:'inventaryReportsCtrl'
      })
      .state('intryreport.inventary',{
          url:"",
          templateUrl:"views/br_manager/mg_inventaryReport.html"
      })
      .state('intryreport.main',{
          url:"",
          templateUrl:"views/br_manager/mg_reportdashbord.html"
      })

      .state('time', {
          abstract : true,
          url: "/time",
          template: '<div ui-view style="height:100%"></div>',
          controller: 'timeTableCtrl'
      })
      .state('time.list', {
          url:"",
          templateUrl: 'views/br_manager/mg_timetable.html'
      })
      .state('time.add', {
          url:"",
          templateUrl: 'views/br_manager/mg_addTimetable.html'
      })


      .state('marksheet', {
          abstract : true,
          url: "/marksheet",
          template: '<div ui-view style="height:100%"></div>',
          controller: 'marksSheetCtrl'
      })
      .state('marksheet.each', {
          url:"",
          templateUrl: 'views/br_manager/mg_MarkSheetforEachAsses.html'
      })
      .state('marksheet.class', {
          url:"",
          templateUrl: 'views/br_manager/mg_Marksheetforclassroom.html'
      })
      .state('marksheet.annual', {
          url:"",
          templateUrl: 'views/br_manager/mg_MarksheetAnnual.html'
      })
      .state('marksheet.add', {
          url:"",
          templateUrl: 'views/br_manager/mg_addMarks.html'
      })
      .state('marksheet.editMarks', {
          url:"",
          templateUrl: 'views/br_manager/mg_editMarks.html'
      })
      .state('marksheet.result1', {
          url:"",
          templateUrl: 'views/br_manager/mg_assessmentResult.html'
      })
      .state('marksheet.result2', {
          url:"",
          templateUrl: 'views/br_manager/mg_assessmentResult.html'
      })
      .state('marksheet.ticket', {
          url:"",
          templateUrl: 'views/br_manager/mg_examHallTicket.html'
      })
      .state('marksheet.main',{
          url:"",
          templateUrl:"views/br_manager/mg_reportdashbord.html"
      })

     // ****************** Transfer Certificate ******************
      .state('transferCertificate', {
    	  abstract:true,
          url: "/transferCertificate",
          template: '<div ui-view style="height:100%"></div>',          
          controller:'transferCertificateCtrl'
      })
      .state('transferCertificate.view',{
          url:"",
          templateUrl:"views/br_manager/mg_transferCertificate.html"
      })
      .state('transferCertificate.study',{
          url:"",
          templateUrl:"views/br_manager/mg_studyCertificate.html"
      })
      .state('transferCertificate.icard',{
          url:"",
          templateUrl:"views/br_manager/mg_eyeCard.html"
      })

      .state('event', {
          abstract:true,
          url:"/event",
          template: '<div ui-view style = "height:100%"></div>',
          controller:'eventManagementCtrl'
      })
      .state('event.list',{
          url:"",
          templateUrl: 'views/br_manager/mg_eventManagement1.html'
      })
      .state('event.add',{
          url:"",
          templateUrl: 'views/br_manager/mg_addEvent.html'
      })
      .state('event.edit',{
          url:"",
          templateUrl:"views/br_manager/mg_editEvents.html"
      })

      .state('notify', {
          abstract:true,
          url:"/notify",
          template: '<div ui-view style = "height:100%"></div>',
          controller:'notificationCtrl'
      })
      .state('notify.sms',{
          url:"",
          templateUrl: 'views/br_manager/mg_notification.html'
      })
      .state('notify.email',{
          url:"",
          templateUrl: 'views/br_manager/mg_notification.html'
      })
      .state('notify.mail',{
          url:"",
          templateUrl: 'views/br_manager/mg_mailtostudent.html'
      })
      .state('notify.mails',{
          url:"",
          templateUrl: 'views/br_manager/mg_mailtoclassroom.html'
      })
      .state('notify.mailsAll',{
          url:"",
          templateUrl: 'views/br_manager/mg_mailToSchool.html'
      }).state('notify.mailtofaculty',{
          url:"",
          templateUrl: 'views/br_manager/mg_mailToFaculty.html'
      }).state('notify.mailsAllfaculty',{
          url:"",
          templateUrl: 'views/br_manager/mg_mailToAllFaculty.html'
      })

      .state('xlsfiles', {
          abstract:true,
          url:"/xlsfiles",
          template: '<div ui-view style = "height:100%"></div>',
          controller:'fileUploadCtrl'
      })
      .state('xlsfiles.files',{
          url:"",
          templateUrl: 'views/br_manager/mg_spreadsheets.html'
      })
      .state('xlsfiles.studentsheet',{
          url:"",
          templateUrl: 'views/br_manager/mg_spreadsheetStudent.html'
      })
      .state('xlsfiles.marksheet',{
          url:"",
          templateUrl: 'views/br_manager/mg_spreadsheetMarksheet.html'
      })
      .state('xlsfiles.facultysheet',{
          url:"",
          templateUrl: 'views/br_manager/mg_spreadsheetFaculty.html'
      })
      .state('xlsfiles.inventarysheet',{
          url:"",
          templateUrl: 'views/br_manager/mg_spreadsheetInventory.html'
      })
      .state('xlsfiles.vehiclesheet',{
          url:"",
          templateUrl: 'views/br_manager/mg_spreadsheetVehicle.html'
      })
      .state('xlsfiles.librarysheet',{
          url:"",
          templateUrl: 'views/br_manager/mg_spreadsheetLibrary.html'
      })
      .state('xlsfiles.video',{
          url:"",
          templateUrl: 'views/br_manager/video.html'
      })
      .state('xlsfiles.download',{
          url:"",
          templateUrl: 'views/br_manager/mg_downloadTemplates.html'
      })

      .state('settings', {
          abstract:true,
          url:"/settings",
          template: '<div ui-view style = "height:100%"></div>',
          controller:'branchSettingsController'
      })
      .state('settings.list',{
          url:"",
          templateUrl: 'views/br_manager/mg_settings.html'
      })
      .state('settings.std',{
          url:"",
          templateUrl: 'views/br_manager/mg_settingspost.html'
      })
      .state('settings.sec',{
          url:"",
          templateUrl: 'views/br_manager/mg_settingsections.html'
      })

      // ***************** Strudy Certificate *********************
       .state('studyCertificate', {
    	  abstract:true,
          url: "/study",
          template: '<div ui-view style="height:100%"></div>',          
          controller:'studyCertificateManagementCtrl'
      });

    $locationProvider.html5Mode(true);
    blockUIConfig.message =  "Processing ...";

}]);

branchManager.controller('logoutCtrl', ['$scope', '$window','$localStorage','$sessionStorage',function($scope, $window,$localStorage,$sessionStorage) {
    $scope.logout = function(){
        $window.sessionStorage.removeItem('psId');
        $window.sessionStorage.removeItem('pcId');
        $window.sessionStorage.removeItem('userId');
        $window.sessionStorage.clear();
        $window.localStorage.clear();
        $sessionStorage.$reset();
        $localStorage.$reset();
        $window.location = 'appLogin.html';
    }
}]);

branchManager.controller('passwordCtrl', ['$scope','branchManagerFactory','$state','$timeout','$window',function($scope,branchManagerFactory,$state,$timeout,$window) {
    var initials = {
        username:"",oldPassword:"",newPassword:"",confirmPassword:""
    };

    $scope.passwordChange = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };
    $scope.changePassword = function(){

        var uid = $window.sessionStorage.getItem('userId');
        console.log("udi "+ uid);
        var add = $scope.add;
        var body = ' { ' +
            '"username":"' + add.username + '",' +
            '"oldPassword" :"' + add.oldPassword + '",'+
            '"newPassword" :"'+ add.newPassword + '",' +
            '"confirmPassword" :"'+ add.confirmPassword +
            '"}';
        var user = window.btoa(uid);
        var response = branchManagerFactory.changePassword(user);
        var data = response.pass({}, body, function (response) {
            if(response.status == 200){
               alert("Password Changed successfully!!!");
                $window.location = 'index.html';
            }
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Password change is unsuccessful !!!";
        });
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('dash');
    };
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

branchManager.controller('dialogeCtrl', ['$scope', '$modalInstance','data',function ($scope, $modalInstance,data) {
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

