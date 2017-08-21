/**
 * Created by Icarat3 on 7/17/2016.
 */

branchOperator.factory('libraryFactory',['$resource', 'br_Operator_Config', '$window',function($resource, br_Operator_Config, $window){
    var factory = {};
    var fetch_library_url = br_Operator_Config.getMainAPI();
    var fetch_year_url = br_Operator_Config.getAssessmentAPI();
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

    factory.fetchAcademicYear = function(){
        return $resource(fetch_year_url+'/orgsettings',{},{
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

    /*factory.fetchLibraryReport = function(){
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
    };*/

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

    factory.deleteBook = function(bookId) {
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

branchOperator.controller('libraryManagementController', ['$scope','libraryFactory','$state','$filter','$modal','$localStorage',function($scope,libraryFactory,$state,$filter,$modal,$localStorage) {

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

    $scope.aDate = '2015-10-31';
    $scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
    }

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
                if(response.data.classroomnames != undefined){
                    var _data = angular.fromJson(response.data.classroomnames);
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
        var standard = window.btoa(currentStandard.name);
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
        var standard = window.btoa(currentStandard.name);
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

    $scope.fetchLibraryList = function(offset,limit) {
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

        },function(response) {
            if(response.status==409 || response.status==404) {
                $scope.library_list = [];
                $scope.$parent.setBaseContentHeight(-1);
                $scope.response_msg1 = response.data.errorMessage;
            }
            else {
                $scope.response_msg1 = "No such books are found !!! ";
            }

        });
    };


    // Check Below for Current Name
    $scope.$on('$viewContentLoaded',function() {
        if($state.current.name == "library" && $scope.library_list != undefined)
        {
            $scope.$parent.setBaseContentHeight($scope.library_list.length);
        }
    });
    $scope.addLibraryBook = function() {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        $scope.add = angular.copy(initials);
        console.log("inside addLibraryBook !!")
    };

    $scope.createLibraryBookEntry = function (bookId) {
        var add = $scope.add;
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
    $scope.editLibrary = function (bookId,library) {
        if(angular.equals(library.issuedTo,"N/A")) {
            $state.go('^.edit');
            $scope.response_msg = "";
            $scope.response_msg1 = "";
            $scope.edit = angular.copy(initials);

            angular.forEach($scope.library_list, function (library) {
                console.log("vehicle: " + library.bookId);
                if (bookId == library.bookId) {
                    $scope.edit.bookId = library.bookId;
                    $scope.edit.bookName = library.bookName;
                    $scope.edit.bookVersion = library.bookVersion;
                    $scope.edit.author = library.author;
                    $scope.edit.publication = library.publication;
                    $scope.edit.approximateCost = library.approximateCost;
                }
            });
        }
        else
        {
         window.alert("Cann't update! Book is already assigned.");
        }
    };

    $scope.editLibraryBook = function (bookId) {
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
        if(angular.equals(library.issuedTo,"N/A")) {
            $scope.response_msg = "";
            $scope.response_msg1 = "";
            var book = window.btoa(library.bookId);
            console.log("inside delete function !!");

            var dialogue_message = "Are you sure to delete the library ?";
            var modalInstance = show_dialoge($modal, $scope, dialogue_message, 'dialoge_content.html');
            modalInstance.result.then(function (flag) {
                console.log("Flag value: " + flag);
                if (flag) {
                    console.log(library.bookId);
                    libraryFactory.deleteBook(book).remove({}, function (response) {
                        if (response.status == 200) {
                            $scope.fetchLibraryList(0, $scope.libraryDetails.numPerPage);
                            console.log("deleted")
                        }
                    }, function (response) {
                        if (response.status == 404) {
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
        }
        else{
            window.alert("Cann't delete! Book is already assigned.");
        }
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

    $scope.fetchAcademicYear = function(){
        //$scope.response_msg = "";
        $scope.response_msg1 = "";
        libraryFactory.fetchAcademicYear().fetch({},function(response){
            $scope.academicYear ="";
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.academicYear = _data;
                    //$localStorage.academicYear = $scope.academicYear;
                    $scope.year = $scope.academicYear.successMessage;
                    console.log($scope.academicYear.successMessage);
                }
            }
        },function(response){
            $scope.academicYear ="";
        });
    };

    $scope.fetchFacultyList = function(offset,limit){
        $scope.response_msg1 = "";
        $scope.response_msg = "";
        libraryFactory.fetchFacultyList(offset,limit).fetch({},function(response){
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

    $scope.assignBook = function (book,index) {
        if(angular.equals(book.issuedTo,"N/A")){
            $state.go('^.assign');
            $scope.response_msg = "";
            $scope.response_msg1 = "";
            $scope.fetchStandardList($scope.year);
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
            alert("This book has been already assigned to someone !");
        }
    };

    $scope.returnBook = function(book,index){
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

    $scope.assignTo = function (bookId) {
        var issuedTo = function(assign){
            if($scope.isVisibleS == true){
                return assign.student.studentFirstName+"(S)";
            }
            else if($scope.isVisibleF == true){
                return assign.faculty.fullName+"(F)";
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
        var data = response.assign({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
                $scope.isVisibleS = false;
                $scope.isVisibleF = false;
            }
            $scope.response_msg = "Book assigned successfully !!!";
            $state.go('^.list');
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
        var response = libraryFactory.unissueBook(book);
        var data = response.ret({}, body, function (response)
        {
            if(response.status == 200 || response.status == 201){
                $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
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

    $scope.fetchDefaulterList = function(offset,limit) {
        $scope.response_msg = "";
        libraryFactory.fetchDefaulterList(offset,limit).fetch({},function(response) {
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

    $scope.init = function() {
        $scope.isVisibleS = false;
        $scope.isVisibleF = false;
        $scope.years = $localStorage.years;
        $scope.fetchAcademicYear();
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

