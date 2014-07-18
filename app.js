/*globals angular */
/*jslint unparam: true, browser:true */

var app = angular.module('PersonalWebsite', ['ui.bootstrap']);


function transformElm(elm, pTrans) {
    "use strict";
    elm.style.webkitTransform = pTrans;
    elm.style.MozTransform = pTrans;
    elm.style.msTransform = pTrans;
    elm.style.OTransform = pTrans;
    elm.style.transform = pTrans;
}



app.controller('MainCtrl', ['$scope', '$modal', function ($scope, $modal) {
    "use strict";
    var dialogs = {
        infants: "infants.html",
        kids: "kids.html",
        tamar: "tamar.html"
    };

    $scope.open = function (which) {
        console.log(dialogs[which]);
        var instance = $modal.open({
            templateUrl: dialogs[which]
        });



    };
}]);

app.directive("jiggly", ['$interval', function ($interval) {
    "use strict";
    var
        isLastPositive = true,
        mousein = false;
    return {
        link: function (scope, elm, attr) {
            elm.bind("mouseenter", function () {
                mousein = true;
                transformElm(elm[0], "rotate(0deg)");
            });
            elm.bind("mouseleave", function () {
                mousein = false;
            });
            $interval(function () {
                var deg = Math.floor(Math.random() * 4);
                if (isLastPositive === true) {
                    deg *= -1;
                }
                isLastPositive = !isLastPositive;
                if (mousein === false) {
                    transformElm(elm[0], "rotate(" + deg + "deg)");
                }

            }, 3000);
        }
    };
}]);