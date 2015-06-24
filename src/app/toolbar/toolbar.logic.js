/* 
 * Project Ariana
 * toolbar.logic.js
 * 
 * This file contains the ToolbarController, which controls the toolbar.
 *
 */
 
app.controller('ToolbarController', ['$scope', '$modal', 'mouse', 'tools', 'layers'
    function ($scope, $modal, mouse, tools, layers) {
      
        $scope.checkVisible = function(){
            return !mouse.checkActive();
        };
        
        $scope.stopTool = function() {
            tools.setTool("pan");
            tools.setToolset(null);
        }
        
        /* This function opens the newfile modal. */
        $scope.openNewFileModal = function() {
            $scope.stopTool();
            
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/newfile/newfile.tpl.html',
                controller:  'NewFileModalController',
                scope: $scope,
                size: 'sm'
            });
        };
        
        /* This function opens the upload modal. */
        $scope.openUploadModal = function() {
            $scope.stopTool();
            
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/upload/upload.tpl.html',
                controller:  'UploadModalController',
                scope: $scope,
                size: 'lg'
            });
        };

        /* This function opens the save image modal. */
        $scope.openSaveImageModal = function() {
            $scope.stopTool();
            
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/save-image/save-image.tpl.html',
                controller: 'SaveImageModalController',
                scope: $scope
            })
        };
        
        /* This object contains the currently selected filter. */
        $scope.filter = {
            filterName: "",
            filterObject: null,
            filterParameters: null,
            currentlayerOnly: false
        };
    
        /* This function opens the filters modal. */
        $scope.openFilterModal = function() {
            $scope.stopTool();
            
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/filters/filters.tpl.html',
                controller:  'FilterModalController',
                scope: $scope,
                size: 'lg'
            });
        };

        function forEachLayer(f) {
            for (var i = 0; i < $scope.renderEngine.getNumberOfLayers(); i ++) {
                f($scope.renderEngine.getLayer(i), i);
            }
        }

        $scope.cancelFilter= function() {
            $scope.filter.filterObject = null;
            $scope.filter.currentlayerOnly = false;

            forEachLayer(function(layer) {
                if (layer.getLayerType() === LayerType.ImageLayer) {
                    layer.discardFilter();
                }
            });

            $scope.requestRenderEngineUpdate();
        };

        /* Set all filter parameters into the filter object. */
        $scope.applyFilterChanges = function () {
            var filter = $scope.filter.filterObject;
            if (!filter) {
                return;
            }

            for (var key in $scope.filter.filterParameters) {
                var value = $scope.filter.filterParameters[key].value;
                filter.setAttribute(key, value);
            }

            forEachLayer(function(layer, index) {
                $scope.updateThumbnail(index);
            });

            $scope.requestRenderEngineUpdate();
        };

        $scope.commitFilterOnLayers = function () {
            forEachLayer(function(layer, index) {
                if (layer.getLayerType() === LayerType.ImageLayer) {
                    layer.commitFilter();
                    $scope.updateThumbnail(index);
                }
            });

            $scope.requestRenderEngineUpdate();
        };
        
        $scope.applyFilterOnLayers = function() {
            var filter = $scope.filter.filterObject;

            if (layers.getNumLayers() == 0 || !filter) {
                $scope.cancel();
                return;
            }

            forEachLayer(function(layer, index) {
                if (layer.getLayerType() !== LayerType.ImageLayer || layer.isHidden()) {
                    return;
                }

                if (index === layers.getCurrentIndex() || !$scope.filter.currentlayerOnly) {
                    layer.applyFilter(filter);
                }
                else {
                    layer.discardFilter();
                }
                $scope.updateThumbnail(index);
            });

            $scope.requestRenderEngineUpdate();
        };

        $scope.$on("newCurrentLayer", function() {
            $scope.applyFilterOnLayers();
        });
    }
]);
