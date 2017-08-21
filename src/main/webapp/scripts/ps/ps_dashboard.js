/**
 * Created by $anthu on 1/6/2016.
 */
smart_parking.factory('dashFactory',['$resource','Config', '$window',function($resource,Config, $window){
    var factory = {};
    var fetch_dashboard_asset_url = Config.getAssetAPI();
    var authCode = $window.localStorage.getItem("authCode");
    var main_url = Config.getBranchManagersAPI();

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
    factory.sunburstData = function(){
        return $resource(main_url+'/organizationdashboard/studentcountbasedonbranch',{},{
            fetch: {
                method: 'get',
                isArray: false,
                headers : { 'Authorization' : authCode },
                interceptor: {
                    response: function (data) {
                        console.log(data);
                        return data;
                    }
                }
            }
        });
    };
    factory.getStudentCount = function(){
        return $resource(main_url+'/organizationdashboard/studentcount',{},{
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

   /* factory.newAdmissions = function(){
        return $resource(main_url+'/organizationdashboard/newadmissions',{},{
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

    return factory;
}]);

smart_parking.controller("dashCtrl",['$scope','dashFactory',function($scope,dashFactory){

    $scope.fetchAssetList = function(){
        $scope.response_msg = "";
        dashFactory.fetchAssetList().fetch({},function(response){
            $scope.asset_info =[];
            console.log(response);
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

    /*function chartData(){
        dashFactory.newAdmissions().fetch({},function(response){
            console.log(response);
            $scope.chart1_info = [];
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.chart1_info = _data;
                    $scope.branch_list = $scope.chart1_info.branchInfoWithListStudentCountDTO;
                    $scope.stCount = $scope.branch_list;
                    console.log($scope.stCount);
                    console.log($scope.branch_list);
                    console.log($scope.chart1_info);
                }
            }
        },function(response){
            $scope.chart1_info = [];
            console.log(response.status);
        });
    }
    chartData();*/

    function chartDataTwo(){
        dashFactory.getStudentCount().fetch({},function(response){
            console.log(response);
            $scope.chart2_info = [];
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.chart2_info = _data;
                    $scope.values = $scope.chart2_info.studentCountInOrganizationDTO;
                }
            }
        },function(response){
            $scope.chart2_info = [];
            console.log(response.status);
        });
    }
    chartDataTwo();

    function sunburstData(){
        dashFactory.sunburstData().fetch({},function(response){
            console.log(response);
            $scope.data = [];
            if(response.status == 200){
                if(response.data!=undefined){
                    var _data = angular.fromJson(response.data);
                    $scope.burstvalues = _data;
                    var bdata = $scope.burstvalues;
                    $scope.data = bdata;
                    //$scope.values = $scope.sunburst_info.studentCountInOrganizationDTO;
                    console.log("Required Data"+ $scope.data);
                }
            }
        },function(response){
            $scope.data = [];
            console.log(response.status);
        });
    }
    sunburstData();


    $scope.init = function(){
        $scope.fetchAssetList();
    };

    $scope.init();

}]);


smart_parking.directive('pieChart', function() {
    return {
        restrict: 'E',
        scope: {
            values: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('values', function(values) {
                if (values) {
                    var pie=d3.layout.pie()
                        .value(function(d){return d.studentCount})
                        .sort(null);
                        //.padAngle(.03);

                    var tooltip = d3.select('#chart')
                        .append('div')
                        .attr('class', 'tooltip');

                    tooltip.append('div')
                        .attr('class', 'label');

                    tooltip.append('div')
                        .attr('class', 'count');

                    tooltip.append('div')
                        .attr('class', 'percent');

                    var w=525,h=300;
                    var outerRadius=(w/4)-50;
                    var innerRadius=50;
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
                            transform:'translate('+w/6+','+h/2+')'
                        });
                    var path=svg.selectAll('path')
                        .data(pie(values))
                        .enter()
                        .append('path')
                        .attr({
                            d:arc,
                            fill:function(d,i){
                                return color(d.data.branchName);
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

                    path.on('mouseover', function(d) {
                        var total = d3.sum(values.map(function(d) {
                            return d.studentCount;
                        }));
                        var percent1 = Math.round(1000 * d.data.studentCount / total) / 10;
                        tooltip.select('.label').html(d.data.branchName);
                        tooltip.select('.count').html(d.data.studentCount);
                        tooltip.select('.percent').html(percent1 + '%');
                        tooltip.style('display', 'block');
                    });

                    path.on('mouseout', function() {
                        tooltip.style('display', 'none');
                    });

                    var restOfTheData=function(){
                        var text=svg.selectAll('text')
                            .data(pie(values))
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
                                return d.data.studentCount;
                            })
                            .style({
                                fill:'#fff',
                                'font-size':'10px'
                            });

                        var legendRectSize=15;
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
                                    return 'translate(105,' + ((i*legendHeight)-65) + ')';
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
                                x:20,
                                y:13
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


smart_parking.directive('donutChart', function() {
    return {
        restrict: 'E',
        scope: {
            values: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('values', function(values) {
                if (values) {
                    var pie=d3.layout.pie()
                        .value(function(d){return d.studentCount})
                        .sort(null);
                    //.padAngle(.03);

                    var tooltip = d3.select('#chart1')
                        .append('div')
                        .attr('class', 'tooltip');

                    tooltip.append('div')
                        .attr('class', 'label');

                    tooltip.append('div')
                        .attr('class', 'count');

                    tooltip.append('div')
                        .attr('class', 'percent');

                    var w=525,h=300;
                    var outerRadius=(w/4)-50;
                    var innerRadius=0;
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
                            transform:'translate('+w/6+','+h/2+')'
                        });
                    var path=svg.selectAll('path')
                        .data(pie(values))
                        .enter()
                        .append('path')
                        .attr({
                            d:arc,
                            fill:function(d,i){
                                return color(d.data.branchName);
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

                    path.on('mouseover', function(d) {
                        var total = d3.sum(values.map(function(d) {
                            return d.studentCount;
                        }));
                        var percent1 = Math.round(1000 * d.data.studentCount / total) / 10;
                        tooltip.select('.label').html(d.data.branchName);
                        tooltip.select('.count').html(d.data.studentCount);
                        tooltip.select('.percent').html(percent1 + '%');
                        tooltip.style('display', 'block');
                    });

                    path.on('mouseout', function() {
                        tooltip.style('display', 'none');
                    });

                    var restOfTheData=function(){
                        var text=svg.selectAll('text')
                            .data(pie(values))
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
                                return d.data.studentCount;
                            })
                            .style({
                                fill:'#fff',
                                'font-size':'10px'
                            });

                        var legendRectSize=15;
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
                                    return 'translate(105,' + ((i*legendHeight)-65) + ')';
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
                                x:20,
                                y:13
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

smart_parking.directive('sunburstChart', function() {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('data', function(data) {
                if (data) {
                    var width = 860,
                        height = 600,
                        radius = Math.min(width, height) / 2;
                    var x = d3.scale.linear()
                        .range([0, 2 * Math.PI]);
                    var y = d3.scale.linear()
                        .range([0, radius]);
                    //var color = d3.scale.category20c();
                    var color = d3.scale.category10();
                    /*var color = d3.scale.ordinal()
                        .range(["#FF5733", "#FE6899", "#FC9D88", "#DAF7A6", "#FFC300", "#D6FC88"]);*/

                    var svg = d3.select("#sunburstchart").append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");
                    var partition = d3.layout.partition()
                        .value(function(d) { return d.size; });
                    var arc = d3.svg.arc()
                        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
                        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
                        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
                        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });
                    var g = svg.selectAll("g")
                        .data(partition.nodes(data))
                        .enter().append("g");
                    var path = g.append("path")
                        .attr("d", arc)
                        .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
                        .on("click", click);
                    var text = g.append("text")
                        .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
                        .attr("x", function(d) { return y(d.y); })
                        .attr("dx", "6") // margin
                        .attr("dy", ".35em") // vertical-align
                        .text(function(d) { return "C-"+d.size+ ", Y-"+ d.name; })
                        .style("fill", "white");;
                    function click(d) {
                        text.transition().attr("opacity", 0);
                        path.transition()
                            .duration(750)
                            .attrTween("d", arcTween(d))
                            .each("end", function(e, i) {
                                if (e.x >= d.x && e.x < (d.x + d.dx)) {
                                    var arcText = d3.select(this.parentNode).select("text");
                                    arcText.transition().duration(750)
                                        .attr("opacity", 1)
                                        .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
                                        .attr("x", function(d) { return y(d.y); });
                                }
                            });
                    };
                    function arcTween(d) {
                        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                            yd = d3.interpolate(y.domain(), [d.y, 1]),
                            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
                        return function(d, i) {
                            return i
                                ? function(t) { return arc(d); }
                                : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
                        };
                    }
                    function computeTextRotation(d) {
                        return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
                    }
                }
            })
        }
    }
});
