    var getpaidMobile=angular.module('getpaidMobile.controllers',['ngCookies']);

    getpaidMobile.controller('MenuController', function($scope,$ionicPopup,$ionicLoading,$ionicModal, $timeout,$rootScope,$translate,sgClientStorageService,$state,$http,userService,$cookieStore,$ionicViewService,showAlertMessageService) {
         $scope.loginData = {};

     // Perform the login action when the user submits the login form
     $scope.login = function() {
         $rootScope.loginChallange();
        $scope.loginData={"username":"","password":""};
     };


     
     
        $scope.logout=function(){
            var serverURL=sgClientStorageService.getItem("serverURL");  
              $http.post(serverURL+'/api/auth/logout', {loginName: sgClientStorageService.getItem("userName")}).
                success(function(data, status, headers, config) {
                  //userService.clearUserData();
                    sgClientStorageService.removeItem("loggedIn");
                    sgClientStorageService.removeItem("toState");
                    $cookieStore.remove("JSESSIONID");
                    $cookieStore.remove("XSRF-TOKEN");
                    $rootScope.modal=undefined;
                     showAlertMessageService.displayMessage('Successfully logout','Success');
                     $ionicViewService.clearHistory();
                     $state.go("app.home");
                }).
                error(function(data, status, headers, config) {
                });
             
        
            

        };
        $rootScope.$on("loadLogoutPage",function(event,data){
         console.log("do logout");
         $scope.logout();
    });

    });

    getpaidMobile.controller('PlaylistsCtrl', function($scope) {
      $scope.playlists = [
        { title: 'Reggae', id: 1 },
        { title: 'Chill', id: 2 },
        { title: 'Dubstep', id: 3 },
        { title: 'Indie', id: 4 },
        { title: 'Rap', id: 5 },
        { title: 'Cowbell', id: 6 }
      ];
    });

    getpaidMobile.controller('PlaylistCtrl', function($scope, $stateParams) {
    });
    

    getpaidMobile.controller('MainController', function($rootScope,$ionicLoading, $scope, messageActionService,urlOrder,getpaidOrderUrl,customersUrl,$firebase){
       $rootScope.show();
        //Initialization variables
        $scope.online=false;
        $scope.searchedCustomers=[];
        $scope.isFav=[];
        $scope.items=[];
        $scope.localItems=[];

    $scope.getApplicationMessages=function(){
        return messageActionService.getApplicationMessages();
    };
        //local storage variables

        var localFavoriteCustomer=window.localStorage.getItem("myFavoriteCustomersXXX");

        if (!(localFavoriteCustomer === 'undefined'||localFavoriteCustomer === null || localFavoriteCustomer.length === 0))
        {
            $scope.items = JSON.parse(window.localStorage.getItem("myFavoriteCustomersXXX"));
            //console.log($scope.items);

        }


        //firebase calls asynch so populate the data  
        var ref = new Firebase(customersUrl);
        $scope.searchedCustomers = $firebase(ref);
        $scope.searchedCustomers.$on('loaded', function() {

            var keys=$scope.searchedCustomers.$getIndex();
            keys.forEach(function(key, i) {

                $scope.isFav[i] = false;;
                var count=0;
                if( !($scope.items === undefined || $scope.items === null || $scope.items.length === 0) ){
                    $scope.items=eval($scope.items);
                    $scope.items.forEach(function (el) {if (el.customerNumber === $scope.searchedCustomers[key].customerNumber) ++count; });
                    if(count>0){
                        $scope.isFav[i]=true;
                        $scope.searchedCustomers[key].isfavorite=true;
                        $scope.searchedCustomers.firebaseKey=key;
                    }
                }

            });

        $rootScope.hide();
        });




        var scrollItems = [];

        for (var i=1; i<=100; i++) {
            scrollItems.push("Item " + i);
        }

        $scope.scrollItems = scrollItems;
        $scope.invoice = {payed: true};
        $scope.loggedin = {login: true,user:"Yogesh Dakre",logout:true};

        /////////////////////////////////////////Serach condition/////////////////////////////
        $scope.searchCondition = {condition:"Customer Name",searchValue:"",label:"Customer Name"};
         $scope.filter = "$";
    //    $scope.search = { 'customerName':''};
        $scope.currentCustomerToWorkOn = {};

        $scope.reasonCodes=[
            {"id":"CR","tag":"Credit Submitted"},
            {"id":"MAN","tag":"Manual Invoice"},
            {"id":"MISCWO","tag":"Miscellanous Write-off"},
            {"id":"NONAR","tag":"Non AR Receipt"},
            {"id":"STX","tag":"Sales Tax"},
            {"id":"TAXREF","tag":"Tax Refund"},
            {"id":"UCD","tag":"Unearned Cash Discount"}];

        $scope.favoriteCustomers =  [];
        $scope.currentInvoiceToworkon =  {"currentInvoice":""};
        $scope.currentInvoice = function(invoice){
            //console.log("abc"+invoice);      
            $scope.currentInvoiceToworkon.currentInvoice=invoice;
            //console.log("abc====="+JSON.stringify(invoice));
        };

    //coming out from local storage  
        if( !($scope.items === undefined || $scope.items === null || $scope.items.length === 0) )
        {
            $scope.favoriteCustomers=$scope.items;
            //console.log(" from local storate 1 "+$scope.items);
        }

      $scope.myDisputes =  [
                            {
                                disputeNumber: "D10001",
                                Customer_Name:"Honda Inc",
                                Customer_Number:"123",
                                Company_Name:"Honda corp",
                                invoiceNumber:"INV001",
                                disputedAmount:"4000",
                                poNumber:"PO1234",
                                groupNumber:"1234",
                                reasonCode:"XYZ",
                                referenceNumber:"e34343",
                                notes:"not satisfied"

                            },
                            {
                                disputeNumber: "D10002",
                                Customer_Name:"GM Inc",
                                Customer_Number:"123",
                                Company_Name:"GM corp",
                                Invoice_Number:"INV001",
                                disputedAmount:"4000",
                                poNumber:"PO1234",
                                groupNumber:"1234",
                                reasonCode:"XYZ",
                                referenceNumber:"e34343",
                                notes:"not satisfied"

                            }                        
                            
                            ];
      
      
      $scope.myDisputes.forEach(function(dispute){dispute.currentlyWorked=false;});
      
      $scope.workonDispute=function(dispute){
        dispute.currentlyWorked=true;  
      };
      
      $scope.saveDisputeDetails=function(dispute){
            dispute.currentlyWorked=false;  
          };
           
        $scope.reasonCodes=[
              {"id":"CR","tag":"Credit Submitted"},
              {"id":"MAN","tag":"Manual Invoice"},
              {"id":"MISCWO","tag":"Miscellanous Write-off"},
              {"id":"NONAR","tag":"Non AR Receipt"},
              {"id":"STX","tag":"Sales Tax"},
              {"id":"TAXREF","tag":"Tax Refund"},
              {"id":"UCD","tag":"Unearned Cash Discount"}];
        
        
        $scope.dpStatus=[
                          {"id":"1","tag":"Unidentified"},
                          {"id":"2","tag":"Identified"},
                        {"id":"3","tag":"Distributed"},
                        {"id":"4","tag":" Approved"},
                        {"id":"5","tag":"Credit"},
                        {"id":"5","tag":"Collectable"},
                        {"id":"5","tag":"Suspense"},
                        {"id":"5","tag":"Write-Off"},
                          ];    
        $scope.reasonCat=[
                          {"id":"AD","tag":"Accounting DEFAULT"},
                          {"id":"MTW","tag":"Marketing Transportation Warehouse"} 
                          ];
        
        $scope.reason=[
                          {"id":"1","tag":"Advertising Rebate"},
                          {"id":"2","tag":"Promotional Price Discrepency"},
                          {"id":"3","tag":"Quarter End Discounts"},
                          ];
        
        $scope.ownerCat=[
                          {"id":"1","tag":"Accounting"},
                          {"id":"2","tag":"Cash App Manager"},
                        {"id":"3","tag":"COLLECTION CLERK"},
                        {"id":"4","tag":" COLLECTION MANAGER"},
                        {"id":"5","tag":"CREDIT MANAGER"}
                          ];
     
        $scope.owner=[
                          {"id":"1","tag":"Andrew S"},
                          {"id":"2","tag":"Branden"}
                        
                      ]; 
        
        $scope.contact=[
                          {"id":"1","tag":"Alex"},
                          {"id":"2","tag":"Branden"}
                        
                      ];    
                      

        $scope.userAgent =  navigator.userAgent;
        $scope.chatUsers = [
            { name: "Yogesh Dakre", online: true },
            { name: "Getpaid Support", online: true },
            { name: "Amit Jain", online: true },
            { name: "Niraj Laud", online: true },
            { name: "Rahul Kumar", online: true }
        ];




        //////////////////////////////////////////////////function declarations////////////////////////////////////////

        $scope.login=function(user){
            $scope.loggedin = {login: true,user:"Yogesh Dakre",logout:false};
            location.href="#/search";
        };

        $scope.logout=function(){
            $scope.loggedin = {login: false,user:"Yogesh Dakre",logout:true};
            location.href="#/logout";
        };
    $scope.searchOptions=[{"value":"customerName","label":"Customer Name"},
                          {"value":"customerNumber","label":"Customer Number"},
                          {"value":"poNumber","label":"Po Number"},
                          {"value":"disputeNumber","label":"Dispute Number"},   
                          {"value":"contact","label":"Contact"}
                        ];
        $scope.myOption=$scope.searchOptions[0];
        $scope.changeSearchType = function(changeType){

               console.log($scope.myOption.label + " = " +changeType.value);

                $scope.searchCondition.label=changeType.label;
                $scope.searchCondition.condition=changeType.value;
    //          $scope.search = { 'customerName':''};
                $scope.filter = changeType.value;


        };

     $scope.changeSearchType($scope.myOption);

    $scope.clearSearch=function(){
     $scope.search = { 'customerName':''};
    };

    $scope.getLabel=function(search){
        var searchAvailabel=false;
        for(a=0;a<$scope.searchOptions.length;a++)
        {
             if($scope.searchOptions[a].value===search){
                 return $scope.searchOptions[a].label;
             }
        }

    };

    $scope.showSearchDone=function(search){
        var searchAvailabel=false;
        angular.forEach(search, function(value, key) {
          //this.push(key + ': ' + value);
            searchAvailabel=searchAvailabel|| value.length>0;
        });
        return searchAvailabel;
    };
        $scope.refreshData=function(){
    //        $scope.search = { 'customerName':''};
        };

        $scope.disputeCriteria={"invoicelevel":false,customerlevel:false};

        $scope.newDispute={};

        $scope.createDispute=function(invoicelevel,customerlevel,objectInAction)
        {
            var c = 1;
            this.uniqueNumber=function cuniq() {
                var d = new Date(),
                    m = d.getMilliseconds() + "",
                    u = ++d + m + (++c === 10000 ? (c = 1) : c);

                return u;
            };

            $scope.newDispute= {
                "disputeNumber":"d"+this.uniqueNumber(),
                "disputedAmount":"",
                "invoiceNumber":$scope.currentInvoiceToworkon.currentInvoice,
                "referenceNumber":"",
                "poNumber":"",
                "groupNumber":"",
                "reasonCode":"",
                "notes":"",
                "open": true
            };

            $scope.disputeCriteria.invoicelevel=invoicelevel;
            $scope.disputeCriteria.customerlevel=customerlevel;

            location.href="#/createDispute";
        };

        $scope.setCurrentCustomerToWorkOn=function(customer)
        {
            $scope.currentCustomerToWorkOn=customer;
            $scope.currentCustomerToWorkOn.isSet=true;
        };

        $scope.removeFromFavorite=function(favcustomer){
            var foundIndex=$scope.favoriteCustomers.indexOf(favcustomer);
            $scope.favoriteCustomers.splice(foundIndex,1);
        };

        $scope.createDisputeItem=function(currentCustomerToWorkOn){

            if($scope.disputeCriteria.invoicelevel){
                //https://kyd.firebaseio.com/disputes/0/invoicelist/0/transactions
                //console.log("New dispute at invoice level="+$scope.newDispute);           
            }else if($scope.disputeCriteria.customerlevel){
                var updatecustomerURL="https://kyd.firebaseio.com/disputes/"+ currentCustomerToWorkOn.$id+"/disputelist";
                var ref = new Firebase(updatecustomerURL);
                var data= $firebase(ref);
                data.$add($scope.newDispute);
                messageActionService.setApplicationMessages("Success","Dispute "+$scope.newDispute.disputeNumber + " create successfully!!!!!");
                console.log("item created");
            }

            //console.log($scope.newDispute);
        };

        $scope.link={"navigateto":"#/workingCustomer","navaigatefrom":"#/search"};

        $scope.remberNavigation = function(to,from){
            $scope.link.navigateto=to;
            $scope.link.navigatefrom=from;
        };

        $scope.callme = function(){
            location.href=$scope.link.navigateto;
        };
        $scope.returnToCaller = function(){
            location.href=$scope.link.navigatefrom;
            $scope.getMessageType();
            $scope.getMessageData();
        };

        $scope.addtofavorite = function(customer){
            //$scope.isFav[index]=!$scope.isFav[index];
            //alert($scope.isFav);
            //console.log(1313);
            customer.isfavorite=!customer.isfavorite;
            if($scope.favoriteCustomers.length>=10){
                $scope.favoriteCustomers.splice(0,1);

            }
            var favcustomer=customer;
            //if(favcustomer)
            //$scope.favoriteCustomers.push(favcustomer);

            // Description:  Return the number of elements in the list or optionally the number of elements which are equal to the object given
            this.Count = function (favcustomer) {
                if (!favcustomer) return $scope.favoriteCustomers.length;
                else {
                    var count = 0;
                    $scope.favoriteCustomers.forEach(function (el) { if (el.customerNumber === favcustomer.customerNumber) ++count; });
                    return count;
                }
            };

            if(this.Count(favcustomer)==0)
            {
                $scope.favoriteCustomers.push(favcustomer);
                window.localStorage.removeItem("myFavoriteCustomersXXX");
            }

            this.setCurrentCustomerToWorkOn(customer);

            //alert($scope.isFav[index]);
            if(!customer.isfavorite){
                $scope.removeFromFavorite(favcustomer);
                window.localStorage.removeItem("myFavoriteCustomersXXX");
            }
            window.localStorage.setItem("myFavoriteCustomersXXX",JSON.stringify($scope.favoriteCustomers));
        };
        $scope.message={'displayMessage':false,'data':'','type':''};
        
        $scope.getMessageType=function(){
            if(messageActionService.getApplicationMessages().length>0){         
                 $scope.message.displayMessage=true;
                 $scope.message.type=messageActionService.getApplicationMessages()[0].type;
            }
        };
        $scope.getMessageData=function(){
            if(messageActionService.getApplicationMessages().length>0){         
                $scope.message.data=messageActionService.getApplicationMessages()[0].data;
                $scope.message.displayMessage=true;
            }
        };
        $scope.closeMessage=function(){
            $scope.message.displayMessage=false;
            messageActionService.clearApplicationMessages();
        };

     $scope.$on('$viewContentLoaded', function(){
        //Here your view content is fully loaded !!
         console.log("$viewContentLoaded");
      });


    });

    getpaidMobile.controller('GetpaidAppController', ['$scope','$state','sgClientStorageService','appId','$translate','defaultLangId','showAlertMessageService', function($scope,$state,sgClientStorageService,appId,$translate,defaultLangId,showAlertMessageService) {

      $scope.languageOptions=getLanguageOptions();
      $scope.selectedLanguage=$scope.languageOptions[0];
        
      for(i=0;i<$scope.languageOptions.length;i++)
        {
           if($scope.languageOptions[i].value === sgClientStorageService.getItem("currentLanguage")){
                  $scope.selectedLanguage=$scope.languageOptions[i];
           }
        }

      
      $scope.isLogInNeeded=function(stateName){
         // sgClientStorageService.setItem(stateName,{'loginReqd':$state.get(stateName).data.needLoggedIn});
         if(sgClientStorageService.getItem("loggedIn")===true)
          {
             return $state.get(stateName).data.needLoggedIn ;
          }else{
               if($state.get(stateName)!== null) 
                   return !$state.get(stateName).data.needLoggedIn ;
               else
                   return false;
          }
      };

      $scope.changeLanguage=function(lang){
        $translate.use(lang.value);
        sgClientStorageService.setItem("currentLanguage",lang.value);
      };

      $scope.saveServerURL=function(settings){
        sgClientStorageService.setItem("serverURL",settings.url);
        showAlertMessageService.displayMessage('Server URL saved','Information');

      };





    }]);


