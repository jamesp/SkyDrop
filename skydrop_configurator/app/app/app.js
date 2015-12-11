"use strict";

function err(msg)
{
    alert(msg);
}

function uint8_invert(data)
{
    var val = 0;
    for (var i = 0; i<8; i++)
    {
        if (data & 1 << i)
            val += 0;
        else
            val += (1 << i);
    }
    
    return val;
}

var app = angular.module('app', ["ngRoute", "chart.js", "ui.bootstrap-slider", 'ngAnimate', 'ui.bootstrap', 'uiSwitch']);
    
//var memory = new MemoryHandler();

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
	    when('/audio_profile', {
	        templateUrl: 'pages/audio_profile.html',
	    }).      
	    when('/display', {
	        templateUrl: 'pages/display.html',
	    }).      
	    when('/system', {
	        templateUrl: 'pages/system.html',
	    }).      
        when('/advanced', {
            templateUrl: 'pages/advanced.html',
         }).      
        when('/var_list', {
            templateUrl: 'pages/var_list.html',
        }).      
        otherwise({
            redirectTo: '/advanced'
        });
  }]);
  
app.controller("menuList", ["$scope", function ($scope) {
    $scope.menus = 
    [
        [
         	{"title": "Audio Profile editor", "ref": "audio_profile"},
         	{"title": "Display", "ref": "display"},
         	{"title": "System", "ref": "system"}
        ],
        [
         	{"title": "Advanced", "ref": "advanced"},
         	{"title": "All Values", "ref": "var_list"}
        ]
    ];
    
    $scope.activeMenu = "audio_profile";
    
    $scope.select = function(ref){
        $scope.activeMenu = ref;
    };
    
    $scope.isActive = function(ref){
        return (this.activeMenu === ref);
    };

}]);

app.controller("controls", ["$scope", "memory", "$timeout", function ($scope, memory, $timeout) {
	
	$scope.hide_nav = true;
	
    $scope.save = function(){
        var blob = new Blob([memory.getBlob()], {type: "application/octet-stream"});
        
        alert("Save this file as UPDATE.EE on SkyDrop root directory.\n\nWARNING!\nFiles generated by browser like UPDATE (2).EE, UPDATE (3).EE, ... UPDATE (12).EE will not be accepted by SkyDrop!");
        saveAs(blob, "UPDATE.EE");
    };

    $scope.load = function(){
    	$scope.file_selector.click();
    };
    
    $scope.read_file = function(files){
    	console.log(files[0]);
    	var file = files[0];
    	
    	if (files.length != 1 || (file.name != "CFG.EE" && file.name != "OLD.EE"))
    	{
    		alert("Please select CFG.EE or OLD.EE file from SkyDrop root directory");
    		$scope.file_selector.val(null);
    		return;
    	}

    	
    	var reader = new FileReader();
    	reader.onload = function(e) 
    	{
    	    var contents = e.target.result;
    	    memory.load_data(contents);
    	    $scope.file_selector.val(null);
    	};
    	  
    	reader.readAsArrayBuffer(file);
    };
    
    $scope.restore_default = function()
    {
    	if (confirm('Restore default values for this build?\nYour changes will be discarted!'))
    		memory.restore_default();
    	
    };
    
    $scope.is_old = function()
    {
    	return memory.is_old_version();  	
    };

    $scope.newest = function()
    {
    	return memory.newest_build;  	
    };    
    
    $scope.upgrade = function()
    {
    	memory.upgrade();
    };
    
    //init memory handler
    memory.getAllValues();
    
    $scope.file_selector = angular.element("#file-selector");
}]);

