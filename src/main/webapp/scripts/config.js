
/*var ps_server_ip = '139.162.38.246:8080';
var br_manager_server_ip = '139.162.38.246:8080';
var br_operator_server_ip = '139.162.38.246:8080';
var faculty_server_ip = '139.162.38.246:8080';*/

var ps_server_host = 'Eshiksha';
var br_manager_server_host = 'Eshiksha';
var br_operator_server_host = 'Eshiksha';
var faculty_server_host = 'Eshiksha';

var ps_server_ip = 'localhost:8080';
var br_manager_server_ip = 'localhost:8080';
var br_operator_server_ip = 'localhost:8080';
var faculty_server_ip = 'localhost:8080';

var config_app = angular.module('config_app',[]);

config_app.value("ps_server_ip",ps_server_ip);
config_app.value("ps_server_host",ps_server_host);
config_app.value("ps_appConfig",{});

config_app.value("ad_server_ip",ps_server_ip);
config_app.value("ad_server_host",ps_server_host);
config_app.value("admin_appConfig",{});

config_app.value("br_manager_server_ip",br_manager_server_ip);
config_app.value("br_manager_server_host",br_manager_server_host);
config_app.value("br_manager_appConfig",{});

config_app.value("br_operator_server_ip",br_manager_server_ip);
config_app.value("br_operator_server_host",br_manager_server_host);
config_app.value("br_operator_appConfig",{});

config_app.value("faculty_server_ip",faculty_server_ip);
config_app.value("faculty_server_host",faculty_server_host);
config_app.value("faculty_appConfig",{});



config_app.factory('admin_config',['admin_appConfig','ad_server_ip','ps_server_host','$window',function(admin_appConfig,ad_server_ip,ad_server_host,$window){
    var factory = {};
    var admin_server_url = 'http://'+ad_server_ip+'/'+ad_server_host+'/';
    //var orgId = {};
    //var branchId = {};

    factory.setConfig = function(){
        if($window.sessionStorage.getItem("loggedin") == false){
            return false;
        }else{
            // admin_appConfig._orgId = $window.sessionStorage.getItem("adminId");
            admin_appConfig.base_url = admin_server_url;
            return true;
        }
    };

    factory.getServerIp = function(){
        return 'http://'+ad_server_ip;
    };

    factory.getBaseUrl = function(){
        return admin_appConfig.base_url;
    };

    factory.getLoginApi = function(){
        return admin_server_url+'login';
    };

    return factory;
}]);


config_app.factory('Config',['ps_appConfig','ps_server_ip','$window',function(ps_appConfig,ps_server_ip,$window){

    var factory = {};
    var ps_server_url = 'http://'+ps_server_ip+'/'+ps_server_host+'/';
    var orgId = {};

    factory.setConfig = function(){
        if($window.sessionStorage.getItem("orgId") == null || $window.sessionStorage.getItem("userId") == null){
            return false;
        }else{
            ps_appConfig._orgId = $window.sessionStorage.getItem("orgId");
            ps_appConfig._userId = $window.sessionStorage.getItem("userId");
            orgId = window.btoa(ps_appConfig._orgId);
            ps_appConfig.base_url = ps_server_url;
            return true;
        }
    };

    factory.getOrgAPI = function(){
        return ps_appConfig.base_url+'org/'+ps_appConfig._orgId;
    };

    factory.getServerIp = function(){
        return 'http://'+ps_server_ip;
    };

    factory.getBaseUrl = function(){
        return ps_appConfig.base_url;
    };

    factory.getLoginApi = function(){
        return ps_server_url+'login';
    };

    factory.getPasswordApi = function(){
        return 'http://'+ps_server_ip+'/'+ps_server_host+'/'+'org/'+orgId;
    };

    factory.getBranchesAPI = function(){
        return ps_appConfig.base_url+'org/'+orgId;
    };

    factory.getFeeAPI = function(){
            return ps_appConfig.base_url+'org/'+orgId+'/branch/';
    };
    
	factory.getBranchManagersAPI = function(){
        return ps_appConfig.base_url+'org/'+orgId;
    };

    factory.getBranchOperatorsAPI = function(){
        return ps_appConfig.base_url+'org/'+orgId;
    };

    factory.getAssetAPI = function(){
        return ps_appConfig.base_url+'org/'+orgId+'/dashboard';
    };

    return factory;
}]);

config_app.factory('br_Manager_Config',['br_manager_appConfig','br_manager_server_ip','br_manager_server_host','$window',function(br_manager_appConfig,br_manager_server_ip,br_manager_server_host,$window){
    var factory = {};
    var br_manager_server_url = 'http://'+br_manager_server_ip+'/'+br_manager_server_host+'/';
    var orgId = {};
    var branchId = {};
    factory.setConfig = function(){
        if($window.sessionStorage.getItem("orgId") == null || $window.sessionStorage.getItem("userId") == null ||
            $window.sessionStorage.getItem("branchId") == null  ){
            return false;
        }else{
            br_manager_appConfig._orgId = $window.sessionStorage.getItem("orgId");
            br_manager_appConfig._userId = $window.sessionStorage.getItem("userId");
            br_manager_appConfig._branchId = $window.sessionStorage.getItem("branchId");
            orgId = window.btoa(br_manager_appConfig._orgId);
            branchId = window.btoa(br_manager_appConfig._branchId);
            br_manager_appConfig.base_url = br_manager_server_url+'org/'+ orgId+'/branch/'+branchId;
            return true;
        }
    };

    factory.getServerIp = function(){
        return 'http://'+br_manager_server_ip;
    };

    factory.getBaseUrl = function(){
        return br_manager_appConfig.base_url;
    };

    factory.getLoginApi = function(){
        return br_manager_server_url+'login';
    };

    factory.getPasswordApi = function(){
        return 'http://'+br_manager_server_ip+'/'+br_manager_server_host+'/'+'org/'+orgId;
    };

    factory.getMainAPI = function() {
        return 'http://'+br_manager_server_ip+'/'+br_manager_server_host+'/'+'org/'+orgId+'/branch/'+branchId;
    };

    factory.getAssetAPI = function(){
        return 'http://'+br_manager_server_ip+'/'+br_manager_server_host+'/'+'org/'+orgId+'/dashboard/'+'branch/'+branchId;
    };

    factory.getBranchesAPI = function(){
        return 'http://'+br_manager_server_ip+'/'+br_manager_server_host+'/'+'org/'+orgId;
    };

    return factory;
}]);

config_app.factory('br_Operator_Config',['br_operator_appConfig','br_operator_server_ip','br_operator_server_host','$window',function(br_operator_appConfig,br_operator_server_ip,br_operator_server_host,$window){
    var factory = {};
    var br_operator_server_url = 'http://'+br_operator_server_ip+'/'+br_operator_server_host+'/';
    var orgId = {};
    var branchId = {};

    factory.setConfig = function(){
        if($window.sessionStorage.getItem("orgId") == null || $window.sessionStorage.getItem("userId") == null ||
            $window.sessionStorage.getItem("branchId") == null ){
            return false;
        }else{
            br_operator_appConfig._orgId = $window.sessionStorage.getItem("orgId");
            br_operator_appConfig._userId = $window.sessionStorage.getItem("userId");
            br_operator_appConfig._branchId = $window.sessionStorage.getItem("branchId");
            orgId = window.btoa(br_operator_appConfig._orgId);
            branchId = window.btoa(br_operator_appConfig._branchId);
            br_operator_appConfig.base_url = br_operator_server_url+'org/'+ orgId+'/branch/'+branchId;
            return true;
        }
    };

    factory.getServerIp = function(){
        return 'http://'+br_operator_server_ip;
    };

    factory.getBaseUrl = function(){
        return br_operator_appConfig.base_url;
    };

    factory.getLoginApi = function(){
        return br_operator_server_url+'login';
    };
    factory.getAssessmentAPI = function() {
        return 'http://'+br_manager_server_ip+'/'+br_manager_server_host+'/'+'org/'+orgId;
    };

    factory.getMainAPI = function() {
        return 'http://'+br_manager_server_ip+'/'+br_manager_server_host+'/'+'org/'+orgId+'/branch/'+branchId;
    };

    factory.getAssetAPI = function(){
        return 'http://'+br_operator_server_ip+'/'+br_operator_server_host+'/'+'org/'+orgId+'/dashboard/'+'branch/'+branchId;
    };
    return factory;
}]);


config_app.factory('faculty_config',['faculty_appConfig','faculty_server_ip','faculty_server_host','$window',function(faculty_appConfig,faculty_server_ip,faculty_server_host,$window){
    var factory = {};
    var faculty_server_url = 'http://'+faculty_server_ip+'/'+faculty_server_host+'/';
    var orgId = {};
    var branchId = {};

    factory.setConfig = function(){
        if($window.sessionStorage.getItem("orgId") == null || $window.sessionStorage.getItem("facultyId") == null ||
            $window.sessionStorage.getItem("branchId") == null  ){
            return false;
        }else{
                 faculty_appConfig._orgId = $window.sessionStorage.getItem("orgId");
                 faculty_appConfig._userId = $window.sessionStorage.getItem("facultyId");
                 faculty_appConfig._branchId = $window.sessionStorage.getItem("branchId");
                 orgId = window.btoa(faculty_appConfig._orgId);
                 branchId = window.btoa(faculty_appConfig._branchId);
                 faculty_appConfig.base_url = faculty_server_url+'org/'+ orgId +'/branch/'+ branchId;
            return true;
        }
    };
    factory.getServerIp = function(){
        return 'http://'+faculty_server_ip;
    };
    factory.getBaseUrl = function(){
         return faculty_appConfig.base_url;
    };
    factory.getLoginApi = function(){
         return faculty_server_url+'login';
    };
    factory.getAssessmentAPI = function() {
        return 'http://'+br_manager_server_ip+'/'+br_manager_server_host+'/'+'org/'+orgId;
    };
    factory.getAssetAPI = function(){
         return 'http://'+faculty_server_ip+'/'+faculty_server_host+'/'+'org/'+orgId+'/dashboard/'+'branch/'+branchId;
    };
    factory.getAssignmentAPI = function(){
        return 'http://'+faculty_server_ip+'/'+faculty_server_host+'/'+'org/'+orgId+'/branch/'+branchId;
    };
    factory.getMainAPI = function() {
        return 'http://'+faculty_server_ip+'/'+faculty_server_host+'/'+'org/'+orgId+'/branch/'+branchId;
    };

    factory.getPasswordAPI = function(){
        return 'http://'+faculty_server_ip+'/'+faculty_server_host+'/'+'org/'+orgId+'/branch/'+branchId;
    };

    return factory;
 }]);