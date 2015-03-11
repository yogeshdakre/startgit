// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

//var getpaidMobile=angular.module('getpaidMobile.translation',['pascalprecht.translate']);

 


var getpaidMobile=angular.module('getpaidMobile', ['ionic', 'ngCookies', 'pascalprecht.translate','getpaidMobile.controllers','getpaidMobile.services','firebase']);

getpaidMobile.run(['$ionicPlatform','$rootScope', '$ionicLoading','sgClientStorageService','defaultLangId','appId','$translate','$ionicModal','$state','$timeout','userService','$http','$ionicPopup','showAlertMessageService',function($ionicPlatform,$rootScope, $ionicLoading,sgClientStorageService,defaultLangId,appId,$translate,$ionicModal,$state,$timeout,userService,$http,$ionicPopup,showAlertMessageService) {
  
  sgClientStorageService.init(appId);
  if(sgClientStorageService.getItem("currentLanguage")===undefined || sgClientStorageService.getItem("currentLanguage")===null){
	  sgClientStorageService.setItem("currentLanguage",defaultLangId);
	}
	else{
      $translate.use(sgClientStorageService.getItem("currentLanguage"));
	}
  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({template: 'Loading...'})
  })

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide()
  })
  
  	  // Create the login modal that we will use later
	  $ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $rootScope
	  }).then(function(modal) {
		$rootScope.modal = modal;
	  });
  

  
  $rootScope.$on('loadLoginPage', function() {
  

	$rootScope.loginChallange();

  })

 $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState, fromStateParams) {
	 //$rootScope.show();
    console.log("Changing state to :");
    console.log(toState);
    console.log("routeChangeStart");
    var checkStorageData=sgClientStorageService.getItem("loggedIn");
    if(toState.data.needLoggedIn===true)
		{
          sgClientStorageService.setItem("toState",toState.name);
		}
	var loggedin= (checkStorageData===true);

    if(toState.name==="app.logout"){
//		 $rootScope.$broadcast('loadLogoutPage',{});
//		 console.log("broadcast logout");
		sgClientStorageService.removeItem("loggedIn");
 		sgClientStorageService.removeItem("toState");
     } 
   else if( (toState.data.needLoggedIn===true && !loggedin)){
		//if(!(toState.name==='app.login' && loggedin ) ){
		 event.preventDefault();
        // $state.go("app.home");
		 $rootScope.$broadcast('loadLoginPage',{});
		 console.log("direct to show login");
     } 
})

$rootScope.$on('$stateChangeSuccess', function(current, previous) {
	//$rootScope.hide();
	//$rootScope.show();
    console.log("routeChangeSuccess");
    //console.dir(current);
    //console.dir(previous);
})

// View Loading Event
$rootScope.$on('$viewContentLoading', function (event, viewConfig) {
	console.log("[$viewContentLoading] View Loading...");
})

$rootScope.$on('$ionicView.loaded',function(event){
  console.log('$viewContentLoaded - fired after dom rendered',event);
  //$rootScope.show();
})
$rootScope.$on('$routeUpdate', function(rootScope) {
    console.log("routeUpdate", rootScope);
})


	// Triggered in the login modal to close it
	  $rootScope.closeLogin = function(fromPage){
												   //hide keeps the previous data so using remove	 
	  											   $rootScope.modal.remove();
													if(!fromPage)
														$state.go("app.search");
  												};

  												
	  // Open the login modal
	  $rootScope.loginChallange = function() {
		  
		  var serverURL=sgClientStorageService.getItem("serverURL");
			  if(serverURL===null){
				  showAlertMessageService.displayMessage('Please setup Server URL first','Information');
			  }else
			  {
				  //if we use remove it ask to create new instance to show
				  //so creating modal everytime
				  //if($rootScope.modal===undefined){
					  $ionicModal.fromTemplateUrl('templates/login.html', {
						  scope: $rootScope
					  }).then(function(modal) {
						  $rootScope.modal = modal;
						  $rootScope.modal.show();
					  });
				  /*}
				  else{
					  $rootScope.modal.show();
				  }*/

			  }
		  
			};

	  // Perform the login action when the user submits the login form
	  $rootScope.doLogin = function(loginData) {
		console.log('Doing login', loginData);
		
		// Simulate a login delay. Remove this and replace with your login
		var serverUrl=sgClientStorageService.getItem("serverURL");
		//userService.login(loginData);
		  $http.post(serverUrl+'/api/auth/login', {loginName: loginData.username, password: loginData.password}).
			success(function(data, status, headers, config) {
        
             // $cookieStore.remove("i18next");// the reason to remove this cookie is to make sure shell use the one coming from config.json
              document.cookie = headers().cookie;
             // userService.setUserData(data);
              //window.location.reload();
              sgClientStorageService.setItem("loggedIn",true);
              userService.setUserData(data);
              $rootScope.closeLogin(false); 
              
			}).
			error(function(data, status, headers, config) {
				 $ionicLoading.hide()
				sgClientStorageService.removeItem("loggedIn");
				 showAlertMessageService.displayMessage(data.error,'error');
			});
		// code if using a login system
		  
	  };



$rootScope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  }

$rootScope.hide = function(){
    $ionicLoading.hide();
  }

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}]);

getpaidMobile.value('customersUrl', 'https://kyd.firebaseio.com/disputes');
getpaidMobile.value('urlOrder', 'https://kyd.firebaseio.com/orderEntry');
getpaidMobile.value('getpaidOrderUrl', 'http://localhost:8189/myrestweb/orders');
getpaidMobile.value('appId', 'getpaidMobile');
getpaidMobile.value('defaultLangId', 'en');

getpaidMobile.config(function ($translateProvider) {

//  $translateProvider.useUrlLoader('http://localhost:8080/getpaid-mobile-rest/api/i18n');
 // $translateProvider.preferredLanguage('en');
    var languages=getTranslations();
	for(i=0;i<languages.length;i++){
		angular.forEach(languages[i], function(value, key) {
		  //this.push(key + ': ' + value);
			console.log("we support languages"+key);
			$translateProvider.translations(key, value);
		});
	}
	$translateProvider.preferredLanguage("en");

});


getpaidMobile.config(function($stateProvider, $urlRouterProvider,$httpProvider) {

 $httpProvider.interceptors.push(function($rootScope,$q) {
    return {
      request: function(config) {
        $rootScope.$broadcast('loading:show')
        return config
      },
      response: function(response) {
        $rootScope.$broadcast('loading:hide')
        return response
      },
       responseError: function(rejection) {
    	    $rootScope.$broadcast('loading:hide')  
    	    if(rejection.status===401 && rejection.data.action === "loginChanllange") 
    	    	{
    	    	
    	    	var alertPopup=showAlertMessageService.displayMessage('You need to login fist!!','Information');
				  	alertPopup.then(function(res) {
					  		$rootScope.loginChanllange();
					   });
    	    			   
    	    	}
            return $q.reject(rejection);
        }
      
    }
  });

 $stateProvider

	 .state('app', {
	    url: "/app",
	    abstract: true,
		data:{needLoggedIn: false}, 
	    templateUrl: "templates/menu.html",
	    controller: 'MenuController'
	  })
	
	  .state('app.home', {
	    url: "/home",
		data:{needLoggedIn: false},
		    views: {
	      'menuContent': {
			    templateUrl: "templates/home.html"
				}
			}
	  })
	  .state('app.login', {
	    url: "/login",
		data:{needLoggedIn: false},
	    views: {
	      'menuContent': {
	        templateUrl: "templates/blank.html"
	      }
	    }
	  })
	  .state('app.search', {
	    url: "/search",
		data:{needLoggedIn: true},
	    views: {
	      'menuContent': {
	        templateUrl: "templates/search.html",
	        controller: 'MainController'
	      }
	    }
	  })
	
	  .state('app.settings', {
	    url: "/settings",
		data:{needLoggedIn: false},
	    views: {
	      'menuContent': {
	        templateUrl: "templates/settings.html"
	      }
	    }
	  })
	    .state('app.notification', {
	      url: "/notification",
	      data:{needLoggedIn: true},
	      views: {
	        'menuContent': {
	          templateUrl: "templates/playlists.html",
	          controller: 'PlaylistsCtrl'
	        }
	      }
	    })
	
	  .state('app.logout', {
	    url: "/logout",
		data:{needLoggedIn: true},
		abstract: true   
	  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});


//@TODO REMOVE THIS 
getpaidMobile.service('messageActionService', [function() {
                             
	                     var currentMessage=[];
	                     
	                     return{
	                       setApplicationMessages:function(type,data){
	                    	   var message={};
	                    	   message.type=type;
	                    	   message.data=data;
	                    	   
	                    	   currentMessage.push(message);	                    	   
	                       },	                       
	                       getApplicationMessages:function(){
	                    	   return currentMessage;
	                       },
	                       
	                       clearApplicationMessages:function(){
	                    	   currentMessage=[];
	                       }
	
                          };
						}
                      ]);










