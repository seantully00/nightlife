'use strict';

angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication', '$localStorage', '$state', '$rootScope', '$stateParams',

  function ($scope, $http, Authentication, $localStorage, $state, $rootScope, $stateParams) {

    $scope.search = function(zip) {
      $localStorage.zip = zip;
      $http({
          method: 'POST',
          url: '/search',
          data: { zip: zip }
    })
      .then(function successCallback(res) {
        $scope.results = res.data;
        console.log($scope.results);
        //console.log(res.data);
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(res) {
        console.log(res);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      }).catch(function() {
         console.log('Promise Rejected');
    });
    };

    if ($localStorage.zip) {
      $scope.zip = $localStorage.zip;
      if ($localStorage.loggedin) {
        $localStorage.loggedin = false;
        $scope.search($localStorage.zip);
      }
    }

    $scope.checkin = function(id) {
      //console.log(id);
      $http({
          method: 'POST',
          url: '/checkin',
          data: { id: id }
    }).then(function successCallback(response) {
      $scope.authentication.user = response.data;
      console.log(response.data);
    });
    };

    $scope.checkout = function(id) {
      //console.log(id);
      $http({
          method: 'POST',
          url: '/checkout',
          data: { id: id }
    }).then(function successCallback(response) {
      $scope.authentication.user = response.data;
      console.log(response.data);
    });
    };
    // This provides Authentication context.
    $scope.authentication = Authentication;
    console.log($scope.authentication);
  }
]);
