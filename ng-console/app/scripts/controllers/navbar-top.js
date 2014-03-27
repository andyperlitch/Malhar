'use strict';

angular.module('ngConsoleApp')
  .controller('NavbarTopCtrl', function ($scope) {
    $scope.showLicenseInfo = function() {
        console.log('showLicenseInfo');
    }
    $scope.info_dropdown = [
      { header: true, text: 'cluster info' },
      // <a href="#" class="displayLicenseInfo">License Info</a>
      { click: 'showLicenseInfo()', text: 'License Info' },
      // <a href="#" class="displayGatewayInfo">Gateway Info</a>
      // <a href="#" class="displayConsoleInfo">Console Info</a>
      { divider: true },
      { header: true, text: 'docs & help' },
      // <a target="_blank" href="https://www.datatorrent.com/documentation.php">Guides</a>
      // <a target="_blank" href="https://www.datatorrent.com/docs/apidocs/">API Docs</a>
      // <a target="_blank" href="https://www.datatorrent.com/contactus.php">Contact DataTorrent</a>
      // <a href="https://github.com/DataTorrent/Malhar" target="_blank">Malhar Repository</a>
    ];
  });
