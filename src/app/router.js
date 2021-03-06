/* 
 * Project Ariana
 * router.js
 * 
 * This file contains the router, which displays the correct template in the 
 * correct ui-view for every given state.
 *
 */

app.config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    
    $stateProvider
        .state('index', {
            url: "/",
            views: {
                "content": {
                    templateUrl: "app/content/landing/landing.content.tpl.html"
                }
            }
        })
        .state('ariana', {
            url: "/ariana",
            views: {
                "content": {
                    templateUrl: "app/content/content.tpl.html",
                    controller: 'ContentCtrl'
                },
                "toolbar": {
                    templateUrl: "app/toolbar/toolbar.tpl.html",
                    controller: 'ToolbarCtrl'
                },
                "layers": {
                    templateUrl: "app/layers/layers.tpl.html",
                    controller: 'layersCtrl'
                },
                "toolbox": {
                    templateUrl: "app/toolbox/toolbox.tpl.html",
                    controller: 'ToolboxCtrl'
                }
            }
        });
});
