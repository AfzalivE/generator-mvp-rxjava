'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

/**
 * Functionally the same as directory however applies templating if file name begins with an underscore (_).
 *
 * @param source
 * @param destination
 */
function templateDirectory(source, destination) {
  var root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
  var files = this.expandFiles('**', {
    dot: true,
    cwd: root
  });

  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    var src = path.join(root, f);
    if (path.basename(f).indexOf('_') == 0) {
      var dest = path.join(destination, path.dirname(f), path.basename(f).replace(/^_/, ''));
      this.template(src, dest);
    } else {
      var dest = path.join(destination, f);
      this.copy(src, dest);
    }
  }
}

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
    this.templateDirectory = templateDirectory.bind(this);
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.yellow('MVVM') + ' generator for Android!'
    ));

    var prompts = [{
        name: 'name',
        message: 'What are you calling your app?',
        store: true,
        default: this.appname // Default to current folder name
      },
      {
        name: 'package',
        message: 'What package will you be publishing the app under?',
        store: true
      },
      {
        name: 'targetSdk',
        message: 'What Android SDK will you be targeting?',
        store: true,
        default: 28 // Android 9.0 (Oreo)
      },
      {
        name: 'minSdk',
        message: 'What is the minimum Android SDK you wish to support?',
        store: true,
        default: 19 // Android 4.4 (Kitkat)
      },
      {
        name: 'useCI',
        message: 'Add .yml configs and Android license files for Gitlab and CircleCI',
        store: true,
        default: true
      }
    ];

    this.log("Here is a little schema of the MVP Clean Architecture:");
    this.log("                                        " + chalk.yellow("SQLite"));
    this.log("+---------------------------+     +--------------------------+       +-----------------------------------------------+");
    this.log("|                           |     |                          |       |        " + chalk.yellow("Fragment") + "                               |");
    this.log("|     " + chalk.blue("Remote Data Source") + "    |     |     " + chalk.green("Local Data Source") + "    |       |      +-----------------------------------+    |");
    this.log("|                           |     |                          |       |      |                                   |    |");
    this.log("|                           |     |                          |       |      |              " + chalk.green("View") + "                 |    |");
    this.log("+---------------------------+     +--------------------------+       |      |                                   |    |");
    this.log("              ^                                 ^                    |      +-----------+-----------------------+    |");
    this.log("              |                                 |                    |                  v         ^                  |");
    this.log("+-------------+---------------------------------+------------+       |      +---------------------+-------------+    |");
    this.log("|                                                            |       |      |                                   |    |");
    this.log("|                                                            |       |      |                                   |    |");
    this.log("|             " + chalk.red("REPOSITORY (+ in-memory cache)") + "                 +<-------------+            " + chalk.blue("Presenter") + "              |    |");
    this.log("|                                                            |       |      |                                   |    |");
    this.log("|                                                            |       |      +-----------------------------------+    |");
    this.log("+------------------------------------------------------------+       +-----------------------------------------------+");
    this.log("                                                                              " + chalk.yellow("Activity"));

    this.prompt(prompts, function (props) {
      this.appName = props.name;
      this.appPackage = props.package;
      this.androidTargetSdkVersion = props.targetSdk;
      this.androidMinSdkVersion = props.minSdk;
      this.useCI = props.useCI;

      done();
    }.bind(this));
  },

  writing: {
    projectfiles: function () {
      this.copy('gitignore', '.gitignore');
      this.copy('build.gradle', 'build.gradle');
      this.copy('gradle.properties', 'gradle.properties');
      this.copy('gradlew', 'gradlew');
      this.copy('gradlew.bat', 'gradlew.bat');
      this.copy('LICENSE', 'LICENSE');
      this.copy('settings.gradle', 'settings.gradle');
      this.copy('local.properties', 'local.properties');
      this.directory('gradle', 'gradle');
      if (this.useCI) {
        this.copy('circle.yml', 'circle.yml');
        this.copy('gitlab-ci.yml', '.gitlab-ci.yml');
        this.directory('android-sdk', 'android-sdk');
        this.directory('scripts', 'scripts');
      }
    },

    app: function () {
      var packageDir = this.appPackage.replace(/\./g, '/');

      this.mkdir('app');
      this.copy('app/proguard-rules.pro', 'app/proguard-rules.pro');
      this.template('app/_build.gradle', 'app/build.gradle');

      this.mkdir('app/src/mock/java/' + packageDir);
      this.templateDirectory('app/src/mock/java', 'app/src/mock/java/' + packageDir);

      this.mkdir('app/src/androidTest/java/' + packageDir);
      this.templateDirectory('app/src/androidTest/java', 'app/src/androidTest/java/' + packageDir);

      this.mkdir('app/src/androidTestMock/java/' + packageDir);
      this.templateDirectory('app/src/androidTestMock/java', 'app/src/androidTestMock/java/' + packageDir);

      this.mkdir('app/src/prod/java/' + packageDir);
      this.templateDirectory('app/src/prod/java', 'app/src/prod/java/' + packageDir);

      this.mkdir('app/src/test/java/' + packageDir);
      this.templateDirectory('app/src/test/java', 'app/src/test/java/' + packageDir);

      this.mkdir('app/src/main/assets');
      this.mkdir('app/src/main/java/' + packageDir);
      this.directory('app/src/main/assets', 'app/src/main/assets');
      this.template('app/src/main/_AndroidManifest.xml', 'app/src/main/AndroidManifest.xml');
      this.templateDirectory('app/src/main/java', 'app/src/main/java/' + packageDir);
      this.templateDirectory('app/src/main/res', 'app/src/main/res');
    }
  },
  end: function () {
    this.log(yosay(
      'Thanks for using ' + chalk.red('Y') + chalk.blue('M') + chalk.green('C') + chalk.yellow('A') + '! If you found it useful follow this link ' + chalk.green('https://goo.gl/lsIE8D') + ' to tweet and spread the word, and love. Peace.'
    ));
  }
});
