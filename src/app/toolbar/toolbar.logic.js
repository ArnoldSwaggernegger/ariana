app.controller('toolbarCtrl', ['$scope', '$modal',
    function ($scope, $modal) {

        // SVG FIX FOT STACK OVEFLOW
        $('.svg-img').each(function(){
            var $img = $(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            $.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = $(data).find('svg');

                // Add replaced image's ID to the new SVG
                if(typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if(typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass+' replaced-svg');
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');

                // Replace image with new SVG
                $img.replaceWith($svg);

            }, 'xml');
        }); 
        
        $scope.openUploadModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/upload/upload.tpl.html',
                controller:  'UploadModalCtrl',
                size: 'lg'
            });
        };
        
        $scope.saveImage = function() {
            // TODO I have no idea if this works :^)
            //var image = $scope.renderEngine.renderToImg();
            //window.location.href = image;
        }
        
        $scope.openTransformationModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/transformations/transformations.tpl.html',
                controller:  'TransformationModalController',
                size: 'lg'
            });
        };
    
        $scope.openFilterModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/filters/filters.tpl.html',
                controller:  'FilterModalController',
                size: 'lg'
            });
        };    

        
    }
]);
