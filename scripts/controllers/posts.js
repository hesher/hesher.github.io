/*globals angular */
/*jslint unparam: true, browser:true */

var app = angular.module('PersonalWebsite');
app.controller('posts', ['$scope', '$firebase', function ($scope, $firebase) {
  var ref = new Firebase('https://tamartk.firebaseio.com/posts');
  var sync = $firebase(ref);
  $scope.posts = sync.$asArray();
  $scope.posts.$loaded().then(function () {
    $scope.isLoaded = true;
    console.log('loaded...');
  }).catch(function (err) {
    $scope.isLoaded = false;
    console.error('failed to load posts', err);
  });
  $scope.addPost = function () {
    $scope.posts.$add({
      title: $scope.newTitle
    });
  };
}]);
