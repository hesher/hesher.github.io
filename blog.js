function s4() {
  'use strict';
  return Math.floor((1 + Math.random()) * 0x10000)
         .toString(16)
         .substring(1);
}

function guid() {
  'use strict';
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

var blogApp = angular.module('blogModule', ['firebase', 'ui.tinymce', 'ngSanitize']).config(function ($locationProvider) {
  'use strict';
  $locationProvider.html5Mode(true);
});

blogApp.controller('blogControl', [
  '$scope',
  '$location',
  '$firebase',
  function blogControl($scope, $location, $firebase) {
    'use strict';

    var ref = new Firebase('https://tamartk.firebaseio.com/posts');
    var sync = $firebase(ref);
    var editMode = false;
    $scope.blogPosts = sync.$asArray();

    $scope.blogPosts.$loaded().then(function () {
      $scope.finishedLoading = true;
    });

    function getPost(postId) {
      if (postId !== undefined && postId !== '') {
        var post = $scope.blogPosts[postId];
        return post;
      }
    }

    $scope.isAPostActive = function () {
      var ret = ($scope.hasOwnProperty('activePost') && $scope.activePost !== undefined);
      return ret;
    };

    $scope.isAPostNew = function () {
      return $location.hash() === 'newpost';
    };

    $scope.isEditMode = function () {
      return editMode === true;
    };

    $scope.startEdit = function () {
      editMode = true;
      $scope.newpost = angular.copy($scope.activePost);
    };

    $scope.cancelEdit = function () {
      editMode = false;
      delete $scope.newpost;
    };

    $scope.addPost = function () {
      console.log('adding post');
      $scope.newpost.time = new Date().getTime();
      $scope.blogPosts.$add($scope.newpost);
      location.hash = '';
      editMode = false;
      delete $scope.newpost;
    };

    $scope.savePost = function () {
      editMode = false;
      // $scope.blogPosts.$remove($scope.activePost);
      $scope.activePost.title = $scope.newpost.title;
      $scope.activePost.content = $scope.newpost.content;
      $scope.activePost.author = $scope.newpost.author;
      $scope.blogPosts.$save($scope.activePost);
      delete $scope.newpost;
    };

    $scope.deleteActivePost = function () {
      $scope.blogPosts.$remove($scope.activePost).then(function () {
      }, function (error) {
        console.error(error);
      });
      location.hash = '';
    };

    $scope.$on('$locationChangeStart', function (event, nextLocation, currentLocation) {
      $scope.blogPosts.$loaded().then(function () {
        var hash = $location.hash();
        var post = getPost(hash);
        $scope.activePost = post;
      });
    });

    $scope.tinymceOptions = {
      theme: 'modern',
      plugins: [
        'advlist autolink lists link image charmap preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen',
        'insertdatetime nonbreaking save table contextmenu directionality',
        'template paste textcolor code'
      ],
      toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
      toolbar2: 'ltr rtl | preview | forecolor backcolor code',
      /*jscs: disable */
      image_advtab: true,
      /*jscs: enable */
      height: '400px',
      width: '850px',
      directionality: 'rtl'
    };
  }
]);
