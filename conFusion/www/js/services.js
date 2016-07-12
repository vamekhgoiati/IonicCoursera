'use strict';

angular.module('conFusion.services', ['ngResource'])
  .constant("baseURL", "http://localhost:3000/")
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

  .service('feedbackFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    this.getFeedbacks = function () {
      return $resource(baseURL + "feedback/:id");
    }
  }])

  .factory('favouriteFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    var favFac = {};
    var favourites = [];

    favFac.addToFavourites = function (index) {
      for (var i = 0; i < favourites.length; i++) {
        if (favourites[i].id == index)
          return;
      }
      favourites.push({id: index});
    };

    favFac.deleteFromFavourites = function (index) {
      for (var i = 0; i < favourites.length; i++) {
        if (favourites[i].id == index) {
          favourites.splice(i, 1);
        }
      }
    };

    favFac.getFavourites = function () {
      return favourites;
    };

    return favFac;

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
  }]);
