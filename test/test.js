// powered by Livecomment [
//  by d08ble
// powered by Livecomment ]

// deps [

var path = require('path');

// deps ]

// todo: create test dirs [
// todo: create test dirs ]
// todo: test other watch modules [
// duo-watch
// dirwatcher
// bewitch
// beholder
// fireworm
// wtchr
// ...
// todo: test other watch modules ]

var DIR = path.resolve(__dirname+'/..')

// Tests [

// sane [
function test_sane() {
  var sane = require('sane');

  console.log('sane:', DIR);

  var watcher = sane(DIR, [ '**/node_modules', '.git' ]);
  watcher.on('ready', function () { console.log('ready') });
  watcher.on('change', function (filepath, root, stat) { console.log('file changed', filepath); });
  watcher.on('add', function (filepath, root, stat) { console.log('file added', filepath); });
  watcher.on('delete', function (filepath, root) { console.log('file deleted', filepath); });
}
// sane ]

// gerard [
function test_gerard() {
  var gerard = require('gerard');

  console.log('gerard:', DIR);

  gerard(DIR, { ignore: '**/node_modules' }, function (err, results) {
    if (err) {
      console.error('Error:', err);
    }

//    console.log(results);
    console.log('gerard found', results.length, 'files')
  });
}
// gerard ]

// gaze [
function test_gaze() {
  var gaze = require('gaze');

  console.log('gaze:', DIR);

  gaze(DIR, function(err, watcher) {
    //console.log(watcher)
  });
}
// gaze ]

// miniwatch [
function test_miniwatch() {
  var miniwatch = require('miniwatch');

  miniwatch({
    directory: DIR,
    include: '**/*.js',
    exclude: '**/*.bundle.js'
  }, function(error, files) {
    if (error) {
      console.error('Error:', error.stack || error);
      return;
    }

    if (files.deleted) {
      files.deleted.forEach(function(file) {
//        bundler.remove(file);
      });
    }

    if (files.updated) {
      files.updated.forEach(function(file) {
//        bundler.reload(file);
      });
    }

    if (files.created) {
      files.created.forEach(function(file) {
//        bundler.add(file);
      });
    }
  });
}
// miniwatch ]

// fs-watch-tree [
function test_watchTree() {
  var watchTree = require("fs-watch-tree").watchTree;

  console.log('fs-watch-tree:', DIR);

  var w = watchTree(DIR, {
    exclude: ["node_modules", "~", "#", /^\./]
  }, function (event) {
    console.log(event)
    // Respond to change
  });
}
// fs-watch-tree ]

// saw [
function test_saw() {
  var saw = require('saw');

  console.log('saw:', DIR);

  saw(DIR, {})
    .on('ready', function (files) {
      // watcher is active. `files` is an array of file objects (details below).
    })
    .on('add', function (file) {
      // `file.path` = relative path from root dir
      // `file.fullPath` = absolute path
      // `file.name` = file name
      // `file.stat` = instance of `fs.Stats`
      // `file.parentDir` = relative parent dir
      // `file.fullParentDir` = absolute parent dir
    })
    .on('remove', function (file) {
      // file was removed
    })
    .on('update', function (file) {
      // file was updated
      // caveat: updates within a millisecond after the file was added or updated
      // can't be detected
    })
    .on('all', function (ev, file) {
      // catchall - `ev` is the event name.
    })
    // to unwatch all files, call close():
//    .close()
}
// saw ]

// fileset [
function test_fileset() {
  var fileset = require('fileset');

  console.log('fileset:', DIR);

  fileset(DIR+'/**', 'node_modules/**')
    .on('match', console.log.bind(console, 'match'))
    .on('include', console.log.bind(console, 'includes'))
    .on('exclude', console.log.bind(console, 'excludes'))
    .on('end', console.log.bind(console, 'end'));
}
// fileset ]

// run test [

//test_sane()
//test_gerard()
//test_gaze()
//test_miniwatch()
//test_watchTree()
//test_saw()
//test_fileset()

// run test ]

// Tests ]
