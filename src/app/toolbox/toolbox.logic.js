/*
 * The toolset controller contains all logic of the toolsets
 */
angular.module('ariana').controller('toolsetCtrl', function($scope) {
    
    // SVG FIX FOT STACK OVEFLOW
    $('.svg').each(function(){
        var $img    = $(this);
        var id      = $img.attr('id');
        var src     = $img.attr('src');

        /* Load image src. */
        $.get(src, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = $(data).find('svg');

            // Add replaced image's ID to the new SVG
            if(typeof id !== 'undefined') {
                $svg = $svg.attr('id', id);
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns');
            $svg = $svg.removeAttr('xmlns:xlink');

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');
    });

    /* This function selects a toolset and therefore opens a toolbox. */
    $scope.selectToolSet = function(name) {
        if ($scope.config.tools.activeToolset == name) {
            $scope.config.tools.activeToolset = null;
        }
        else {
            $scope.config.tools.activeToolset = name;
        }
    };
    
    /* This function selects a tool. */
    $scope.selectTool = function(e, tool) {
        e.stopPropagation()

        $scope.config.tools.activeTool = tool;

        var toolset = $scope.config.tools.activeToolset,
            toolFunctions = $scope.toolbox[toolset].tools[tool].toolFunctions;
        
        $scope.config.tools.activeToolFunctions = toolFunctions;
        toolFunctions.start();
        
        /* Set the cursor over the canvas. */
        if      (tool == "pan")         $("#main-canvas").css("cursor", "grab");
        else if (tool == "translate")   $("#main-canvas").css("cursor", "move");
        else if (tool == "rotate")      $("#main-canvas").css("cursor", "grab");
        else                            $("#main-canvas").css("cursor", "default")
    };

});

/*
 * The toolbox controller contains all logic of the whole toolbar!
 */
angular.module('ariana').controller('toolboxCtrl', function($scope) {
    $scope.primary = $scope.config.tools.colors.primary;
    $scope.secondary = $scope.config.tools.colors.secondary;
    $scope.active = $scope.config.tools.active;

    $scope.setPrimary = function(color) {
        $scope.primary = color;
    }

    $scope.setSecondary = function(color) {
        $scope.secondary = color;
    }

    $scope.swapColors = function() {
        var temp = $scope.primary;
        $scope.primary = $scope.secondary;
        $scope.secondary = temp;
    }

    /*
     * Toolsets
     */
    $scope.toolbox = {
        basic: {
            image: 'arrow-all.svg',
            tools: {
                pan: {
                    image: 'cursor-pointer.svg',
                    toolFunctions: panTool,
                },
                translate: {
                    image: 'arrow-all.svg',
                    toolFunctions: translateTool,
                },
                scale: {
                    image: 'arrow-expand.svg'
                },
                rotate: {
                    image: 'rotate-left.svg',
                    toolFunctions: rotateTool,
                },
                crop: {
                    image: 'crop.svg'
                }
            }
        },
        painting: {
            image: 'border-color.svg',
            tools: {
                color: {
                    image: 'palette.svg'
                },
                pencil: {
                    image: 'pen.svg'
                },
                brush: {
                    image: 'brush.svg'
                },
                eraser: {
                    image: 'eraser.svg'
                },
                picker: {
                    image: 'eyedropper.svg',
                    toolFunctions: colorPicker,
                },
                fill: {
                    image: 'format-color-fill.svg'
                }
            }
        },
        select: {
            image: 'select.svg',
            tools: {
                rectangle: {
                    image: 'select.svg'
                },
                elipse: {
                    image: 'checkbox-blank-circle-outline.svg'
                },
                curve: {
                    image: 'vector-curve.svg'
                },
                wand: {
                    image: 'auto-fix.svg' 
                }
            }
        },
        text: {
            image: 'format-size.svg'
        }
    }
});
