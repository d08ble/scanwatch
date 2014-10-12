// powered by livecomment [
//  by d08ble
// powered by livecomment ]

// deps [

var minimatch = require('minimatch')
var _ = require('underscore')
var path = require('path')
var walk = require('walkdir')
var watch = require('node-watch')

// deps ]

// setup [
function setup(settings, callback) {

  var debug = settings.debug
  function log(s) {
    if (debug)
      console.log(s)
  }

  // SCAN [

  var normalizedPaths = {}
  var watchList = []

  // stringOrObjectAsObject [
  function stringOrObjectAsObject(p) {
    if (typeof p == 'string') {
      var o = {};
      o[p] = {};
      return o;
    } else if (typeof p == 'object') {
      return p
    }
    console.log('p is undefined');
    return {
      'undefined': {}
    }
  };
  // stringOrObjectAsObject ]

  // add base path for watch

  if (_.isArray(settings.paths)) {
    _.each(settings.paths, function(p) {
      p = stringOrObjectAsObject(p)
      _.each(p, function (v, p1) {
        normalizedPaths[path.resolve(p1)] = v
      })
    })
  } else {
    _.each(settings.paths, function (v, p1) {
      normalizedPaths[path.resolve(p1)] = v
    })
  }

  watchList = _.map(normalizedPaths, function (p, o) {
    return o
  })

  // check path [
  function checkContainsPathComponent(dir, o, filepath) {

    // find [
    function find(ignorelist, p) {
      return _.find(ignorelist, function(m) {
        if (m.constructor == RegExp)
          return m.test(p)
        else
          return minimatch(p, m)
        return false
      })
    }
    // find ]

    var p = filepath.substring(dir.length + 1)
    return (settings.common && settings.common.ignore && find(settings.common.ignore, p))
      || (o.ignore && find(o.ignore, p))
  }
  // check path ]

  log('Scan files [')
  _.each(normalizedPaths, function(o, dir) {
    log(dir+' [')
    walk.sync(dir, function(path, stat) {
      if (!checkContainsPathComponent(dir, o, path)) {
        if (!stat.isDirectory()) {
          callback('scan', path)
        } else {
          watchList.push(path)
        }
      } else {
        callback('skip', path)
      }
    });
    log(dir+' ]')
  })
  log('Scan files ]')

// SCAN ]


  // WATCH [
  // todo: use right watcher, fix for new/delete events, add watcher for new files [
  // todo: use right watcher, fix for new/delete events, add watcher for new files ]

  log('Watch for changes [');
  _.each(watchList, function(dir) {
    log(' '+dir);
    watch(dir, { recursive: false, followSymLinks: false }, function(filename) {
      filename = path.resolve(filename);
      // ON FILE/DIR CHANGED [
//      log(filename+' changed.');
      callback('change', filename);
      // ON FILE/DIR CHANGED ]
    });
  });
  log('Watch for changes ]');

  // WATCH ]

}
// setup ]

// module.exports [
module.exports = {
  setup: setup
}
// module.exports ]
