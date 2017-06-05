'use strict';

angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication',

  function (scope, $http, Authentication) {

    scope.search = function(zip) {
      $http({
          method: 'POST',
          url: '/search',
          data: { zip: zip }
    })
      .then(function successCallback(res) {
        scope.results = res.data;
        console.log(scope.results);
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

    scope.checkin = function(id) {
      //console.log(id);
      $http({
          method: 'POST',
          url: '/checkin',
          data: { id: id }
    }).then(function successCallback(id) {
      console.log(id);
    });
    };
    // This provides Authentication context.
    scope.authentication = Authentication;
  }
]);
