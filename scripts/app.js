/*globals angular */
/*jslint unparam: true, browser:true */

var app = angular.module('PersonalWebsite', ['ui.bootstrap', 'ui.router', 'firebase', 'ngSanitize']);

function transformElm(elm, pTrans) {
  'use strict';
  elm.style.webkitTransform = pTrans;
  elm.style.MozTransform = pTrans;
  elm.style.msTransform = pTrans;
  elm.style.OTransform = pTrans;
  elm.style.transform = pTrans;
}

app.config(function ($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise('/front');
  //
  // Now set up the states
  //
  function genDialog(url) {
    return ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
        $modal.open({
            templateUrl: url,
            // resolve: {
            //   item: function () { new Item(123).get(); }
            // },
            controller: ['$scope', function ($scope) {
              $scope.dismiss = function () {
                $scope.$dismiss();
              };
            }]
        }).result.then(function (result) {
          if (result) {
            return $state.transitionTo('front');
          }
        }, function () {
          return $state.transitionTo('front');
        });
      }];
  }
  $stateProvider
    .state('front', {
      url: '/front',
      templateUrl: 'index.html'
    })
    .state('tamar', {
      url: '/tamar',
      onEnter: genDialog('partials/tamar.html')
    })
    .state('kids', {
      url: '/kids',
      onEnter: genDialog('partials/kids.html')
    })
    .state('infants', {
      url: '/infants',
      onEnter: genDialog('partials/infants.html')
    })
    .state('article', {
      url: '/article',
      onEnter: genDialog('partials/story-telling.html')
    });
});

app.controller('MainCtrl', ['$scope', '$modal', function ($scope, $modal) {
  'use strict';

}]);

app.directive('jiggly', ['$interval', function ($interval) {
  'use strict';
  var isLastPositive = true;
  var mousein = false;
  return {
    link: function (scope, elm, attr) {
      elm.bind('mouseenter', function () {
        mousein = true;
        transformElm(elm[0], 'rotate(0deg)');
      });
      elm.bind('mouseleave', function () {
        mousein = false;
      });
      $interval(function () {
        var deg = Math.floor(Math.random() * 4);
        if (isLastPositive === true) {
          deg *= -1;
        }
        isLastPositive = !isLastPositive;
        if (mousein === false) {
          transformElm(elm[0], 'rotate(' + deg + 'deg)');
        }

      }, ((Math.random() * 1000) + 2000));
    }
  };
}]);
