var getpaidMobile=angular.module('getpaidMobile.translation',['pascalprecht.translate'], ['$translateProvider', function ($translateProvider) {
  // register german translation table
  $translateProvider.translations('de_DE', {
    'GREETING': 'Hallo Welt!',
		'My Settings' : 'vow vow'
  });
  // register english translation table
  $translateProvider.translations('en_EN', {
    'GREETING': 'Hello World!'
  });
  // which language to use?
  $translateProvider.use('de_DE');
 
}]);



