/**
 * 
 */
branchOperator.factory('dashFactory', ['$resource','br_Operator_Config', '$window',function($resource,br_Operator_Config, $window){
    var factory = {};
    var fetch_dashboard_asset_url = br_Operator_Config.getAssetAPI();
    var fetch_assessment_url = br_Operator_Config.getAssessmentAPI();
    var fetch_main_url = br_Operator_Config.getMainAPI();
    var authCode = $window.localStorage.getItem("authCode");

    factory.fetchYears = function(){
        return $resource(fetch_assessment_url+'/orgsettings/years',{},{
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
        return $resource(fetch_assessment_url+'/orgsettings/assessments',{},{
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
        return $resource(fetch_main_url+'/branchsettings/standards',{},{
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
        return $resource(fetch_main_url+'/branchsettings/standardssections',{},{
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

    factory.facultygrowth = function(){
        return $resource(fetch_main_url+'/dashboard/numberoFfaculties',{},{
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
        return $resource(fetch_main_url+'/dashboard/numberoFvehicales',{},{
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


branchOperator.controller("dashboardController",['$scope','dashFactory','$localStorage',function($scope,dashFactory,$localStorage){
	
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
            console.log(response.status);
        });
    };

    $scope.vehicleData = function (){
        dashFactory.vehiclegrowth().fetch({},function(response){
            console.log(response);
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
            console.log(response);
            $scope.faculty_info = [];
            if(response.status == 200 || response.status == 201){
                if(response.data.facultyListWithYear.length!=undefined){
                    var _data = angular.fromJson(response.data.facultyListWithYear);
                    $scope.data = _data;
                }
            }
        },function(response){
            $scope.faculty_info = [];
            console.log(response.status);
        });
    };
    //facultyData();

    $scope.listYears = function(){
        dashFactory.fetchYears().fetch({},function(response){
            $scope.year_list =[];
            if(response.status == 200){
                if(response.data.yearsDetails!=undefined){
                    var _data = angular.fromJson(response.data.yearsDetails);
                    $scope.years = [];
                    $scope.year_list = _data;
                    $localStorage.years = $scope.year_list;
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
                }
            }
        },function(response){
            $scope.assessment_list ="";
            console.log(response.status);
        });
    };


    $scope.init = function(){
        $scope.fetchAssetList();
        $scope.listYears();
        $scope.assessmentlist();
        $scope.getStandards();
        $scope.getSections();
        $scope.facultyData();
        $scope.vehicleData();
    };
    
    $scope.init();

}]);
branchOperator.directive('pieChart', function() {
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

                    var svg=d3.select("#chart")
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

branchOperator.directive('donutChart', function() {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('data', function(data) {
                if (data) {

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