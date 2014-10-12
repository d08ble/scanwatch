# File watcher

Usage:

```javascript
  var scanwatch = require('../scanwatch')

  var options = {
    debug: 1,
    common: {
      ignore: [
        '.git',
        '.git/**',
        /^test\/.*/,
        'node_modules',
        'node_modules/**',
        'node_modules/**/.*',
        'node_modules/**/.*/**'
//        /\/node_modules.*/
      ]
    },
    paths: {}
  }
  options.paths[__dirname+'/..'] = {
    ignore: [
      /^\.idea.*/
    ]
  }
  options.paths[__dirname+'/../node_modules'] = {}

  scanwatch.setup(options, function fileChanged(type, path) {
    if (type == 'skip') {
      console.log('[skipping]', path)
      return
    }
    console.log(type, path)
  })
```

### test/test.js libraries:
* sane
* gerard
* gaze
* miniwatch
* watchTree
* saw
* fileset
* ...