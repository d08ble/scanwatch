# scanwatch 0.2.0

Scan files and watch for changes

Fast and simple file watcher for Node without all the fanciful decoration

## Features

Scanwatch has the following features
- extremely fast and simple (242 lines of code and 4 deps only)
- follow symlinks
- ignore subpaths with minimatch and regex
- events callback file scan, skip, changed, deleted

## Version history

scanwatch version 0.2.0 (see version history below for details)

## 🏄‍♂️ Quick start

### Pre-requirements

- NodeJS 16.x (Latest). Scanwatch works with older versions also like 8.x  

### Install

Using npm:
```
npm i scanwatch
```

Using yarn:
```
yarn install scanwatch
```

Using pnpm:
```
pnpm i scanwatch
```

### Run

Create ```options {...}``` object with paths and scanwatch options then run ```scanwatch.setup(options, callback)```

Usage example:

```javascript
  var scanwatch = require('scanwatch')

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
      ]
    },
    paths: {}
  }
  options.paths[__dirname] = {
    ignore: [
      /^\.idea.*/
    ]
  }
  options.paths[__dirname+'/node_modules'] = {}

  scanwatch.setup(options, function fileChanged(type, path) {
    if (type == 'skip') {
      console.log('[skipping]', path)
      return
    }
    console.log(type, path)
  })
```

## 📚 Documentation

Scanwatch uses a simple API for your files 

### scanwatch.setup(options, callback) 

Scanwatch your paths

```
scanwatch.setup(options, function fileChanged(type, path) {
  ...
})
```

#### options configuration 

```debug: 0|1``` console log debug information

```common = {}``` common options 

```common.ignore = []``` ignore patterns array with regex or minimatch format

```paths = {}``` paths object. Each path is a key like ```options.paths[__dirname+'/node_modules'] = {}```

#### callback events

```scan``` - initial scan

```skip``` - file skipped

```changed``` - file changed

```deleted``` - file deleted

#### Code and architecture

Scanwatch uses self-documenting code and architecture with livecomment

Install livecomment
```
npm -g i livecomment
```

Run live docs
```
livecomment --path node_modules/scanwatch
```

open http://localhost:3070/

and see code docs like this

<img src="/assets/screenshot_docs.png" width="320px">

## 💳 Support

Please become Github Sponsor or donate for support scanwatch and other projects development

Donate with crypto:
- BTC: ```bc1q5ad4pzxxqmc6rehy2y2fn58utm5jkhwphznruj```
- ETH:
- Polkadot:
- USDT:
- Paypal:

## License

MIT

## Contributing

Standard contributing rules for professional developer, pull requests, etc.

## ✅ Version history

Changelog
- 0.2.0 feature: CLI bin. bugfix: broken/recursive symlinks, permission errors
- 0.1.9 bugfix: fix minimatch 10.0.1
- 0.1.8 bugfix: fix symlink dir bug. update readme show
- 0.1.7 bugfix: scan files crash Changelog 
- 0.1.6 bugfix: watch/delete for new/deleted files/dirs
