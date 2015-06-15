/* 
 * Project Ariana
 * content.logic.js
 * 
 * This file contains the ContenController, which controls the canvas in the
 * center of the screen.
 *
 */

/* The ContenController contains the behaviour of the main content. */
angular.module('ariana').controller('ContentController', function($scope, $window) {

    /* Set the cursor for the deafult tool: the pan tool. */
    // $("#background").css("cursor", "grab");

    /* This function is triggered when the mouse is moved. */
    $scope.mouseMove = function(event) {
        event.preventDefault();

        var cx = $scope.config.canvas.x,
            cy = $scope.config.canvas.y,
            z  = $scope.config.canvas.zoom;

        $scope.config.mouse.current.x = (event.pageX - cx) / z;
        $scope.config.mouse.current.y = (event.pageY - cy) / z;
        
        $scope.config.mouse.current.global.x = event.pageX;
        $scope.config.mouse.current.global.y = event.pageY;
        
        /* Call the appropriate tool functions. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) toolFunctions.mouseMove();
    };

    /* This function is triggered on a click. */
    $scope.mouseDown = function(event) {
        event.preventDefault();
        event.stopPropagation();

        var cx = $scope.config.canvas.x,
            cy = $scope.config.canvas.y,
            z  = $scope.config.canvas.zoom;
        
        /* Store the mouse button. */
        $scope.config.mouse.button[event.which] = true;

        /* Set correct position in config. */
        $scope.config.mouse.current.x = (event.pageX - cx) / z;
        $scope.config.mouse.current.y = (event.pageY - cy) / z;
        $scope.config.mouse.old.x     = (event.pageX - cx) / z;
        $scope.config.mouse.old.y     = (event.pageY - cy) / z;
        
        $scope.config.mouse.current.global.x = event.pageX;
        $scope.config.mouse.current.global.y = event.pageY;
        $scope.config.mouse.old.global.x = event.pageX;
        $scope.config.mouse.old.global.y = event.pageY;
        
        /* Call the appropriate tool functions. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) toolFunctions.mouseDown();
    };

    /* This function is called when a mouse button is released. */
    $scope.mouseUp = function(event) {
        event.preventDefault();

        /* Store the mouse button. */
        $scope.config.mouse.button[event.which] = false;

        /* Call the appropriate tool functions. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) toolFunctions.mouseUp();
    }
    
    $scope.mwheelUp = function() {
        $scope.config.canvas.zoom += 0.05;
        if ($scope.config.canvas.zoom > 3.0) {
            $scope.config.canvas.zoom = 3.0;
        } 
    };

    $scope.mwheelDown = function() {
        $scope.config.canvas.zoom -= 0.05;
        if ($scope.config.canvas.zoom < 0.1) {
            $scope.config.canvas.zoom = 0.1;
        }
    };

    /* Get the canvas element and start the engine. */
    $scope.startEngines(
        document.getElementById("main-canvas"),
        document.getElementById("editing-canvas")
    );

    // Add Arnold the First
    var image1 = new Image();
    image1.src="/assets/img/logo.png";
    image1.onload = function(){$scope.newLayerFromImage(image1)};

    //TODO: nu tekenen we op de canvas, maar we moeten in de renderEngine tekenen o.i.d.
    //$scope.drawEngine = new Draw(canvas, $scope.renderEngine);
    //$scope.drawEngine.activate();
    //$scope.drawEngine.setBrush(brushType.THIN);
    //$scope.drawEngine.loadBrushSVG('assets/draw/thin.svg');
    //$scope.drawEngine.setDrawType(drawType.CIRCLE);
});
