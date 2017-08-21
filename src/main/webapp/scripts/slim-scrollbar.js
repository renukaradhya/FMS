/**
 * Created by Neha.garg on 10-07-2015.
 */
var slimScrollDirective = angular.module('slimScrollDirective',[]);
slimScrollDirective.value("slimScrollConfig", {});

slimScrollDirective.directive("slimScroll", ["slimScrollConfig", function (slimScrollConfig) {
  var options = {};
  if (slimScrollConfig) {
    angular.extend(options, slimScrollConfig);
  }
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      // instance-specific options
      var opts = angular.extend({}, options, scope.$eval(attrs.slimScroll));
      angular.element(element).slimScroll(opts);/*
       if(attrs['list'] != undefined) {
       console.log(attrs['list'].length)
       if (attrs['list'].length > 0) {
       console.log(attrs['id'])
       var opts = angular.extend({}, options, scope.$eval(attrs.slimScroll));
       console.log(opts)
       angular.element(element).slimScroll(opts);
       }
       }*/
    }
  };
}]);
