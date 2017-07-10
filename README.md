# aurelia-systemjs-hot-plugin

Unofficial plugin to enable Aurelia Hot Module Replacement (HMR) for [SystemJS](https://github.com/systemjs/systemjs). This module works as extension over [systemjs-hot-reloader](https://github.com/alexisvincent/systemjs-hot-reloader).

`aurelia-systemjs-hot-plugin` **MUST** be used in conjunction with modules:
- [aurelia-loader-systemjs](https://github.com/wegorich/loader) - the systemjs port of [aurelia-loader-webpack](https://github.com/aurelia/loader-webpack)
- [systemjs-hot-reloader](https://github.com/alexisvincent/systemjs-hot-reloader) - simple HMR module for systemjs, or [systemjs-hot-reloader-example](https://github.com/wegorich/systemjs-hot-reloader) til [PR #114](https://github.com/alexisvincent/systemjs-hot-reloader/pull/144) would be merged
- [chokidar-socket-emitter](https://github.com/capaj/chokidar-socket-emitter) - simple file watcher

## Usage
Install with your client-side package manager
- `jspm install npm:aurelia-loader-systemjs`
- `jspm install npm:aurelia-systemjs-hot-plugin`
- `jspm install systemjs-hot-reloader-example`

It works good with SystemJS `>0.19.x` not tested with `>=0.20.8`.

`systemjs-hot-reloader` **MUST** run before your application code otherwise SystemJS
won't know how to resolve your app's `@hot` imports.

Assuming your app entry point is `app.js`, wrap your import statement so that you first load `systemjs-hot-reloader`.

```html
<script>
    System.import('aurelia-loader-systemjs')
    Promise.all([
        System.import('aurelia-systemjs-hot-plugin'),
        System.import('systemjs-hot-reloader-example')
    ]).then(([fileChanged, connect]) => {
        connect({
            fileChanged
        })
        System.import('aurelia-bootstrapper')
    })
</script>
```

More options of connect function can be found at `systemjs-hot-reloader` module page.

The configuration at your server (for example: `browser-sync`) may looks like that

```javascript
import gulp from 'gulp';
import paths from '../paths';
import browserSync from 'browser-sync';
import chokidarEvEmitter from 'chokidar-socket-emitter';

gulp.task('serve', ['build'], function() {
    var bs = browserSync.create();

    bs.watch([
        'index.html',
        'config.js',
        'jspm.config.js'
    ]).on('change', bs.reload);

    bs.init({
        server: '.',
        port: 9000,
        logPrefix: 'TEST',
        online: false,
        open: false,
        reloadOnRestart: true
    }, function(){
        chokidarEvEmitter({quiet: true});
    });
});
```

### Production
In production, `systemjs-hot-reloader` maps to an empty module so you can leave
the `systemjs-hot-reloader` import in your `index.html`. But anyway you may change the code from

```html
<script src="jspm_packages/system.js"></script>
<script src="config.js"></script>

<script>
    System.import('aurelia-loader-systemjs')
    Promise.all([
        System.import('aurelia-systemjs-hot-plugin'),
        System.import('systemjs-hot-reloader-example')
    ]).then(([fileChanged, connect]) => {
        connect({
            fileChanged
        })
        System.import('aurelia-bootstrapper')
    })
</script>
```
to this, manualy. But take care about `aurelia-loader-default`, it should exists in deps.

```html
<script src="jspm_packages/system.js"></script>
<script src="config.js"></script>

<script>
    System.import('aurelia-bootstrapper')
</script>
```

## Example Projects
- [Aureliajs Systemjs HMR sandbox](https://github.com/wegorich/aurelia-systemjs-loader)

## Credit
This project is extension for [systemjs-hot-reloader](https://github.com/alexisvincent/systemjs-hot-reloader) and hardly depends on [aurelia/loader-webpack](https://github.com/aurelia/loader-webpack) none of this would have been possible without [Alexis Vincent](https://github.com/alexisvincent) and [Bazyli Brzóska](https://github.com/niieani).

