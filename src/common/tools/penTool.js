var penTool = {
    start: function() {
        var scope = angular.element($("#background")).scope();
        $("#background").css("cursor", "url(/assets/vectors/pen.svg), auto");

        scope.drawEngine.setDrawType(drawType.NORMAL);
    },

    stop: function() {
        var scope = angular.element($("#background")).scope();

        var image = scope.drawEngine.getCanvasImageData();
        var imageLayer = scope.renderEngine.createImageLayer(image);
        imageLayer.setPos(image.width/2.0, image.height/2.0);
        scope.renderEngine.addLayer(imageLayer);
        scope.renderEngine.render();

        scope.drawEngine.clearCanvases();
    },
    
    mouseDown: function($scope, event) {
        $scope.drawEngine.setColor(
            $scope.config.tools.colors.primary.r,
            $scope.config.tools.colors.primary.g,
            $scope.config.tools.colors.primary.b,
            1.0
        );
        $scope.drawEngine.onMousedown(event);
    },
    
    mouseUp: function($scope, event) {
        $scope.drawEngine.onMouseup(event);
    },
    
    mouseMove: function($scope, event) {
        $scope.drawEngine.onMousemove(event);
    }
}