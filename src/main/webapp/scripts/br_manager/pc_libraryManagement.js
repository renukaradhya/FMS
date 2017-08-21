/**
 * Created by uidr1063 on 1/10/2016.
 */

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

branchManager.controller('libraryManagementCtrl', ['$scope','libraryManagementFactory','br_manager_appConfig','$state','$filter','$modal','$localStorage',function($scope,libraryManagementFactory,br_manager_appConfig,$state,$filter,$modal,$localStorage) {

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
            $scope.$parent.setBaseContentHeight(-1);
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

    $scope.fetchStandardList = function(selectedYear){
        $scope.response_msg1 = "";
        var year = window.btoa(selectedYear);
        libraryManagementFactory.fetchStandardList(year).fetch({},function(response){
            $scope.standard_list =[];
            $scope.section_list =[];
            $scope.student_list =[];
            $scope.fee_list =[];
            if(response.status == 200 || response.status == 201) {
                if(response.data.classroomnames != undefined){
                    var _data = angular.fromJson(response.data.classroomnames);
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
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
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
           // $scope.response_msg = "No Section found for this standard.";
            console.log(response.status);
        });
    };

    $scope.fetchStudentList = function(selectedYear, currentStandard, currentSection){
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard.name);
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
            $scope.response_msg1 = " Studentds not found for this section.";
            console.log(response.status);
        });
    };

    $scope.fetchFacultyList = function(offset,limit){
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
    $scope.editLibrary = function (bookId,library) {
        if (angular.equals(library.issuedTo, "N/A")) {
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
        else{
            window.alert("Cann't update! Book is already assigned.");
        }
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
                    libraryManagementFactory.deleteBook(book).remove({}, function (response) {
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
            $scope.fetchStandardList($scope.year);
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
            alert("This book has been already assigned to someone !");
        }
    };


    $scope.assignTo = function (bookId) {
        var issuedTo = function(assign){
            if($scope.isVisibleS == true){
                return  assign.student.studentFirstName+"(S)";
            }
            else if($scope.isVisibleF == true){
                return assign.faculty.fullName+"(F)";
            }
        };

        var assign = $scope.assign;
        $scope.assign.issueDate.Value = $filter('date')(new Date(assign.issueDate),'yyyy-MM-dd');
        $scope.assign.returnByDate.Value = $filter('date')(new Date(assign.returnByDate),'yyyy-MM-dd');
        var body = ' { ' +
            '"bookId" :"' + assign.bookId + '",'+
            '"issuedTo" :"'+ issuedTo($scope.assign) +  '",'+
            '"returnByDate" :"'+ $scope.assign.returnByDate.Value +  '",'+
            '"issueDate" :"'+  $scope.assign.issueDate.Value +
            '"}';
        var book = window.btoa(bookId);
        var response = libraryManagementFactory.assignTo(book);
        var data = response.assign({}, body, function (response) {
            if(response.status == 200 || response.status == 201){
                $scope.fetchLibraryList(0,$scope.libraryDetails.numPerPage);
                $scope.isVisibleS = true;
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
                    $scope.file = file;
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
        //window.open($scope.fileURL);
        saveAs($scope.file, 'Library Report' + '.pdf');
    };

    $scope.init = function() {
        $scope.isVisibleS = false;
        $scope.isVisibleF = false;
        /*$scope.years = $localStorage.years;*/
        $scope.year = $localStorage.academicYear.successMessage;
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

