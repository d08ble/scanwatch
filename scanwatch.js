// 📚 powered by livecomment for docs [
// $ npm i -g livecomment
// 📚 powered by livecomment for docs ]

// 🔗 deps [

var minimatch = require('minimatch'),
  _ = require('underscore'),
  path = require('path'),
  walk = require('walkdir'),
  watch = require('node-watch'),
  fs = require('fs')

// 🔗 deps ]
// 📡 setup [

function setup(settings, callback) {

  var debug = settings.debug
  function log(s) {
    if (debug)
      console.log(s)
  }

  // 🔍 SCAN [

  var normalizedPaths = {}
  var watchList = {}

  // util stringOrObjectAsObject [

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

  // util stringOrObjectAsObject ]
  // normalize paths [

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

  // normalize paths ]
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
  // walk with links [

  function walkWithLinks(dir0, cb) {
    
    // resolve link [

    let dir = fs.realpathSync(dir0)
    let prefix
    if (dir0 != dir) {
      log(`link ${dir0} -> ${dir}`)
      prefix = dir
    }
    
    // resolve link ]
    // walk [

    log(dir + ' [')
    
    walk.sync(dir, function(p, stat) {
      if (prefix)
        p = p.startsWith(prefix) ? dir0 + p.slice(prefix.length) : p;

      cb(p, stat)
      if (stat.isSymbolicLink()) {
        let p1 = fs.realpathSync(p)
        if (fs.lstatSync(p1).isDirectory()) {
          walkWithLinks(p, cb)
        }
      }
    })

    log(dir + ' ]')

    // walk ]
  }

  // walk with links ]
  // scan files [

  log('Scan files [')
  _.each(normalizedPaths, function(o, dir) {
    log(dir+' [')
    walkWithLinks(dir, function(p, stat) {
      if (!checkContainsPathComponent(dir, o, p)) {
        if (!stat.isDirectory()) {
          callback('scan', p)
          var d = path.dirname(p)
          var n = path.basename(p)
          watchList[d] = watchList[d] || {}
          watchList[d][n] = true
        } else {
          watchList[p] = {}
        }
      } else {
        callback('skip', p)
      }
    });
    log(dir+' ]')
  })
  log('Scan files ]')

  // scan files ]
  // 🔍 SCAN ]
  // 👀 WATCH [
  // todo: review right watcher
  
  log('Watch for changes [');
  _.each(watchList, function(o, dir) {
    log(' '+dir);
    function watchHandler(filename) {
      var ignored = _.find(normalizedPaths, function(o, dir) {
        return filename.indexOf(dir) == 0 && checkContainsPathComponent(dir, o, filename)
      })
      if (ignored)
        return

      filename = path.resolve(filename);

      if (fs.existsSync(filename)) {
        var stat = fs.statSync(filename)
        if (stat.isDirectory()) {
          // new dir [
          if (!watchList[filename]) {
            watchList[filename] = {}
            watch(filename, { recursive: false, followSymLinks: false }, watchHandler)
          }
          // new dir ]
        }
        else {
          // new/update file [
          var d = path.dirname(filename)
          if (!watchList[d]) {
            log('Error: untracked directory file change', filename)
            return
          }
          if (!watchList[d][filename]) {
            // new file
            watchList[d][path.basename(filename)] = true
          }
          callback('change', filename)
          // new/update file ]
        }
      }
      else {
        var o, f
        if (o = watchList[filename]) {
          // remove dir [
          _.each(o, function (v, name) {
            var f = path.join(filename, name)
            callback('delete', f);
          })
          delete watchList[filename]
          // remove dir ]
        }
        else if (o = watchList[path.dirname(filename)]) {
          // remove file [
          f = path.basename(filename)
          if (o[f]) {
            delete o[f];
            callback('delete', filename);
          }
          else {
            log('Error: remove untracked file', filename)
            return
          }
          // remove file ]
        }
        else {
          // undefined dir/file [
          log('Error: remove undefined dir/file', filename)
          return
          // undefined dir/file ]
        }
      }

      // ON FILE/DIR CHANGED - review
//      log(filename+' changed.');
//      callback('change', filename);
    }
    watch(dir, { recursive: false, followSymLinks: false }, watchHandler);
  });
  log('Watch for changes ]');

  // 👀 WATCH ]
}

// 📡 setup ]
// 📁 exports [

module.exports = {
  setup
}

// 📁 exports ]
