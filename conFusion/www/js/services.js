'use strict';

angular.module('conFusion.services', ['ngResource'])
  .constant("baseURL", "http://10.131.33.141:3000/")
  .factory('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    return $resource(baseURL + "dishes/:id", null, {
      'update': {
        method: 'PUT'
      }
    });
  }])

  .factory('promotionFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    return $resource(baseURL + "promotions/:id");
  }])

  .factory('corporateFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    return $resource(baseURL + "leadership/:id");
  }])

  .factory('feedbackFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    return $resource(baseURL + "feedback/:id");
  }])

  .factory('$localStorage', ['$window', function ($window) {
    return {
      store: function (key, value) {
        $window.localStorage[key] = value;
      },
      get: function (key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      storeObject: function (key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function (key, defaultValue) {
        return JSON.parse($window.localStorage[key] || defaultValue);
      }
    }
  }])

  .factory('favouriteFactory', ['$resource', '$localStorage', 'baseURL', function ($resource, $localStorage, baseURL) {
    var favourites = $localStorage.getObject('favourites', '[]');

    return {
      addToFavourites: function (index) {
        for (var i = 0; i < favourites.length; i++) {
          if (favourites[i].id == index)
            return;
        }
        favourites.push({id: index});
        $localStorage.storeObject('favourites', favourites);
      },
      deleteFromFavourites: function (index) {
        for (var i = 0; i < favourites.length; i++) {
          if (favourites[i].id == index) {
            favourites.splice(i, 1);
          }
        }
        $localStorage.storeObject('favourites', favourites);
      },
      getFavourites: function () {
        return favourites;
      }
    };
  }]);
