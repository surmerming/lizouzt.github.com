'use strict';

/* App Module */
require.config({
    baseUrl: "js",
    paths:{
        text:'./lib/require/text',
        jquery:'./lib/jquery/jquery',
        angular:'./lib/angular/angular'
    },
    shim: {
        angular: {
            exports: "angular"
        }
    },
    priority:[
        'angular'
    ],
    urlArgs:'v=1.2'
});
require([
    "angular",
    "jquery",
    "resources/js/rout.js",
    "text", 
    'app'
], function(angular){
    $(document).ready(function () {
        angular.bootstrap(document, ['blog']);
    });
});