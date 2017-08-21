/**
 * Created by Icarat2 on 11/4/2016.
 */

facultyApp.directive('capitalizeFirst', ['$parse', function($parse) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                var capitalized = inputValue.charAt(0).toUpperCase() +
                    inputValue.substring(1);
                if(capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            };
            var model = $parse(attrs.ngModel);
            modelCtrl.$parsers.push(capitalize);
            capitalize(model(scope));
        }
    };
}]);