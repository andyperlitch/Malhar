DataTorrent Console (Angular)
=============================

Open-source, web-based user interface for use with [DataTorrent](http://datatorrent.com), a stream-processing platform for developing real-time, big data applications in Hadoop.
Built with Angular.


## Setting up dev environment

### Installing Current Dependencies
Uses the `bower.json` and `package.json` files:

    npm install .
    bower install .

### Spin up dev server
Use the `serve` grunt task:

    grunt serve



## Working with Dependencies

### Installing a bower package
To use a package from bower, first run the bower install command:

    bower install PACKAGE_NAME[#VERSION_TAG] [--save]

Then, use grunt to automatically inject this package into index.html:

    grunt bower-install

### Updating packages

    bower update [PACKAGE_NAME]

### Uninstalling a package

    bower uninstall [PACKAGE_NAME] --save



## Creating custom components
One of the goals of this project is to use as many open-source components as possible, however the need for some custom components may be unavoidable at times. Even then, it may be prudent to publish a custom component to bower separately and then use it as a dependency in this project. Barring that, the easiest way to create custom components is via the yeoman-angular generator. This requires the `yo` executable, installed by running the following (may need to run as root):

    npm install yo -g

To install the yeoman-angular generator, run:

    npm install -g generator-angular

### Directives
To create a custom directive, run:

    yo angular:directive DIRECTIVE-NAME

By convention, names should be all lower-case with dashes, eg. ng-navbar. This will place a new file into `/app/scripts/directives/` and will also add the appropriate script to `/app/index.html`.
