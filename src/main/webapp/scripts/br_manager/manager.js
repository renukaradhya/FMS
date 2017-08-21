var branchManager_login = angular.module('branchManager_login',['blockUI','config_app','ngRoute','ngResource']);

branchManager_login.config(['$locationProvider','blockUIConfig',function($locationProvider,blockUIConfig) {
    $locationProvider.html5Mode({enabled:true,requireBase:true});
    blockUIConfig.message =  "Logging In ...";
}]);

branchManager_login.factory('br_manager_loginFactory', ['$resource','br_Manager_Config',function($resource,br_Manager_Config){
    var factory = {};
    var login_url = br_Manager_Config.getLoginApi();

    factory.getLogin = function(type){
        return $resource(login_url+'/'+type,{},{
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

branchManager_login.controller('loginCtrl',['$scope','br_manager_loginFactory','$window',function($scope,br_manager_loginFactory,$window){

    $scope.username = '';
    $scope.password = '';

    $scope.login = function(){
        var body = '{"userName":"'+$scope.username+'","password":"'+$scope.password+'"}';
        var response = br_manager_loginFactory.getLogin($scope.login_as).login({},body,function(response){
            if(response.status == 200){
                var data = response.data;
                $window.sessionStorage.setItem('orgId',data.orgId);
                $window.sessionStorage.setItem('userId',data.userId);
                $window.sessionStorage.setItem('branchId',data.branchId);
                $window.localStorage.setItem('authCode', data.authCode);
                console.log("orgId"+ data.orgId);
                console.log("userId"+ data.userId);
                console.log("branchId"+ data.branchId);
                $window.location = 'pc_main.html';
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

   /* if(data.status == 404)
        $scope.$parent.response_message = "Userid and password did not match";*/
}

var branchManager = angular.module('branchManager',['ui.bootstrap','blockUI','slimScrollDirective','highcharts-ng','angularUtils.directives.dirPagination','config_app','ui.bootstrap','branchManager_login',"checklist-model",'ui.router', 'ngRoute', 'ngResource']);

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
          templateUrl: 'views/br_manager/mg_assessmentMarks.html'
      })
      .state('marksheet.editMarks', {
          url:"",
          templateUrl: 'views/br_manager/mg_editassesmentMarks.html'
      })
      .state('marksheet.result1', {
          url:"",
          templateUrl: 'views/br_manager/mg_assessmentResult.html'
      })
      .state('marksheet.result2', {
          url:"",
          templateUrl: 'views/br_manager/mg_assessmentResult.html'
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
      .state('xlsfiles.logo',{
          url:"",
          templateUrl: 'views/br_manager/logo.html'
      })
      .state('xlsfiles.video',{
          url:"",
          templateUrl: 'views/br_manager/video.html'
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

branchManager.controller('logoutCtrl', ['$scope', '$window',function($scope, $window) {
    $scope.logout = function(){
        $window.sessionStorage.removeItem('psId');
        $window.sessionStorage.removeItem('pcId');
        $window.sessionStorage.removeItem('userId');
        $window.location = 'index.html';
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


branchManager.factory('dashFactory',['$resource','br_Manager_Config', '$window',function($resource,br_Manager_Config, $window){
    var factory = {};
    var fetch_dashboard_asset_url = br_Manager_Config.getAssetAPI();
    var mainUrl = br_Manager_Config.getMainAPI();
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


    factory.vehiclegrowth = function(){
        return $resource(mainUrl+'/dashboard/numberoFvehicales',{},{
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


    //http://localhost:8080/Eshiksha/org/org9074784334/branch/branch4378775/dashboard/numberoFfaculties
    factory.facultygrowth = function(){
        return $resource(mainUrl+'/dashboard/numberoFfaculties',{},{
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

    //http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/dashboard/newadmissions
    factory.fetchAdmissionsCount = function(){
        return $resource(mainUrl+'/dashboard/newadmissions',{},{
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


branchManager.controller("dashCtrl",['$scope','$interval','dashFactory',function($scope,$interval,dashFactory){

    $scope.fetchAssetList = function(){
        $scope.response_msg = "";
        dashFactory.fetchAssetList().fetch({},function(response){
            console.log(response);
            $scope.asset_info =[];
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.asset_info = _data;
                }
            }
        },function(response){
            $scope.asset_info = [];
            //console.log(response.status);
        });
    };

    function vehicleData(){
        dashFactory.vehiclegrowth().fetch({},function(response){
            //console.log(response);
            $scope.data1 = [];
            if(response.status == 200 || response.status == 201){
                if(response.data.vehicales.length!=undefined){
                    var _data = angular.fromJson(response.data.vehicales);
                    $scope.data1 = _data;
                }
            }
        },function(response){
            $scope.data1 = [];
            console.log(response.status);
        });
    }vehicleData();

    function facultyData(){
        dashFactory.facultygrowth().fetch({},function(response){
            //console.log(response);
            $scope.faculty_info = [];
            if(response.status == 200 || response.status == 201){
                if(response.data.facultyListWithYear.length!=undefined){
                    var _data = angular.fromJson(response.data.facultyListWithYear);
                    $scope.data = _data;
                    //$scope.values = $scope.faculty_info.studentCountWithYearDTO;
                }
            }
        },function(response){
            $scope.faculty_info = [];
            console.log(response.status);
        });
    }facultyData();

    function pieChartData(){
        dashFactory.fetchAdmissionsCount().fetch({},function(response){
            //console.log(response);
            $scope.chart_info = [];
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.chart_info = _data;
                    $scope.values = $scope.chart_info.studentCountWithYearDTO;
                }
            }
        },function(response){
            $scope.chart_info = [];
            console.log(response.status);
        });
    }
    pieChartData();

}]);

branchManager.directive('pieChart', function() {
    return {
        restrict: 'E',
        scope: {
            data1: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('data1', function(data1) {
                if (data1) {
                   // console.log('values from directive: ', values);

                    var margin = {top: 40, right: 5, bottom: 20, left: 30},
                        width = 300 - margin.left - margin.right,
                        height = 250 - margin.top - margin.bottom,
                        radius = Math.min(width, height) / 2 ;



                    var color = d3.scale.ordinal()
                        .range(["#ff3300", "#0066ff", "#009933", "#8000ff", "#00e6e6", "#004080", "#b35900"]);

                    var arc = d3.svg.arc()
                        .outerRadius(radius - 10)
                        .innerRadius(0);
                    var arcOver = d3.svg.arc()
                        .innerRadius(0)
                        .outerRadius(radius);

                    var pie = d3.layout.pie()
                        .sort(null)
                        .value(function(d) {
                            return d.vehicleCount;
                        });

                /*    d3.select("#piechart").append("text")
                        .attr("x", (width + margin.left + margin.right)/4)
                        .attr("y", 10)
                        .attr("class","title")
                        .attr("text-anchor", "middle")
                        .text("Students growth in a school Pie Chart")
                    ;*/

                    var svg = d3.select("#piechart").append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


                    var arcs = svg.selectAll(".arc")
                        .data(pie(data1))
                        .enter().append("g")
                        .attr("class", "arc");


                    arcs.append("path")
                        .attr("d", arc)
                        .style("fill", function(d) {
                            return color(d.data.year);
                        })
                        .on("mouseover", function(d) {
                            d3.select(this).transition()
                                .duration(500)
                                .attr("d", arcOver);
                        })
                        .on("mouseout", function(d) {
                            d3.select(this).transition()
                                .duration(500)
                                .attr("d", arc);
                        });

                    arcs.append("text")
                        .attr("transform", function(d) {
                            return "translate(" + arc.centroid(d) + ")";
                        })
                        .attr("dy", ".35em")
                        .style("text-anchor", "middle")
                        .text(function(d) {
                            return d.data.year;
                        });

                }
            })
        }
    }
});

branchManager.directive('barChart', function() {
    return {
        restrict: 'E',
        scope: {
            values: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('values', function(values) {
                if (values) {
                   // console.log('values from directive: ', values);

                    var margin = {top: 30, right: 5, bottom: 20, left: 30},
                        width = 300 - margin.left - margin.right,
                        height = 250 - margin.top - margin.bottom,
                        barPadding = 5
                        ;

                    var color = d3.scale.ordinal()
                        .range(["#00ff00", "#ff9900", "#666633", "#6666ff", "#ff5050", "#006699", "#993333"]);

                    var xScale = d3.scale.linear()
                            .domain([0, values.length])
                            .range([0, width])
                        ;


                    var yScale = d3.scale.linear()
                            .domain([0, d3.max(values, function(d) { return d.studentCount; })])
                            .range([height, 0])
                        ;

                    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom");
                    //.ticks(5);

                    var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([-10, 0])
                        .html(function(d) {
                            return "<strong>Student Count:</strong> <span style='color:red'>" + d.studentCount + "</span><br/>"+"<strong>Year:</strong> <span style='color:red'>"+ d.year +"</span>";
                        });

                    var svg = d3.select("#barchart")
                            .append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .attr("id","barChartPlot")
                        ;
                    svg.call(tip);

                    var plot = svg
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    //.call(yAxis)
                        ;
                    plot.selectAll("rect")
                        .data(values)
                        .enter()
                        .append("rect")
                        .attr("x", function(d, i) {
                            return xScale(i);
                        })
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide)
                        .attr("width", width / values.length - barPadding)
                        .attr("height", 0)
                        .transition()
                        .duration(2000)
                        .delay(function (d, i) {
                            return i * 50;
                        })
                        .attr("y", function(d) {
                            return yScale(d.studentCount);
                        })
                        .attr("height", function(d) {
                            return height-yScale(d.studentCount);
                        })
                        .attr("fill", function(d) {
                            return color(d.year);
                        })
                    ;
                    plot.selectAll("text")
                        .data(values)
                        .enter()
                        .append("text")
                        .text(function(d) {
                            return d.studentCount;
                        })
                        .attr("text-anchor", "middle")
                        .attr("x", function(d, i) {
                            return (i * (width / values.length)) + ((width / values.length - barPadding) / 2);
                        })
                        .attr("y", function(d) {
                            //console.log(d.studentCount);
                            return yScale(d.studentCount) + 14;
                        })
                        .attr("class", "yAxis")
                    ;
                    var xLabels = svg
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + (margin.top + height)  + ")")
                        ;

                    xLabels.selectAll("text.xAxis")
                        .data(values)
                        .enter()
                        .append("text")
                        .text(function(d) { return d.year;})
                        .attr("text-anchor", "middle")
                        .attr("x", function(d, i) {
                            return (i * (width / values.length)) + ((width / values.length - barPadding) / 2);
                        })
                        .attr("y", 15)
                        .style("fill", "#000")
                        .attr("class", "xAxis")
                    ;


                    /*svg.append("text")
                        .attr("x", (width + margin.left + margin.right)/2)
                        .attr("y", 15)
                        .attr("class","title")
                        .attr("text-anchor", "middle")
                        .style("fill", "steelblue")
                        .style("font-size", "14px")
                        .text("Students growth in a school Bar Chart")
                    ;*/
                }
            })
        }
    }
});

branchManager.directive('donutChart', function() {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('data', function(data) {
                if (data) {
                    console.log('data from directive: ', data);

                    var margin = {top: 40, right: 5, bottom: 20, left: 30},
                        width = 300 - margin.left - margin.right,
                        height = 250 - margin.top - margin.bottom,
                        radius = Math.min(width, height) / 2 ;



                    var color = d3.scale.ordinal()
                        .range(["#0000ff", "#ff3300", "#00ff00", "#ff00ff", "#ff0080", "#6600ff", "#ff5500"]);

                    var arc = d3.svg.arc()
                        .outerRadius(radius - 10)
                        .innerRadius(radius/2);
                    var arcOver = d3.svg.arc()
                        .innerRadius(radius/2 - 15)
                        .outerRadius(radius - 10);

                    var pie = d3.layout.pie()
                        .sort(null)
                        .value(function(d) {
                            return d.facultyCount;
                        });


                    var svg = d3.select("#donutchart").append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


                    var arcs = svg.selectAll(".arc")
                        .data(pie(data))
                        .enter().append("g")
                        .attr("class", "arc");


                    arcs.append("path")
                        .attr("d", arc)
                        .style("fill", function(d) {
                            return color(d.data.year);
                        })
                        .on("mouseover", function(d) {
                            d3.select(this).transition()
                                .duration(500)
                                .attr("d", arcOver);
                        })
                        .on("mouseout", function(d) {
                            d3.select(this).transition()
                                .duration(500)
                                .attr("d", arc);
                        });

                    /*arcs.append("text")
                        .attr("transform", function(d) {
                            return "translate(" + arc.centroid(d) + ")";
                        })
                        .attr("dy", ".35em")
                        .style("text-anchor", "middle")
                        .text(function(d) {
                            return d.data.year;
                        });*/
                    arcs.append("text")
                        .attr("transform", function(d) {
                            return "translate(" + arc.centroid(d) + ")";
                        })
                        .attr("dy", ".35em")
                        .style("text-anchor", "middle")
                        .text(function(d) {
                            return d.data.facultyCount;
                        });
                }
            })
        }
    }
});


branchManager.directive('lineChart', function() {
    return {
        restrict: 'E',
        scope: {
            values: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('values', function(values) {
                if (values) {


                    var values = [{
                        "studentCount": "102",
                        "year": "2000"
                    }, {
                        "studentCount": "215",
                        "year": "2001"
                    }, {
                        "studentCount": "179",
                        "year": "2002"
                    }, {
                        "studentCount": "199",
                        "year": "2003"
                    }, {
                        "studentCount": "134",
                        "year": "2003"
                    }, {
                        "studentCount": "176",
                        "year": "2010"
                    }];

                   // console.log('values from directive: ', values);

                    var margin = {top: 30, right: 5, bottom: 20, left: 30},
                        width = 300 - margin.left - margin.right,
                        height = 250 - margin.top - margin.bottom
                        ;

                    var xScale = d3.scale.linear().range([margin.left, width - margin.right]).domain([2000,2010]),
                        yScale = d3.scale.linear().range([height - margin.top, margin.bottom]).domain([0,d3.max(values, function(d) { return d.studentCount; })]),

                        xAxis = d3.svg.axis()
                            .scale(xScale)
                            .ticks(5),

                        yAxis = d3.svg.axis()
                            .scale(yScale)
                            .orient("left");


                    var svg = d3.select("#linechart").append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        ;

                        svg.append("g")
                           .attr("class","axis")
                           .attr("transform", "translate(0," + (height - margin.bottom) + ")")
                           .call(xAxis);

                        svg.append("g")
                            .attr("class","axis")
                            .attr("transform", "translate(" + (margin.left) + ",0)")
                            .call(yAxis);

                    var lineGen = d3.svg.line()
                        .x(function(d) {

                            return xScale(d.year);
                        })
                        .y(function(d) {

                            return yScale(d.studentCount);
                        })
                        .interpolate("basis");

                    svg.append('path')
                        .attr('d', lineGen(values))
                        .attr('stroke', 'green')
                        .attr('stroke-width', 2)
                        .attr('fill', 'none');

                }
            })
        }
    }
});



branchManager.factory('classroomFactory',['$resource','br_Manager_Config','$window',function($resource,br_Manager_Config,$window){
    var factory = {};
    var fetch_classroom_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");


    factory.assignFaculty = function(facultyId,classRoomId){
        return $resource(fetch_classroom_url+'/faculty/'+facultyId+'/classRoom/'+classRoomId,{},{
            assign : {
                method : 'get',
                isArray : false,
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data) {
                        return data;
                    }
                }
            }
        })
    };
    factory.removeTeacher = function(classRoomId){
        return $resource(fetch_classroom_url+'/classroom/'+classRoomId+'/faculty',{},{
            remove : {
                method : 'delete',
                isArray : false,
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data) {
                        return data;
                    }
                }
            }
        })
    };

    factory.getFacultyList = function(){
        return $resource(fetch_classroom_url+'/faculty/getFacultyId',{},{
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
        })
    };
    factory.listSubjects = function(classRoomId){
        return $resource(fetch_classroom_url+'/subject/classroom/'+classRoomId,{},{
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

    factory.fetchClassroomPdfReport = function(selcectedYear){
        return $resource(fetch_classroom_url+'/classroom/reports/year/'+selcectedYear,{},{
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

    factory.createClassroom = function(){
        console.log(authCode);
        return $resource(fetch_classroom_url+'/classroom',{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        console.log("inside createClassroom !!!");
                        return data;
                    }
                }
            }

        });
    };

    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_classroom_url+'/classroom/year/'+ selectedYear, {}, {
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

    factory.fetchSectionList = function(currentStandard, selectedYear) {
        return $resource(fetch_classroom_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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

    factory.updateClassroom = function(classRoomId){
        return $resource(fetch_classroom_url+'/classroom/'+classRoomId+"/update",{},{
            edit:{
                method:'PUT',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        console.log("update success!!!!");
                        return data;
                    }
                }
            }
        });
    };


    factory.deleteClassroom = function(classRoomId){
        console.log("Classroom Id: "+ classRoomId);
        return $resource(fetch_classroom_url+'/classroom/'+classRoomId+'/deactivate',{},{
            remove : {
                method: 'get',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor: {
                    response: function (data) {
                        console.log("deleted success!!!!");
                        return data;
                    }
                }
            }
        });
    };

    return factory;
}]);

branchManager.controller('classroomManagementCtrl',['$scope','classroomFactory','br_manager_appConfig','$state','$modal',function($scope,classroomFactory,br_manager_appConfig,$state,$modal){

    var initials = {
        syllabus:"",section:"",standard:"",year:"",classRoomId:"",maxcount:"",maxCount:""
    };

    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
        $scope.classroom_list = [];
        $scope.sub_list = [];
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg="";
        $scope.response_msg1 = "";
        var year = window.btoa(selectedYear);
        classroomFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list = [];
            if(response.status == 200 || response.status == 201){
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                }
            }
        }, function(response){
            $scope.standard_list = [];
            $scope.classroom_list = [];
            $scope.respnose_msg1 = "No Classes Found"
        });
    };

    $scope.fetchSectionList = function (currentStandard,selectedYear) {
        $scope.response_msg1 = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        classroomFactory.fetchSectionList(standard,year).fetch({},function(response){
            $scope.classroom_list = [];
            if(response.status == 200 || response.status ==201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classroom_list = _data;
                    $scope.$parent.setBaseContentHeight($scope.classroom_list.length);
                }
            }
        },function(response){
            $scope.classroom_list = [];
            $scope.response_msg1 = "No Classrooms Found";
            $scope.$parent.setBaseContentHeight(-1);
        })
    };

    $scope.listSubjects =function(classroom,index){
        $scope.response_msg1 = "";
        var classRoom = window.btoa(classroom.classRoomId);
        classroomFactory.listSubjects(classRoom).fetch({},function(response){
            $scope.sub_list = [];
            if(response.status == 200 || response.status == 201){
                if(response.data.subjects!=undefined){
                    var _data = angular.fromJson(response.data.subjects);
                    $scope.sub_list = _data;
                }
            }
        },function(response){
            $scope.sub_list = [];
            $scope.response_msg1 = "No Subjects Found";
        });
    };

    $scope.assignClassTeacher = function (classRoomId) {
        $scope.assign = angular.copy(initials);
        angular.forEach($scope.classroom_list, function(classroom){
            if(classRoomId == classroom.classRoomId){
                $scope.assign.classRoomId = classroom.classRoomId;
                $scope.assign.standard = classroom.standard;
                $scope.assign.section = classroom.section;
                $scope.assign.year = classroom.year;
                $scope.getFacultyList();
            }
        });
    };

    $scope.assignFaculty = function (classRoomId, faculty) {
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var classRoomId = window.btoa(classRoomId);
        var facultyId = window.btoa(faculty.facultyId);
        classroomFactory.assignFaculty(facultyId,classRoomId).assign({},function(response){
            $scope.classroom_list =[];
            if(response.status == 200 || response.status == 201){
                $scope.standard_list = [];
                $scope.fetchYearList();
            }
            $state.go('^.list');
            $scope.response_msg = "Class Teacher assigned successfully !!!.";
        },function(response){
            $scope.response_msg1 = "Class Teacher assigning is  Unsuccessful !!!.";

        });
    };

    $scope.removeTeacher = function (classroom,index) {
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var classRoomId = window.btoa(classroom.classRoomId);
        var dialogue_message = "Are you sure to Remove the Class Teacher ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                console.log(classroom.classRoomId);
                classroomFactory.removeTeacher(classRoomId).remove({},function(response){
                    if(response.status == 200 || response.status == 201){
                        $scope.standard_list = [];
                        $scope.fetchYearList();
                        console.log("deleted")
                    }
                    $scope.response_msg = "Teacher Removed successfully!!!";
                },function(response){
                    console.log(response.status);
                    if(response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg1 =  "Removing the class teacher is failed !!!";
                });
            }
            else {
                $scope.response_msg1 =  "Removing the class teacher is failed !!!";
            }
        });
    };

    $scope.getFacultyList = function () {
        classroomFactory.getFacultyList().fetch({},function(response){
            $scope.faculty_list = [];
            if(response.status == 200 || response.status == 201){
                if(response.data.faculties!=undefined){
                    var _data = angular.fromJson(response.data.faculties);
                    $scope.faculty_list = _data;
                    $scope.faculty = $scope.faculty_list[0];
                }
            }
        },function(response){
            $scope.faculty_list = [];
            $scope.response_msg1 = "No Faculties Found";
        });
    };

    $scope.syllabus_list = {
        data: [{
            id: 'id1',
            name: 'CBSE'
        }, {
            id: 'id2',
            name: 'ICSE'
        }, {
            id: 'id3',
            name: 'State Syllabus'
        }]
    };

    $scope.standards = ["Pre-Nursery","L.K.G","U.K.G","M0","M1","M2","M3","First", "Second", "Third", "Fourth","Fifth",
        "Sixth","Seventh","Eighth","Ninth","Tenth"];


    $scope.addClassroom = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };

    $scope.createClassroom = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var add = $scope.add;
        var body = ' { ' +
            '"standard":"' + add.standard + '",' +
            '"section" :"' + add.section + '",'+
            '"maxcount" :"' + add.maxcount + '",'+
            '"syllabus" :"' + add.syllabus.name + '",'+
            '"year" :"'+add.year+ '"},';
        var response = classroomFactory.createClassroom();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                $scope.fetchYearList();
            }
            $scope.response_msg = "Classroom added successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of Classroom is unsuccessful !!!";
        });
    };

    $scope.editClassroom = function(classRoomId){
        $scope.edit = angular.copy(initials);
        angular.forEach($scope.classroom_list, function(classroom){
            if(classRoomId == classroom.classRoomId){
                $scope.edit.classRoomId = classroom.classRoomId;
                $scope.edit.standard = classroom.standard;
                $scope.edit.section = classroom.section;
                $scope.edit.maxcount = classroom.maxCount;
                $scope.edit.syllabus = classroom.syllabus;
                $scope.edit.year = classroom.year;
            }
        });
    };

    $scope.updateClassroom = function(classRoomId){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var edit = $scope.edit;
        var body = ' { ' +
            '"standard":"' + edit.standard + '",' +
            '"section" :"' + edit.section + '",'+
            '"maxcount" :"' + edit.maxcount + '",'+
            '"syllabus" :"' + edit.syllabus + '",'+
            '"year" :"'+ edit.year + '"}';
        var classRoom = window.btoa(classRoomId);
        var response = classroomFactory.updateClassroom(classRoom);
        var data = response.edit({},body, function(response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                $scope.fetchYearList();
            }
            $scope.response_msg = "Classroom Updated Successfully !!";
        }, function(response) {
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }else{
                $scope.response_msg1 = "Updation of Classroom is unsuccessful !!"
            }
        });
    };

    $scope.deleteClassroom = function(classroom,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var dialogue_message = "Are you sure to delete the Classroom ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                var classRoom = window.btoa(classroom.classRoomId);
                classroomFactory.deleteClassroom(classRoom).remove({},function(response){
                    if(response.status == 200){
                        $scope.fetchYearList();
                        $scope.response_msg = "classroom deleted successfully !!!";
                    }
                    $state.go('^.list');
                },function(response){
                    $scope.response_msg1 = "classroom Deletion failed !!!";
                });
            }
            else {
                $scope.response_msg1 = "classroom Deletion failed !!!";
            }
        });
    };

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "classroom" && $scope.classroom_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.classroom_list.length);
        }
    });

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

}]);

branchManager.controller('classroomReportsCtrl', ['$scope','classroomFactory','$state', function($scope,classroomFactory,$state){
    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
    };

    $scope.generateClassroomReport = function(classYear){
        if( classYear == undefined ){
            window.alert("Please select the Year");
        }
        else {
            var year = window.btoa(classYear);
            classroomFactory.fetchClassroomPdfReport(year).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
                        var file = new Blob([response.data], {type: 'application/pdf'});
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
        var scale= 1.7;  // "zoom" factor for the PDF
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
        window.open($scope.fileURL);
    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('classroomreports.main');
    };
}]);
branchManager.factory('subjectFactory',['$resource','br_Manager_Config', '$window',function($resource,br_Manager_Config, $window){
    var factory = {};
    var fetch_subjects_url = br_Manager_Config.getMainAPI();

    var authCode = $window.localStorage.getItem("authCode");


    factory.fetchSubjectsPdfReport = function(classroom){
        // subject/reports/classroom/CL0000001
        return $resource(fetch_subjects_url+'/subject/reports/classroom/'+classroom,{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        console.log("Report Generated  !!!");
                        return data;
                    }
                }
            }
        });
    };

    factory.fetchStandardList = function(selectedYear) {
        console.log("authorize "+ authCode);
        return $resource(fetch_subjects_url+'/classroom/year/'+ selectedYear, {}, {
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
    factory.fetchSectionList = function(currentStandard, selectedYear) {

        // first/section/yr/2016-17
        return $resource(fetch_subjects_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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

    factory.createSubject = function(bookId){
        // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/subject
        return $resource(fetch_subjects_url+'/subject',{},{
            add:{
                method:'POST',
                headers: { 'Authorization' : authCode,
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

    factory.fetchSubjectList = function(currentStandard,syllabusType) {
        // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/subject/std/First/syllubus/CBSE
        console.log("authorize "+ authCode);
        return $resource(fetch_subjects_url+'/subject/std/'+currentStandard+'/syllubus/'+syllabusType, {}, {
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

    factory.updateSubject = function(subjectId){
        console.log("authorize "+ authCode);
        return $resource(fetch_subjects_url+'/subject/'+subjectId+'/update',{},{
            edit: {
                method: 'PUT',
                headers: { 'Authorization' : authCode,
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

    factory.deleteSubject = function (subjectId)
    {
        // subject/SUB0000002/deactivate
        console.log("sub: "+subjectId);
        return $resource(fetch_subjects_url+'/subject/'+subjectId+"/deactivate",{}, {
            remove: {
                method: 'get',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor: {
                    response: function (data){
                        console.log("deleted");
                        return data;
                    }
                }
            }
        });
    };

    factory.assigntoClassroom = function (subjectId, classroom)
    {
        console.log("sub: "+subjectId);
        return $resource(fetch_subjects_url+'/subject/'+subjectId+"/classroom/"+classroom,{}, {
            assign: {
                method: 'get',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor: {
                    response: function (data){
                        console.log("assigned");
                        return data;
                    }
                }
            }
        });
    };

    return factory;
}]);

branchManager.controller('subjectManagementCtrl', ['$scope','subjectFactory','br_manager_appConfig','$state','$modal',function($scope,subjectFactory,br_manager_appConfig,$state,$modal) {

    var initials = {
        subjectId: "", year:"",subjectName:"",syllubusType:"",standard:"",subjectCode:"",category:"",type:""
    };

    $scope.subjectDetails = {
        subjectLists: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };


    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
        $scope.standard_list =[];
        $scope.subjects_list = [];
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        subjectFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            $scope.subjects_list = [];
            if(response.status == 200 || response.status == 201){
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                    console.log("standards:- "+ $scope.standard_list);
                }
            }
        },function(response){
            $scope.standard_list = undefined;
            $scope.response_msg1 = "There is no Standards found for this year.";
            console.log(response.status);
        });
    };

    $scope.fetchSectionList = function(currentStandard,selectedYear){
        $scope.response_msg = "";
        var standard = window.btoa(currentStandard);
        var year = window.btoa(selectedYear);
        subjectFactory.fetchSectionList(standard,year).fetch({},function(response){
            $scope.classroom_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classroom_list = _data;
                }
            }
        },function(response){
            $scope.classroom_list = [];
            $scope.response_msg1 = "No classrooms found for this Standard.";
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.fetchSyllabusList = function(){
        $scope.subjects_list = [];
        $scope.syllabus_list = ["CBSE","ICSE","State Syllabus"];
        $scope.response_msg = "";
        $scope.response_msg1 = "";
    };

    $scope.fetchSubjectList = function (currentStandard,syllabusType) {
        var standard = window.btoa(currentStandard);
        var syllabus = window.btoa(syllabusType);
        subjectFactory.fetchSubjectList(standard,syllabus).fetch({}, function (response) {
            $scope.subjects_list = [];
            console.log(response);
            if (response.status == 200) {
                if (response.data.subjects != undefined) {
                    var _data = angular.fromJson(response.data.subjects);
                    $scope.subjects_list = _data;
                }
            }
        }, function (response) {
            $scope.subjects_list = undefined;
            $scope.response_msg1 = "Subjects Not Found.";
            console.log(response.status);
        });
    };


    // ************** Posting **********************

    $scope.addSubject = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };

    $scope.createSubject = function (syllabusType) {
        var add = $scope.add;
        var body = ' { ' +
            '"standard":"' + add.standard + '",' +
            '"subjectName" :"' + add.subjectName + '",'+
            '"syllubusType" :"' + syllabusType + '",'+
            '"subjectCode" :"' + add.subjectCode + '",'+
            '"type" :"' + add.type + '",'+
            '"category" :"' + add.category +
             '"}';

        var response = subjectFactory.createSubject();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                $scope.fetchYearList();
            }
            $scope.response_msg = "Subject added successfully !!!";
        },function(response){
            $scope.response_msg1 = response.data.errorMessage;
        });
    };


    $scope.assignSubject = function (subjectId) {
        console.log("subjectId "+subjectId);
        $scope.response_msg = "";
        $scope.assign = angular.copy(initials);

        angular.forEach($scope.subjects_list, function (subject) {
            if (subjectId == subject.subjectId) {
                $scope.assign.subjectId = subject.subjectId;
                $scope.assign.subjectName = subject.subjectName;
                $scope.assign.syllubusType = subject.syllubusType;
                $scope.assign.subjectCode = subject.subjectCode;
                $scope.assign.standard = subject.standard;
                $scope.assign.category = subject.category;
                $scope.assign.year = subject.year;
            }
        });
    };


    $scope.assigntoClassroom = function(subjectId, classroom) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        console.log("inside assign function !!");
        var sub = window.btoa(subjectId);
        var classRoom = window.btoa(classroom);
        var response =  subjectFactory.assigntoClassroom(sub, classRoom).assign({},function(response){
            if(response.status == 200){
                $state.go('^.list');
                $scope.fetchYearList();
            }
            $scope.response_msg = "Subject assigned successfully !!!";
        },function(response){
            $scope.response_msg1 =response.data.errorMessage;
            console.log(response.status);
        });
    };


    // ****************** Updating the Classroom *****************

    $scope.editSubject = function (subjectId) {
        console.log("subjectId "+subjectId);
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.subjects_list, function (subject) {
            console.log("subject: "+subject.subjectId);
            if (subjectId == subject.subjectId) {
                $scope.edit.subjectId = subject.subjectId;
                $scope.edit.subjectName = subject.subjectName;
                $scope.edit.syllubusType = subject.syllubusType;
                $scope.edit.subjectCode = subject.subjectCode;
                $scope.edit.standard = subject.standard;
                $scope.edit.type = subject.type;
                $scope.edit.category = subject.category;
                $scope.edit.year = subject.year;
            }
        });
    };

    $scope.updateSubject = function (subjectId) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var edit = $scope.edit;
        var body = ' { ' +
            '"standard":"' + edit.standard + '",' +
            '"subjectName" :"' + edit.subjectName + '",'+
            '"syllubusType" :"' + edit.syllubusType + '",'+
            '"subjectCode" :"' + edit.subjectCode + '",'+
            '"type" :"' + edit.type + '",'+
            '"category" :"' + edit.category +
            '"}';

        var sub = window.btoa(subjectId);
        var response = subjectFactory.updateSubject(sub);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                $scope.fetchYearList();
            }
            $scope.response_msg = "Subject updated successfully !!!";
        },function(response){
            $scope.response_msg1 = response.data.errorMessage;
        });
    };

    $scope.deleteSubject = function(subject,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var sub = window.btoa(subject.subjectId);
        console.log("inside delete function !!");

        var dialogue_message = "Are you sure to delete the Subject ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){
                console.log(subject.subjectId);
                subjectFactory.deleteSubject(sub).remove({},function(response){
                    if(response.status == 200){
                        $scope.fetchYearList();
                        console.log("deleted");
                    }
                },function(response){
                    $scope.response_msg = "Subject assigned to a classroom can't deactivate !!!";
                    console.log(response.status);
                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "subject" && $scope.subjects_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.subjects_list.length);
        }
    });

    $scope.init = function(){
        $scope.catogories = ["General", "Cultural"];
        $scope.types = ["Academic", "General"];
        $scope.standards= [ "Pre-Nursery","L.K.G","U.K.G","M0","M1","M2","M3", "First", "Second", "Third",
            "Fourth","Fifth","Sixth", "Seventh","Eighth","Ninth", "Tenth"];
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

    $scope.init();

}]);


branchManager.controller('subjectReportsCtrl',['$scope','subjectFactory','$state',function($scope,subjectFactory,$state){

    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
        $scope.standard_list =[];
        $scope.classroom_list =[];
    };

    $scope.fetchStandardList = function(selectedYear){
        var year = window.btoa(selectedYear);
        subjectFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            $scope.classroom_list =[];
            console.log( $scope.standard_list);
            if(response.status == 200 || response.status == 201){
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                }
            }
        },function(response){
            $scope.standard_list = undefined;
            console.log(response.status);
        });

    };

    $scope.fetchSectionList = function(currentStandard,selectedYear){
        $scope.response_msg = "";
        var standard = window.btoa(currentStandard);
        var year = window.btoa(selectedYear);
        subjectFactory.fetchSectionList(standard,year).fetch({},function(response){
            $scope.classroom_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classroom_list = _data;
                }
            }
        },function(response){
            $scope.classroom_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.classroomSucjectReport = function(classroom){
        console.log("Inside classStudent Report()");
        var classRoom = window.btoa(classroom);
        if( classroom == undefined ){
            window.alert("Please Select Year, Class, Section");
        }
        else {
            subjectFactory.fetchSubjectsPdfReport(classRoom).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        console.log("response status 200 !!");
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
                        var file = new Blob([response.data], {type: 'application/pdf'});
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
        }

        //PDFJS.disableWorker = true;
        PDFJS.getDocument(url).then(renderPages);

    };

    $scope.downloadPdf = function(){
        window.open($scope.fileURL);

    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('subjects.main');
    };

}]);
branchManager.factory('timeTableFactory',['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
   var factory = {};
    var fetch_timetable_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");



    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_timetable_url +'/classroom/year/'+ selectedYear, {}, {
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

    factory.fetchSectionList = function(selectedYear, currentStandard) {
        return $resource(fetch_timetable_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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


    factory.fetchTimeTable = function(classRoomId){
        console.log("class "+ classRoomId);
        return $resource(fetch_timetable_url+'/classRoom/'+classRoomId+'/timetable',{},{
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

    factory.createTimeTable = function(classroomId){
        console.log("class: "+fetch_timetable_url+'/classRoom/'+classroomId+'/timetable');
        return $resource(fetch_timetable_url+'/classRoom/'+classroomId+'/timetable',{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        console.log("posted successfully");
                        return data;
                    }
                }
            }
        });
    };

    factory.deleteTimetable = function(classRoom){
        return $resource(fetch_timetable_url+'/classRoom/'+classRoom+'/timetable',{},{
            remove: {
                method: 'Delete',
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

branchManager.controller('timeTableCtrl', ['$scope','timeTableFactory','br_manager_appConfig','$state','$modal',function($scope,timeTableFactory,br_manager_appConfig,$state,$modal) {

    var initials = {
            monday:"",tuesday:"",year:"" ,wednesday:"",thursday:"",friday:"",saturday:"",
            subject:"", firstStart:"",secondStart:"",thirdStart:"",fourthStart:"",
            fifthStart:"",sixthStart:"",seventhStart:"",periodStartTime:"",
            subjectName1:"", subjectName2:"", subjectName3:"",
            subjectName4:"", subjectName5:"", subjectName6:"",
            subjectName7:"", subjectName8:"", subjectName9:"",
            subjectName10:""
    };

    $scope.timetableDetails = {
        timetable_lists: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };

    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        $scope.timetable ="";
        $scope.section_list =[];
        var year = window.btoa(selectedYear);
        timeTableFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            if(response.status == 200 || response.status == 201){
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                    console.log( $scope.standard_list);
                }
            }
        },function(response){
            $scope.standard_list = "";
            $scope.timetable = "";
            $scope.response_msg1 = "No classes found for this year.";
            console.log(response.status);
        });

    };

    $scope.fetchSectionList = function(selectedYear, currentStandard){
        $scope.response_msg1 = "";
        $scope.timetable ="";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        console.log(selectedYear);
        console.log(selectedYear);
        timeTableFactory.fetchSectionList(year, standard).fetch({},function(response){
            $scope.section_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.section_list = _data;
                }
            }
        },function(response){
            $scope.section_List = "";
            $scope.timetable = "";
            $scope.response_msg1 = "No Section found for this standard.";
            console.log(response.status);
        });
    };

    $scope.fetchTimeTable = function(currentClassroom) {
        $scope.response_msg1 = "";
        var classRoom = window.btoa(currentClassroom.classRoomId);
        timeTableFactory.fetchTimeTable(classRoom).fetch({},function(response) {
            $scope.timetable ={};
            console.log(response);
            if(response.status == 200 || response.statu == 201) {
                if(response.data!=undefined) {
                    var _data = angular.fromJson(response.data);
                    console.log(_data);
                    $scope.timetable = _data;
                }
            }
        },function(response){
            $scope.response_msg1 = "No Time Table found for this section.";
            $scope.timetable = "";
        });
    };


    $scope.addTimetable = function(){
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        console.log("Initials Copied !!!");
    };

    $scope.createTimeTable = function (currentClassroom) {
        var add = $scope.add;
        var body = ' { ' +
            '"monday"'+':'+
            '['+
            '{'+
            '"subject" :"' + add.mon.subjectName1 + '",'+
            '"periodStartTime" :"' + add.firstStart +'",'+
            '"periodEndTime" :"' + add.firstEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.mon.subjectName2 + '",'+
            '"periodStartTime" :"' + add.secondStart +'",'+
            '"periodEndTime" :"' + add.secondEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.mon.subjectName3 + '",'+
            '"periodStartTime" :"' + add.thirdStart +'",'+
            '"periodEndTime" :"' + add.thirdEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.mon.subjectName4 + '",'+
            '"periodStartTime" :"' + add.fourthStart +'",'+
            '"periodEndTime" :"' + add.fourthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.mon.subjectName5 + '",'+
            '"periodStartTime" :"' + add.fifthStart +'",'+
            '"periodEndTime" :"' + add.fifthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.mon.subjectName6 + '",'+
            '"periodStartTime" :"' + add.sixthStart +'",'+
            '"periodEndTime" :"' + add.sixthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.mon.subjectName7 + '",'+
            '"periodStartTime" :"' + add.seventhStart +'",'+
            '"periodEndTime" :"' + add.seventhEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.mon.subjectName8 + '",'+
            '"periodStartTime" :"' + add.eighthStart +'",'+
            '"periodEndTime" :"' + add.eighthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.mon.subjectName9 + '",'+
            '"periodStartTime" :"' + add.eighthStart +'",'+
            '"periodEndTime" :"' + add.eighthEnd +'"'+
            '}'+
            ']'+','+
            '"tuesday"'+':'+
            '['+
            '{'+
            '"subject" :"' + add.tue.subjectName1 + '",'+
            '"periodStartTime" :"' + add.firstStart +'",'+
            '"periodEndTime" :"' + add.firstEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.tue.subjectName2 + '",'+
            '"periodStartTime" :"' + add.secondStart +'",'+
            '"periodEndTime" :"' + add.secondEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.tue.subjectName3 + '",'+
            '"periodStartTime" :"' + add.thirdStart +'",'+
            '"periodEndTime" :"' + add.thirdEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.tue.subjectName4 + '",'+
            '"periodStartTime" :"' + add.fourthStart +'",'+
            '"periodEndTime" :"' + add.fourthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.tue.subjectName5 + '",'+
            '"periodStartTime" :"' + add.fifthStart +'",'+
            '"periodEndTime" :"' + add.fifthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.tue.subjectName6 + '",'+
            '"periodStartTime" :"' + add.sixthStart +'",'+
            '"periodEndTime" :"' + add.sixthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.tue.subjectName7 + '",'+
            '"periodStartTime" :"' + add.seventhStart +'",'+
            '"periodEndTime" :"' + add.seventhEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.tue.subjectName8 + '",'+
            '"periodStartTime" :"' + add.eighthStart +'",'+
            '"periodEndTime" :"' + add.eighthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.tue.subjectName9 + '",'+
            '"periodStartTime" :"' + add.eighthStart +'",'+
            '"periodEndTime" :"' + add.eighthEnd +'"'+
            '}'+
            ']'+','+
            '"wednesday"'+':'+
            '['+
            '{'+
            '"subject" :"' + add.wed.subjectName1 + '",'+
            '"periodStartTime" :"' + add.firstStart +'",'+
            '"periodEndTime" :"' + add.firstEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.wed.subjectName2 + '",'+
            '"periodStartTime" :"' + add.secondStart +'",'+
            '"periodEndTime" :"' + add.secondEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.wed.subjectName3 + '",'+
            '"periodStartTime" :"' + add.thirdStart +'",'+
            '"periodEndTime" :"' + add.thirdEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.wed.subjectName4 + '",'+
            '"periodStartTime" :"' + add.fourthStart +'",'+
            '"periodEndTime" :"' + add.fourthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.wed.subjectName5 + '",'+
            '"periodStartTime" :"' + add.fifthStart +'",'+
            '"periodEndTime" :"' + add.fifthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.wed.subjectName6 + '",'+
            '"periodStartTime" :"' + add.sixthStart +'",'+
            '"periodEndTime" :"' + add.sixthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.wed.subjectName7 + '",'+
            '"periodStartTime" :"' + add.seventhStart +'",'+
            '"periodEndTime" :"' + add.seventhEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.wed.subjectName8 + '",'+
            '"periodStartTime" :"' + add.eighthStart +'",'+
            '"periodEndTime" :"' + add.eighthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.wed.subjectName9 + '",'+
            '"periodStartTime" :"' + add.eighthStart +'",'+
            '"periodEndTime" :"' + add.eighthEnd +'"'+
            '}'+
            ']'+','+
            '"thursday"'+':'+
            '['+
            '{'+
            '"subject" :"' + add.thu.subjectName1 + '",'+
            '"periodStartTime" :"' + add.firstStart +'",'+
            '"periodEndTime" :"' + add.firstEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.thu.subjectName2 + '",'+
            '"periodStartTime" :"' + add.secondStart +'",'+
            '"periodEndTime" :"' + add.secondEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.thu.subjectName3 + '",'+
            '"periodStartTime" :"' + add.thirdStart +'",'+
            '"periodEndTime" :"' + add.thirdEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.thu.subjectName4 + '",'+
            '"periodStartTime" :"' + add.fourthStart +'",'+
            '"periodEndTime" :"' + add.fourthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.thu.subjectName5 + '",'+
            '"periodStartTime" :"' + add.fifthStart +'",'+
            '"periodEndTime" :"' + add.fifthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.thu.subjectName6 + '",'+
            '"periodStartTime" :"' + add.sixthStart +'",'+
            '"periodEndTime" :"' + add.sixthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.thu.subjectName7 + '",'+
            '"periodStartTime" :"' + add.seventhStart +'",'+
            '"periodEndTime" :"' + add.seventhEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.thu.subjectName8 + '",'+
            '"periodStartTime" :"' + add.eighthStart +'",'+
            '"periodEndTime" :"' + add.eighthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.thu.subjectName9 + '",'+
            '"periodStartTime" :"' + add.eighthStart +'",'+
            '"periodEndTime" :"' + add.eighthEnd +'"'+
            '}'+
            ']'+','+
            '"friday"'+':'+
            '['+
            '{'+
            '"subject" :"' + add.fri.subjectName1 + '",'+
            '"periodStartTime" :"' + add.firstStart +'",'+
            '"periodEndTime" :"' + add.firstEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.fri.subjectName2 + '",'+
            '"periodStartTime" :"' + add.secondStart +'",'+
            '"periodEndTime" :"' + add.secondEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.fri.subjectName3 + '",'+
            '"periodStartTime" :"' + add.thirdStart +'",'+
            '"periodEndTime" :"' + add.thirdEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.fri.subjectName4 + '",'+
            '"periodStartTime" :"' + add.fourthStart +'",'+
            '"periodEndTime" :"' + add.fourthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.fri.subjectName5 + '",'+
            '"periodStartTime" :"' + add.fifthStart +'",'+
            '"periodEndTime" :"' + add.fifthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.fri.subjectName6 + '",'+
            '"periodStartTime" :"' + add.sixthStart +'",'+
            '"periodEndTime" :"' + add.sixthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.fri.subjectName7 + '",'+
            '"periodStartTime" :"' + add.seventhStart +'",'+
            '"periodEndTime" :"' + add.seventhEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.fri.subjectName8 + '",'+
            '"periodStartTime" :"' + add.eighthStart +'",'+
            '"periodEndTime" :"' + add.eighthEnd +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.fri.subjectName9 + '",'+
            '"periodStartTime" :"' + add.eighthStart +'",'+
            '"periodEndTime" :"' + add.eighthEnd +'"'+
            '}'+
            ']'+','+
            '"saturday"'+':'+
            '['+
            '{'+
            '"subject" :"' + add.sat.subjectName1 + '",'+
            '"periodStartTime" :"' + add.firstStart1 +'",'+
            '"periodEndTime" :"' + add.firstEnd1 +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.sat.subjectName2 + '",'+
            '"periodStartTime" :"' + add.secondStart1 +'",'+
            '"periodEndTime" :"' + add.secondEnd1 +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.sat.subjectName3 + '",'+
            '"periodStartTime" :"' + add.thirdStart1 +'",'+
            '"periodEndTime" :"' + add.thirdEnd1 +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.sat.subjectName4 + '",'+
            '"periodStartTime" :"' + add.fourthStart1 +'",'+
            '"periodEndTime" :"' + add.fourthEnd1 +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.sat.subjectName5 + '",'+
            '"periodStartTime" :"' + add.fifthStart1 +'",'+
            '"periodEndTime" :"' + add.fifthEnd1 +'"'+
            '},'+
            '{'+
            '"subject" :"' + add.sat.subjectName6 + '",'+
            '"periodStartTime" :"' + add.fifthStart1 +'",'+
            '"periodEndTime" :"' + add.fifthEnd1 +'"'+
            '}'+
            ']'+
            '}';
        console.log("read the inputs !!");
        var classRoom = window.btoa(currentClassroom.classRoomId);
        var response = timeTableFactory.createTimeTable(classRoom);
        console.log("response "+ response);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201) {
                $scope.fetchYearList();
            }
            $state.go('^.list');
            $scope.response_msg = "Time Table Added Successfully !!!";
        },function(response){
            if(response.status == 404)
            {
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of time table is unsuccessful !!!";
        });
    };

    $scope.deleteTimetable = function(classRoom){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        console.log(classRoom);
        var classRoom = window.btoa(classRoom);


        var dialogue_message = "Are you sure to delete the Time Table ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){
                timeTableFactory.deleteTimetable(classRoom).remove({},function(response){
                    console.log(response.status);
                    if(response.status == 200 || response.status == 201 || response.status == 204 ){
                        $scope.timetable =undefined;
                        $scope.monday = [];
                        $scope.tuesday = [];
                        $scope.wednesday = [];
                        $scope.thursday = [];
                        $scope.friday = [];
                        $scope.saturday = [];
                        //$state.go('^.list');
                        console.log("Time Table Deleted successfully");
                        $scope.response_msg = "Time Table Deleted successfully !!!";
                    }
                    $state.go('^.list');
                    $scope.response_msg = "Time Table Deleted successfully !!!";
                },function(response){
                    if(response.data.errorMessage){
                        $scope.response_msg1 = response.data.errorMessage;
                    }else{
                        $scope.response_msg1 = "Deletion of time table unsuccessful !!";
                    }

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
      //  $scope.fetchYearList();
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

    $scope.init();

}]);


branchManager.factory('studentManageFactory',['$resource','br_Manager_Config', '$window','$http',function($resource,br_Manager_Config, $window,$http){
    var factory = {};

    var fetch_student_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");


    factory.studentPhoto = function(studentId){
      return   url = fetch_student_url+'/image/student/'+studentId;
    };

    factory.fetchStudentsPdfReport = function(classroom){
        // reports/vehicle/V0000001
        //reports/classroom/CL0000001
        var studentReportUrl;
        if(classroom != null)
        {
            studentReportUrl =fetch_student_url+'/student/reports/classroom/'+classroom
        }
        return $resource(studentReportUrl,{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        return data;
                    }
                }
            }
        });
    };

    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_student_url +'/classroom/year/'+ selectedYear, {}, {
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
    factory.fetchClassRoomlist = function(currentStandard, selectedYear) {
        return $resource(fetch_student_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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

    factory.fetchSectionList = function(selectedYear, currentStandard) {
        return $resource(fetch_student_url +'/classroom/standard/'+ currentStandard +  '/year/'+ selectedYear+'/sectionnames', {}, {
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

    //http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/student/year/2016-17/std/First/sec/A/students
    factory.fetchStudents = function( selectedYear, currentStandard, currentSection,offset,limit) {
        return $resource(fetch_student_url+'/student/year/'+selectedYear+'/std/'+currentStandard +'/sec/'+currentSection+'/students'+'?offset='+offset+'&limit='+limit,{},{
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
        return $resource(fetch_student_url+'/student/year/'+selectedYear+'/std/'+currentStandard +'/sec/'+currentSection+'/basicinfo',{},{
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

    factory.fetchStudentDetails = function(currentStudent) {
        return $resource(fetch_student_url+'/student/'+currentStudent+'/abstract',{},{
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


    factory.validateUsername = function(userName) {
        // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/student/userName/ravi
        return $resource(fetch_student_url+'/student/userName/'+userName,{},{
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

    factory.fetchPhoto = function(currentStudent) {
        //branch/BRANCH0001/image/student/STD0000002
        return $resource(fetch_student_url+'/image/student/'+currentStudent,{},{
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

    factory.createStudent = function(){
        return $resource(fetch_student_url+'/student',{},{
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

    factory.studentReadmission = function(studentId){
        return $resource(fetch_student_url+'/student/'+studentId+'/readmission',{},{
            read:{
                method: 'POST',
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

   // http://localhost:8080/Eshiksha/org/wr/branch/wrr/student/wrewr/vehicle/erwr/assign
    factory.assignStudentsVehicle = function(studentId, vehicleId){
        return $resource(fetch_student_url+'/student/'+studentId+'/vehicle/'+vehicleId+'/assign',{},{
            assign: {
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

  //  http://localhost:8080/Eshiksha/org/ORG00000001/branch/BRANCH0001/vehicle/getVehicleIds
    factory.getVehicles = function(){
            console.log("Autorize: "+ authCode);
        return $resource(fetch_student_url+'/vehicle/getVehicleIds',{},{
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


    factory.fetchMode = function(ClassRoomId){
        console.log("Autorize: "+ authCode);
        return $resource(fetch_student_url+'/expandfees/classroom/'+ClassRoomId+'/studentfeestructuretype',{},{
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

    factory.choosePaymentMode = function(studentId){
        return $resource(fetch_student_url+'/student/'+studentId+'/feesmode',{},{
            add:{
                method: 'POST',
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

    return factory;
}]);


branchManager.controller('studentManageCtrl',['$scope','studentManageFactory','br_manager_appConfig','$state','$filter','$modal','fileUpload', function($scope,studentManageFactory,br_manager_appConfig,$state,$filter,$modal,fileUpload) {

    var initials = {
        studentId:"",studentFirstName:"",studentLastName:"",dateOfBirth:"",fatherFirstName:"",fatherLastName:"",
        motherFirstName:"",motherLasttName:"", caste:"", nationality:"",phoneNumber:"",email:"",year:"",rollnumber:"",
        yearOfJoining:"",classRoomId:"",religion:"",userName:"",password:"",correspondingYear:""
        ,localAddress:"",permanentAddress:"",admissionDate:"",vehicleRegNumber:""
    };

    $scope.studentDetails = {
        studentList: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };


    $scope.standards = ["Pre-Nursery","L.K.G","U.K.G","M0","M1","M4","M3","First", "Second", "Third", "Fourth","Fifth",
        "Sixth","Seventh","Eighth","Ninth","Tenth"];

    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
        // $scope.response_msg = "";
        $scope.stud ="";
        $scope.section_list ="";
        $scope.standard_list ="";
        $scope.student_list ="";
        $scope.student_details = {};
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        $scope.section_list ="";
        $scope.student_list ="";
        $scope.student_details = {};
        var year = window.btoa(selectedYear);
        studentManageFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            if(response.status == 200 || response.status == 201)
            {
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                }
            }
        },function(response){
            $scope.standard_list = [];
            $scope.response_msg1 = "No Standards found for this year.";
            console.log(response.status);
        });
    };
    $scope.fetchSectionList = function(selectedYear, currentStandard){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        studentManageFactory.fetchSectionList(year, standard).fetch({},function(response){
            $scope.section_list =[];
            $scope.student_list =[];
            $scope.student_details = {};
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.sections!=undefined){
                    var _data = angular.fromJson(response.data.sections);
                    $scope.section_list = _data;
                }
            }
        },function(response){
            $scope.section_List = [];
            $scope.response_msg1 = "No Section found for this standard.";
            console.log(response.status);
        });
    };

    $scope.fetchStudents = function(selectedYear, currentStandard, currentSection,offset,limit){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        var section = window.btoa(currentSection.section);
        console.log(selectedYear+":"+currentStandard+":"+currentSection.section);
        studentManageFactory.fetchStudents(year, standard, section,offset,limit).fetch({},function(response){
            $scope.student_list =[];
            $scope.student_details = {};
            console.log(response);
            if(response.status == 200 || response.status == 201){
                $scope.count = response.data.total;
                console.log($scope.count);
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    $scope.student_list = _data;
                    $scope.totalPages = Math.ceil($scope.count/$scope.studentDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.student_list.length);
                    console.log("data:-"+ $scope.student_list.length);
                }
            }
        },function(response){
            $scope.student_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.fetchStudentList = function(selectedYear, currentStandard, currentSection,offset,limit){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        var section = window.btoa(currentSection.section);
        console.log(selectedYear+":"+currentStandard+":"+currentSection.section);
        studentManageFactory.fetchStudentList(year, standard, section,offset,limit).fetch({},function(response){
            $scope.student_list =[];
            $scope.student_details = {};
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    $scope.student_list = _data;
                    console.log("data:-"+ $scope.student_list.length);
                }
            }
        },function(response){
            $scope.student_list = [];
            $scope.response_msg1 = "No students found for this section.";
            console.log(response.status);
        });
    };

    $scope.fetchStudentDetails = function(currentStudent){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var student = window.btoa(currentStudent.studentId);
        studentManageFactory.fetchStudentDetails(student).fetch({},function(response){
            $scope.student_details = {};
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.student_details = _data;
                    $scope.stud = $scope.student_details;
                    $scope.studentId = $scope.student_details.studentId;
                    $scope.fname = $scope.student_details.studentFirstName;
                    $scope.lname = $scope.student_details.studentLastName;
                    $scope.fatherFname = $scope.student_details.fatherFirstName;
                    $scope.fatherLname = $scope.student_details.fatherLastName;
                    $scope.motherFname = $scope.student_details.motherFirstName;
                    $scope.motherLname = $scope.student_details.motherLastName;
                    $scope.class = $scope.student_details.currentClass;
                    $scope.branchName = $scope.student_details.branchName;
                    $scope.currentYear =$scope.student_details.currentYear;
                    $scope.joiningYear =$scope.student_details.yearOfJoining;
                    $scope.phoneNumber = $scope.student_details.phoneNumbers[0].phoneNumber;
                    $scope.email = $scope.student_details.emails[0].email;
                    $scope.result = $scope.student_details.promote;
                    $scope.dob = $scope.student_details.dob;
                    $scope.caste = $scope.student_details.caste;
                    $scope.religion = $scope.student_details.religion;
                    $scope.nationality = $scope.student_details.nationality;
                    $scope.rollNumber = $scope.student_details.rollNumber;
                    $scope.section = $scope.student_details.section;
                    $scope.localAddress = $scope.student_details.localAddress;
                    $scope.permanentAddress = $scope.student_details.permanentAddress;
                    console.log($scope.studentId);
                    $scope.fetchPhoto( $scope.studentId);
                }

                $scope.student_details = undefined;
            }
        },function(response){
            $scope.student_details = undefined;
            console.log(response.status);
        });
    };

    $scope.getVehicles = function(){
        $scope.response_msg1 = "";
        studentManageFactory.getVehicles().fetch({},function(response){
            $scope.vehicle_list = [];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.vehicles!=undefined){
                    var _data = angular.fromJson(response.data.vehicles);
                    $scope.vehicle_list = _data;
                    $scope.vehicle = $scope.vehicle_list[0];
                    console.log($scope.vehicle_list);
                }
            }
        });
    };

    $scope.assignVehicle = function(studentId){
        console.log("class id:" + studentId);
        $scope.response_msg="";
        $scope.assign = angular.copy(initials);
        angular.forEach($scope.student_list, function(student){
            if(studentId == student.studentId){
                $scope.assign.studentFirstName = student.studentFirstName;
                $scope.assign.studentId = student.studentId;
                $scope.assign.standard = student.currentClass;
                $scope.assign.year = student.year;
                $scope.assign.section = student.section;
                $scope.getVehicles();
            }
        });
    };

    $scope.assignStudentsVehicle = function(studentId, vehicle){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var studentId = window.btoa(studentId);
        var vehicleId = window.btoa(vehicle.vehicleId);
        studentManageFactory.assignStudentsVehicle(studentId,vehicleId).assign({},function(response){
            $scope.classroom_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                $scope.fetchYearList();
            }
            $scope.response_msg = "Student assigned to vehicle successfully !!!.";
        },function(response){
            $scope.response_msg1 = "Student assigning to vehicle is  Unsuccessful !!!.";

        });
    };

    $scope.chooseMode = function(student, index, section){
        $scope.name = student.studentFirstName;
        $scope.studId = student.studentId;
        var classroomId = window.btoa(section.classRoomId);
        studentManageFactory.fetchMode(classroomId).fetch({},function(response){
            $scope.mode_list = [];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.feeTypes!=undefined){
                    var _data = angular.fromJson(response.data.feeTypes);
                    $scope.mode_list = _data;
                }
            }
        },function(response){
            console.log("errorrrrrr")
        });
        $scope.add = angular.copy(initials);
    };

    $scope.choosePaymentMode = function(mode){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var body =' { ' +
                '"mode" :"' + mode + '"'+
            '}';
        var studentId = window.btoa($scope.studId);
        var response = studentManageFactory.choosePaymentMode(studentId);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201)
            {
                $state.go('^.list');
                $scope.fetchYearList();
            }
            $scope.response_msg = "Fees Mode Added Successfully !!!";
        },function(response){

            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            } else{
                $scope.response_msg1 = "Selecting Fees Mode is unsuccessful !!!";
            }
        });
    };
    $scope.image = false;
    $scope.fetchPhoto = function(studentId) {
        $scope.photo = {};
        var student = window.btoa(studentId);
        studentManageFactory.fetchPhoto(student).fetch({},function(response){
            $scope.success = false;
            console.log(response);
            console.log("Response length"+response.data.byteLength);
            if(response.status == 200 || response.status == 201){
                $scope.photo = response.data;
                $scope.image = true;
            }
        },function(response){
            $scope.image = false;
            console.log("errorrrrrr")
        });
    };

    $scope.validateUsername = function(userName){
        var user = window.btoa(userName);
        studentManageFactory.validateUsername(user).fetch({}, function(response){
            if(response.status == 200 || response.status == 201){
                $scope.availability = "Available !!"
            }
        }, function(response){
            $scope.availability = response.data.errorMessage;
        })
    };
    $scope.addStudent = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.discountAmount = 0;
        $scope.add = angular.copy(initials);
    };


    $scope.createStudent = function (selectedYear, standard, classroom) {
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var add = $scope.add;
        $scope.add.dateOfBirth.Value = $filter('date')(new Date(add.dateOfBirth),'yyyy-MM-dd');
        $scope.add.admissionDate.Value = $filter('date')(new Date(add.admissionDate),'yyyy-MM-dd');
        var body = ' { ' +
            '"yearOfJoining" :"' + selectedYear + '",' +
            '"section" :"' + classroom.section + '",' +
            '"standard" :"' + standard + '",' +
            '"studentFirstName":"' + add.studentFirstName + '",' +
            '"studentLastName" :"' + add.studentLastName + '",' +
            '"dateOfBirth" :"' + $scope.add.dateOfBirth.Value + '",' +
            '"admissionDate" :"' + $scope.add.admissionDate.Value + '",' +
            '"discountAmount" :"' + $scope.discountAmount + '",'+
            '"fatherFirstName" :"' + add.fatherFirstName + '",'+
            '"fatherLastName" :"'+add.fatherLastName + '",'+
            '"motherFirstName" :"' + add.motherFirstName + '",'+
            '"motherLastName" :"' + add.motherLastName + '",'+
            '"localAddress" :"' + add.localAddress + '",'+
            '"permanentAddress" :"' + add.permanentAddress + '",'+
            '"religion" :"'+add.religion + '",'+
            '"nationality" :"'+add.nationality + '",'+
            '"caste" :"'+add.caste + '",'+
            '"correspondingYear" :"'+selectedYear + '",'+
            '"classRoomId" :"'+ classroom.classRoomId + '",'+
            '"rollnumber" :"'+add.rollnumber + '",'+
            '"userName" :"' + add.userName + '",' +
            '"password" :"' + add.password + '",' +

            '"emails"' + ':' +
                '[' +
                    '{' +
                        '"email" :"' + add.email + '",' +
                        '"type" :"' + add.type + '"' +
                    '}' +
                ']' +',' +
            '"phoneNumbers"' + ':' +
                '[' +
                    '{' +
                        '"phoneNumber" :"' + add.phoneNumber + '",' +
                        '"type" :"' + add.type + '"' +
                    '}' +
                ']' +
            '}';

        console.log("Inputs read  !!");
        var response = studentManageFactory.createStudent();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201) {

                $scope.response_msg = "Student Admission successfully !!!";
                $state.go('^.list');
                //$scope.fetchYearList();
            }
            $scope.response_msg = "Student Admission successfully !!!";
        },function(response){

             if(response.status == 404){
                 $scope.response_msg1 = response.data.errorMessage;
            }else if(response.status == 409) {
                 console.log(response.data);
                 $scope.response_msg1 = response.data;
             }
             else{
                $scope.response_msg1 = "Addition of Student is unsuccessful !!!";
            }
        });
    };

    //********************* Readmission *******************

    $scope.readStudent = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.discountPercentage = 0;
        $scope.read = angular.copy(initials);

        console.log("Inside readStudent !!!");
    };

    $scope.studentReadmission = function (currentStudent,discount) {
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var read = $scope.read;
        $scope.read.admissionDate.Value = $filter('date')(new Date(read.admissionDate),'yyyy-MM-dd');
        console.log($scope.read.admissionDate.Value);

        var body = ' { ' +
            '"rollnumber" :"' + read.rollnumber + '",' +
            '"correspondingYear" :"' + read.correspondingYear + '",' +
            '"standard" :"' + read.standard + '",' +
            '"discountAmount" :"' + discount + '",' +
            '"admissionDate" :"' + $scope.read.admissionDate.Value + '",' +
            '"section":"' + read.section + '"' +

            '}';

        var student = window.btoa(currentStudent.studentId);
        var response = studentManageFactory.studentReadmission(student);
        var data = response.read({}, body, function (response) {
            if(response.status == 200 || response.status == 201) {
                $state.go('^.list');
                //$scope.fetchYearList();
            }
            $scope.response_msg = "Student Re-Admission Successful !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }else{
                $scope.response_msg1= "Re-Admission of Student is unsuccessful !!!";
            }
        });
    };
    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "student" && $scope.student_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.student_list.length);
        }
    });



    $scope.init = function(){
        $scope.studentDetails.numPerPage = parseInt($scope.studentDetails.numPerPage);
        $scope.maxSize = 5;
        //$scope.fetchStudents(0,$scope.studentDetails.numPerPage);
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.photo =[];
        $state.go('sm.list');
    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.photo = [];
        $state.go('sm.list');
    };

    $scope.init();

    $scope.pageChanged = function(selectedYear,currentStandard, currentSection){
        $scope.studentDetails.startValue = (($scope.studentDetails.currentPage - 1) * $scope.studentDetails.numPerPage);
        $scope.fetchStudents(selectedYear,currentStandard,currentSection,$scope.studentDetails.startValue,$scope.studentDetails.numPerPage);
    };

}]);


branchManager.controller('studentReportsCtrl',['$scope','studentManageFactory','$state',function($scope,studentManageFactory,$state){


    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
    };


    $scope.fetchStandardList = function(selectedYear){
        var year = window.btoa(selectedYear);
        studentManageFactory.fetchStandardList(year).fetch({},function(response){
            $scope.classroom_list =[];
            $scope.standard_list =[];
            console.log( $scope.standard_list);
            if(response.status == 200 || response.status == 201){
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                    if($scope.standard_list.length > 0){
                        console.log("standard list");
                    }
                }
            }
        },function(response){
            $scope.standard_list = [];
            console.log(response.status);
        });

    };

    $scope.fetchClassRoomlist = function(currentStandard,selectedYear){
        $scope.response_msg = "";
        var standard = window.btoa(currentStandard);
        var year = window.btoa(selectedYear);
        studentManageFactory.fetchClassRoomlist(standard,year).fetch({},function(response){
            $scope.classroom_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classroom_list = _data;
                }
            }
        },function(response){
            $scope.classroom_list = [];
            console.log(response.status);
        });
    };

    $scope.generateStudentReport = function(classroom){
        console.log("Inside classStudent Report()");
        var classRoom = window.btoa(classroom);
        if( classroom == undefined ){
            window.alert("Please Select Year, Class, Section ");
        }
        else {
            studentManageFactory.fetchStudentsPdfReport(classRoom).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        console.log("response status 200 !!");
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        $scope.fileURL = URL.createObjectURL(file);
                        $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                    } else {
                        console.log("Reponse Length = " + response.data.byteLength);
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
        window.open($scope.fileURL);

    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('students.main');
    };

}]);



branchManager.factory('studentPromotionFactory1',['$resource','br_Manager_Config', '$window',function($resource,br_Manager_Config, $window){
    var factory = {};

    var fetch_student_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    // http://localhost:8080/Eshiksha/org/ORG00001/branch/BRANCH0001/expandfeetransactions/year/2016-17/student/STD0000001/isFeePaid
    factory.checkFeesPaid = function(selectedYear,studentId) {
        return $resource(fetch_student_url +'/expandfeetransactions/year/'+ selectedYear+'/student/'+studentId+'/isFeePaid', {}, {
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

    factory.studentPromotion = function(studentId, standard, section, year){
        return $resource(fetch_student_url+'/student/'+studentId+'/studentrecords/standard/'+standard+'/section/'+section+'/year/'+year+'/promote',{},{
            pms: {
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


    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_student_url +'/classroom/year/'+ selectedYear, {}, {
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
        //year/2016-17/std/first/sec/A/basicinfo
        return $resource(fetch_student_url+'/student/year/'+selectedYear+'/std/'+
            currentStandard +'/sec/'+currentSection+'/basicinfo',{},{
            fetch : {
                method : 'get',
                isArray : false,
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data) {
                        console.log("student list got: ");
                        return data;
                    }
                }
            }
        });
    };

    factory.fetchSectionList = function(selectedYear, currentStandard) {

        // first/section/yr/2016-17
        //first/yr/2016-17/sectionnames
        return $resource(fetch_student_url +'/classroom/standard/'+ currentStandard +  '/year/'+ selectedYear+'/sectionnames', {}, {
            fetch : {
                method : 'get',
                isArray : false,
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data) {
                        console.log("replication");
                        return data;
                    }
                }
            }
        });
    };

    factory.fetchStudentDetails = function(currentStudent) {
        // SDT00000001/abstract
        return $resource(fetch_student_url+'/student/'+currentStudent+'/abstract',{},{
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

    return factory;
}]);


branchManager.controller('studentPromotionsManagementCtrl1', ['$scope','studentPromotionFactory1','br_manager_appConfig','$state','$modal',function($scope,studentPromotionFactory1,br_manager_appConfig,$state,$modal)
{

    var initials = {
        studentFirstName:"",studentLastName:"",dateOfBirth:"",fatherFirstName:"",fatherLastName:"",
        motherFirstName:"",motherLasttName:"", caste:"", nationality:"",phoneNumber:"",email:"",year:"",
        yearOfJoining:"",classRoomId:"",religion:"",userName:"",password:"",correspondingYear:""
        ,localAddress:"",permanentAddress:"", rollNumber:"",promote:""
    };

    $scope.studentDetails = {
        studentList: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };

    $scope.fetchYearList = function(){
        $scope.response_msg = "";
        $scope.response_msg1="";
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
        $scope.standard_list ="";
        $scope.section_list ="";
        $scope.student_list ="";
        $scope.student_details = "";
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        $scope.response_msg1 ="";
        $scope.section_list ="";
        $scope.student_list ="";
        $scope.student_details = "";
        var year = window.btoa(selectedYear);
        studentPromotionFactory1.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            if(response.status == 200 || response.status == 201)
            {
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                }
            }
        },function(response){
            $scope.standard_list = [];
            $scope.response_msg1 = "No Standards found for this year.";
            console.log(response.status);
        });
    };

    $scope.fetchSectionList = function(selectedYear, currentStandard){
        $scope.response_msg1 = "";
        $scope.student_list ="";
        $scope.student_details = undefined;
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        studentPromotionFactory1.fetchSectionList(year, standard).fetch({},function(response){
            $scope.section_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.sections!=undefined){
                    var _data = angular.fromJson(response.data.sections);
                    $scope.section_list = _data;
                }
            }
        },function(response){
            $scope.section_List = [];
            $scope.response_msg1 = "No Section found for this standard.";
            console.log(response.status);

        });
    };

    $scope.fetchStudentList = function(selectedYear, currentStandard, currentSection){
        $scope.response_msg1 = "";
        $scope.student_details = undefined;
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        var section = window.btoa(currentSection.section);
        studentPromotionFactory1.fetchStudentList(year, standard, section).fetch({},function(response){
            $scope.student_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    console.log("date:"+ _data);
                    $scope.student_list = _data;
                }
            }
        },function(response){
            $scope.student_list = [];
            $scope.response_msg1 = "Student not found for this Section.";
            console.log(response.status);
        });
    };

    // Student Details  not an Array. Update the Below Code
    $scope.fetchStudentDetails = function(currentStudent){
        //$scope.response_msg = "";
        var student = window.btoa(currentStudent.studentId);
        studentPromotionFactory1.fetchStudentDetails(student).fetch({},function(response){
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.student_details = _data;
                }
            }
        },function(response){
            $scope.student_details = undefined;
            console.log(response.status);
        });
    };


    //***************** student Promotion *********************
    $scope.promotion = ["Yes", "No"];
    $scope.promoteStudent = function (studentId) {
        $scope.promote = $scope.promotion[0];
        console.log("studentId "+studentId);
        $scope.response_msg = "";
        $scope.pms = angular.copy(initials);

        angular.forEach($scope.student_list, function (student) {
            console.log("subject: "+student.studentId);
            if (studentId == student.studentId) {
                $scope.pms.studentId = student.studentId;
                $scope.pms.Fname = student.studentFirstName;
                $scope.pms.Lname = student.studentLastName;
                $scope.pms.standard = student.currentClass;
                $scope.pms.section = student.section;
                //$scope.pms.promote = student.promote;
                $scope.pms.year = student.year;
            }
        });
    };

    $scope.checkFeesPaid = function (selectedYear, StudentId) {
        var year = window.btoa(selectedYear);
        var student = window.btoa(StudentId);
        studentPromotionFactory1.checkFeesPaid(year, student).fetch({},function(response){
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.response_msg1 = "Fees Paid You Can Continue To Promote";
                }
            }
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }else{
                $scope.response_msg1 = "Please Check whether student paid all fees.";
            }
        });
    };

    $scope.studentPromotion = function (studentId, standard, section, year , promote) {
        var pms = $scope.pms;
        var body = ' { ' +
            '"promote":"' + promote + '"' +
            '}';

        var year = window.btoa(year);
        var standard = window.btoa(standard);
        var section = window.btoa(section);
        var student = window.btoa(studentId);
        var response = studentPromotionFactory1.studentPromotion(student, standard, section, year);
        var data = response.pms({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.student_details = undefined;
                $state.go('^.list');
                // $scope.fetchYearList();
            }
            $scope.response_msg = "Student Promotion successful !!!";
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else if(response.status == 404){
                $scope.response_msg1 = response.data;
            }else
                $scope.response_msg1= "Student Promotion is unsuccessful !!!";

        });
    };

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "spm" && $scope.student_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.student_list.length);
        }
    });

    $scope.init = function(){
        $scope.student_details = undefined;
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

    $scope.studentDetails = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.studentdetails');
    };

    $scope.init();

}]);

branchManager.factory('photoFactory',['$resource','br_Manager_Config', '$window','$http',function($resource,br_Manager_Config, $window,$http){
    var factory = {};

    var authCode = $window.localStorage.getItem("authCode");
    var fetch_photo_url = br_Manager_Config.getMainAPI();


    factory.fetchFacultyList = function(offset,limit){
        return $resource(fetch_photo_url+'/faculty'+'?offset='+offset+'&limit='+limit,{},{
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
    factory.studentPhoto = function(studentId){
        return   url = fetch_photo_url+'/image/student/'+studentId;
    };

    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_photo_url +'/classroom/year/'+ selectedYear, {}, {
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

    factory.fetchSectionList = function(selectedYear, currentStandard) {

        return $resource(fetch_photo_url +'/classroom/standard/'+ currentStandard +  '/year/'+ selectedYear+'/sectionnames', {}, {
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
        //year/2016-17/std/first/sec/A/basicinfo
        return $resource(fetch_photo_url+'/student'+'/year/'+selectedYear+'/std/'+
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

    // http://localhost:8080/feesmanagementsystem/org/ORG0000001/branch/BRANCH0001/image/faculty/FC0000002

    factory.facultyPhoto = function(file, facultyId){
        var fd = new FormData();
        fd.append('file', file);
        console.log("faculty id "+facultyId);
        $http.post(fetch_photo_url+'/image/faculty/'+facultyId, fd, {
            transformRequest: angular.identity,
            headers: { 'Authorization' : authCode,
                'Content-Type': undefined}
        })
            .success(function(){
                alert("Photo uploaded Successfully !!!")
            })

            .error(function(){
                alert("Uploading photo is unsuccessful !!!")
            });
    };

    factory.uploadFileToUrl = function(file, studentId){
        var fd = new FormData();
        fd.append('file', file);
        console.log("student id "+studentId);
        $http.post(fetch_photo_url+'/image/student/'+studentId, fd, {
            transformRequest: angular.identity,
            headers: { 'Authorization' : authCode,
                'Content-Type': undefined}
        })
            .success(function(){
                alert("Photo uploaded Successfully !!!")
            })

            .error(function(){
                alert("Uploading photo is unsuccessful !!!")
            });
    };

    return factory;
}]);

branchManager.directive('fileModel',['$parse', function($parse){
    return  {
        restrict: 'A',
        link: function(scope, element, attrs){
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                })
            })
        }
    }
}]);
/*
 branchManager.service('fileUpload', ['$http','$window', function ($http, $window) {
 this.uploadFileToUrl = function(file, uploadUrl){
 var fd = new FormData();
 var authCode = $window.localStorage.getItem("authCode");
 console.lo("auth "+authCode);
 fd.append('file', file);

 $http.post(uploadUrl, fd, {
 transformRequest: angular.identity,
 headers: { 'Authorization' : authCode,
 'Content-Type': undefined}
 })
 .success(function(){
 })

 .error(function(){
 });
 }
 }]);*/

branchManager.controller('photoCtrl',['$scope','photoFactory','br_manager_appConfig','$state','$modal','fileUpload', function($scope,photoFactory,br_manager_appConfig,$state,$modal,fileUpload) {

    $scope.uploadStudentphoto = function(currentStudent){
        $scope.response_msg = "";
        if($scope.studentPhoto != undefined){
            var file = $scope.studentPhoto;
            console.log('file is ' );
            console.dir(file);
            var stud = window.btoa(currentStudent.studentId);
            photoFactory.uploadFileToUrl(file,stud);
        }else{
            window.alert("Please select the file !!");
        }

    };

    $scope.uploadFacultyPhoto = function(faculty){
        if($scope.facultyPhoto != undefined){
            var file = $scope.facultyPhoto;
            console.log('file is ' );
            console.dir(file);
            var fac = window.btoa(faculty.facultyId);
            photoFactory.facultyPhoto(file, fac);
        }else{
            window.alert("Please select the file !!");
        }

    };

    $scope.facultyDetails = {
        facultyList: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };

    $scope.fetchFacultyList = function(offset,limit){
        $scope.response_msg = "";
        photoFactory.fetchFacultyList(offset,limit).fetch({},function(response){
            $scope.faculty_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.faculties!=undefined){
                    var _data = angular.fromJson(response.data.faculties);
                    $scope.faculty_list = _data;
                }
            }
        },function(response){
            $scope.faculty_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        photoFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
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

    $scope.fetchSectionList = function(selectedYear, currentStandard){

        console.log(selectedYear+" "+currentStandard);
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        photoFactory.fetchSectionList(year, standard).fetch({},function(response){
            $scope.section_list =[];
            if(response.status == 200 || response.status == 201){
                if(response.data.sections!=undefined){
                    var _data = angular.fromJson(response.data.sections);
                    $scope.section_list = _data;
                    if($scope.section_list.length > 0){
                       // $scope.currentSection = $scope.section_list[0];
                       // $scope.fetchStudentList(selectedYear, currentStandard, $scope.currentSection)
                    }
                }
            }
        },function(response){
            $scope.section_list = [];
            $scope.response_msg = "No classrooms found for this standard.";
            console.log(response.status);
        });
    };

    $scope.fetchStudentList = function(selectedYear, currentStandard, currentSection){
        // $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        var section = window.btoa(currentSection.section);
        photoFactory.fetchStudentList(year, standard, section).fetch({},function(response){
            $scope.student_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    $scope.student_list = _data;
                  // $scope.currentStudent = $scope.student_list[0];
                }
            }
        },function(response){
            $scope.student_list = [];
            $scope.response_msg = "Students Not found";
        });
    };

}]);





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

    factory.fetchFeeList = function(selectedYear){
        return $resource(fetch_fee_url+'//expandfees/year/'+selectedYear+'/feestructuresbasedonmode',{},{
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
branchManager.controller('feeManagementCtrl', ['$scope','$filter','feeManagementFactory','br_manager_appConfig','$state','$modal',function($scope,$filter,feeManagementFactory,br_manager_appConfig,$state,$modal) {

    var initials = {
        standard:"",admissionFees:"",monthlyFees:"",sportsFees:"",booksFees:"",vanFees:""
        ,feesId:"",year:""
    };

    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
        $scope.fee_list =[];
        $scope.syllabus_list=[];
    };


    $scope.fetchFeeList = function(selectedYear){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var year = window.btoa(selectedYear);
        //var syllabus = window.btoa(syllabus);
        feeManagementFactory.fetchFeeList(year).fetch({},function(response){
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
    };

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
        console.log("inside addBranchFees");
    };

   /* $scope.standards= ["First", "Second", "Third", "Fourth","Fifth",
        "Sixth","Seventh","Eighth","Ninth","Tenth"];*/

    $scope.mode_list = ["Monthly", "Quarterly", "Half-Yearly", "Yearly"];

    $scope.createBranchFees = function () {
        $scope.response_msg = "";
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
            "year": add.year,
            "oneTimeFees": $scope.choices,
            "recurringFees": $scope.modes

        };

        var response = feeManagementFactory.createBranchFees();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                $scope.fetchYearList();
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
        $scope.response_msg = "";
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
                $state.go('^.list');
                $scope.fetchYearList();
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
        $scope.response_msg = "";
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
                $state.go('^.list');
                $scope.fetchYearList();
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
        console.log("list - "+$scope.recurring);
        $scope.edit = angular.copy(initials);

    };

    $scope.updateFees = function (feeId) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var edit = $scope.edit;

        $scope.updateone.forEach(function(v){
            v.payByDate = $filter('date')(new Date(v.payByDate),'yyyy-MM-dd');
        });

        console.log($scope.updateone);
        console.log($scope.recurring);

        var body ={
            "name": $scope.feeDetails.name,
            "year": $scope.feeDetails.year,
            "oneTimeFees": $scope.updateone,
            "recurringFees": $scope.recurring

        };


        var fee = window.btoa(feeId);
        var response = feeManagementFactory.updateFees(fee);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                $scope.fetchYearList();
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
        $scope.details = $scope.fee_list[index];
        $scope.assign = angular.copy(initials);
        $scope.assign.feeId =  fee.feeId;
        $scope.assign.name =  fee.name;
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        feeManagementFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
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
            $scope.response_msg = "No Section found for this standard.";
            console.log(response.status);
        });
    };

    $scope.assignFeeClassroom = function(feesId, classroom){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var fees = window.btoa(feesId);
        var classId = window.btoa(classroom.classRoomId);
        feeManagementFactory.assignFeeClassroom(classId, fees).fetch({},function(response){
            console.log(response);
            if(response.status == 200){
                if(response.data!=undefined){
                    $state.go('^.list');
                    $scope.fetchYearList();
                }
                $scope.response_msg = "Assigned Successfully !!!";
            }
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Assigning Fee Structure is unsuccessful !!!";
        });
    };

    $scope.deleteFee = function(fee,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        console.log("inside delete Fee");
        var fee = window.btoa(fee.feeId);
        var dialogue_message = "Are you sure to delete the Fee ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){
                feeManagementFactory.deleteFee(fee).remove({},function(response){
                 if(response.status == 200 || response.status == 201){
                     $state.go('^.list');
                     $scope.fetchYearList();
                 }
                 },function(response){
                    if(response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }
                    else
                         $scope.response_msg1 = "Fee Deletion failed !!!";
                         console.log(response.status);
                 });

                }
                else {
                    console.log("Failed to delete");
                }
        });
    };

    $scope.deactivateRecurringFee = function(rec,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        console.log("inside delete Fee");
        var recId = window.btoa(rec.recurringId);
        var dialogue_message = "Are you sure to delete the Fee ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){
                feeManagementFactory.deactivateRecurringFee(recId).remove({},function(response){
                    if(response.status == 200 || response.status == 201){
                        $state.go('^.list');
                        $scope.fetchYearList();
                        $scope.response_msg1 = "Recurring Fee Deactivated !!!";
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
        console.log("inside delete Fee");
        var oneId = window.btoa(one.oneTimeFeeId);
        var dialogue_message = "Are you sure to delete the One Time Fee ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){
                feeManagementFactory.deactivateOneTimeFee(oneId).remove({},function(response){
                    if(response.status == 200 || response.status == 201){
                        $state.go('^.list');
                        $scope.response_msg1 = "One Time Fee Deactivated !!!";
                        $scope.fetchYearList();
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
   
    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

    $scope.init = function(){
       // $scope.fetchYearList();
    };

    $scope.init();

}]);


branchManager.controller('feeStructureReportsCtrl',['$scope','feeManagementFactory','$state',function($scope,feeManagementFactory,$state){

    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
    };
    /*$scope.fetchSyllabus = function () {
        $scope.syllabus_list = ["CBSE", "ICSE", "State Syllabus"];
    };*/

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        feeManagementFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            if(response.status == 200 || response.status == 201) {
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
            $scope.response_msg = "No Section found for this standard.";
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
        window.open($scope.fileURL);

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

}]);
branchManager.factory('feeTransactionFactory',['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
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


    factory.festchStudentFeesStructure = function(year,studentId){
        return $resource(fetch_fee_url+'/expandfees/student/'+studentId+'/studentfeestructure',{},{
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


    factory.createFeesTransaction = function(studentId){
        return $resource(fetch_fee_url+'/expandfeetransactions/student/'+studentId,{},{
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

    return factory;
}]);
branchManager.controller('feeTransactionCtrl', ['$scope','feeTransactionFactory','br_manager_appConfig','$state','$modal',function($scope,feeTransactionFactory,br_manager_appConfig,$state,$modal) {

    var initials = {
        admissionFees:"",academicYear:"",transactionId:"",amount:"",transactionDate:"",
        studentId:"",standard:"",section:"",periodicity:"",period:""
    };
    $scope.transaction_type = ["One Time Fees", "Recurring Fees"];
    $scope.payment_type = ["Cash", "Cheque", "Demand Draft", "Other"];


    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
        $scope.standard_list =[];
        $scope.section_list =[];
        $scope.student_list =[];
        $scope.fee_list =[];
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        feeTransactionFactory.fetchStandardList(year).fetch({},function(response){
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
        feeTransactionFactory.fetchClassRoomlist(year, standard).fetch({},function(response){
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
        feeTransactionFactory.fetchStudentList(year,standard,section).fetch({},function(response){
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


    $scope.fetchTransactionList = function(selectedYear){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        feeTransactionFactory.fetchTransactionList(year).fetch({},function(response){

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
        $scope.response_msg = "";
        $scope.response_msg1 = "";
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
        $scope.trans_list = fee.feeDetails;
        console.log(fee);
        console.log($scope.trans_list);
    };

    $scope.festchStudentFeesStructure = function(year, student){

        var stud = window.btoa(student.studentId);
        var year = window.btoa(year);
        feeTransactionFactory.festchStudentFeesStructure(year, stud).fetch({},function(response){
            console.log(response);
            $scope.structure_list;
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

    $scope.getDetails = function(structure) {
        console.log(structure);
        $scope.onetimes = structure.oneTimeFees;
        $scope.recurrings = structure.recurringFees;
    };


    $scope.addFeesTransaction = function(){

        $scope.response_msg = "";
        $scope.response_msg1 = "";

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

    $scope.createFeesTransaction = function(student,selectedYear,ptype){
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
            v.mode = v.mode.mode;
        });

        $scope.transaction = $scope.modes.concat($scope.otfs);

        var add = $scope.add;
        var body = {
            "year": selectedYear,
            "paymentDetails": add.paymentDetails,
            "modeOfpayment": ptype,
            "receivedBy": add.recievedBy,
            "receiptId": add.recieptId,
            "feeDetails": $scope.transaction
        };

        var student = window.btoa(student.studentId);

        var response = feeTransactionFactory.createFeesTransaction(student);
        var data = response.add({}, body,function (response){
            if(response.status == 200 || response.status == 201){
                $state.go('^.lists');
               // $scope.fetchYearList();
            }
            $scope.response_msg = "Fee transaction complete !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1 = "Fee Transaction incomplete !!!";
        });
    };

    $scope.deleteTransaction = function(fee,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var student = window.btoa(fee.studentId);
        var transaction = window.btoa(fee.transactionId);

        var dialogue_message = "Are you sure to delete the Transaction ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            if(flag){
                console.log(fee.transactionId);
                feeTransactionFactory.deleteTransaction(transaction,student).remove({},function(response){
                    if(response.status == 200){
                        $scope.fetchYearList();
                    }
                },function(response){
                    $scope.response_msg1 = "Fee Transaction Deletion Failed !!";
                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.structure_list = "";
        $state.go('feeTran.lists');
    };

    $scope.init = function(){
        $scope.structure_list = "";
    };

    $scope.init();

}]);

branchManager.factory('facultyManagementFactory',['$resource', 'br_Manager_Config','$window',function($resource, br_Manager_Config,$window){
    var factory = {};
    var fetch_faculty_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchLeaveList = function(year,offset,limit){
        // http://localhost:8080/Eshiksha/org/dfsfsdf/branch/sdfsdf/facultyleave/year/sdfsdfsdf/newState
        // '/faculty?offset='+offset+'&limit='+limit,
        return $resource(fetch_faculty_url+'/facultyleave/year/'+year+'/newState?offset='+offset+'&limit='+limit,{},{
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

    factory.rejectLeave = function (leaveId,rejected) {
        // http://localhost:8080/Eshiksha/org/sdfsdfsf/branch/sdfsdfdsf/facultyleave/sdfsdfsd/state/sdfsdfdf/approvalorrejected
        return $resource(fetch_faculty_url+'/facultyleave/'+leaveId+'/state/'+rejected+'/approvalorrejected',{}, {
            remove: {
                method: 'put',
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

    factory.approveLeave = function (leaveId,approval) {
        // http://localhost:8080/Eshiksha/org/sdfsdfsf/branch/sdfsdfdsf/facultyleave/sdfsdfsd/state/sdfsdfdf/approvalorrejected
        return $resource(fetch_faculty_url+'/facultyleave/'+leaveId+'/state/'+approval+'/approvalorrejected',{}, {
            remove: {
                method: 'put',
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

    factory.fetchPhoto = function(facultyId) {
        return $resource(fetch_faculty_url+'/image/faculty/'+facultyId,{},{
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

    //http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/faculty/userName/adarsh
    factory.validateUsername = function(userName) {
        return $resource(fetch_faculty_url+'/faculty/userName/'+userName,{},{
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

    // ORG0000001/branch/BRANCH0001/faculty/FC0000001/getClassRooms
    factory.fetchClassrooms = function(facultyId) {
        return $resource(fetch_faculty_url+'/faculty/'+facultyId+'/getClassRooms',{},{
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
        return $resource(fetch_faculty_url+'/faculty?offset='+offset+'&limit='+limit,{},{
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

    factory.fetchFacultyPdfReport = function(){
        return $resource(fetch_faculty_url+'/faculty/reports',{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        console.log("Report Generated !!!");
                        return data;
                    }
                    }
                }
        });
    };

    factory.updateFacultyEntry = function(facultyId){
    	return $resource(fetch_faculty_url+'/faculty/'+facultyId,{},{
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

    factory.deleteFaculty = function(facultyId)
    {
        // branch/BRANCH0001/faculty/FAC00005/deactivate
        console.log("Id: "+ facultyId);
    	return $resource(fetch_faculty_url+'/faculty/'+facultyId+'/deactivate',{},{
    		remove: {
    			method: 'get',
    			isArray: false,
                headers : { 'Authorization' : authCode },
    			interceptor: {
    				response: function (data) {
                        console.log("Data: "+ data);
    					return data;
    				}
    			}
    		}
    	});
    };

    factory.createFacultyEntry = function(){
        return $resource(fetch_faculty_url+'/faculty',{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data)
                    {
                        console.log("data posted successfully !!");
                        return data;
                    }
                }
            }
        });
    };

    return factory;
}]);
branchManager.controller('facultyManagementCtrl', ['$scope','facultyManagementFactory','br_manager_appConfig','$state','$filter','$modal',function($scope,facultyManagementFactory,br_manager_appConfig,$state,$filter,$modal) {

    var initials = {
        firstName:"",lastName:"",qualification:"",dateOfJoining:"",dateOfBirth:"",comments:"",emails:"",phoneNumber:"",
        phoneNumbers:"",fatherFirstName:"",fatherlastName:"",emailType:"",phoneNumberType:"",email:"",
        localAddress:"",permanentAddress:""
    };

    $scope.facultyDetails = {
        facultyList: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.fetchFacultyList = function(offset,limit){
        $scope.response_msg1 = "";
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

    $scope.fetchFacultyInfo = function(facultyId){
        console.log("facultyId "+facultyId);
        $scope.response_msg = "";
        $scope.info={};
        $scope.classrooms = [];
        angular.forEach($scope.faculty_list, function (faculty) {
           // console.log("faculty: "+faculty.facultyId);
            if (facultyId == faculty.facultyId) {
                $scope.info = faculty;
                $scope.classrooms =  $scope.fetchClassrooms(facultyId);
                $scope.fetchPhoto($scope.info.facultyId);
            }
        });
    };
    $scope.image = false;
    $scope.fetchPhoto = function(facultyId) {
        $scope.photo = [];
        var faculty = window.btoa(facultyId);
        facultyManagementFactory.fetchPhoto(faculty).fetch({},function(response){
            //$scope.photo = [];
            $scope.success = false;
            console.log(response);
            console.log("Response length"+response.data.byteLength);
            if(response.status = 200 || response.status == 201){
                $scope.photo = response.data;
                $scope.image = true;
            }
        },function(response){
            $scope.image = false;
            console.log("errorrrrrr")
        });
    };
    $scope.fetchClassrooms = function(facultyId) {
        var classes = [];
        var faculty = window.btoa(facultyId);
        console.log(facultyId);
        facultyManagementFactory.fetchClassrooms(faculty).fetch({},function(response){
            console.log(response);
            if(response.status = 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classes = _data;
                    console.log($scope.classes);
                }
                return classes;
            }
        },function(response){
            console.log("errorrrrrr")
        });
    };


    $scope.validateUsername = function(userName){
        var user = window.btoa(userName);
        facultyManagementFactory.validateUsername(user).fetch({}, function(response){
            if(response.status == 200 || response.status == 201){
                $scope.availability = "Available !!"
            }
        }, function(response){
            $scope.availability = response.data.errorMessage;
        })
    };

    $scope.addFacultyEntry = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.noOfExperience = 0;
        $scope.add = angular.copy(initials);
        console.log("inside addFacultyEntry !!");
    };

// Creating Faculty to add into database
    $scope.createFacultyEntry = function () {

         var add = $scope.add;
         $scope.add.dateOfJoining.Value = $filter('date')(new Date(add.dateOfJoining),'yyyy-MM-dd');
         $scope.add.dateOfBirth.Value = $filter('date')(new Date(add.dateOfBirth),'yyyy-MM-dd');

         var body = ' { ' +
         '"firstName":"' + add.firstName + '",' +
         '"lastName" :"' + add.lastName + '",'+
         '"dateOfBirth" :"' + $scope.add.dateOfBirth.Value  + '",'+
         '"qualification" :"' + add.qualification + '",'+
         '"designation" :"' + add.designation + '",'+
         '"noOfExperience" :"' +  $scope.noOfExperience + '",'+
         '"dateOfJoining" :"'+ $scope.add.dateOfJoining.Value + '",'+
         '"fatherFirstName" :"' + add.fatherFirstName + '",'+
         '"fatherlastName" :"' + add.fatherlastName + '",'+
         '"localAddress" :"' + add.localAddress + '",'+
         '"permanentAddress" :"' + add.permanentAddress + '",'+
         '"userName" :"' + add.userName + '",'+
         '"password" :"' + add.password + '",'+

         '"comments" :"'+add.comments + '",'+
             '"emails"'+':'+
             '['+
                 '{'+
                     '"email" :"' + add.email + '",'+
                     '"type" :"' + add.type +'"'+
                 '}'+
             ']'+','+
             '"phoneNumbers"'+':'+
             '['+
                 '{'+
                     '"phoneNumber" :"' + add.phoneNumber + '",'+
                     '"type" :"' + add.type +'"'+
                 '}'+
             ']'+
             '}';
         var response = facultyManagementFactory.createFacultyEntry();
         var data = response.add({}, body, function (response)
         {
             if(response.status == 200 || response.status == 201)
             {
                 $state.go('^.list');
                 $scope.fetchFacultyList(0,$scope.facultyDetails.numPerPage);
             }
             $scope.response_msg = "Faculty added successfully !!!";
             },function(response){
             if(response.status == 404){
                 $scope.response_msg1 = response.data.errorMessage;
             }else
                 $scope.response_msg1= "Addition of Faculty is unsuccessful !!!";
         });
     };
// ********************* Update Faculty *********************
    $scope.editFaculty = function (facultyId) {
        console.log("facultyId "+facultyId);
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.faculty_list, function (faculty) {
            console.log("faculty: "+faculty.facultyId);
            if (facultyId == faculty.facultyId) {
                 $scope.edit.facultyId = faculty.facultyId;
                 $scope.edit.firstName = faculty.firstName;
                 $scope.edit.lastName = faculty.lastName;
                 $scope.edit.dateOfBirth = new Date(faculty.dateOfBirth);
                 $scope.edit.dateOfJoining = new Date(faculty.dateOfJoining);
                 $scope.edit.qualification = faculty.qualification;
                 $scope.edit.designation = faculty.designation;
                 $scope.edit.noOfExperience = faculty.noOfExperience;
                 $scope.edit.comments = faculty.comments;
                 $scope.edit.fatherFirstName = faculty.fatherFirstName;
                 $scope.edit.fatherLastName = faculty.fatherLastName;
                 $scope.edit.localAddress = faculty.localAddress;
                 $scope.edit.permanentAddress = faculty.permanentAddress;
                 $scope.edit.email = faculty.emails[0].email;
                 $scope.edit.phoneNumber = faculty.phoneNumbers[0].phoneNumber;
             }
        });
    };

  $scope.updateFacultyEntry = function (facultyId) {
        var edit = $scope.edit;
        $scope.edit.dateOfJoining.Value = $filter('date')(new Date(edit.dateOfJoining),'yyyy-MM-dd');
        $scope.edit.dateOfBirth.Value = $filter('date')(new Date(edit.dateOfBirth),'yyyy-MM-dd');
        var body = ' { ' +
            '"firstName":"' + edit.firstName + '",' +
            '"lastName" :"' + edit.lastName + '",'+
            '"dateOfBirth" :"' + $scope.edit.dateOfBirth.Value + '",'+
            '"qualification" :"' + edit.qualification + '",'+
            '"dateOfJoining" :"'+ $scope.edit.dateOfJoining.Value + '",'+
            '"noOfExperience" :"'+ edit.noOfExperience + '",'+
            '"designation" :"'+ edit.designation + '",'+
            '"fatherFirstName" :"' + edit.fatherFirstName + '",'+
            '"fatherLastName" :"' + edit.fatherLastName + '",'+
            '"localAddress" :"' + edit.localAddress + '",'+
            '"permanentAddress" :"' + edit.permanentAddress + '",'+
            '"comments" :"'+ edit.comments + '",'+
            '"emails"'+':'+
                '['+
                    '{'+
                        '"email" :"' + edit.email + '",'+
                        '"type" :"' + edit.type +'"'+
                    '}'+
                ']'+','+
            '"phoneNumbers"'+':'+
                '['+
                    '{'+
                        '"phoneNumber" :"' + edit.phoneNumber + '",'+
                        '"type" :"' + edit.type +'"'+
                    '}'+
                ']'+
            '}';
        var faculty = window.btoa(facultyId);
        var response = facultyManagementFactory.updateFacultyEntry(faculty);
        var data = response.edit({}, body, function (response)
        {
            if(response.status == 200 || response.status == 201)
            {
                $state.go('^.list');
                //$scope.fetchFacultyList(0,$scope.facultyDetails.numPerPage);
            }
            $scope.response_msg = "Faculty updated successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Faculty is unsuccessful !!!";
        });
    };

    $scope.deleteFaculty = function(faculty,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var faculty = window.btoa(faculty.facultyId);

        var dialogue_message = "Are you sure to delete the Faculty ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){
                console.log(faculty.facultyId);
                facultyManagementFactory.deleteFaculty(faculty).remove({},function(response){
                    if(response.status == 200 || response.status == 201){
                        $state.go('^.list');
                        $scope.fetchFacultyList(0,$scope.facultyDetails.numPerPage);
                        console.log("deleted");
                    }
                },function(response){
                    if(response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }
                    else
                        $scope.response_msg1= "Faculty deletion unsuccessful !!!";
                });
            }
            else {
                console.log("Failed to delete");
            }
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
    
    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.photo = [];
        $state.go('^.list');
    };
    
    $scope.init();

    $scope.pageChanged = function(){
        $scope.facultyDetails.startValue = (($scope.facultyDetails.currentPage - 1) * $scope.facultyDetails.numPerPage);
        $scope.fetchFacultyList($scope.facultyDetails.startValue,$scope.facultyDetails.numPerPage);
    };

}]);


branchManager.controller('facultyLeaveCtrl', ['$scope','facultyManagementFactory','br_manager_appConfig','$state','$filter','$modal',function($scope,facultyManagementFactory,br_manager_appConfig,$state,$filter,$modal)
{
    $scope.fetchYearList = function () {
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
    };

    $scope.leaveDetails = {
        leaveList: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };
    $scope.fetchLeaveList = function(year,offset,limit){
        // var faculty = $window.sessionStorage.getItem('facultyId');
        var year1 = window.btoa(year);
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        facultyManagementFactory.fetchLeaveList(year1,offset,limit).fetch({},function(response){
            $scope.leave_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.facultyLeaveResponseDTO!=undefined){
                    var _data = angular.fromJson(response.data.facultyLeaveResponseDTO);
                    $scope.leave_list = _data;
                    //   console.log("leave_list"+$scope.leave_list.state);
                    $scope.totalPages = Math.ceil($scope.count/$scope.leaveDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.leave_list.length);
                }
            }
        },function(response){
            $scope.leave_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "leave" && $scope.leave_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.leave_list.length);
        }
    });

    $scope.rejectLeave = function(leaveId, year){
        var rejected = window.btoa("Rejected");
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var leave = window.btoa(leaveId);
        var year1 = window.btoa(year);
        var dialogue_message = "Are you sure you want to Reject the Leave ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){

                facultyManagementFactory.rejectLeave(leave,rejected).remove({},function(response){
                    if(response.status == 200){
                        $scope.fetchLeaveList(year1,0,$scope.leaveDetails.numPerPage);
                        console.log("Cancelled")
                    }
                    $state.go("^.list");
                    $scope.response_msg = "Leave Rejected successfully !!!";
                },function(response){
                    if(response.status == 409){
                        $scope.response_msg1 = "Leave Rejection failed !!!";
                    }else if( response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }
                    else{
                        $scope.response_msg1 = "Leave Rejection failed !!!";
                        console.log(response.status);
                    }
                });
            }
            else {
                console.log("Failed to Reject");
            }
        });
    };



    $scope.approveLeave = function(leaveId, year){
        var approval = window.btoa("Approval");
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var leave = window.btoa(leaveId);
        var year1 = window.btoa(year);
        var dialogue_message = "Are you sure you want to Approve the Leave ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){

                facultyManagementFactory.approveLeave(leave,approval).remove({},function(response){
                    if(response.status == 200){
                        $scope.fetchLeaveList(year1,0,$scope.leaveDetails.numPerPage);
                        console.log("Approved");
                    }
                    $state.go("^.list");
                    $scope.response_msg = "Leave Approval is successfully !!!";
                },function(response){
                    if(response.status == 409){
                        $scope.response_msg1 = "Leave Approval is failed !!!";
                    }else if(response.status == 404){
                        $scope.response_msg1 = response.data.errorMessage;
                    }
                    else{
                        $scope.response_msg1 = "Leave Approval is failed !!!";
                        console.log(response.status);
                    }
                });
            }
            else {
                console.log("Failed to Approve");
            }
        });

    };

    $scope.init = function(year){
        $scope.leaveDetails.numPerPage = parseInt($scope.leaveDetails.numPerPage);
        $scope.maxSize = 5;
        $scope.fetchLeaveList(year,0,$scope.leaveDetails.numPerPage);
        console.log("Selected Item Per Page: "+$scope.leaveDetails.numPerPage);

    };

    $scope.init();

    $scope.pageChanged = function(year){
        $scope.leaveDetails.startValue = (($scope.leaveDetails.currentPage - 1) * $scope.leaveDetails.numPerPage);
        $scope.fetchLeaveList(year,$scope.leaveDetails.startValue,$scope.leaveDetails.numPerPage);
    };

}]);

branchManager.controller('facultyReportCtrl',['$scope','facultyManagementFactory','$state',function($scope,facultyManagementFactory,$state){

    $scope.generateFacultyReport = function(){
        console.log("Inside generateFacultyReport()");
        facultyManagementFactory.fetchFacultyPdfReport().fetch({},function(response){
            $scope.success = false;
            if(response.status = 200){
                if(response.data.byteLength>0){
                    $scope.success = true;
                    console.log("response status 200 !!");
                    console.log("Reponse.data.byteLength = " + response.data.byteLength);
                    var file = new Blob([response.data], { type: 'application/pdf' });
                    $scope.fileURL = URL.createObjectURL(file);
                    $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                }else{
                    console.log("Reponse.data.byteLength = "+response.data.byteLength);
                }
            }
        },function(response){
            console.log("Error Unable to download the page");
        });
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
        window.open($scope.fileURL);

    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('facultyreports.main');
    };


}]);
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

        var response = inventoryManagementFactory.createInventoryEntry();
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
        window.open($scope.fileURL);

    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('intryreport.main');
    };

}]);
branchManager.factory('vehicleManagementFactory',['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
    var factory = {};
    var fetch_vehicle_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");



    factory.fetchVehiclePdfReport = function(){
        //localhost:8080/feesmanagementsystem/org/ORG0000001/branch/BRANCH0001/vehicle/reports
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

    factory.vehicleStudents = function(){
        console.log("Autorize: "+ authCode);
        return $resource(fetch_vehicle_url+'/vehicle/getVehicleIds',{},{
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

    factory.studendsForVehicle = function(routeName){
        // /BRANCH0001/vehicle/reports/routeName/Chord%20Name
        return $resource(fetch_vehicle_url+'/vehicle/reports/routeName/'+routeName,{},{
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



    return factory;
}]);
branchManager.controller('vehicleManagementCtrl', ['$scope','vehicleManagementFactory','br_manager_appConfig','$state','$filter','$modal',function($scope,vehicleManagementFactory,br_manager_appConfig,$state,$filter,$modal) {

    var initials = {
        vehicleId: "", vehicleType:"",vehicleRegNo:"",vehicleModel:"",yearOfManufacter:"",insuranceRenewal:"",nextRenewalDate:""
        ,seatCapacity:"",routeName:"",routeNumber:""
    };

    $scope.vehicleDetails = {
        vehicleList: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.fetchVehicleList = function(offset,limit){
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
            '"driverName" :"'+ add.driverName + '",'+
            '"routeName" :"'+ add.routeName + '",'+
            '"routeNumber" :"'+ add.routeNumber + '",'+
            '"phoneNumbers"'+':'+
            '{'+
                '"phoneNumber" :"' + add.phoneNumber + '",'+
                '"type" :"' + add.type +'"'+
            '},'+
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
                $scope.edit.routeNumber = vehicle.routeNumber;
                $scope.edit.phoneNumber = vehicle.phoneNumbers.phoneNumber;
                $scope.edit.vehicleModel = vehicle.vehicleModel;
                $scope.edit.yearOfManufacter = vehicle.yearOfManufacter;
                $scope.edit.dateOfPurchase = new Date(vehicle.dateOfPurchase);
                $scope.edit.insuranceRenewal = new Date(vehicle.insuranceRenewal);
                $scope.edit.nextRenewalDate = new Date(vehicle.nextRenewalDate);
            }
        });
    };

    $scope.editVehicleEntry = function (vehicleId) {
        var edit = $scope.edit;
        $scope.edit.dateOfPurchase.Value = $filter('date')(new Date(edit.dateOfPurchase),'yyyy-MM-dd');
        $scope.edit.insuranceRenewal.Value = $filter('date')(new Date(edit.insuranceRenewal),'yyyy-MM-dd');
        $scope.edit.nextRenewalDate.Value = $filter('date')(new Date(edit.nextRenewalDate),'yyyy-MM-dd');
        var body = ' { ' +
            '"vehicleType":"' + edit.vehicleType + '",' +
            '"vehicleRegNo" :"' + edit.vehicleRegNo + '",'+
            '"vehicleModel" :"'+ edit.vehicleModel + '",'+
            '"seatCapacity" :"'+ edit.seatCapacity + '",'+
            '"driverName" :"'+ edit.driverName + '",'+
            '"routeName" :"'+ edit.routeName + '",'+
            '"routeNumber" :"'+ edit.routeNumber + '",'+
            '"phoneNumbers"'+':'+
                '{'+
                    '"phoneNumber" :"' + edit.phoneNumber + '",'+
                    '"type" :"' + edit.type +'"'+
                '}'+ ','+
            '"yearOfManufacter" :"' + edit.yearOfManufacter + '",'+
            '"dateOfPurchase" :"' + $scope.edit.dateOfPurchase.Value + '",'+
            '"insuranceRenewal" :"' + $scope.edit.insuranceRenewal.Value + '",'+
            '"nextRenewalDate" :"' + $scope.edit.nextRenewalDate.Value + '"}';
        var vehicle = window.btoa(vehicleId);
        var response = vehicleManagementFactory.editVehicleEntry(vehicle);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
               // $scope.fetchVehicleList(0,$scope.vehicleDetails.numPerPage);
            }
            $scope.response_msg = "Vehicle Details Updated successfully !!!";
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
        console.log("inside delete function !!");

        var dialogue_message = "Are you sure to delete the Vehicle ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){
                console.log(vehicle.vehicleId);
                vehicleManagementFactory.deleteVehicle(vehicle).remove({},function(response){
                 if(response.status == 200 || response.status == 201){
                      $scope.fetchVehicleList(0,$scope.vehicleDetails.numPerPage);
                     console.log("deleted")
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


branchManager.controller('vehicleReportsCtrl',['$scope','vehicleManagementFactory','$state',function($scope,vehicleManagementFactory,$state){

    $scope.vehicleReport = function(){
        $scope.generateVehicleReport();
        console.log("Inside vehicleReports()");
    };
    $scope.generateVehicleReport = function(){
        console.log("Inside generateVehicleReport()");
        vehicleManagementFactory.fetchVehiclePdfReport().fetch({},function(response){
            $scope.success = false;
            if(response.status = 200){
                if(response.data.byteLength>0){
                    $scope.success = true;
                    console.log("response status 200 !!");
                    console.log("Download Complete !!!");
                    console.log("Content length = " + response.data.byteLength);
                    var file = new Blob([response.data], { type: 'application/pdf' });
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


    $scope.vehicleStudents = function(){
        $scope.response_msg = "";
        vehicleManagementFactory.vehicleStudents().fetch({},function(response){
            $scope.vehicle_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.vehicles!=undefined){
                    var _data = angular.fromJson(response.data.vehicles);
                    $scope.vehicle_list = _data;
                   // $scope.vehicle = $scope.vehicle_list[0];
                   // console.log($scope.vehicle_list);
                }
            }
        },function(response){
            $scope.vehicle_list = [];
            console.log(response.status);
        });
    };

    $scope.studendsForVehicle = function(vehicle){

        if( vehicle == undefined ){
            window.alert("Please select the Route Name");
        }
        else {
            console.log(vehicle.routeName);
            var routeName = window.btoa(vehicle.routeName);
            vehicleManagementFactory.studendsForVehicle(routeName).fetch({}, function (response) {
                $scope.success = false;
                if (response.status == 200 || response.status == 201) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        console.log("Download Complete !!!");
                        console.log("content length = " + response.data.byteLength);
                        var file = new Blob([response.data], {type: 'application/pdf'});
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
        window.open($scope.fileURL);
    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('vehiclereports.main');
    };

}]);
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
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
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
        console.log("fuelbook "+date);
        $scope.response_msg = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.fuelbook_lists, function (fuelbook) {
            console.log("date: "+fuelbook.date);
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

        var dialogue_message = "Are you sure to delete the entry ??";
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

    $scope.init = function()
    {
       $scope.fuelbookDetails.numPerPage = parseInt($scope.fuelbookDetails.numPerPage);
       $scope.maxSize = 5;
       $scope.fuelbook_lists =[];
      // $scope.fetchVehicleList(0,$scope.vehicleDetails.numPerPage);
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
branchManager.factory('libraryManagementFactory',['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
    var factory = {};
    var fetch_library_url = br_Manager_Config.getMainAPI();
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


    factory.fetchLibraryReport = function(){
        return $resource(fetch_library_url+'/library/reports',{},{
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


    factory.fetchDefaulterList = function(offset,limit){
       // http://localhost:8080/Eshiksha/org/orgId/branch/branchId/library/defaulters?offset=0&limit=25
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

branchManager.controller('libraryManagementCtrl', ['$scope','libraryManagementFactory','br_manager_appConfig','$state','$filter','$modal',function($scope,libraryManagementFactory,br_manager_appConfig,$state,$filter,$modal) {

    var initials = {
        bookId:"", bookName:"",author:"",publication:"",issuedTo:"",
        issuedDate:"",returnDate:"",approximateCost:"",bookVersion:""
    };

    $scope.libraryDetails = {
        libraryList: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.defaulterDetails = {
        libraryList: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };

    $scope.search_by_list = ["Author","Publication","Book Name"];

    $scope.fetchLibraryList = function(offset,limit) {
        $scope.response_msg1 = "";
        libraryManagementFactory.fetchLibraryList(offset,limit).fetch({},function(response) {
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

        },function(response) {
            $scope.library_list = [];
            //$scope.response_msg1 = "No Books Found";
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.searchBooks = function(searchby,inputValue, offset,limit){
        console.log(searchby);
        console.log(inputValue);
        $scope.response_msg = "";
        var value = window.btoa(inputValue);
        libraryManagementFactory.searchBooks(searchby,value, offset,limit).fetch({},function(response) {
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

        },function(response) {
            $scope.library_list = [];
            //$scope.response_msg1 = "No books found.";
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };
    // Check Below for Current Name
    $scope.$on('$viewContentLoaded',function() {
        if($state.current.name == "library" && $scope.library_list != undefined) {
            $scope.$parent.setBaseContentHeight($scope.library_list.length);
        }
    });


    $scope.fetchDefaulterList = function(offset,limit) {
        $scope.response_msg = "";
        libraryManagementFactory.fetchDefaulterList(offset,limit).fetch({},function(response) {
            $scope.defaulter_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201) {
                $scope.count = response.data.total;
                if(response.data.assignedBooks!=undefined) {
                    var _data = angular.fromJson(response.data.assignedBooks);
                    $scope.defaulter_list = _data;
                    $scope.totalPages = Math.ceil($scope.count/$scope.defaulterDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.defaulter_list.length);
                }
            }

        },function(response) {
            $scope.defaulter_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };


    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
        $scope.standard_list =[];
        $scope.section_list =[];
        $scope.student_list =[];
        $scope.fee_list =[];
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        libraryManagementFactory.fetchStandardList(year).fetch({},function(response){
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
            $scope.response_msg = "No Classes Found.";
            console.log(response.status);
        });
    };

    $scope.fetchClassRoomlist = function(selectedYear, currentStandard){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        libraryManagementFactory.fetchClassRoomlist(year, standard).fetch({},function(response){
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
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        var section = window.btoa(currentSection.section);
        libraryManagementFactory.fetchStudentList(year,standard,section).fetch({},function(response){
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

    $scope.fetchFacultyList = function(offset,limit){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        libraryManagementFactory.fetchFacultyList(offset,limit).fetch({},function(response){
            $scope.faculty_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.faculties!=undefined){
                    var _data = angular.fromJson(response.data.faculties);
                    $scope.faculty_list = _data;
                }
            }
        },function(response){
            $scope.faculty_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.addLibraryBook = function() {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        console.log("inside addLibraryBook !!")
    };

    $scope.createLibraryBookEntry = function (bookId) {

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
        var response = libraryManagementFactory.createLibraryBookEntry(book);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
            }
            $scope.response_msg = "LibraryBookEntry added successfully !!!";
            $state.go('^.list');
        },function(response){
            if(response.status == 404){
                $scope.add.branchName = "";
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of LibraryBookEntry is unsuccessful !!!";
        });
    };

// ******************* Update Library *******************
    $scope.editLibrary = function (bookId) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
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
            }
        });
    };

    $scope.editLibraryBook = function (bookId) {
        var edit = $scope.edit;
        var body = ' { ' +

            '"bookName" :"' + edit.bookName + '",'+
            '"bookVersion" :"' + edit.bookVersion + '",'+
            '"author" :"'+edit.author+  '",'+
            '"publication" :"'+edit.publication+  '",'+
            '"approximateCost" :"'+edit.approximateCost+
            '"}';
        var book = window.btoa(bookId);
        var response = libraryManagementFactory.editLibraryBook(book);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                //$scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
                $scope.response_msg = "Library Book updated successfully !!!";
                $state.go('^.list');
            }
        },function(response) {
            if(response.status == 404) {
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
                libraryManagementFactory.deleteBook(book).remove({},function(response){
                    if(response.status == 200){
                        $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
                        console.log("deleted")
                    }
                },function(response){
                    if(response.status == 404) {
                        $scope.response_msg1 = response.data.errorMessage;
                    }
                        $scope.response_msg1 = "Book Deletion failed !!!";
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


    $scope.assignBook = function (book) {
        if(angular.equals(book.issuedTo,"N/A")){
            $state.go('^.assign');
            $scope.response_msg = "";
            $scope.response_msg1 = "";
            $scope.assign = angular.copy(initials);

            angular.forEach($scope.library_list, function (library) {
                console.log("book: "+library.bookId);
                if (book.bookId == library.bookId) {
                    $scope.assign.bookId = library.bookId;
                    $scope.assign.bookName = library.bookName;
                    $scope.assign.author = library.author;
                    $scope.assign.publication = library.publication;
                    $scope.assign.approximateCost = library.approximateCost;
                }
            });
        }else{
            alert("This book is already assigned to someone");
        }
    };

    $scope.assignTo = function (bookId) {
        var issuedTo = function(assign){
            if($scope.isVisibleS == true){
                return assign.student.studentId;
            }
            else if($scope.isVisibleF == true){
                return assign.faculty.facultyId;
            }
        };

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
        var response = libraryManagementFactory.assignTo(book);
        var data = response.assign({}, body, function (response)
        {
            if(response.status == 200 || response.status == 201){
                $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
                $scope.isVisibleS = false;
                $scope.isVisibleF = false;
            }
            $scope.response_msg = "Book assigned successfully !!!";
            $state.go('^.list');
        },function(response) {
            if(response.status == 404) {
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Assigning of book is unsuccessful !!!";
        });
    };


    $scope.returnBook = function(book){
        if(angular.equals(book.issuedTo,"N/A")){
            alert("This book is not assigned to anyone");
        }else{
            $state.go('^.ret');
            $scope.response_msg = "";
            $scope.response_msg1 = "";
            $scope.ret = angular.copy(initials);
            angular.forEach($scope.library_list, function (library) {
                if (book.bookId == library.bookId) {
                    $scope.ret.bookId = library.bookId;
                    $scope.ret.issuedTo = library.issuedTo;
                }
            });
        }
    };
    $scope.unissueBook = function (bookId) {
        console.log("book id: "+ bookId);
        var ret = $scope.ret;
        $scope.ret.returnDate.Value = $filter('date')(new Date(ret.returnDate),'yyyy-MM-dd');
        var body = ' { ' +
            '"bookId" :"' + ret.bookId + '",'+
            '"studentId" :"' + ret.issuedTo +
            '"}';
        var book = window.btoa(bookId);
        var response = libraryManagementFactory.unissueBook(book);
        var data = response.ret({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
                $scope.isVisibleS = false;
                $scope.isVisibleF = false;
            }
            $scope.response_msg = "Book returned successfully !!!";
            $state.go('^.list');

        },function(response){
            if(response.status == 404) {
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Book Returning is unsuccessful !!!";
        });
    };

    $scope.fetchLibraryReport = function(){
        console.log("Inside library report()");
        libraryManagementFactory.fetchLibraryReport().fetch({},function(response){
            $scope.success = false;
            if(response.status = 200){
                if(response.data.byteLength>0){
                    $scope.success = true;
                    console.log("response status 200 !!");
                    console.log("Download Complete !!! content length: "+response.data.byteLength);
                    var file = new Blob([response.data], { type: 'application/pdf' });
                    $scope.fileURL = URL.createObjectURL(file);
                    $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                }else
                {
                    console.log("Reponse data-length = " + response.data.byteLength);
                }
            }
        },function(response){
            console.log("Error Unable to download the page");
        });
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
        window.open($scope.fileURL);

    };

    $scope.init = function() {
        $scope.libraryDetails.numPerPage = parseInt($scope.libraryDetails.numPerPage);
        $scope.defaulterDetails.numPerPage = parseInt($scope.defaulterDetails.numPerPage);
        $scope.maxSize = 5;
        //$scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
    };
    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('reports.main');
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };
    
    $scope.init();

    $scope.pageChanged = function() {
        $scope.libraryDetails.startValue = (($scope.libraryDetails.currentPage - 1) * $scope.libraryDetails.numPerPage);
        $scope.fetchLibraryList($scope.libraryDetails.startValue,$scope.libraryDetails.numPerPage);
    };
    $scope.pageChanged1 = function() {
        $scope.defaulterDetails.startValue = (($scope.defaulterDetails.currentPage - 1) * $scope.defaulterDetails.numPerPage);
        $scope.fetchDefaulterList($scope.defaulterDetails.startValue,$scope.defaulterDetails.numPerPage);
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


branchManager.factory('holidayManagementFactory',['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
    var factory = {};
    var fetch_holidaylist_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_holidaylist_url+'/classroom/year/'+ selectedYear, {}, {
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

    factory.fetchSectionList = function(currentStandard, selectedYear) {
        return $resource(fetch_holidaylist_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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


    factory.fetchHolidayList = function(selectedYear,offset,limit){
        // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/holidaylist/year/2016-17/holidays
        return $resource(fetch_holidaylist_url+'/holidaylist/year/'+selectedYear+'/holidays?offset='+offset+'&limit='+limit,{},{
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

    factory.createHoliday = function(){
        return $resource(fetch_holidaylist_url+'/holidaylist',{},{
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

    factory.updateHoliday = function(startTime, to){
        return $resource(fetch_holidaylist_url+'/holidaylist/startTime/'+startTime+'/to/'+to,{},{
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

    factory.deleteHoliday = function(year,startDate,endDate){
        return $resource(fetch_holidaylist_url+'/holidaylist?startDate='+startDate+'&endDate='+endDate+'&year='+year,{},{
            remove: {
                method: 'Delete',
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
branchManager.controller('holidaysManagementCtrl', ['$scope','holidayManagementFactory','br_manager_appConfig','$state','$filter','$modal',function($scope,holidayManagementFactory,br_manager_appConfig,$state,$filter,$modal) {

    var initials = {
        type:"",reason:"",classroomId:"",startTime:"",endTime:"",year:""
    };

    $scope.holidayDetails = {
        holiday_lists: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };



    $scope.fetchYearList = function () {
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
        $scope.holiday_lists = "";
    };

    $scope.fetchHolidayList = function(selectedYear,offset,limit) {
        $scope.response_msg ="";
        $scope.response_msg1 = "";
        var year = window.btoa(selectedYear);
        holidayManagementFactory.fetchHolidayList(year,offset,limit).fetch({},function(response) {
            $scope.holiday_lists =[];
            console.log(response);
            if(response.status == 200) {
                $scope.count = response.data.total;
                console.log($scope.count);
                if(response.data.holidayLists!=undefined) {
                    var _data = angular.fromJson(response.data.holidayLists);
                    console.log(_data);
                    $scope.holiday_lists = _data;
                    $scope.totalPages = Math.ceil($scope.count/$scope.holidayDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.holiday_lists.length);
                }
            }
        },function(response){
            $scope.holiday_lists = [];
            $scope.response_msg1 = "No Holidays found for this year.";
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    // Check Below for Current Name
    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "holiday" && $scope.holidays_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.holidays_list.length);
        }
    });

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg1 = "";
        var year = window.btoa(selectedYear);
        holidayManagementFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            console.log( $scope.standard_list);
            if(response.status == 200 || response.status == 201){
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                }
            }
        },function(response){
            $scope.standard_list = [];
            //$scope.response_msg1 = "No Classes found for this year.";
            console.log(response.status);
        });

    };

    $scope.fetchSectionList = function(currentStandard,selectedYear){
        $scope.response_msg1 = "";
        var standard = window.btoa(currentStandard);
        var year = window.btoa(selectedYear);
        holidayManagementFactory.fetchSectionList(standard,year).fetch({},function(response){
            $scope.classroom_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classroom_list = _data;
                }
            }
        },function(response){
            $scope.classroom_list = [];
           // $scope.response_msg1 = "No Classrooms found for this year.";
            console.log(response.status);
        });
    };

    $scope.addHoliday = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        $scope.other= 0;
        $scope.holiday = function(to){
            hol_to = "Class room";
            hol_to1 = "Class";
            if(angular.equals(hol_to,to)){
                $scope.other = 1;
                console.log("all change");

            }else if(angular.equals(hol_to1,to)){
                $scope.other = 2;
                console.log("two change");
            }else{
                $scope.other = 0;
                console.log("No change");
            }
        };
        $scope.fetchStandardList($scope.selectedYear);
    };


    $scope.holiday_type = ["National Holiday","Study Holidays","Festival","Summer Holidays","Winter Holidays","Regional Holiday"];
    $scope.holiday_to = ['School', 'Class', 'Class room'];

    $scope.createHoliday = function () {
        var add = $scope.add;

        $scope.add.startTime.Value = $filter('date')(new Date(add.startTime),'yyyy-MM-dd');
        $scope.add.endTime.Value = $filter('date')(new Date(add.endTime),'yyyy-MM-dd');

        var input = function(){
            var formData = {};
            if(angular.equals(add.to, "Class room")){
                formData ={
                    type: add.type,
                    reason: add.reason,
                    startTime: $scope.add.startTime.Value,
                    endTime: $scope.add.endTime.Value,
                    to: add.to,
                    standard: add.standard,
                    classroomId: add.classroom.classRoomId,
                    //section: add.classroom.section,
                    year: add.year
                }
            }else if(angular.equals(add.to, "Class")){
                formData ={
                    type: add.type,
                    reason: add.reason,
                    startTime: $scope.add.startTime.Value,
                    endTime: $scope.add.endTime.Value,
                    to: add.to,
                    standard: add.standard,
                    year: add.year
                }
            }else{
                formData ={
                    type: add.type,
                    reason: add.reason,
                    startTime: $scope.add.startTime.Value,
                    endTime: $scope.add.endTime.Value,
                    to: add.to,
                    year: add.year
                }
            }
            return formData;
        };

        var body = input();
        var response = holidayManagementFactory.createHoliday();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                $scope.fetchYearList();
            }
            $scope.response_msg = "Holiday added successfully !!!";
        },function(response){
            //$scope.response_msg1 = response.data.errorMessage;
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }else
                $scope.response_msg1= "Addition of Holiday is unsuccessful !!!";
        });
    };

//************************ Updating Inventory **************************

    $scope.editHoliday = function (holiday, index) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";

        $scope.edit =holiday;
        $scope.edit.prevStartTime = holiday.startTime;
        $scope.edit.prevEndTime = holiday.endTime;

        $scope.edit.startTime = new Date(holiday.startTime);
        $scope.edit.endTime = new Date(holiday.endTime);

        console.log($scope.edit.type);
        console.log($scope.edit.reason);
        console.log($scope.edit.standard);
        console.log($scope.edit.classRoomId);
        console.log($scope.edit.year);
        console.log($scope.edit.startTime);
        console.log($scope.edit.endTime);

    };


    $scope.updateHoliday = function () {
        var edit = $scope.edit;

        $scope.edit.startTime = $filter('date')(new Date($scope.edit.startTime),'yyyy-MM-dd');
        $scope.edit.endTime = $filter('date')(new Date($scope.edit.endTime),'yyyy-MM-dd');

        console.log($scope.edit.type);
        console.log($scope.edit.reason);
        console.log($scope.edit.standard);
        console.log($scope.edit.classRoomId);
        console.log($scope.edit.year);
        console.log(edit.to);
        console.log($scope.edit.startTime);
        console.log($scope.edit.endTime);

        var body = ' { ' +
            '"type":"' + edit.type + '",' +
            '"reason":"' + edit.reason + '",' +
            '"to":"' + edit.to + '",' +
            '"standard":"' + edit.standard + '",' +
            '"classroomId" :"' + edit.classRoomId + '",'+
            '"year" :"' + edit.year + '",'+
            '"startTime" :"' + $scope.edit.startTime + '",'+
            '"endTime" :"'+ $scope.edit.endTime +'"}';

        var start = window.btoa($scope.edit.prevStartTime);
        var to = window.btoa(edit.to);
        var response = holidayManagementFactory.updateHoliday(start,to);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                $scope.fetchYearList();
            }
            $scope.response_msg = "Holiday updated successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updating of Holiday is unsuccessful !!!";
        });
    };

    $scope.deleteHoliday = function(holiday,index,year){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        console.log(holiday.startTime);
        console.log(holiday.endTime);
        console.log(year);
        var startTime = window.btoa(holiday.startTime);
        var endTime = window.btoa(holiday.endTime);
        var year = window.btoa(holiday.year);

        var dialogue_message = "Are you sure to delete the Holidy Entry ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value:"+ flag);
            if(flag){
                holidayManagementFactory.deleteHoliday(year,startTime,endTime).remove({},function(response){
                    console.log(response.status);
                    if(response.status == 200 || response.status == 201 || response.status == 204){
                        $scope.holiday_lists ="";
                        $state.go('^.list');
                        $scope.fetchYearList();
                        $scope.response_msg = "Holiday Entry Deleted successfully !!!";
                    }
                },function(response){
                    $scope.response_msg1 = "Deletion of holiday unsuccessful !!";
                    console.log(response.status);
                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };


    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "holiday" && $scope.holiday_lists != undefined){
            $scope.$parent.setBaseContentHeight($scope.holiday_lists.length);
        }
    });

    $scope.init = function() {
        $scope.holidayDetails.numPerPage = parseInt($scope.holidayDetails.numPerPage);
        $scope.maxSize = 5;
       // $scope.fetchFacultyList(0,$scope.facultyDetails.numPerPage);
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };

    $scope.init();

    $scope.pageChanged = function(year){
        $scope.holidayDetails.startValue = (($scope.holidayDetails.currentPage - 1) * $scope.holidayDetails.numPerPage);
        $scope.fetchHolidayList(year,$scope.holidayDetails.startValue,$scope.holidayDetails.numPerPage);
    };

}]);
branchManager.factory('assessmentMangementFactory',['$resource','br_Manager_Config','$window',function ($resource,br_Manager_Config,$window){
    var factory = {};

    var fecth_assessment_url =  br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fecthAssesmentList = function(currentClassroom){
        // branch/BRANCH0001/classroom/CL0000002/assessment/fetch
        return $resource(fecth_assessment_url+'/classroom/'+currentClassroom+'/assessment/fetch',{},{
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

    factory.fetchStandardList = function(selectedYear) {
        return $resource(fecth_assessment_url+'/classroom/year/'+ selectedYear, {}, {
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

    factory.fetchSectionList = function(currentStandard, selectedYear) {
        return $resource(fecth_assessment_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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

    factory.listExams = function(classroomId, assessmentId){
        // /BRANCH0001/classroom/CL0000002/assessment/ASS0000016
        return $resource(fecth_assessment_url+'/classroom/'+classroomId+'/assessment/'+assessmentId,{},{
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

    factory.fetchSubjectList = function(currentClassroom){
        return $resource(fecth_assessment_url+'/subject/classroom/'+currentClassroom,{},{
            fetch : {
                method : 'get',
                isArray : false,
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function (data) {
                        return data;
                    }
                }
            }
        });
    };

    factory.createAssessment = function(classRoomId){
        // classroom/CL00000001/assessment
        return $resource(fecth_assessment_url+'/classroom/'+classRoomId+'/assessment',{},{
            add:{
                method:'POST',
                headers: { 'Authorization' : authCode,
                            'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data)
                    {
                        console.log("data posted successfully !!");
                        return data;
                    }
                }
            }
        });
    };


    factory.updateAssessment = function(classRoomId, assess){
        return $resource(fecth_assessment_url+'/classroom/'+classRoomId+'/assessment/'+assess,{},{
            add:{
                method:'PUT',
                headers: { 'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data)
                    {
                        console.log("data posted successfully !!");
                        return data;
                    }
                }
            }
        });
    };


    factory.deactivateAssessment = function (classroomId, assessmentId) {
        // /classroom/CL000001/assessment/AS0000001/dectivate
        return $resource(fecth_assessment_url+'/classroom/'+classroomId+'/assessment/'+assessmentId+'/dectivate',{}, {
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

branchManager.controller('assessmentCtrl',['$scope','assessmentMangementFactory','br_manager_appConfig','$state','$filter','$modal',function($scope,assessmentMangementFactory,br_manager_appConfig,$state,$filter,$modal){

    var initials = {
        assesmentName:"",
        year:"",
        classRoomId:"",
        assessmentId:"",
        maxMarks1:"",maxMarks2:"",maxMarks3:"",maxMarks4:"",maxMarks5:"",
        maxMarks6:"",maxMarks7:"",maxMarks8:"",maxMarks9:"",maxMarks10:""
    };
    $scope.assessmentDetails = {
        assessmentList: [],
        numPerPage:25,
        currentPage:1,
        startValue:0
    };

    $scope.assessments_name = ['First Test','Second Test','Midterm Exam', 'Prepratory Exam','Annual Exam', 'Other'];
    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
        $scope.standard_list ="";
        $scope.assessment_list = "";
        $scope.classroom_list = "";
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.assessment_list = "";
        $scope.classroom_list = "";
        var year = window.btoa(selectedYear);
        assessmentMangementFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            console.log( $scope.standard_list);
            if(response.status == 200 || response.status == 201){
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                }
            }
        },function(response){
            $scope.standard_list = [];
            $scope.response_msg1 = "There is no Class found for this year.";
            console.log(response.status);
        });
    };

    $scope.fetchSectionList = function(currentStandard,selectedYear){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        $scope.assessment_list ="";
        var standard = window.btoa(currentStandard);
        var year = window.btoa(selectedYear);
        assessmentMangementFactory.fetchSectionList(standard,year).fetch({},function(response){
            $scope.classroom_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classroom_list = _data;
                }
            }
        },function(response){
            $scope.classroom_list = [];
            $scope.response_msg1 = "There is no classrooms found for this standard.";
            console.log(response.status);
        });
    };

    $scope.fecthAssesmentList = function(currentClassroom){
        $scope.response_msg1 = "";
        var classRoom = window.btoa(currentClassroom.classRoomId);
        assessmentMangementFactory.fecthAssesmentList(classRoom).fetch({},function(response){
            $scope.assessment_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.assessmentLists!=undefined){
                    var _data = angular.fromJson(response.data.assessmentLists);
                    $scope.assessment_list = _data;
                    $scope.$parent.setBaseContentHeight($scope.assessment_list.length);
                }
            }
        },function(response){
            $scope.assessment_list = [];
            $scope.response_msg1 = "There is no Assessments.";
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.fetchSubjectList = function(currentClassroom){
        $scope.response_msg = "";
        var classRoom = window.btoa(currentClassroom.classRoomId);
        assessmentMangementFactory.fetchSubjectList(classRoom).fetch({}, function(response){
            $scope.sub_list = [];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.subjects != undefined){
                    var _data = angular.fromJson(response.data.subjects);
                    $scope.sub_list = _data;
                    $scope.subjects = [];
                    $scope.sub_list.forEach(function(v){
                        $scope.subjects.push(v.subjectName);
                    });
                }
            }
        });
    };


    $scope.listExams = function(classroom, assessment,index,selectedYear){
        $scope.response_msg = "";
        var classRoom = window.btoa(classroom.classRoomId);
        var assess = window.btoa(assessment.assessmentId);
        assessmentMangementFactory.listExams(classRoom,assess).fetch({}, function(response){
            $scope.exams_list = {};
            console.log(response);
            if(response.status == 200){
                if(response.data != undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.exams_list = _data;
                    $scope.assessmentId = assessment.assessmentId;
                    $scope.classRoomId = classroom.classRoomId;
                    $scope.section = assessment.section;
                    $scope.assesmentName = $scope.exams_list.assesmentName;
                    $scope.eyear = selectedYear;
                    $scope.Exams = $scope.exams_list.exams;
                }
            }
        });
    };

// ******************************************************
    $scope.addAssessment =function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        console.log("inside addAssessment");
        $scope.other= 0;
        $scope.assess = function(assessment){
            name = "Other";
            if(angular.equals(name,assessment)){
                $scope.other = 1;
                console.log("name change");
            }else{
                $scope.other = 0;
                console.log("No change");
            }
        };

        $scope.newExams = [{id: 'ex1'}];
        $scope.addAssess = function() {
            var newItem = $scope.newExams.length+1;
            $scope.newExams.push({'id':'ex'+newItem});
        };

        $scope.removeAssess = function() {
            var lastMode = $scope.newExams.length-1;
            $scope.newExams.splice(lastMode);
        };
    };

    $scope.createAssessment = function(currentClassroom,assessment, selectedYear) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var add = $scope.add;
        var NameOfAssessment = "";
        var assessName = function(){
            name = "Other";
            if(angular.equals(assessment,name)){
                NameOfAssessment = add.assessmentName1;
            }else{
                NameOfAssessment = assessment;
            }
            return NameOfAssessment;
        };

        $scope.newExams.forEach(function(v){
            delete v.id;
            v.date = $filter('date')(new Date(v.date),'yyyy-MM-dd');
        });

        var body = {
            assesmentName: assessName(),
            year : selectedYear ,
            exams : $scope.newExams
            };
        console.log("data read");
        console.log(body);

        var classRoom = window.btoa(currentClassroom.classRoomId);
        var response = assessmentMangementFactory.createAssessment(classRoom);
        var data = response.add({},body, function(response){
            if(response.status == 200 || response.status == 201){
                $scope.subjects = [];
                $scope.fetchYearList();
            }
            $state.go('^.list');
            $scope.response_msg = "Assessment added successfully !!!";
        }, function(response){
            //$scope.response_msg1 = response.data.errorMessage;

            if(response.status == 404){
                $scope.assessmentName = "";
                $scope.response_msg1 = response.data.errorMessage;
            }
            else {
                $scope.response_msg1 = "Addition of Assessment is not successful !!!";
            }
        });
    };


    $scope.editAssessment = function(currentClassroom,  assessment,index, selectedYear, standard){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.edit = angular.copy(initials);
        var classRoom = window.btoa(currentClassroom.classRoomId);
        var assess = window.btoa(assessment.assessmentId);
        $scope.assessmentId = assessment.assessmentId;
        $scope.section = assessment.section;
        assessmentMangementFactory.fetchSubjectList(classRoom).fetch({}, function(response){
            $scope.sub_list = [];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.subjects != undefined){
                    var _data = angular.fromJson(response.data.subjects);
                    $scope.sub_list = _data;
                    assessmentMangementFactory.listExams(classRoom,assess).fetch({}, function(response){
                        $scope.exams_list = {};
                        console.log(response);
                        if(response.status == 200 || response.status == 201){
                            if(response.data != undefined){
                                var _data = angular.fromJson(response.data);
                                $scope.exams_list = _data;
                                $scope.edit.classRoomId = currentClassroom.classRoomId;
                                $scope.assesmentName = $scope.exams_list.assesmentName;
                                $scope.edit.eyear = selectedYear;
                                $scope.edit.standard = standard;

                                $scope.exams_list.exams.forEach(function(v){
                                    v.date = new Date(v.date);
                                });

                                $scope.subjects = [];
                                $scope.sub_list.forEach(function(v){
                                    $scope.subjects.push(v.subjectName);
                                });

                                $scope.removeExams = function() {
                                    var lastMode = $scope.exams_list.exams.length-1;
                                    var delObj = $scope.exams_list.exams.splice(lastMode);
                                    $scope.deletedExams.push(delObj.pop());
                                    console.log($scope.deletedExams);
                                };

                                 $scope.NewExams = [{id: 'ex1'}];
                                 $scope.addExam = function() {
                                 var newItem = $scope.NewExams.length+1;
                                 $scope.NewExams.push({'id':'ex'+newItem});
                                 };

                                $scope.deletedExams = [];
                                $scope.removeExam = function() {
                                    var lastMode = $scope.NewExams.length-1;
                                    $scope.NewExams.splice(lastMode);
                                };
                            }
                        }else{
                            console.log(response.status);
                            console.log("Exam list not fiound");
                            $scope.response_msg1 = "Exam list not fiound";
                        }
                    });
                }else{
                    console.log(response.status);
                    console.log("Subject list not fiound");
                    $scope.response_msg1 = "Subject list not fiound";
                }
            }
        });
    };

    $scope.updateAssessment = function(currentClassroom,assessment) {

        var edit = $scope.edit;
        $scope.exams_list.exams.forEach(function(v){
            v.date = $filter('date')(new Date(v.date),'yyyy-MM-dd');
        });
        $scope.deletedExams.forEach(function(v){
            v.date = $filter('date')(new Date(v.date),'yyyy-MM-dd');
        });
        $scope.NewExams.forEach(function(v){
            delete v.id;
            v.date = $filter('date')(new Date(v.date),'yyyy-MM-dd');
        });
       // $scope.Exams = $scope.exams_list.exams.concat($scope.NewExams );
        var body = {
            assesmentName: $scope.assesmentName,
            year : $scope.edit.eyear ,
            updatedExams : $scope.exams_list.exams,
            addedExams : $scope.NewExams,
            deletedExams : $scope.deletedExams
        };
        var classRoom = window.btoa($scope.edit.classRoomId);
        var assess = window.btoa($scope.assessmentId);
        var response = assessmentMangementFactory.updateAssessment(classRoom,assess);
        var data = response.add({},body, function(response){
            if(response.status == 200 || response.status == 201){
                //$scope.fetchYearList();
                $scope.subjects = [];
                $scope.assessment_list = "";
            }
            $state.go('^.list');
            $scope.response_msg = "Assessment Updated successfully !!!";
        }, function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else {
                $scope.response_msg = "Updating of Assessment is not successful !!!";
            }
        });
    };


    $scope.$on('$viewContentLoaded',function(){
        if($state.current.name == "assessment" && $scope.assessment_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.assessment_list.length);
        }
    });

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.assessment_list =[];
        $state.go('^.list');
    };

}]);
branchManager.factory('marksSheetfactory', ['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
    var factory = {};
    var fetch_marksheet_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");


    factory.fecthAssesmentList = function(currentClassroom){
        // branch/BRANCH0001/classroom/CL0000002/assessment/fetch
        return $resource(fetch_marksheet_url+'/classroom/'+currentClassroom+'/assessment/fetch',{},{
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
    factory.fetchStudentList = function( selectedYear, currentStandard, currentSection) {
        return $resource(fetch_marksheet_url+'/student/year/'+selectedYear+'/std/'+currentStandard +'/sec/'+currentSection+'/basicinfo',{},{
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
        return $resource(fetch_marksheet_url+'/classroom/year/'+ selectedYear, {}, {
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

    factory.fetchSectionList = function(currentStandard, selectedYear) {

        // first/section/yr/2016-17
        return $resource(fetch_marksheet_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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

    factory.fetchclassroomMarksSheet = function(classroomId,assessmentId){
        // /classRoom/CL0000001/markssheet/report/assessment/ASS0000001
        return $resource(fetch_marksheet_url+'/classRoom/'+classroomId+'/markssheet/report/assessment/'+assessmentId,{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        return data;
                    }
                }
            }
        });
    };


    factory.fetchstudentMarksheetPerYear = function(year,classroomId,studentId) {
        // /classRoom/CL00000001/markssheet/report/student/SDT00000001/year/2015-16
        return $resource(fetch_marksheet_url+'/classRoom/'+classroomId+'/markssheet/report/student/'+studentId+'/year/'+year,{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        console.log("Report Generated !!!");
                        return data;
                    }
                }
            }
        });
    };

    factory.studentMarksListforAssess = function(classroomId,studentId,assessmentId) {
        // /classRoom/CL0000001/markssheet/student/STD0000001/assessment/AS0000001
        return $resource(fetch_marksheet_url+'/classRoom/'+classroomId+'/markssheet/student/'+studentId+'/assessment/'+assessmentId,{},{
            fetch : {
                method:'get',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        console.log("result Generated !!!");
                        return data;
                    }
                }
            }
        });
    };


    factory.fetchMarksheetPerAssess = function(classroomId,studentId,assessmentId) {
        // /classRoom/CL0000001/markssheet/report/student/SDT00000001/assessment/ASS0000001
        return $resource(fetch_marksheet_url+'/classRoom/'+classroomId+'/markssheet/report/student/'+studentId+'/assessment/'+assessmentId,{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        console.log("Report Generated !!!");
                        return data;
                    }
                }
            }
        });
    };

    factory.listExams = function(classroomId, assessmentId){
        // /BRANCH0001/classroom/CL0000002/assessment/ASS0000016
        return $resource(fetch_marksheet_url+'/classroom/'+classroomId+'/assessment/'+assessmentId,{},{
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

    factory.addStudentMarks = function(classRoomId, studentId){
        // /classRoom/CL0000001/markssheet/student/STD0000001
        return $resource(fetch_marksheet_url+'/classRoom/'+classRoomId+'/markssheet/student/'+studentId,{},{
            add:{
                method:'POST',
                headers: {'Authorization' : authCode,
                    'Content-Type': 'application/json'},
                isArray:false,
                interceptor: {
                    response: function (data) {
                        console.log("inside add student marks !!!");
                        return data;
                    }
                }
            }

        });
    };
    
    factory.fetchMarks = function(classRoomId, assessmentId, studentId){
    return $resource(fetch_marksheet_url+'/classRoom/'+classRoomId+'/markssheet/student/'+studentId+'/assessment/'+assessmentId,{},{
    	fetch:{
	    		method: 'GET',
	    		headers: {'Authorization' : authCode},
	    		interceptor: {
	                response: function (data) {
	                    return data;
	                }
	            }
    		
    	}
    });
    };
    
    factory.updateStudentMarks = function(ClassRoomId, StudentId){
        // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/classRoom/CL0000001/markssheet/student/STD0000001/update
    	 return $resource(fetch_marksheet_url+'/classRoom/'+ClassRoomId+'/markssheet/student/'+StudentId+'/update',{},{
             add:{
                 method:'PUT',
                 headers: {'Authorization' : authCode,
                     'Content-Type': 'application/json'},
                 isArray:false,
                 interceptor: {
                     response: function (data) {
                         console.log("inside update student marks !!!");
                         return data;
                     }
                 }
             }

         });
    };
   
    return factory;
}]);

branchManager.controller('marksSheetCtrl',['$scope','marksSheetfactory','$state',function($scope,marksSheetfactory,$state) {

    var initials = {
        assesmentName:"", assesmentId:"",
        year:"", classRoomId:"", assessmentId:"",
        marks1:"",marks2:"",marks3:"",marks4:"",marks5:"",
        marks6:"",marks7:"",marks8:"",marks9:"",marks10:""
    };

    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
        $scope.standard_list ="";
        $scope.classroom_list ="";
        $scope.student_list ="";
        $scope.assessment_list ="";
        $scope.marks_list = "";
        $scope.marksObtained ="";
    };

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        $scope.classroom_list ="";
        $scope.student_list ="";
        $scope.assessment_list ="";
        $scope.marks_list = "";
        $scope.marksObtained ="";
        var year = window.btoa(selectedYear);
        marksSheetfactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            console.log( $scope.standard_list);
            if(response.status == 200 || response.status == 201){
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                }
            }
        },function(response){
            $scope.standard_list = [];
            $scope.response_msg1 = "No Standards Found";
            console.log(response.status);
        });

    };

    $scope.fetchSectionList = function(currentStandard,selectedYear){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        $scope.student_list ="";
        $scope.assessment_list ="";
        $scope.marks_list = "";
        $scope.marksObtained ="";
        var standard = window.btoa(currentStandard);
        var year = window.btoa(selectedYear);
        marksSheetfactory.fetchSectionList(standard,year).fetch({},function(response){
            $scope.classroom_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classroom_list = _data;
                }
            }
        },function(response){
            $scope.classroom_list = [];
            console.log(response.status);
        });
    };

    $scope.fetchStudentList = function(selectedYear, currentStandard, currentClassroom){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        $scope.student_list ="";
        $scope.assessment_list ="";
        $scope.marks_list = "";
        $scope.marksObtained ="";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        var section = window.btoa(currentClassroom.section);
        marksSheetfactory.fetchStudentList(year, standard, section).fetch({},function(response){
            $scope.student_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    $scope.student_list = _data;
                }
            }
        },function(response){
            $scope.response_msg1 = "No Students Found";
            console.log(response.status);
        });
    };

    $scope.fecthAssesmentList = function(currentClassroom){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        $scope.marks_list="";
        $scope.marksObtained ="";
        var classRoom = window.btoa(currentClassroom.classRoomId);
        marksSheetfactory.fecthAssesmentList(classRoom).fetch({},function(response){
            $scope.assessment_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.assessmentLists!=undefined){
                    var _data = angular.fromJson(response.data.assessmentLists);
                    $scope.assessment_list = _data;
                }
            }
        },function(response){
            $scope.assessment_list = [];
            $scope.response_msg1 = "No Assessments Found";
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };


    $scope.marksSheet = function (currentClassroom, currentAssesment) {

        if(currentAssesment == undefined || currentClassroom == undefined){
            window.alert("Please Select Year, Class, Section and Assessment");
        }
        var assessId = currentAssesment.assessmentId;
        var classId = currentClassroom.classRoomId;
        $scope.fetchclassroomMarksSheet(classId,assessId);
    };
    $scope.fetchclassroomMarksSheet = function (classId,assessId) {
        var classId = window.btoa(classId);
        var assess = window.btoa(assessId);


            marksSheetfactory.fetchclassroomMarksSheet(classId, assess).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        console.log("response status 200 !!");
                        console.log("Download Complete !!! content length: " + response.data.byteLength);
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        $scope.fileURL = URL.createObjectURL(file);
                        $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                    } else {
                        console.log("Reponse data Length = " + response.data.byteLength);
                    }
                }
            }, function (response) {
                console.log("Error Unable to download the page");
            });

    };

   $scope.markssheetEachYear = function (selectedYear, currentClassroom, currentStudent) {
       if( selectedYear == undefined || currentClassroom == undefined || currentStudent == undefined ) {
           window.alert("Please Select Year, Class, Section and Student");
       }
       var year = selectedYear;
        var studId = currentStudent.studentId;
        var classId = currentClassroom.classRoomId;
        $scope.fetchstudentMarksheetPerYear(year,classId,studId);
   };

    $scope.fetchstudentMarksheetPerYear = function (year,classId,studId) {
        console.log("Inside fetchstudentMarksheetPerYear()");
        var classId = window.btoa(classId);
        var studId = window.btoa(studId);
        var year = window.btoa(year);

            marksSheetfactory.fetchstudentMarksheetPerYear(year, classId, studId).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        console.log("response status 200 !!");
                        console.log("Download Complete !!! content length: " + response.data.byteLength);
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        $scope.fileURL = URL.createObjectURL(file);
                        $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                    } else {
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
                    }
                }
            }, function (response) {
                console.log("Error Unable to download the page");
            });

    };

    $scope.marksSheetEachAssess = function (currentClassroom,currentStudent,currentAssesment) {
        if( currentClassroom == undefined || currentStudent == undefined || currentAssesment == undefined){
            window.alert("Please Select Year, Class, Section, Student and Assessment");
        }
        var studId = currentStudent.studentId;
        var assessId = currentAssesment.assessmentId;
        var classId = currentClassroom.classRoomId;
        console.log(studId+ " "+ assessId+ " "+ classId);
        $scope.fetchMarksheetPerAssess(classId,studId,assessId);
    };
    $scope.fetchMarksheetPerAssess = function (classId,studId,assessId) {

        var classroomId = window.btoa(classId);
        var studentId = window.btoa(studId);
        var assessmentId = window.btoa(assessId);


            marksSheetfactory.fetchMarksheetPerAssess(classroomId, studentId, assessmentId).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200) {
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
                console.log("Error Unable to download the page");
            });

        };

    $scope.renderPDF = function (url, canvasContainer) {
        var scale = 1.7;  //"zoom" factor for the PDF
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
            for (var num = 1; num <= pdfDoc.numPages; num++)
                pdfDoc.getPage(num).then(renderPage);
            console.log("Render Pages !!");
        }

        //PDFJS.disableWorker = true;
        PDFJS.getDocument(url).then(renderPages);

    };

    $scope.downloadPdf = function () {
        window.open($scope.fileURL);

    };


    $scope.addMarks =function(classroom,assessment,student){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        if(classroom == undefined || assessment == undefined || student == undefined){
            alert("Please Select Year, Class, Section, Student and Assessment");
        }else{
            $state.go('^.add');

            $scope.add = angular.copy(initials);
            var classRoom = window.btoa(classroom.classRoomId);
            var assess = window.btoa(assessment.assessmentId);
            marksSheetfactory.listExams(classRoom,assess).fetch({}, function(response){
                $scope.exams_list = {};
                console.log(response);
                if(response.status == 200){
                    if(response.data != undefined){
                        var _data = angular.fromJson(response.data);
                        $scope.exams_list = _data;
                        $scope.assessmentId = assessment.assessmentId;
                        $scope.classRoomId = classroom.classRoomId;
                        $scope.studentId = student.studentId;
                        $scope.assesmentName = assessment.assessmentName;
                        $scope.Exams = $scope.exams_list.exams;
                        console.log($scope.assesmentName);
                        console.log( $scope.studentId);
                        console.log($scope.Exams.length);
                    }
                }
            });
        }
    };
    $scope.pass = ["Yes", "No"];
    
    $scope.addStudentMarks = function(currentClassroom,studentId){

        var add = $scope.add;
        console.log($scope.classRoomId);
        console.log(studentId);
        var classroom = window.btoa($scope.classRoomId );
        var stud = window.btoa(studentId);
        
        var scores = function(){
        	
        	var markArray = [];

            console.log($scope.Exams.length);

        	for(var i=0; i<= $scope.Exams.length;i++) {
        			if((add.marks[i] != undefined || add.marks[i] != null  )&& ($scope.Exams[i].subjectName != undefined || $scope.Exams[i].subjectName != null)){
        				markArray.push({ subject : $scope.Exams[i].subjectName , obtainedScore: add.marks[i],grade: add.grade[i], passed: add.passed[i], examId: $scope.Exams[i].examId });
        			}
        		}
        	console.log(markArray);
        	return markArray;
        };


        var body = {
            assessmentId : $scope.assessmentId,
            assessmentName : $scope.assesmentName,
            scores : scores(),
            passed: add.result,
            comments: add.comments
        };

        var response = marksSheetfactory.addStudentMarks(classroom, stud);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.result1');
                $scope.fetchYearList();
            }
            $scope.response_msg = "Marks added successfully !!!";
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Addition of Marks is unsuccessful !!!";
        });
    };

    $scope.studentMarksListforAssess = function(classroom,student,assessment){
        $scope.response_msg = "";
        $scope.response_msg1 = "";

        var classRoomId = window.btoa(classroom.classRoomId);
        var studentId = window.btoa(student.studentId);
        var assessmentId = window.btoa(assessment.assessmentId);

        $scope.marks_list = {};
        $scope.scores = [];
        marksSheetfactory.studentMarksListforAssess(classRoomId,studentId,assessmentId).fetch({}, function (response) {
            console.log(response);
            if (response.status = 200 || response.status == 201) {
                var _data = angular.fromJson(response.data);
                $scope.marks_list = _data;
                if($scope.marks_list != undefined){
                    $scope.marksObtained = $scope.marks_list.scores;
                }
            }
        }, function (response) {
            $scope.response_msg1 = "No Marks available";
            console.log(response.status);
        });
    };

    $scope.updateMarks = function(classroom,assessment,student){

        if(classroom == undefined || assessment == undefined || student == undefined){
            alert("Please Select Year, Class, Section, Student and Assessment");
        }else{
            $state.go('^.editMarks');

            $scope.edit = angular.copy(initials);
            $scope.std = student.studentId;
            $scope.cls = classroom.classRoomId;

            var classRoomId = window.btoa(classroom.classRoomId);
            var assessmentId = window.btoa(assessment.assessmentId);
            var studentId = window.btoa(student.studentId);

            marksSheetfactory.studentMarksListforAssess(classRoomId,studentId,assessmentId).fetch({}, function (response) {
                console.log(response);
                if (response.status = 200 || response.status == 201) {
                    var _data = angular.fromJson(response.data);
                    $scope.marks_list = _data;
                    if($scope.marks_list != undefined){
                        $scope.marks = $scope.marks_list.scores;
                        $scope.obtainedMarks = [];
                        $scope.maxMarks = [];
                        for (var i=0; i<$scope.marks.length; i++)
                        {
                            $scope.obtainedMarks[i] = parseInt($scope.marks[i].obtainedScore, 10);
                            $scope.maxMarks[i] = parseInt($scope.marks[i].maxScore, 10);
                        }
                    }
                }
            }, function (response) {
                $scope.response_msg1 = "No Marks available";
                console.log(response.status);
            });
        }
    };

    $scope.updateStudentMarks = function(){

        var ClassRoomId = window.btoa( $scope.cls);
        var StudentId = window.btoa( $scope.std);

        var upScores = function(){
            var markArray = [];

            for(var i=0; i<$scope.marks.length; i++) {
                if(($scope.maxMarks[i] != undefined || $scope.maxMarks[i] != null) && ($scope.obtainedMarks[i] != undefined || $scope.obtainedMarks[i] != null) && ($scope.marks[i].subject != undefined || $scope.marks[i].subject != null) && ($scope.marks[i].passed != undefined && $scope.marks[i].grade != undefined)){
                    markArray.push({subject : $scope.marks[i].subject , obtainedScore: $scope.obtainedMarks[i], grade: $scope.marks[i].grade, passed: $scope.marks[i].passed, examId: $scope.marks[i].examId  });
                    console.log($scope.marks[i].obtainedScore);
                    console.log($scope.marks[i].subject);
                    console.log($scope.marks[i].examId);
                }
            }
            console.log(markArray);
            return markArray;
        };

        var body = {
            assessmentId : $scope.marks_list.assessmentId,
            assessmentName : $scope.marks_list.assessmentName,
            scores : upScores(),
            passed: $scope.marks_list.passed,
            comments: $scope.marks_list.comments
        };
        console.log("the data is");
        console.log(body);


        console.log("Vaules read !!!");
        var response = marksSheetfactory.updateStudentMarks(ClassRoomId, StudentId);
        console.log("Response status is: "+response.status);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.marks_list = undefined;
                $scope.marksObtained = undefined;
                $state.go('^.result1');
                $scope.fetchYearList();
            }
            $scope.response_msg = "Marks Updated successfully !!!";
        },function(response){
            $scope.response_msg1 = response.data.errorMessage;
           /* if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Marks are unsuccessful !!!";*/
        });
    };

    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.marksObtained = undefined;
        $state.go('^.result1');
    };
    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.main');
    };

}]);
branchManager.factory('eventManagementFactory',['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
    var factory = {};
    var fetch_event_url = br_Manager_Config.getMainAPI();

    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchEventsPdfReport = function(year){
        // /branch/BRANCH0001/event/reports/year/2015-16/fetch
        // branch/BRANCH0001/event/reports/year/2015-16/fetch
        return $resource(fetch_event_url+'/event/reports/year/'+year+'/fetch',{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        console.log("Report Generated  !!!");
                        return data;
                    }
                }
            }
        });
    };

    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_event_url+'/classroom/year/'+ selectedYear, {}, {
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

    factory.fetchSectionList = function(currentStandard, year) {
        return $resource(fetch_event_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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


    factory.fetchEventList = function(year,offset,limit){
        return $resource(fetch_event_url+'/event/year/'+year+'/events?offset='+offset+'&limit='+limit,{},{
            fetch: {
                method: 'get',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor:{
                    response: function(data){
                        return data;
                    }
                }
            }
        });
    };

    factory.createEventEntry = function(){
        // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/event
        return $resource(fetch_event_url+'/event',{},{
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

    factory.updateEvents = function(eventId){
        return $resource(fetch_event_url+'/event/'+eventId,{},{
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

    factory.deleteEvent = function(eventId) {
    	return $resource(fetch_event_url+'/event/'+eventId,{},{
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


branchManager.controller('eventManagementCtrl',['$scope','eventManagementFactory','br_manager_appConfig','$state','$filter','$modal',function($scope,eventManagementFactory,br_manager_appConfig,$state,$filter,$modal){

    var initials = {
        eventType:"",date:"",time:"",standard:"",dressType:"",eventId:""
    };

    $scope.eventDetails = {
        eventList: [],
        numPerPage:10,
        currentPage:1,
        startValue:0
    };


    $scope.fetchYearList = function () {
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
        $scope.event_list = "";

    };

    $scope.fetchEventList = function(year,offset,limit) {
        $scope.response_msg ="";
        $scope.response_msg1 ="";
        var year = window.btoa(year);
        console.log(year);
        eventManagementFactory.fetchEventList(year,offset,limit).fetch({},function(response) {
            console.log(response);
            if(response.status==200) {
                $scope.count = response.data.total;
                console.log($scope.count);
                if(response.data.eventList != undefined) {
                    var _data= angular.fromJson(response.data.eventList);
                    $scope.event_list = _data;
                    $scope.totalPages = Math.ceil($scope.count/$scope.eventDetails.numPerPage);
                    $scope.$parent.setBaseContentHeight($scope.event_list.length);
                }
            }
        }, function(response){
            $scope.event_list = [];
            $scope.response_msg1 = "No Events found for this year.";
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };



    $scope.fetchStandardList = function(year){
        $scope.response_msg1 ="";
        var year = window.btoa(year);
        eventManagementFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                }
            }
        },function(response){
            $scope.standard_list = [];
            //$scope.response_msg1 = "No Classes found for this year.";
            console.log(response.status);
        });
    };

    $scope.fetchSectionList = function(currentClass,year){
        $scope.response_msg1 = "";
        console.log(currentClass);
        var standard = window.btoa(currentClass);
        var year = window.btoa(year);
        eventManagementFactory.fetchSectionList(standard,year).fetch({},function(response){
            $scope.classroom_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classroom_list = _data;
                }
            }
        },function(response){
            $scope.classroom_list = [];
           // $scope.response_msg1 = "No Classrooms  found for this Class.";
            console.log(response.status);
        });
    };



    $scope.addEvent = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        console.log("in add event");
    };

    $scope.other= 0;
    $scope.event = function(to){
        hol_to = "Class room";
        hol_to1 = "Class";
        if(angular.equals(hol_to,to)){
            $scope.other = 1;
            console.log("all change");
        }else if(angular.equals(hol_to1,to)){
            $scope.other = 2;
            console.log("two change");
        }else{
            $scope.other = 0;
            console.log("No change");
        }
    };

    $scope.createEventEntry = function(year) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var add = $scope.add;

        $scope.add.date.Value = $filter('date')(new Date(add.date),'yyyy-MM-dd');

        var input = function(){
            var formData = {};
            if(angular.equals(add.to, "Class room")){
                formData ={
                    eventType: add.eventType,
                    date: $scope.add.date.Value,
                    time: add.time,
                    description: add.description,
                    to: add.to,
                    year: add.year,
                    standard: add.standard,
                    classRoomId: add.classroom.classRoomId,
                    dressType: add.dressType
                }
            }else if(angular.equals(add.to, "Class")){
                formData ={
                    eventType: add.eventType,
                    date: $scope.add.date.Value,
                    time: add.time,
                    description: add.description,
                    to: add.to,
                    year: add.year,
                    standard: add.standard,
                    dressType: add.dressType
                }
            }else{
                formData ={
                    eventType: add.eventType,
                    date: $scope.add.date.Value,
                    time: add.time,
                    description: add.description,
                    to: add.to,
                    year: add.year,
                    dressType: add.dressType
                }
            }
            return formData;
        };
        var body = input();

        var response = eventManagementFactory.createEventEntry();
        var data = response.add({},body, function (response)
        {
            if (response.status == 200 || response.status == 201) {
                $state.go('^.list');
                //$scope.fetchYearList();
            }
            $scope.response_msg = "Event added Successfully !!!";
        },function(response) {
            //$scope.response_msg1= response.data.errorMessage;
                if(response.status == 404) {
                    $scope.add.eventType = "";
                    $scope.response_msg1= response.data.errorMessage;
                } else {
                    $scope.response_msg1 = "Addition of Event is Failed !!! "
                }
        });
    };


    // ***************** Update Operation ****************
    $scope.editEvents = function (eventId) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.edit = angular.copy(initials);

        angular.forEach($scope.event_list, function (event) {
            if (eventId == event.eventId) {
                $scope.edit.eventId = event.eventId;
                $scope.edit.eventType = event.eventType;
                $scope.edit.date = new Date(event.date);
                $scope.edit.time = event.time;
                $scope.edit.description = event.description;
                $scope.edit.standard = event.standard;
                $scope.edit.section = event.section;
                $scope.edit.dressType = event.dressType;
                console.log("eventId "+eventId);
            }
        });
    };

    $scope.updateEvents = function (eventId) {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var edit = $scope.edit;
        $scope.edit.date.Value = $filter('date')(new Date(edit.date),'yyyy-MM-dd');

        var body = ' { ' +
            '"eventType":"' + edit.eventType + '",' +
            '"date" :"' + $scope.edit.date.Value + '",'+
            '"time" :"' + edit.time + '",'+
            '"description" :"' + edit.description + '",'+
            '"standard" :"' + edit.standard + '",'+
            '"dressType" :"' + edit.dressType + '"}';

        var eve = window.btoa(eventId);
        var response = eventManagementFactory.updateEvents(eve);
        var data = response.edit({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $state.go('^.list');
                $scope.fetchYearList();
            }
            $scope.response_msg = "Event updated successfully !!!";
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Updation of Event is unsuccessful !!!";
        });
    };

    $scope.deleteEvent = function(event,index){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        var eve = window.btoa(event.eventId);
        var dialogue_message = "Are you sure to delete the event ??";
        var modalInstance = show_dialoge($modal,$scope,dialogue_message,'dialoge_content.html');
        modalInstance.result.then(function (flag) {
            console.log("Flag value: "+ flag);
            if(flag){
                eventManagementFactory.deleteEvent(eve).remove({},function(response){

                    if(response.status == 200 || response.status == 201){
                        $scope.event_list = "";
                        $state.go('^.list');
                        $scope.fetchYearList();
                    }
                },function(response){
                    $scope.response_msg1 = "event Deletion failed !!!";
                    console.log(response.status);
                });
            }
            else {
                console.log("Failed to delete");
            }
        });
    };

    $scope.$on('$viewContentLoaded',function(){

        if($state.current.name == "event" && $scope.event_list != undefined){
            $scope.$parent.setBaseContentHeight($scope.event_list.length);
        }
    });

    $scope.init = function() {
        $scope.eventDetails.numPerPage = parseInt($scope.eventDetails.numPerPage);
        $scope.maxSize = 5;
        $scope.event_list = [];
        $scope.events_to = ['School', 'Class', 'Class room'];
    };

    $scope.cancel = function () {
        $scope.event_list = [];
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.list');
    };
    
    $scope.init();

    $scope.pageChanged = function(year){
        $scope.eventDetails.startValue = (($scope.eventDetails.currentPage - 1) * $scope.eventDetails.numPerPage);
        $scope.fetchEventList(year,$scope.eventDetails.startValue,$scope.eventDetails.numPerPage);
    };

}]);


branchManager.controller('eventReportsCtrl',['$scope','eventManagementFactory','$state',function($scope,eventManagementFactory,$state){

    $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
    $scope.fetchYearList = function () {
       // $scope.selectedYear = $scope.year_list[0];
    };
    $scope.generateEventsReport = function(year){
        console.log("Inside event Report()");
        console.log(year);
        if( year == undefined ){
            window.alert("Please select the Year");
        }
        else {
            var year = window.btoa(year);
            eventManagementFactory.fetchEventsPdfReport(year).fetch({}, function (response) {
                $scope.success = false;
                if (response.status == 200 || response.status == 201) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        console.log("response status 200 !!");
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        $scope.fileURL = URL.createObjectURL(file);
                        $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                    } else {
                        console.log("data Length = " + response.data.byteLength);
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
        window.open($scope.fileURL);
    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('events.main');
    };

}]);
branchManager.factory('notificationFactory',['$resource', 'br_Manager_Config', 'Config', '$window',function($resource, br_Manager_Config,Config,$window){
   var factory = {};
   var fetch_notification_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");
   //var fetch_branch_url = Config.getBranchesAPI();


    factory.sendMail = function(studentId){
        // http://localhost:8080/Eshiksha/org/erwer/branch/werwerwer/email/student/werwerwer/mail
        //var url =  fetch_notification_url+'/email/student/'+studentId+'/mail';
        return $resource(fetch_notification_url+'/email/student/'+studentId+'/mail',{},{
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

    factory.fetchFacultyList = function(offset,limit){
        return $resource(fetch_notification_url+'/faculty?offset='+offset+'&limit='+limit,{},{
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


    factory.notifyOneFaculty = function(facultyId){
        // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/email/faculty/FAC46/facultymail
        return $resource(fetch_notification_url+'/email/faculty/'+facultyId+'/facultymail',{},{
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

    factory.notifyAllFaculty = function(){
        // http://localhost:8080/Eshiksha/org/ORG0000001/branch/BRANCH0001/email/facultymail
        return $resource(fetch_notification_url+'/email/facultymail',{},{
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

    factory.sendMailNotification = function(classRoomId){
      //  http://localhost:8080/Eshiksha/org/rtert/branch/gdfgdfg/email/classroom/dfgdfgdfg/emailToclassroom
        return $resource(fetch_notification_url+'/email/classroom/'+classRoomId+'/emailToclassroom',{},{
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

    factory.schoolMailNotification = function(year){
        return $resource(fetch_notification_url+'/email/year/'+year+"/mail",{},{
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

    factory.fetchStandardList = function(selectedYear) {
        return $resource(fetch_notification_url+'/classroom/year/'+ selectedYear, {}, {
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

    factory.fetchSectionList = function(currentStandard, selectedYear) {
        return $resource(fetch_notification_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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
        return $resource(fetch_notification_url+'/student/year/'+selectedYear+'/std/'+currentStandard +'/sec/'+currentSection+'/basicinfo',{},{
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

    return factory;
}]);

branchManager.controller('notificationCtrl', ['$scope','notificationFactory','br_manager_appConfig','$state','$modal',function($scope,notificationFactory,br_manager_appConfig,$state,$modal){

    var initials = {
        studetId:"", subject:"", description:"",classRoomId:""
    };
    var initials1 = {
        branchId:"", subject:"", description:""
    };

    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
    };

    $scope.fetchStandardList = function(selectedYear){
        var year = window.btoa(selectedYear);
        notificationFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            console.log( $scope.standard_list);
            if(response.status == 200 || response.status == 201){
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                }
            }
        },function(response){
            $scope.standard_list = [];
            console.log(response.status);
        });
    };

    $scope.fetchSectionList = function(currentStandard,selectedYear){
        $scope.response_msg = "";
        var standard = window.btoa(currentStandard);
        var year = window.btoa(selectedYear);
        notificationFactory.fetchSectionList(standard,year).fetch({},function(response){
            $scope.classroom_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classroom_list = _data;
                    if($scope.classroom_list.length > 0){
                        //       $scope.currentClassroom = $scope.classroom_list[0];
                        //       $scope.fecthAssesmentList($scope.currentClassroom);
                    }
                    //$scope.$parent.setBaseContentHeight($scope.classroom_list.length);

                }
            }
        },function(response){
            $scope.classroom_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.fetchStudentList = function(selectedYear, currentStandard, currentSection){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        var section = window.btoa(currentSection.section);
        console.log(selectedYear+":"+currentStandard+":"+currentSection.section);
        notificationFactory.fetchStudentList(year, standard, section).fetch({},function(response){
            $scope.student_list =[];
            $scope.student_details = {};
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    $scope.student_list = _data;
                    console.log("data:-"+ $scope.student_list.length);
                }
            }
        },function(response){
            $scope.student_list = [];
            $scope.response_msg = "No students found for this section.";
            console.log(response.status);
        });
    };

    $scope.fetchFacultyList = function(offset,limit){
        $scope.response_msg1 = "";
        notificationFactory.fetchFacultyList(offset,limit).fetch({},function(response){
            $scope.faculty_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.faculties!=undefined){
                    var _data = angular.fromJson(response.data.faculties);
                    $scope.faculty_list = _data;
                }
            }
        },function(response){
            $scope.faculty_list = [];
            console.log(response.status);
        });
    };

    $scope.mailNotify = function() {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        console.log("inside mailTo !!")
    };

    $scope.sendMail = function (student1) {

        var add = $scope.add;
        console.log("inside sendMail !!");
        var body = ' { ' +
                '"subject":"' + add.subject + '",' +
                '"description" :"' + add.description +
            '"}';
        console.log("read the inputs !!");
        var student = window.btoa(student1.studentId);
        console.log(student1);
        var response = notificationFactory.sendMail(student);
        var data = response.add({}, body, function (response)
        {
            if(response.status == 200 || response.status == 201){
               // $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
                $scope.response_msg1 = "Mails sent to student successfully !!!";
                console.log("Sent successfully");
            }
            $state.go('^.email');
            $scope.response_msg = "Mail sent to student successfully !!!";
        },function(response){
            if(response.status == 409){
                // $scope.add.branchName = "";
                $scope.response_msg1 = response.data.errorMessage;
                console.log("409 error");
            }else if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Sending mail to faculties unsuccessful !!!";
                console.log("Error in sending");
        });
    };

    // ClassRoom Notification
     $scope.sendMailNotification = function (year,standard,classRoom) {
        console.log(year);
        console.log(standard);
        console.log(classRoom.classRoomId);
        var add = $scope.add;
        console.log("inside sendMailNotification !!");
        var body = ' { ' +
                '"subject":"' + add.subject + '",' +
                '"description" :"' + add.description +
            '"}';
        console.log("read the inputs !!");
        console.log(classRoom.classRoomId);
        var classRoom = window.btoa(classRoom.classRoomId);
        var response = notificationFactory.sendMailNotification(classRoom);
        var data = response.add({}, body, function (response)
        {
            if(response.status == 200 || response.status == 201){
               // $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
                $scope.response_msg1 = "Mails sent to all students successfully !!!";
            }
            $state.go('^.email');
            $scope.response_msg1 = "Mails sent to all students successfully !!!";
        },function(response){
            if(response.status == 409){
                // $scope.add.branchName = "";
                $scope.response_msg1 = response.data.errorMessage;
                console.log("409 error");
            }else if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Sending mail to faculties unsuccessful !!!";
        });
    };
    //School Notification
    $scope.schoolMailNotification = function (selectedYear) {

        var add = $scope.add;
        console.log("inside schoolMailNotification !!");
        var body = ' { ' +
            '"subject":"' + add.subject + '",' +
            '"description" :"' + add.description +
            '"}';
        console.log("read the inputs !!");
        var year = window.btoa(selectedYear);
        var response = notificationFactory.schoolMailNotification(year);
        var data = response.add({}, body, function (response)
        {
            if(response.status == 200 || response.status == 201){
                $state.go('^.email');
                $scope.response_msg1 = "Mails sent to School successfully !!!";
            }
        },function(response){
            if(response.status == 409){
                // $scope.add.branchName = "";
                $scope.response_msg1 = response.data.errorMessage;
                console.log("409 error");
            }else if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Sending mail to faculties unsuccessful !!!";
        });
    };

    $scope.notifyAllFaculty = function(){

        var add = $scope.add;
        console.log("inside sendMail !!");
        var body = ' { ' +
            '"subject":"' + add.subject + '",' +
            '"description" :"' + add.description +
            '"}';
        console.log("read the inputs !!");

        var response = notificationFactory.notifyAllFaculty();
        var data = response.add({}, body, function (response)
        {
            if(response.status == 200 || response.status == 201){
                $scope.response_msg1 = "Mails sent to faculties successfully !!!";
                console.log("Sent successfully");
            }
            $state.go('^.email');
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 ="Sending mail to faculties unsuccessful !!!";
            }else if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Sending mail to faculties unsuccessful !!!";
            console.log("Error in sending");
        });
    };
    $scope.notifyOneFaculty = function(faculty){

        var add = $scope.add;
        console.log("inside sendMail !!");
        var body = ' { ' +
            '"subject":"' + add.subject + '",' +
            '"description" :"' + add.description +
            '"}';
        console.log("read the inputs !!");
        var facId = window.btoa(faculty.facultyId);

        var response = notificationFactory.notifyOneFaculty(facId);
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.response_msg1 = "Mails sent to student successfully !!!";
                console.log("Sent successfully");
            }
            $state.go('^.email');
        },function(response){
            if(response.status == 409){
                $scope.response_msg1 = "Sending mail to faculties unsuccessful !!!";
                console.log("409 error");
            }else if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Sending mail to faculties unsuccessful !!!";
            console.log("Error in sending");
        });
    };

    $scope.init = function()
    {
       /* $scope.libraryDetails.numPerPage = parseInt($scope.libraryDetails.numPerPage);
        $scope.maxSize = 5;
        $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);*/
        $scope.fetchYearList();
    };

    $scope.cancel1 = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('^.email');
    };


    $scope.init();
}]);

branchManager.directive('fileModel',['$parse', function($parse){
    return  {
        restrict: 'A',
        link: function(scope, element, attrs){
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                })
            })
        }
    }
}]);

branchManager.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })

        .error(function(){
        });
    }
}]);

branchManager.controller('myCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = notificationFactory.url;
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };
}]);


branchManager.factory('reportFactory',['$resource','br_Manager_Config', '$window',function($resource,br_Manager_Config, $window){
    var factory = {};

    var fetchReportUrl = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchBranchFeePdfReport = function(year,startDate,endDate){
        // http:// reports/year/2015-016/startDate/2015-01-01/endDate/2015-01-30
        return $resource(fetchReportUrl+'/reports/year/'+year+'/startDate/'+startDate+'/endDate/'+endDate,{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        console.log("Report Generated !!!");
                        return data;
                    }
                }
            }
        });
    };

    factory.feesReportForYear = function(year, studentId){
      //  http://localhost:8080/feesmanagementsystem/org/ORG0000001/branch/BRANCH0001/reports/student/STD0000002/year/2015-16
        return $resource(fetchReportUrl+'/reports/student/'+studentId+'/year/'+year,{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        console.log("Report Generated !!!");
                        return data;
                    }
                }
            }
        });
    };



    factory.fetchViolationXlsReport = function(){
        return $resource(fetchReportUrl+'/reports/'+'xls',{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        return data;
                    }
                }
            }
        })
    };

    factory.fetchStudentList = function( selectedYear, currentStandard, currentSection) {
        return $resource(fetchReportUrl+'/student/year/'+selectedYear+'/std/'+currentStandard +'/sec/'+currentSection+'/basicinfo',{},{
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
        return $resource(fetchReportUrl+'/classroom/year/'+ selectedYear, {}, {
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


    factory.fetchClassRoomlist = function(currentStandard, selectedYear) {
        return $resource(fetchReportUrl+'/classroom/standard/'+ currentStandard +'/section/year/'
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

   /* factory.fetchSectionList = function(currentStandard, selectedYear) {
        return $resource(fetchReportUrl+'/classroom/standard/'+ currentStandard +'/section/year/'
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
    };*/

    return factory;

}]);


branchManager.controller('reportCtrl',['$scope','reportFactory','$state','$filter',function($scope,reportFactory,$state,$filter){

    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
    };

    $scope.fetchStandardList = function(selectedYear){
        var year = window.btoa(selectedYear);
        reportFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            console.log( $scope.standard_list);
            if(response.status == 200 || response.status == 201){
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                    if($scope.standard_list.length > 0){
                    //    $scope.currentStandard = $scope.standard_list[0];
                    //    $scope.fetchClassRoomlist($scope.currentStandard,selectedYear);
                    }
                }
            }
        },function(response){
            $scope.standard_list = [];
            console.log(response.status);
        });

    };

    $scope.fetchClassRoomlist = function(currentStandard,selectedYear){
        $scope.response_msg = "";
        var standard = window.btoa(currentStandard);
        var year = window.btoa(selectedYear);
        reportFactory.fetchClassRoomlist(standard,year).fetch({},function(response){
            $scope.classroom_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classroom_list = _data;
                    if($scope.classroom_list.length > 0){
                     //   $scope.currentClassroom = $scope.classroom_list[0];
                     //   $scope.fetchStudentList(selectedYear, currentStandard, $scope.currentClassroom);
                    }
                }
            }
        },function(response){
            $scope.classroom_list = [];
            console.log(response.status);
        });
    };

    $scope.fetchStudentList = function(selectedYear, currentStandard, currentClassroom){
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        var section = window.btoa(currentClassroom.section);
        reportFactory.fetchStudentList(year, standard, section).fetch({},function(response){
            $scope.student_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    $scope.student_list = _data;
                    console.log("data:-"+ $scope.student_list.length);
                }
            }
        },function(response){
            $scope.student_list =[];
            console.log(response.status);
        });
    };


    $scope.generateReport = function(reportType,year,startDate,endDate){
         console.log(year);
         if(reportType==undefined || year == undefined || startDate == undefined || endDate == undefined){
             window.alert("Please Select Year, StartDate and EndDate");
         }
         else if(reportType == 'branchFee'){
             var year = window.btoa(year);
             var startTime = $filter('date')(new Date(startDate),'yyyy-MM-dd');
             var endTime = $filter('date')(new Date(endDate),'yyyy-MM-dd');
             console.log(startTime);
             console.log(endTime);
             var start = window.btoa(startTime);
             var end = window.btoa(endTime);
             reportFactory.fetchBranchFeePdfReport(year,start,end).fetch({},function(response){
                 $scope.success = false;
                 console.log(response);
                 console.log("Inside the gerearteReport Function");
                 if(response.status = 200 || response.status == 201){
                     console.log("Response code is 200 !!");
                     if(response.data.byteLength>0){
                         $scope.success = true;
                         console.log("Response is True !!");
                         var file = new Blob([response.data], { type: 'application/pdf' });
                         $scope.fileURL = URL.createObjectURL(file);
                         $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                         console.log("Call to render pdf !!");
                     }else{
                         console.log("Reponse.data.byteLength = "+response.data.byteLength);
                     }
                 }
             },function(response){
                 console.log("errorrrrrr")
             });
         }
    };

    $scope.feesReportForYear = function(selectedYear, studentId){
        console.log(selectedYear);
        console.log(studentId);
        var year = window.btoa(selectedYear);
        var studentId = window.btoa(studentId);
        if( selectedYear == undefined || studentId == undefined ){
            window.alert("Please Select Year, Class, Section and Student");
        }
        else {
            reportFactory.feesReportForYear(year, studentId).fetch({}, function (response) {
                $scope.success = false;
                console.log(response);
                console.log("Inside the gerearteReport Function");
                if (response.status = 200 || response.status == 201) {
                    console.log("Response code is 200 !!");
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        console.log("Response is True !!");
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        $scope.fileURL = URL.createObjectURL(file);
                        $scope.renderPDF($scope.fileURL, document.getElementById('pdf-holder'));
                        console.log("Call to render pdf !!");
                    } else {
                        console.log("Reponse.data.byteLength = " + response.data.byteLength);
                    }
                }
            }, function (response) {
                console.log("errorrrrrr")
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
            window.open($scope.fileURL);

    };

   /* $scope.downloadXls = function(){
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
        $state.go('reports.back');
    };

}]);
branchManager.factory('transferCertificateFactory',['$resource', 'br_Manager_Config', '$window',function($resource, br_Manager_Config, $window){
    var factory = {};
    var fetch_transferCertificate_url = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchStudentList = function( selectedYear, currentStandard, currentSection) {
        return $resource(fetch_transferCertificate_url+'/student/year/'+selectedYear+'/std/'+currentStandard +'/sec/'+currentSection+'/basicinfo',{},{
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
        return $resource(fetch_transferCertificate_url+'/classroom/year/'+ selectedYear, {}, {
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

    factory.fetchSectionList = function(currentStandard, selectedYear) {

        // first/section/yr/2016-17
        return $resource(fetch_transferCertificate_url+'/classroom/standard/'+ currentStandard +'/section/year/'
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


    factory.fetchTransferCertificateList = function(){
    	return $resource(fetch_transferCertificate_url,{},{
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
    factory.transferCertificate = function(studentId){
        // http://localhost:8080/feesmanagementsystem/org/ORG0000001/branch/BRANCH0001/student/SDT00000001/reports\
        console.log("student Id "+ studentId);
        return $resource(fetch_transferCertificate_url+'/student/'+studentId+'/reports',{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        console.log("Report Generated !!!");
                        return data;
                    }
                }
            }
        });
    };

    return factory;
}]);


branchManager.controller('transferCertificateCtrl', ['$scope','transferCertificateFactory','$state',function($scope,transferCertificateFactory,$state) {

    $scope.fetchYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
       //  $scope.selectedYear = $scope.year_list[0];
       // $scope.fetchStandardList($scope.selectedYear);
    };

    $scope.fetchStandardList = function(selectedYear){
        var year = window.btoa(selectedYear);
        transferCertificateFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            console.log( $scope.standard_list);
            if(response.status == 200 || response.status == 201){
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                    if($scope.standard_list.length > 0){
                     //   $scope.currentStandard = $scope.standard_list[0];
                     //   $scope.fetchSectionList($scope.currentStandard,selectedYear);
                    }
                }
            }
        },function(response){
            $scope.standard_list = [];
            console.log(response.status);
        });

    };

    $scope.fetchSectionList = function(currentStandard,selectedYear){
        $scope.response_msg = "";
        var standard = window.btoa(currentStandard);
        var year = window.btoa(selectedYear);
        transferCertificateFactory.fetchSectionList(standard,year).fetch({},function(response){
            $scope.classroom_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classroom_list = _data;
                    if($scope.classroom_list.length > 0){
                     //   $scope.currentClassroom = $scope.classroom_list[0];
                     //  $scope.fetchStudentList(selectedYear, currentStandard, $scope.currentClassroom);
                    }
                }
            }
        },function(response){
            $scope.classroom_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };

    $scope.fetchStudentList = function(selectedYear, currentStandard, currentClassroom){
        // $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        var section = window.btoa(currentClassroom.section);
        transferCertificateFactory.fetchStudentList(year, standard, section).fetch({},function(response){
            $scope.student_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.students!=undefined){
                    var _data = angular.fromJson(response.data.students);
                    $scope.student_list = _data;
                  //  console.log("data:-"+ $scope.student_list.length);
                  //  $scope.currentStudent = $scope.student_list[0];
                }
            }
        },function(response){
            console.log(response.status);
        });
    };


    $scope.transferCertificate = function (stud) {
        console.log("Inside transferCertificate()");
        console.log("studentId=" + stud);
        var student = window.btoa(stud);
        if( stud == undefined){
            window.alert("Please Select Year, Class, Section and Student");
        }
        else {
            transferCertificateFactory.transferCertificate(student).fetch({}, function (response) {
                $scope.success = false;
                if (response.status = 200) {
                    if (response.data.byteLength > 0) {
                        $scope.success = true;
                        console.log("response status 200 !!");
                        console.log("Download Complete !!! content length: " + response.data.byteLength);
                        var file = new Blob([response.data], {type: 'application/pdf'});
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


    $scope.renderPDF = function (url, canvasContainer) {
        var scale = 1.7;  //"zoom" factor for the PDF
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
            for (var num = 1; num <= pdfDoc.numPages; num++)
                pdfDoc.getPage(num).then(renderPage);
            console.log("Render Pages !!");
        }

        //PDFJS.disableWorker = true;
        PDFJS.getDocument(url).then(renderPages);

    };

    $scope.downloadPdf = function () {
        window.open($scope.fileURL);

    };

    $scope.back = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('reports.main');
    };

}]);


branchManager.factory('fileUploadFactory', ['$resource', 'br_Manager_Config', '$window','$http',function($resource, br_Manager_Config, $window,$http){
    var factory ={};
    var authCode = $window.localStorage.getItem("authCode");
    var main_url = br_Manager_Config.getMainAPI();

    factory.fecthAssesmentList = function(currentClassroom){
        // branch/BRANCH0001/classroom/CL0000002/assessment/fetch
        return $resource(main_url+'/classroom/'+currentClassroom+'/assessment/fetch',{},{
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

    factory.fetchStandardList = function(selectedYear) {
        return $resource(main_url+'/classroom/year/'+ selectedYear, {}, {
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

    factory.fetchSectionList = function(currentStandard, selectedYear) {
        return $resource(main_url +'/classroom/standard/'+ currentStandard +  '/section/year/'+ selectedYear, {}, {
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

    factory.uploadUrls = function(){
        return $resource(main_url+'/videourl',{},{
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


    factory.uploadOrgLogo = function(file){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(main_url+'/image/orglogo', fd, {
            transformRequest: angular.identity,
            headers: { 'Authorization' : authCode,
                'Content-Type': undefined}
        })
            .success(function(){
                alert("Photo uploaded Successfully !!!")
            })

            .error(function(){
                alert("Uploading photo is unsuccessful !!!")
            });
    };

    factory.uploadBranchLogo = function(file){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(main_url+'/image/schoolphoto', fd, {
            transformRequest: angular.identity,
            headers: { 'Authorization' : authCode,
                'Content-Type': undefined}
        })
            .success(function(){
                alert("Photo uploaded Successfully !!!")
            })

            .error(function(){
                alert("Uploading photo is unsuccessful !!!")
            });
    };

    factory.uploadInventory = function(){
        return url = main_url+'/inventory/bulkupload';
    };
    factory.uploadVehicle = function(){
        return url = main_url+'/vehicle/bulkupload';
    };
    factory.uploadLibrary = function(){
        return url = main_url+'/library/bulkupload';
    };
    factory.uploadStudents = function(classRoomId){
        return url = main_url+'/classroom/'+classRoomId+'/bulkupload';
    };
    factory.uploadMarksheet = function(classRoomId,assessmentId){
        return url = main_url+'/classroom/'+classRoomId+'/assessment/'+assessmentId+'/marksheet/bulkupload';
    };

    factory.downloadInventory = function(){
        return $resource(main_url+'/inventory/xlsSheet',{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        return data;
                    }
                }
            }
        })
    };

    factory.downloadVehicle = function(){
        return $resource(main_url+'/vehicle/vehiclexls',{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        return data;
                    }
                }
            }
        })
    };
    factory.downloadLibrary = function(){
        return $resource(main_url+'/library/xlsSheet',{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        return data;
                    }
                }
            }
        })
    };
    factory.downloadFaculty = function(){
        return $resource(main_url+'/faculty/xlsSheet',{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        return data;
                    }
                }
            }
        })
    };
    factory.downloadStudents = function(classRoomId){
        return $resource(main_url+'/student/classroom/'+classRoomId+'/studentXls',{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        return data;
                    }
                }
            }
        })
    };
    factory.downloadMarksheet = function(classRoomId, assessmentId){
        return $resource(main_url+'/classRoom/'+classRoomId+'/markssheet/assessment/'+assessmentId+'/xlsSheet',{},{
            fetch : {
                method:'get',
                responseType: 'arraybuffer',
                headers : { 'Authorization' : authCode },
                interceptor : {
                    response : function(data){
                        return data;
                    }
                }
            }
        })
    };


    return factory;
}]);

branchManager.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                 element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
            });
        }
    };
}]);

branchManager.service('fileUpload', ['$http','$window', function ($http, $window) {
    var authCode = $window.localStorage.getItem("authCode");
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Authorization' : authCode,
                        'Content-Type': undefined}
        }).then(function(response){
        	alert(response.data.errorMessage);
        },function(response){
        	alert(response.data.errorMessage);
        });
    }
}]);

branchManager.controller('fileUploadCtrl', ['$scope', 'fileUpload','fileUploadFactory','br_manager_appConfig','$state', function($scope, fileUpload,fileUploadFactory,br_manager_appConfig,$state){



    var initials = {
        videoName:"",imageUrl:"",videoUrl:"",eventName:""
    };

    $scope.uploadYearList = function(){
        $scope.year_list = ["2016-17","2017-18","2018-19","2019-20","2020-21"];
       
    };
    $scope.fetchStandardList = function(selectedYear){
        var year = window.btoa(selectedYear);
        fileUploadFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            if(response.status == 200 || response.status == 201){
                if(response.data.standards != undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                    console.log( $scope.standard_list);
                    if($scope.standard_list.length > 0){
                        //$scope.currentStandard = $scope.standard_list[0];
                       // $scope.fetchSectionList($scope.currentStandard,selectedYear);
                    }
                }
            }
        },function(response){
            $scope.standard_list = [];
            $scope.response_msg = "There is no Standards found for this year.";
            console.log(response.status);
        });

    };
    $scope.fetchSectionList = function(currentStandard,selectedYear){
        $scope.response_msg = "";
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        fileUploadFactory.fetchSectionList(standard,year).fetch({},function(response){
            $scope.classroom_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.classroom_list = _data;
                   // $scope.currentClassroom = $scope.classroom_list[0];
                    //$scope.fecthAssesmentList($scope.currentClassroom);
                }
            }
        },function(response){
            $scope.classroom_list = [];
            $scope.response_msg = "There is no classrooms found for this year.";
            console.log(response.status);
        });
    };
    $scope.fecthAssesmentList = function(currentClassroom){
        $scope.response_msg = "";
        var classRoom = window.btoa(currentClassroom.classRoomId);
        fileUploadFactory.fecthAssesmentList(classRoom).fetch({},function(response){
            $scope.assessment_list =[];
            console.log(response);
            if(response.status == 200){
                $scope.count = response.data.total;
                if(response.data.assessmentLists!=undefined){
                    var _data = angular.fromJson(response.data.assessmentLists);
                    $scope.assessment_list = _data;
                    //$scope.currentAssessment = $scope.assessment_list[0];
                }
            }
        },function(response){
            $scope.assessment_list = [];
            $scope.$parent.setBaseContentHeight(-1);
            console.log(response.status);
        });
    };


    $scope.addUrl = function(){
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
    };

    $scope.uploadUrls = function(){

        var add = $scope.add;
        var body = ' { ' +
            '"videoName":"' + add.videoName + '",' +
            '"imageUrl":"' + add.imageUrl + '",' +
            '"videoUrl" :"' +add.videoUrl + '",'+
            '"eventName" :"'+add.eventName+'"}';

        var response = fileUploadFactory.uploadUrls();
        var data = response.add({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.response_msg = "Url Saved Successfully !!!";
            }
        },function(response){
            if(response.status == 404){
                $scope.response_msg1 = response.data.errorMessage;
            }
            else
                $scope.response_msg1= "Url Saving is Unsuccessful !!!";
        });
    };

    $scope.uploadOrgLogo = function(){
        if($scope.orgLogo != undefined){
            var file = $scope.orgLogo;
            console.log('file is ' );
            console.dir(file);
            fileUploadFactory.uploadOrgLogo(file);
        }else{
            window.alert("Please select the file !!");
        }

    };

    $scope.uploadBranchLogo = function(){
        if($scope.branchLogo != undefined){
            var file = $scope.branchLogo;
            console.log('file is ' );
            console.dir(file);
            fileUploadFactory.uploadBranchLogo(file);
        }else{
            window.alert("Please select the file !!");
        }

    };

    $scope.uploadInventory = function(){
        var file ={};
        if($scope.xlsInventory == undefined){
            window.alert("Please select the file");
        }else{
            file = $scope.xlsInventory;
            console.log('file is ' );
            console.dir(file);
            var uploadUrl = fileUploadFactory.uploadInventory();
            fileUpload.uploadFileToUrl(file, uploadUrl);
            $scope.response_msg = "File uploaded successfully!!!";
            $scope.xlsInventory="";
        }

    };

    $scope.uploadVehicle = function(){
        var file ={};
        if($scope.xlsVehicle == undefined){
            window.alert("Please select the file");
        }else{
            file = $scope.xlsVehicle;
            console.log('file is ' );
            console.dir(file);
            var uploadUrl = fileUploadFactory.uploadVehicle();
            fileUpload.uploadFileToUrl(file, uploadUrl);
            $scope.response_msg = "File uploaded successfully!!!";
            $scope.xlsVehicle ="";
        }
    };

    $scope.uploadLibrary = function(){
        var file ={};
        if($scope.xlsLibrary == undefined){
            window.alert("Please select the file");
        }else{
            file = $scope.xlsLibrary;
            //var file = $scope.xlsLibrary;
            console.log('file is ' );
            console.dir(file);
            var uploadUrl = fileUploadFactory.uploadLibrary();
            fileUpload.uploadFileToUrl(file, uploadUrl);
            $scope.response_msg = "File uploaded successfully!!!";
            $scope.xlsLibrary ="";
        }

    };

    $scope.uploadStudents = function(currentClassroom){
        var classRoom = window.btoa(currentClassroom.classRoomId);
        var file ={};
        if($scope.xlsStudents == undefined){
            window.alert("Please select the file");
        }else{
            file = $scope.xlsStudents;
            //var file = $scope.xlsStudents;
            console.log('file is ' );
            console.dir(file);
            var uploadUrl = fileUploadFactory.uploadStudents(classRoom);
            fileUpload.uploadFileToUrl(file, uploadUrl);
            $scope.response_msg = "File uploaded successfully!!!";
            $scope.xlsLibrary ="";
        }

    };

    $scope.uploadMarksheet = function(currentClassroom, currentAssessment){
        var classRoom = window.btoa(currentClassroom.classRoomId);
        console.log(currentClassroom.classRoomId);
        console.log(currentAssessment.assessmentName);
        var assess = window.btoa(currentAssessment.assessmentId);
        var file ={};
        if($scope.xlsMarksheet == undefined){
            window.alert("Please select the file");
        }else{
            file = $scope.xlsMarksheet;
            console.log('file is ' );
            console.dir(file);
            var uploadUrl = fileUploadFactory.uploadMarksheet(classRoom, assess);
            fileUpload.uploadFileToUrl(file, uploadUrl);
            $scope.response_msg = "File uploaded successfully!!!";
            $scope.xlsLibrary ="";
        }
        //var file = $scope.xlsMarksheet;

    };


    $scope.downloadStudents = function(classRoomId){
        $scope.response_msg = "";
        var classRoom = window.btoa(classRoomId);
        fileUploadFactory.downloadStudents(classRoom).fetch({},{},function(response){
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
    };

    $scope.downloadMarksheet = function(classRoomId, assessmentId){
        $scope.response_msg = "";

        console.log(assessmentId);
        var classRoom = window.btoa(classRoomId);
        var assess = window.btoa(assessmentId);
        fileUploadFactory.downloadMarksheet(classRoom, assess).fetch({},{},function(response){
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
    };
    $scope.downloadLibrary = function(){
        $scope.response_msg = "";
        //fileUploadFactory.downloadLibrary();
        fileUploadFactory.downloadLibrary().fetch({},{},function(response){
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
    };

    $scope.downloadInventory = function(){
        $scope.response_msg = "";
        //fileUploadFactory.downloadLibrary();
        fileUploadFactory.downloadInventory().fetch({},{},function(response){
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
    };

    $scope.downloadVehicle = function(){
        $scope.response_msg = "";
        //fileUploadFactory.downloadLibrary();
        fileUploadFactory.downloadVehicle().fetch({},{},function(response){
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
    };
    $scope.downloadFaculty = function(){
        $scope.response_msg = "";
        //fileUploadFactory.downloadLibrary();
        fileUploadFactory.downloadFaculty().fetch({},{},function(response){
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
    };


    $scope.cancel = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $state.go('xlsfiles.files');
    };

    $scope.init = function(){
        //$scope.uploadYearList();
    };

    $scope.init();

}]);