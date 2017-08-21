/**
 * Created by $anthu on 1/6/2016.
 */
branchManager.factory('dashFactory',['$resource','br_Manager_Config', '$window',function($resource,br_Manager_Config, $window){
    var factory = {};
    var fetch_dashboard_asset_url = br_Manager_Config.getAssetAPI();
    var fetch_year_url = br_Manager_Config.getPasswordApi();
    var mainUrl = br_Manager_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchYears = function(){
        return $resource(fetch_year_url+'/orgsettings/years',{},{
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

    factory.assessmentlist = function(){
        return $resource(fetch_year_url+'/orgsettings/assessments',{},{
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

    factory.getStandards = function(){
        return $resource(mainUrl+'/branchsettings/standards',{},{
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
    factory.getSections = function(){
        return $resource(mainUrl+'/branchsettings/standardssections',{},{
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

    factory.fetchStandardList = function(selectedYear) {
        return $resource(mainUrl +'/classroom/year/'+ selectedYear, {}, {
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
        return $resource(mainUrl+'/classroom/standard/'+ currentStandard +'/section/year/'
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
    factory.getSyllabus = function(){
        return $resource(fetch_year_url+'/orgsettings/syllabussettings',{},{
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
    // http://localhost:8080/Eshiksha/org/54645/branch/54646456464/dashboard/birthdaystudents
    factory.getBirthDays = function(){
        return $resource(fetch_year_url+'/dashboard/birthdaystudents',{},{
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

    factory.assessmentList = function(classroom){
        //http://localhost:8080/Eshiksha/org/00000000/branch/111111111/classroom/22222222/assessment/fetch
        return $resource(mainUrl+'/classroom/'+classroom+'/assessment/fetch',{},{
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

    factory.fetchResultData = function(classroom, assessment){
        return $resource(mainUrl+'/classroom/'+classroom+'/assessment/'+assessment+'/assessmentPercentages',{},{
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


branchManager.controller("dashCtrl",['$scope','$interval','dashFactory','$window','$localStorage','$modal','$log',function($scope,$interval,dashFactory,$window,$localStorage,$modal,$log){

    $scope.fetchSectionList = function(selectedYear, currentStandard){
        var year = window.btoa(selectedYear);
        var standard = window.btoa(currentStandard);
        dashFactory.fetchSectionList(year, standard).fetch({},function(response){
            $scope.section_list =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.classRoomLists!=undefined){
                    var _data = angular.fromJson(response.data.classRoomLists);
                    $scope.section_list = _data;
                }
            }
        },function(response){
            $scope.section_List = [];
            console.log(response.status);
        });
    };

    $scope.assessmentList = function (classroom) {
        var classroom = window.btoa(classroom.classRoomId);
        dashFactory.assessmentList(classroom).fetch({},function(response){
            $scope.assessments =[];
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.assessmentLists!=undefined){
                    var _data = angular.fromJson(response.data.assessmentLists);
                    $scope.assessments = _data;
                }
            }
        },function(response){
            $scope.assessments = [];
            console.log(response.status);
        });

    };

    $scope.fetchResultData = function (classroom, assessment) {
        var classroom = window.btoa(classroom.classRoomId);
        var assessment = window.btoa(assessment.assessmentId);
        dashFactory.fetchResultData(classroom, assessment).fetch({},function(response){
            $scope.resultData ={};
            console.log(response);
            if(response.status == 200 || response.status == 201){
                if(response.data.percentatage!=undefined){
                    var _data = angular.fromJson(response.data.percentatage);
                    $scope.resultData = _data;
                    if($scope.resultData.length == 2){
                        $scope.result = $scope.resultData;
                    }
                }
            }
        },function(response){
            $scope.resultData = [];
            console.log(response.status);
        });
    };

    $scope.fetchAcademicYear = function(){
        //$scope.response_msg = "";
        $scope.response_msg1 = "";
        dashFactory.fetchAcademicYear().fetch({},function(response){
            $scope.academicYear ="";
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.academicYear = _data;
                    $localStorage.academicYear = $scope.academicYear;
                    $scope.year = $scope.academicYear.successMessage;
                    console.log($scope.academicYear.successMessage);
                }
            }
        },function(response){
            $scope.academicYear ="";
        });
    };

    $scope.fetchAssetList = function(){
        $scope.response_msg = "";
        dashFactory.fetchAssetList().fetch({},function(response){
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

    $scope.vehicleData = function (){
        dashFactory.vehiclegrowth().fetch({},function(response){
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
    };
    //vehicleData();

    $scope.facultyData = function (){
        dashFactory.facultygrowth().fetch({},function(response){
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
    };
    //facultyData();

    $scope.pieChartData = function (){
        dashFactory.fetchAdmissionsCount().fetch({},function(response){
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
    };
    //pieChartData();

    $scope.listYears = function(){
        dashFactory.fetchYears().fetch({},function(response){
            $scope.year_list =[];
            if(response.status == 200){
                if(response.data.yearsDetails!=undefined){
                    var _data = angular.fromJson(response.data.yearsDetails);
                    $scope.years = [];
                    $scope.year_list = _data;
                    $localStorage.years = $scope.year_list;
                   // $window.localStorage.setItem('years', $scope.year_list);
                }
            }
        },function(response){
            $scope.year_list =[];
            console.log(response.status);
        });
    };
    $scope.assessmentlist = function(){
        dashFactory.assessmentlist().fetch({},function(response){
            $scope.assessment_list ="";
            if(response.status == 200){
                if(response.data.assessments!=undefined){
                    var _data = angular.fromJson(response.data.assessments);
                    $scope.assessment_list = _data;
                    $localStorage.assessments = $scope.assessment_list;
                   // $window.localStorage.setItem('assessment', $scope.assessment_list);
                }
            }
        },function(response){
            $scope.assessment_list ="";
            console.log(response.status);
        });
    };
    $scope.getStandards = function(){
        dashFactory.getStandards().fetch({},function(response){
            $scope.standard_list ="";
            if(response.status == 200){
                if(response.data.standards!=undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.standard_list = _data;
                    $localStorage.standards = $scope.standard_list;
                    // $window.localStorage.setItem('assessment', $scope.assessment_list);
                }
            }
        },function(response){
            $scope.assessment_list ="";
            console.log(response.status);
        });
    };
    $scope.getSections = function(){
        dashFactory.getSections().fetch({},function(response){
            $scope.section_list ="";
            if(response.status == 200){
                if(response.data.standards!=undefined){
                    var _data = angular.fromJson(response.data.standards);
                    $scope.section_list = _data;
                    $localStorage.sections = $scope.section_list;
                    // $window.localStorage.setItem('assessment', $scope.assessment_list);
                }
            }
        },function(response){
            $scope.assessment_list ="";
            console.log(response.status);
        });
    };
    $scope.getSyllabus = function () {
        $scope.response_msg = "";
        $scope.response_msg1 = "";
        dashFactory.getSyllabus().fetch({},function(response){
            $scope.syllabus_list =[];
            if(response.status == 200 || response.status ==201){
                if(response.data.syllabusDetails!=undefined){
                    var _data = angular.fromJson(response.data.syllabusDetails);
                    $scope.syllabus_list = _data;
                    $localStorage.syllabus = $scope.syllabus_list;
                }
            }
        },function(response){
            $scope.syllabus_list =[];
            console.log(response.status);
        });
    };

    $scope.fetchStandardList = function(year){
        dashFactory.fetchAcademicYear().fetch({},function(response){
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.currentYear = _data;
                    $scope.year = $scope.currentYear.successMessage;
                    console.log($scope.currentYear.successMessage);
                    var year = window.btoa( $scope.year);
                    dashFactory.fetchStandardList(year).fetch({},function(response){
                        $scope.standards =[];
                        if(response.status == 200 || response.status == 201) {
                            if(response.data.standards != undefined){
                                var _data = angular.fromJson(response.data.standards);
                                $scope.standards = _data;
                            }
                        }
                    },function(response){
                        $scope.standards = [];
                        console.log(response.status);
                    });
                }
            }
        },function(response){
            $scope.academicYear ="";
        });


    };

    $scope.init = function () {
        $scope.fetchAssetList();
        $scope.listYears();
        $scope.assessmentlist();
        $scope.pieChartData();
        $scope.facultyData();
        $scope.vehicleData();
        $scope.getStandards();
        $scope.getSections();
        $scope.getSyllabus();
        $scope.fetchAcademicYear();
        $scope.fetchStandardList();

    };
    $scope.init();
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
                    var pie=d3.layout.pie()
                        .value(function(d){return d.vehicleCount})
                        .sort(null);
                        //.padAngle(.03);

                    var w=300,h=300;

                    var outerRadius=w/2;
                    var innerRadius=100;

                    var color = d3.scale.category10();

                    var arc=d3.svg.arc()
                        .outerRadius(outerRadius)
                        .innerRadius(innerRadius);

                    var svg=d3.select("#chart1")
                        .append("svg")
                        .attr({
                            width:w,
                            height:h,
                            class:'shadow'
                        }).append('g')
                        .attr({
                            transform:'translate('+w/2+','+h/2+')'
                        });
                    var path=svg.selectAll('path')
                        .data(pie(data1))
                        .enter()
                        .append('path')
                        .attr({
                            d:arc,
                            fill:function(d,i){
                                return color(d.data.year);
                            }
                        });

                    path.transition()
                        .duration(1000)
                        .attrTween('d', function(d) {
                            var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
                            return function(t) {
                                return arc(interpolate(t));
                            };
                        });


                    var restOfTheData=function(){
                        var text=svg.selectAll('text')
                            .data(pie(data1))
                            .enter()
                            .append("text")
                            .transition()
                            .duration(200)
                            .attr("transform", function (d) {
                                return "translate(" + arc.centroid(d) + ")";
                            })
                            .attr("dy", ".4em")
                            .attr("text-anchor", "middle")
                            .text(function(d){
                                return d.data.vehicleCount;
                            })
                            .style({
                                fill:'#fff',
                                'font-size':'10px'
                            });

                        var legendRectSize=20;
                        var legendSpacing=7;
                        var legendHeight=legendRectSize+legendSpacing;


                        var legend=svg.selectAll('.legend')
                            .data(color.domain())
                            .enter()
                            .append('g')
                            .attr({
                                class:'legend',
                                transform:function(d,i){
                                    //Just a calculation for x & y position
                                    return 'translate(-35,' + ((i*legendHeight)-65) + ')';
                                }
                            });
                        legend.append('rect')
                            .attr({
                                width:legendRectSize,
                                height:legendRectSize,
                                rx:20,
                                ry:20
                            })
                            .style({
                                fill:color,
                                stroke:color
                            });

                        legend.append('text')
                            .attr({
                                x:30,
                                y:15
                            })
                            .text(function(d){
                                return d;
                            }).style({
                                fill:'#929DAF',
                                'font-size':'14px'
                            });
                    };

                    setTimeout(restOfTheData,1000);

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
                            return "<strong>Student Count:</strong> <span style='color:white'>" + d.studentCount + "</span><br/>"+"<strong>Year:</strong> <span style='color:white'>"+ d.year +"</span>";
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

                    /*var margin = {top: 40, right: 5, bottom: 20, left: 30},
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

                    /!*arcs.append("text")
                        .attr("transform", function(d) {
                            return "translate(" + arc.centroid(d) + ")";
                        })
                        .attr("dy", ".35em")
                        .style("text-anchor", "middle")
                        .text(function(d) {
                            return d.data.year;
                        });*!/
                    arcs.append("text")
                        .attr("transform", function(d) {
                            return "translate(" + arc.centroid(d) + ")";
                        })
                        .attr("dy", ".35em")
                        .style("text-anchor", "middle")
                        .text(function(d) {
                            return d.data.facultyCount;
                        });*/

                    var width = 450,
                        height = 300;

                    var svg = d3.select("#donutchart").append("svg")
                        .attr("class", 'pies')
                        .attr("width", width)
                        .attr("height", height);

                    var group = svg.append("g").attr("id", 'canvas');
                    group.append("g").attr("id", 'art');
                    group.append("g").attr("id", 'labels');
                    canvas = d3.select("#canvas");
                    art = d3.select("#art");
                    labels = d3.select("#labels");


                    jhw_pie = d3.layout.pie()
                    jhw_pie.value(function (d, i) {

                        return d.facultyCount;
                    });


                    cDim = {
                        height: 400,
                        width: 400,
                        innerRadius: 0,
                        outerRadius: 135,
                        labelRadius: 145
                    };


                    svg.attr({
                        height: cDim.height,
                        width: cDim.width
                    });


                    canvas.attr("transform", "translate(" + (cDim.width / 2) + "," + (cDim.width / 2) + ")");

                    pied_data = jhw_pie(data);


                    pied_arc = d3.svg.arc()
                        .innerRadius(0)
                        .outerRadius(120);

                    pied_colors = d3.scale.category10();

                    enteringArcs = art.selectAll(".wedge").data(pied_data).enter();

                    enteringArcs.append("path")
                        .attr("class", "wedge")
                        .attr("d", pied_arc)
                        .style("fill", function (d, i) {
                            return pied_colors(i);
                        });



                    enteringLabels = labels.selectAll(".label").data(pied_data).enter();
                    labelGroups = enteringLabels.append("g").attr("class", "label");
                    labelGroups.append("circle").attr({
                        x: 0,
                        y: 0,
                        r: 2,
                        fill: "#000",
                        transform: function (d, i) {
                            centroid = pied_arc.centroid(d);
                            return "translate(" + pied_arc.centroid(d) + ")";
                        },
                        'class': "label-circle"
                    });

                    textLines = labelGroups.append("line").attr({
                        x1: function (d, i) {
                            return pied_arc.centroid(d)[0];
                        },
                        y1: function (d, i) {
                            return pied_arc.centroid(d)[1];
                        },
                        x2: function (d, i) {
                            centroid = pied_arc.centroid(d);
                            midAngle = Math.atan2(centroid[1], centroid[0]);
                            x = Math.cos(midAngle) * cDim.labelRadius;
                            return x;
                        },
                        y2: function (d, i) {
                            centroid = pied_arc.centroid(d);
                            midAngle = Math.atan2(centroid[1], centroid[0]);
                            y = Math.sin(midAngle) * cDim.labelRadius;
                            return y;
                        },
                        'class': "label-line"
                    });

                    textLabels = labelGroups.append("text").attr({
                        x: function (d, i) {
                            centroid = pied_arc.centroid(d);
                            midAngle = Math.atan2(centroid[1], centroid[0]);
                            x = Math.cos(midAngle) * cDim.labelRadius;
                            sign = (x > 0) ? 1 : -1
                            labelX = x + (5 * sign)
                            return labelX;
                        },
                        y: function (d, i) {
                            centroid = pied_arc.centroid(d);
                            midAngle = Math.atan2(centroid[1], centroid[0]);
                            y = Math.sin(midAngle) * cDim.labelRadius;
                            return y;
                        },
                        'text-anchor': function (d, i) {
                            centroid = pied_arc.centroid(d);
                            midAngle = Math.atan2(centroid[1], centroid[0]);
                            x = Math.cos(midAngle) * cDim.labelRadius;
                            return (x > 0) ? "start" : "end";
                        },
                        'class': 'label-text'
                    }).text(function (d) {
                        return d.data.year+": "+d.data.facultyCount;
                    });

                    alpha = 0.5;
                    spacing = 12;

                    function relax() {
                        again = false;
                        textLabels.each(function (d, i) {
                            a = this;
                            da = d3.select(a);
                            y1 = da.attr("y");
                            textLabels.each(function (d, j) {
                                b = this;

                                if (a == b) return;
                                db = d3.select(b);

                                if (da.attr("text-anchor") != db.attr("text-anchor")) return;

                                y2 = db.attr("y");
                                deltaY = y1 - y2;

                                if (Math.abs(deltaY) > spacing) return;

                                again = true;
                                sign = deltaY > 0 ? 1 : -1;
                                adjust = sign * alpha;
                                da.attr("y",+y1 + adjust);
                                db.attr("y",+y2 - adjust);
                            });
                        });

                        if(again) {
                            labelElements = textLabels[0];
                            textLines.attr("y2",function(d,i) {
                                labelForLine = d3.select(labelElements[i]);
                                return labelForLine.attr("y");
                            });
                            setTimeout(relax,20)
                        }
                    }

                    relax();
                }
            })
        }
    }
});


branchManager.directive('resultChart', function() {
    return {
        restrict: 'E',
        scope: {
            result: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('result', function(result) {
                if (result) {

                    var pie=d3.layout.pie()
                        .value(function(d){return d.percentage})
                        .sort(null);
                    //.padAngle(.03);

                    var w=300,h=300;
                    var outerRadius=w/2;
                    var innerRadius=80;
                    var color = d3.scale.category10();

                    var arc=d3.svg.arc()
                        .outerRadius(outerRadius)
                        .innerRadius(innerRadius);




                    d3.select("#reschart").selectAll("svg").remove();
                    var svg=d3.select("#reschart")
                        .append("svg")
                        .attr({
                            width:w,
                            height:h,
                            class:'shadow'
                        }).append('g')
                        .attr({
                            transform:'translate('+w/2+','+h/2+')'
                        });
                    var path=svg.selectAll('path')
                        .data(pie(result))
                        .enter()
                        .append('path')
                        .attr({
                            d:arc,
                            fill:function(d,i){
                                return color(d.data.name);
                            }
                        });

                    path.transition()
                        .duration(1000)
                        .attrTween('d', function(d) {
                            var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
                            return function(t) {
                                return arc(interpolate(t));
                            };
                        });


                    var restOfTheData=function(){
                        var text=svg.selectAll('text')
                            .data(pie(result))
                            .enter()
                            .append("text")
                            .transition()
                            .duration(200)
                            .attr("transform", function (d) {
                                return "translate(" + arc.centroid(d) + ")";
                            })
                            .attr("dy", ".4em")
                            .attr("text-anchor", "middle")
                            .text(function(d){
                                return d.data.percentage+"%";
                            })
                            .style({
                                fill:'#fff',
                                'font-size':'10px'
                            });

                        var legendRectSize=20;
                        var legendSpacing=7;
                        var legendHeight=legendRectSize+legendSpacing;


                        var legend=svg.selectAll('.legend')
                            .data(color.domain())
                            .enter()
                            .append('g')
                            .attr({
                                class:'legend',
                                transform:function(d,i){
                                    //Just a calculation for x & y position
                                    return 'translate(-35,' + ((i*legendHeight)-45) + ')';
                                }
                            });
                        legend.append('rect')
                            .attr({
                                width:legendRectSize,
                                height:legendRectSize,
                                rx:20,
                                ry:20
                            })
                            .style({
                                fill:color,
                                stroke:color
                            });

                        legend.append('text')
                            .attr({
                                x:30,
                                y:15
                            })
                            .text(function(d){
                                return d;
                            }).style({
                                fill:'#929DAF',
                                'font-size':'14px'
                            });
                    };

                    setTimeout(restOfTheData,1000);
                }
            })
        }
    }
});



