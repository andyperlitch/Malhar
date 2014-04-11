module.exports = function() {
  return {
    basePath: '../',
    frameworks: ['mocha','sinon-chai'],
    reporters: ['dot', 'coverage'],
    browsers: ['Chrome'],
    autoWatch: true,
    // plugins: ['karma-chrome-launcher','karma-mocha','karma-coverage'],
    reporters: ['dots', 'coverage'],

    // tell karma how you want the coverage results
    coverageReporter: {
      type : 'html',
      // where to store the report
      dir : 'coverage/'
    },

    // these are default values anyway
    singleRun: false,
    colors: true,
    
    files : [
      //3rd Party Code
      'app/bower_components/angular/angular.js',
      'app/bower_components/jquery/jquery.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/underscore/underscore.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/bower_components/jquery-ui/ui/jquery-ui.js',
      'app/bower_components/angular-ui-sortable/src/sortable.js',
      'app/bower_components/angular-ui-dashboard/dist/angular-ui-dashboard.js',
      'app/bower_components/bootstrap/dist/js/bootstrap.js',
      'app/bower_components/angular-strap/dist/angular-strap.min.js',
      'app/bower_components/angular-strap/dist/angular-strap.tpl.min.js',
      'app/bower_components/angular-animate/angular-animate.js',
      'app/bower_components/ng-breadcrumbs/dist/ng-breadcrumbs.min.js',

      //App-specific Code
      'app/scripts/**/*.js',



      //Test-Specific Code
      'node_modules/chai/chai.js',
      'node_modules/sinon/pkg/sinon.js',
      'test/lib/chai-should.js',
      'test/lib/chai-expect.js'
    ]
  }
};
