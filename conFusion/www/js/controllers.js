angular.module('conFusion.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login & reserve modal
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    $scope.reservation = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);
      $localStorage.storeObject('userinfo',$scope.loginData);
      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };

    // Create the reserve modal that we will use later
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.reserveform = modal;
    });

    // Triggered in the reserve modal to close it
    $scope.closeReserve = function () {
      $scope.reserveform.hide();
    };

    // Open the reserve modal
    $scope.reserve = function () {
      $scope.reserveform.show();
    };

    // Perform the reserve action when the user submits the reserve form
    $scope.doReserve = function () {
      console.log('Doing reservation', $scope.reservation);

      // Simulate a reservation delay. Remove this and replace with your reservation
      // code if using a server system
      $timeout(function () {
        $scope.closeReserve();
      }, 1000);
    };
  })

  .controller('MenuController', ['$scope', 'menuFactory', 'favouriteFactory', 'baseURL', '$ionicListDelegate',
    function ($scope, menuFactory, favouriteFactory, baseURL, $ionicListDelegate) {

      $scope.baseURL = baseURL;
      $scope.tab = 1;
      $scope.filtText = '';
      $scope.showDetails = false;

      $scope.showMenu = false;
      $scope.message = "Loading...";

      menuFactory.query(
        function (response) {
          $scope.dishes = response;
          $scope.showMenu = true;
        },
        function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        });

      $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
          $scope.filtText = "appetizer";
        }
        else if (setTab === 3) {
          $scope.filtText = "mains";
        }
        else if (setTab === 4) {
          $scope.filtText = "dessert";
        }
        else {
          $scope.filtText = "";
        }
      };

      $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
      };

      $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
      };

      $scope.addFavourite = function (index) {
        console.log("index is " + index);
        favouriteFactory.addToFavourites(index);
        $ionicListDelegate.closeOptionButtons();
      }

    }])

  .controller('ContactController', ['$scope', function ($scope) {

    $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};

    var channels = [{value: "tel", label: "Tel."}, {value: "Email", label: "Email"}];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

  }])

  .controller('FeedbackController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

    $scope.message = "";
    $scope.showMessage = false;
    $scope.sendFeedback = function () {

      console.log($scope.feedback);

      if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
        $scope.invalidChannelSelection = true;
        console.log('incorrect');
      }
      else {
        feedbackFactory.getFeedbacks()
          .save($scope.feedback,
            function (response) {
              console.log("Feedback saved. " + response);
              $scope.invalidChannelSelection = false;
              $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};
              $scope.feedback.mychannel = "";
              $scope.feedbackForm.$setPristine();
            },
            function (response) {
              $scope.message = "Error saving feedback to server: " + response.status + " " + response.statusText;
              $scope.showMessage = true;
            }
          );
      }
    };
  }])

  .controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favouriteFactory', 'baseURL', '$ionicPopover', '$ionicModal',
    function ($scope, $stateParams, dish, menuFactory, favouriteFactory, baseURL, $ionicPopover, $ionicModal) {

      $scope.baseURL = baseURL;
      $scope.showDish = false;
      $scope.message = "Loading ...";

      $scope.dish = dish;

      $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
        scope: $scope
      }).then(function (popover) {
        $scope.popover = popover;
      });

      $scope.openPopover = function ($event) {
        console.log("Opening popover");
        $scope.popover.show($event);
      };

      $scope.closePopover = function () {
        $scope.popover.hide();
      };

      $scope.addToFavourites = function (index) {
        favouriteFactory.addToFavourites(index);
        $scope.closePopover();
      };

      $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.commentModal = modal;
      });

      $scope.openAddCommentModal = function () {
        $scope.closePopover();
        $scope.commentModal.show();
      };

      $scope.closeAddCommentModal = function () {
        $scope.commentModal.hide();
      };

    }])

  .controller('DishCommentController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

    $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};

    $scope.submitComment = function () {

      $scope.mycomment.date = new Date().toISOString();
      console.log($scope.mycomment);

      $scope.dish.comments.push($scope.mycomment);
      menuFactory.update({id: $scope.dish.id}, $scope.dish);

      $scope.addCommentForm.$setPristine();

      $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};
      $scope.closeAddCommentModal();
    }
  }])

  // implement the IndexController and About Controller here

  .controller('IndexController', ['$scope', 'menuFactory', 'promotionFactory', 'corporateFactory', 'baseURL', function ($scope, menuFactory, promotionFactory, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leader = corporateFactory.get({
      id: 3
    });

    $scope.showDish = false;
    $scope.message = "Loading ...";

    $scope.dish = menuFactory.get({
      id: 0
    })
      .$promise.then(
        function (response) {
          $scope.dish = response;
          $scope.showDish = true;
        },
        function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        }
      );

    $scope.promotion = promotionFactory.get({
      id: 0
    });

  }])
  .controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', function ($scope, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.showLeaders = false;
    $scope.message = "Loading ...";
    corporateFactory.getLeaders().query(
      function (response) {
        $scope.leaders = response;
        $scope.showLeaders = true;
      },
      function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      }
    );
  }])
  .controller('FavouritesController', ['$scope', 'dishes', 'favourites', 'favouriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout',
    function ($scope, dishes, favorites, favouriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {

      $scope.baseURL = baseURL;
      $scope.shouldShowDelete = false;

      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Loading...'
      });

      $scope.favourites = favorites;

      $scope.dishes = dishes;

      console.log($scope.dishes, $scope.favourites);

      $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
      };

      $scope.deleteFavourite = function (index) {

        var confirmPopup = $ionicPopup.confirm({
          title: 'Confirm Delete',
          template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (res) {
          if (res) {
            console.log('Ok to delete');
            favouriteFactory.deleteFromFavourites(index);
          } else {
            console.log('Canceled delete');
          }
        });

        $scope.shouldShowDelete = false;

      }
    }])
  .filter('favouriteFilter', function () {
    return function (dishes, favourites) {
      var out = [];
      for (var i = 0; i < favourites.length; i++) {
        for (var j = 0; j < dishes.length; j++) {
          if (dishes[j].id === favourites[i].id)
            out.push(dishes[j]);
        }
      }
      return out;

    }
  });
