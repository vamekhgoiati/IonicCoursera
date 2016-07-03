angular.module('conFusion.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

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

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })

  .controller('MenuController', ['$scope', 'menuFactory', 'baseURL', function ($scope, menuFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;

    $scope.showMenu = false;
    $scope.message = "Loading...";

    menuFactory.getDishes().query(
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

  .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', 'baseURL', function ($scope, $stateParams, menuFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.showDish = false;
    $scope.message = "Loading ...";

    menuFactory.getDishes().get({id: parseInt($stateParams.id, 10)})
      .$promise.then(
      function (response) {
        $scope.dish = response;
        $scope.showDish = true;
      },
      function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      }
    );
  }])

  .controller('DishCommentController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

    $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};

    $scope.submitComment = function () {

      $scope.mycomment.date = new Date().toISOString();
      console.log($scope.mycomment);

      $scope.dish.comments.push($scope.mycomment);
      menuFactory.getDishes().update({id: $scope.dish.id}, $scope.dish)

      $scope.commentForm.$setPristine();

      $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};
    }
  }])

  // implement the IndexController and About Controller here

  .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'baseURL', function ($scope, menuFactory, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.showDish = false;
    $scope.message = "Loading ...";

    menuFactory.getDishes().get({id: 0})
      .$promise.then(
      function (response) {
        $scope.dish = response;
        $scope.showDish = true;
      },
      function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      }
    );

    $scope.showPromotion = false;
    $scope.promotionMessage = "Loading ...";
    menuFactory.getPromotion().get({id: 0})
      .$promise.then(
      function (response) {
        $scope.promotion = response;
        $scope.showPromotion = true;
      },
      function (response) {
        $scope.promotionMessage = "Error: " + response.status + " " + response.statusText;
      }
    );

    $scope.showChief = false;
    $scope.chiefMessage = "Loading ...";
    corporateFactory.getLeaders().get({id: 3})
      .$promise.then(
      function (response) {
        $scope.leader = response;
        $scope.showChief = true;
      },
      function (response) {
        $scope.chiefMessage = "Error: " + response.status + " " + response.statusText;
      }
    );
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
  }]);
