app.directive('brush', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/painting/brush/brush.tpl.html',
        controller: 'BrushCtrl'
    };
});

app.controller('BrushCtrl', function($scope) {
	$scope.toolname = 'brush';
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;
    $scope.thickness = 2;
    $scope.opacity = 1;
    $scope.intensity = 1;
    $scope.brush = "thin";
        
	/* init */
	$scope.init = function() {
        $scope.drawing = false;
        $scope.hasDrawn = false;
		$scope.setCursor('default');
        $scope.setColor($scope.config.tools.colors.primary);
        
        $scope.updateDrawEngine();
        $scope.updateBrushStyle();
	};
    
    $scope.updateDrawEngine = function() {
        $scope.drawEngine.setLineWidth($scope.thickness);
        $scope.drawEngine.setOpacity($scope.opacity);
        $scope.drawEngine.setIntensity($scope.intensity);
    };
    
    $scope.updateBrushStyle = function() {
        if ($scope.brush == "thin") {
            $scope.brushStyle = brushType.THIN;
        }
        if ($scope.brush == "neighbor") {
            $scope.brushStyle = brushType.NEIGHBOR;
        }
        if ($scope.brush == "fur") {
            $scope.brushStyle = brushType.FUR;
        }
        if ($scope.brush == "multistroke") {
            $scope.brushStyle = brushType.MULTISTROKE;
        }
        $scope.drawEngine.setBrush($scope.brushStyle);
    };

    $scope.setColor = function(color) {
        $scope.drawEngine.setColor(
            color.r,
            color.g,
            color.b,
            1.0
        );
    };
    
    $scope.stop = function() {
        if ($scope.hasDrawn) {
            var image = $scope.drawEngine.getCanvasImageData();
            $scope.newLayerFromImage(image);
            $scope.drawEngine.clearCanvases();
        }
    };

	/* onMouseDown */
	$scope.mouseDown = function() {
        $scope.drawing = true;
        
        var buttons = $scope.config.mouse.button;
        if (buttons[1] && buttons[3]) return;
        
        if (buttons[1]) 
            $scope.setColor($scope.config.tools.colors.primary);
        else 
            $scope.setColor($scope.config.tools.colors.secondary);
        
        $scope.drawEngine.onMousedown($scope.config.mouse.current.x, $scope.config.mouse.current.y);
	};

	/* onMouseUp */
	$scope.mouseUp = function() {
        $scope.drawing = false;
        $scope.drawEngine.onMouseup($scope.config.mouse.current.x, $scope.config.mouse.current.y);
	};

	/* onMouseMove */
	$scope.mouseMove = function() {
        if (!$scope.drawing) return;
        $scope.hasDrawn = true;
		$scope.drawEngine.onMousemove($scope.config.mouse.current.x, $scope.config.mouse.current.y);
	};
	/*
	 * This will watch for this tools' "active" variable changes.
	 * When "active" changes to "true", this tools functions need to
	 * be registered to the global config.
	 * This functions NEEDS to be in each tools controller for
	 * the tool to function. Please assign the correct toolfunctions
	 * to the "activeToolFunctions" object.
	 * Always call "init" first;
	 */
	$scope.$watch('active', function(nval, oval) {
		if (nval) {
			$scope.init();

			$scope.config.tools.activeToolFunctions = {
				mouseDown: $scope.mouseDown,
				mouseUp: $scope.mouseUp,
				mouseMove: $scope.mouseMove
			};
		}
        else if (oval) {
            $scope.stop();
        }
	}, true);
});