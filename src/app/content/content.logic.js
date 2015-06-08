angular.module('ariana').controller('contentCtrl', function($scope, $window) {

    $scope.mouseMove = function(e) {
        e.preventDefault();
        $scope.config.mouse.current.x = e.pageX;
        $scope.config.mouse.current.y = e.pageY;
        
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions && $scope.config.mouse.click.down) toolFunctions.mouseMove($scope);      
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
        if (toolFunctions) toolFunctions.mouseDown($scope);
    }
    
    $scope.mouseUp = function(event) {
        event.preventDefault();
        $scope.config.mouse.click.down = false;
        
        /* End current toolset. */
        var toolFunctions = $scope.config.tools.activeToolFunctions;
        if (toolFunctions) toolFunctions.mouseUp($scope);
    }
    
    /* Get the canvas element. */
    var canvas = document.getElementById('main-canvas');
    $scope.startEngine(canvas);
    
    // Add Arnold the First
    var image1 = new Image();
    image1.src="/assets/img/arnold2.jpg";
    
    image1.onload = function() {
        $scope.newLayerFromImage(image1);
    }
    
    // Add Arnold the Second
    var image2 = new Image();
    image2.src="/assets/img/moustache.png";
    
    image2.onload = function() {
        $scope.newLayerFromImage(image2);
    }
});
