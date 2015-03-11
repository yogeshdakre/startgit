var getpaidMobile=angular.module('getpaidMobile.services',[]);

getpaidMobile.provider('sgUserContextService', function () {
        var self = this;

        self.$get = [function () {
            var serv = {};

            var userInContext;

            serv.context = function (user) {
                if (arguments.length === 1) {
                    userInContext = user;
                } else {
                    var clonedUser = angular.copy(userInContext);
                    return clonedUser;
                }
            };
            return serv;
        }];
    });



getpaidMobile.provider('sgClientStorageService', function () {
        var self = this;

        self.$get = ['$window', 'sgUserContextService', function ($window, sgUserContextService) {
            var service = {},
                separator = '_',
                inited = false,
                appId;

            service.init = function (id) {
                appId = id;
                inited = true;
            };

            function createStorageKey(key) {
                var userKey = sgUserContextService.context() ? sgUserContextService.context().userId : null;
                if (appId) {
                    if (userKey) {
                        return appId + separator + userKey + separator + key;
                    } else {
                        return appId + separator + key;
                    }

                } else {
                    if (userKey) {
                        return userKey + separator + key;
                    } else {
                        return key;
                    }

                }
            }

            /**
             * method to persist data in client storage
             * @param {String} key    key
             * @param {Object} val    Object to be stored in client storage
             * @param {Object|String} opts Optional additional attributes like scope (app or user) and storageType (session or default) | storageType
             */
            service.setItem = function (key, val, opts) {
                if (!inited) {
                    throw new Error('Service not initialized with appId');
                }
                var storageKey = createStorageKey(key);
                if ($window.sessionStorage && $window.localStorage) {
                    if (opts && (opts === 'session' || opts.storageType === 'session')) {//options present, work with it
                        $window.sessionStorage.setItem(storageKey, angular.toJson(val));
                    } else { //Add to localStorage
                        $window.localStorage.setItem(storageKey, angular.toJson(val));
                    }
                } else {
                    throw new Error('localStorage/sessionStorage not supported by browser');
                }
            };

            /**
             * Method to get item from Client Storage
             * @param  {String} key   Key
             * @return {Object}       Object stored in Client storage
             */
            service.getItem = function (key) {
                if (!inited) {
                    throw new Error('Service not initialized with appId');
                }
                if ($window.sessionStorage && $window.localStorage) {
                    var storageKey = createStorageKey(key);
                    return angular.fromJson($window.localStorage.getItem(storageKey)) || angular.fromJson($window.sessionStorage.getItem(storageKey));
                } else {
                    throw new Error('localStorage/sessionStorage not supported by browser');
                }
            };

            /**
             * Method to remove item from Client Storage
             * @param  {String} key   Key of the item to be removed
             */
            service.removeItem = function (key) {
                if (!inited) {
                    throw new Error('Service not initialized with appId');
                }
                if ($window.sessionStorage && $window.localStorage) {
                    var storageKey = createStorageKey(key);
                    $window.localStorage.removeItem(storageKey);
                    $window.sessionStorage.removeItem(storageKey);
                } else {
                    throw new Error('localStorage/sessionStorage not supported by browser');
                }
            };

            return service;
        }];
    });


getpaidMobile.service('sgPubSubService', ['$q', function ($q) {
        var listeners = {};
        var count = 0;

        function addListener(topic, callback, sticky) {
            var id = count++;
            if (!callback || !topic) { return; }
            listeners[topic] = (listeners[topic] || {});
            listeners[topic]._sticky = sticky || listeners[topic]._sticky;
            listeners[topic][id] = callback;

            if (sticky && listeners[topic]._lastPayload !== undefined) {
                // invoke callback immediately with the last payload
                callback.call(listeners[topic]._lastPayload, listeners[topic]._lastPayload, topic);
            }
            var ret = function () {
                //handle allows removing the listener
                if (listeners[topic] && listeners[topic][id]) {
                    delete listeners[topic][id];
                }
            };
            // add properties to function to allow inspecting the topic it is attached to.
            ret.topic = topic;
            ret.id = id;
            return ret;
        }

        /**
         * @name publish
         * @description Publish to a topic
         * @param [topic, payload] Passing the topic information and payload information.
         */
        this.publish = function (topic, payload) {
            var deferred = $q.defer(),
                retPromises = [],
                allPromise;

            var l = listeners[topic] || {};
            if (l._sticky) {
                l._lastPayload = payload;
            }
            for (var i in l) {
                if (i.indexOf('_') !== 0) {
                    // Wrap every returned value into a promise. Non-promise return values will be resolved
                    // immediately.
                    retPromises.push($q.when(l[i].call(payload, payload, topic)));
                }
            }

            allPromise = $q.all(retPromises).then(function(retVals) {
                if (_.contains(retVals, false)) {
                    deferred.reject();
                } else {
                    deferred.resolve();
                }
            }, function () {
                deferred.reject();
            });

            return deferred.promise;
        };

        /**
         * @name subscribe
         * @description Subscribe to a topic
         * @param [topic, callback, sticky]
         * @memberOf sungard.event
         * @returns Adds the listener and passes the handle.
         */
        this.subscribe = function (topic, callback, sticky) {
            return addListener(topic, callback, sticky);
        };

        /**
         * @name unsubscribe
         * @description Unsubscribe to a topic
         * @param [handle] Passing the handle to find out the topic information from the handle.
         * @memberOf sungard.event
         */
        this.unsubscribe = function (handle) {
            if (typeof(handle) === 'function') {
                handle();
            } else if (listeners[handle.topic] && listeners[handle.topic][handle.id]) {
                delete listeners[handle.topic][handle.id];
            }
        };
    }]);



getpaidMobile.service('showAlertMessageService',["$ionicPopup", function($ionicPopup) {
	//let the caller handle the what needs to be done when alert done
	this.displayMessage=function(data,title){
	   var alertPopup = $ionicPopup.alert({
		     title: title,
		     template: data
		   });
		 return alertPopup;
	 }
}]);


getpaidMobile.service('userService',["sgClientStorageService","$http","$q", function(sgClientStorageService,$http,$q) {
 
		
	 this.setUserData = function(data){
            //sgClientStorageService.init("courier");
            sgClientStorageService.setItem('userData', data);

        },
     this.getUserData = function(){
             
            return sgClientStorageService.getItem('userData');

        },
     this.clearUserData = function(){
            sgClientStorageService.removeItem('userData');

        }
   
     this.getCurrentCustomer = function(){
    	//request is from admin probably 
        if(sgClientStorageService.getItem('userData').currentCustomer){
                return sgClientStorageService.getItem('userData').currentCustomer;
        }else{
                //we treat the first one as currentCustomer
            return sgClientStorageService.getItem('userData').customers[0];
        }
        
        
     }
     this.getCurrentCurrency = function(){
        if(sgClientStorageService.getItem('userData').currentCurrency){
                return sgClientStorageService.getItem('userData').currentCurrency;
        }else{
                //we treat the first one as currentCustomer
            //return sgClientStorageService.getItem('userData').customers[0];
            return null;
        }
        
        
     }

     this.setCurrentCustomer = function(custNo,custName){
     	var userData = sgClientStorageService.getItem('userData');
        userData.currentCustomer = {"custNo":custNo,"company":custName};
        sgClientStorageService.setItem('userData',userData);
        
     }
     this.getCustomerLabel = function(){
         return sgClientStorageService.getItem('userData').customers[0].company + " ( " + sgClientStorageService.getItem('userData').customers[0].custNo + " ) ";
     }
     
     this.getCustNo = function() {
    	 return sgClientStorageService.getItem('userData').customers[0].custNo;
     }

     this.getRoles = function() {
        return sgClientStorageService.getItem('userData').roles;
    }
     this.havePrivilege = function(privilege){
         var roles = this.getRoles();
         if(jQuery.inArray( privilege, roles )>=0){
            return  true;
         }else{
             return false;
         }
     }
     this.getUserFullName = function() {
    	 return sgClientStorageService.getItem('userData').fullName;
     }

}]);