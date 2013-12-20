'use strict';

define(["angular", "./controllers", "./filters"], function(angular) {
	var blog = angular.module("blog", ["blogFilters", "blogControllers"], function(){});
    return blog.config(['$routeProvider',function($routeProvider) {
		$routeProvider.
		when('/blogs/:query', {templateUrl: 'partials/list.html',   controller: 'ListController'}).
	    when('/blog/:id', {templateUrl: 'partials/blog.html', controller: 'BlogController'}).
	    when('/search', {templateUrl: 'partials/searchResult.html', controller: 'SearchController'}).
	    otherwise({redirectTo: '/blogs/'});
    }]);
});