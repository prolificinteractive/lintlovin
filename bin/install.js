/*jslint node: true */
'use strict';

var lib = {
  fs: require('fs'),
  path: require('path')
};

var root = lib.path.resolve(__dirname, '../');
if (lib.path.basename(lib.path.dirname(root)) !== 'node_modules') {
  process.exit(0);
}
process.chdir(lib.path.resolve(root, '../../'));

if (!lib.fs.existsSync('.editorconfig')) {
  var config = lib.path.resolve(__dirname, '../.editorconfig');
  var rel = lib.path.relative(process.cwd(), config);
  lib.fs.symlinkSync(rel, '.editorconfig');
}

if (!lib.fs.existsSync('.jshintrc')) {
  var config = lib.path.resolve(__dirname, '../.jshintrc');
  var rel = lib.path.relative(process.cwd(), config);
  lib.fs.symlinkSync(rel, '.jshintrc');
}

if (!lib.fs.existsSync('.jscsrc')) {
  var config = lib.path.resolve(__dirname, '../.jscsrc');
  var rel = lib.path.relative(process.cwd(), config);
  lib.fs.symlinkSync(rel, '.jscsrc');
}

if (!lib.fs.existsSync('Gruntfile.js')) {
  var grunt = lib.fs.readFileSync(lib.path.join(__dirname, 'Gruntfile.default.js'), {
    encoding: 'utf8'
  });
  lib.fs.writeFileSync('Gruntfile.js', grunt);
}

if (lib.fs.existsSync('package.json')) {
  var pkgSource = lib.fs.readFileSync('package.json', {
    encoding: 'utf8'
  });
  var pkg = JSON.parse(pkgSource);
  if (!pkg.scripts) {
    pkg.scripts = {};
  }

  var testCommand = 'node -e "require(\'grunt\').tasks([\'test\']);"';
  if (!pkg.scripts.test || pkg.scripts.test.indexOf('no test specified') !== -1) {
    pkg.scripts.test = testCommand;
  } else if (pkg.scripts.test !== testCommand) {
    console.error('A test script has already been specified.');
    console.error('Set it to', JSON.stringify(testCommand), 'to use grunt for tests.');
  }

  if (!pkg.scripts['test-all']) {
    pkg.scripts['test-all'] = 'node -e "require(\'grunt\').tasks([\'test-all\']);"';
  }

  if (!pkg.scripts.prepush) {
    pkg.scripts.prepush = 'npm test';
  }

  lib.fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
}
