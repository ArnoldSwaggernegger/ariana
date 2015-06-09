angular.module('ariana').controller('drawtestCtrl', function($scope, $window) {
    setCanvasSize();
    $scope.rendertarget = null;

    $scope.mouseMove = function(e) {
        e.preventDefault();

        $scope.config.mouse.old.x = $scope.config.mouse.current.x;
        $scope.config.mouse.old.y = $scope.config.mouse.current.y;

        $scope.config.mouse.current.x = e.pageX;
        $scope.config.mouse.current.y = e.pageY;
        
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions && $scope.config.mouse.click.down) toolFunctions.mouseMove($scope, event);      
    }

    $scope.mouseDown = function(e) {
        e.preventDefault();
        /* Set correct position in config. */
        $scope.config.mouse.click.down = true;
        $scope.config.mouse.current.x = e.pageX;
        $scope.config.mouse.current.y = e.pageY;
        $scope.config.mouse.lastClick.x = e.pageX;
        $scope.config.mouse.lastClick.y = e.pageY;
        
        /* Start current toolset. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) toolFunctions.mouseDown($scope, event);
    }
    
    $scope.mouseUp = function(event) {
        event.preventDefault();
        $scope.config.mouse.click.down = false;
        
        /* End current toolset. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) toolFunctions.mouseUp($scope, event);
    }

    $scope.rightClick = function(event) {
        
    }
    
    /* Get the canvas element. */
    var canvas = document.getElementById('main-canvas');
    //$scope.startEngine(canvas);

    //TODO: nu tekenen we op de canvas, maar we moeten in de renderEngine tekenen o.i.d.
    $scope.drawEngine = new Draw(canvas); //DUNES);
    $scope.drawEngine.activate();
    $scope.drawEngine.setBrush(brushType.THIN);
    //$scope.drawEngine.loadBrushSVG('assets/draw/thin.svg');
    //$scope.drawEngine.setDrawType(drawType.CIRCLE);
}); 
    

/* This function sets the canvas full screen. It uses the fact that hdpi 
screen require a larger canvas size. */
function setCanvasSize() {
    var canvas = document.getElementById('main-canvas');
    var desiredWidthInCSSPixels  = window.innerWidth;
    var desiredHeightInCSSPixels = window.innerHeight;
    
    canvas.style.width  = desiredWidthInCSSPixels  + "px";
    canvas.style.height = desiredHeightInCSSPixels + "px";
    
    var devicePixelRatio = window.devicePixelRatio || 1;
    
    canvas.width  = desiredWidthInCSSPixels  * devicePixelRatio;
    canvas.height = desiredHeightInCSSPixels * devicePixelRatio;
}

var penTool = {
    
    start: function() {
        var scope = angular.element($("#main-canvas")).scope();
        $("#main-canvas").css("cursor", "url(/assets/vectors/pen.svg), auto");
        
        scope.drawEngine.activate();
        scope.drawEngine.setDrawType(drawType.NORMAL);
        //$scope.drawEngine.setBrush(brushType.THIN);
    },
    
    mouseDown: function($scope) {
        //$("#main-canvas").css("cursor", "grabbing");

        //$scope.drawEngine.onMousedown();
    },
    
    mouseUp: function($scope) {
        $("#main-canvas").css("cursor", "url(/assets/vectors/pen.svg), auto");
        /*
        for (var i = 0; i < $scope.config.layers.numberOfLayers; i++) {
            var xOffset = $scope.renderEngine.layers[i].getPosX();
            var yOffset = $scope.renderEngine.layers[i].getPosY();
            $scope.config.layers.layerInfo[i].x = xOffset;
            $scope.config.layers.layerInfo[i].y = yOffset;
        }*/
    },
    
    mouseMove: function($scope) {/*
        var dx = $scope.config.mouse.current.x - $scope.config.mouse.lastClick.x;
        var dy = $scope.config.mouse.current.y - $scope.config.mouse.lastClick.y;

        for (var i = 0; i < $scope.config.layers.numberOfLayers; i++) {
            var xOffset = $scope.config.layers.layerInfo[i].x;
            var yOffset = $scope.config.layers.layerInfo[i].y;

            var width = $scope.renderEngine.width;
            var height = $scope.renderEngine.height;
            var aspectRatio = width/ height;
            
            $scope.renderEngine.layers[i].setPos(2 * (dx/width) + xOffset, -2 * (dy/height/aspectRatio) + yOffset);
        }
        
        //$scope.renderEngine.render();*/
    },
}