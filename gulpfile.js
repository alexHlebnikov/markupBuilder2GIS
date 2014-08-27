// Using modules
var gulp = require('gulp'),                     // Gulp JS
    gutil = require('gulp-util'),               // Gulp util module
    runSequence = require('run-sequence'),      // Run sequence module for run task in queue
    browserSync = require('browser-sync'),      // Plugin for sync with browser
    gulpRename = require('gulp-rename'),
    path = require('path'),

    // Flags
    useLiveReload = gutil.env.lr,

    // Configs
    projectConfig = require('./projectConfig');
    browserSyncConfig = projectConfig.browserSyncConfig;



/* HELPERS */

// You can add your own helpers here. Helpers folder is gulpy/helpers

// Watcher by node-watch
var watchByPattern = require('./gulpy/helpers/watcher');

// Notify for changed files in console
var fileChangedNotify = require('./gulpy/helpers/fileChangedNotify');

// Generate new version of  build
var buildVersionGenerator = require('./gulpy/helpers/buildVersionGenerator');

/* END HELPERS */



/* TASKS */


// You can add your own task.
// There is a template of gulp-task
// Function of task have to be in gulpy/taskFunctions folder
// Example:
// gulp.task('example-task', require('./gulpy/taskFunctions/exampleTask'));


// Handlebars compilation
gulp.task('compile-handlebars', require('./gulpy/taskFunctions/compileHandlebars'));

// Make sprite task    
gulp.task('raster-svg', require('./gulpy/taskFunctions/rasterSvg'));

// Make sprite task    
gulp.task('make-sprite-for-svg-fallback', require('./gulpy/taskFunctions/makeSpriteForSvgFallback'));

// Make sprite task    
gulp.task('make-sprite', require('./gulpy/taskFunctions/makeSprite'));

// Less compilation
gulp.task('compile-less', require('./gulpy/taskFunctions/compileLess'));

// Less compilation for ie8
gulp.task('compile-less-for-ie8', require('./gulpy/taskFunctions/compileLessForIe8'));

// Less compilation for ie9
gulp.task('compile-less-for-ie9', require('./gulpy/taskFunctions/compileLessForIe9'));

// Copy JS-files for libs that have to be in separate files
gulp.task('copy-separate-libs-js', require('./gulpy/taskFunctions/copySeparateLibsJs'));

// Concat JS for modules, libs and plugins to 1 file.
// Also lint modules' js
gulp.task(
    'concat-plugins-libs-and-modules-lint-modules-js', 
    ['lint'], 
    require('./gulpy/taskFunctions/concatPluginsLibsAndModulesLintModulesJs')
);

// Check JS (code style and errors)
gulp.task('lint', require('./gulpy/taskFunctions/lint'));

// Move misc files
gulp.task('move-misc-files', require('./gulpy/taskFunctions/moveMiscFiles'));

// Move images from assets modules of modules
gulp.task('move-assets', require('./gulpy/taskFunctions/moveAssets'));

// Move images for content
gulp.task('move-content-img', require('./gulpy/taskFunctions/moveContentImg'));

// Move images for plugins
gulp.task('move-plugins-img', require('./gulpy/taskFunctions/movePluginsImg'));

// Generate font-files (eot, woff, svg) from .ttf-file
gulp.task('generate-fonts', require('./gulpy/taskFunctions/generateFonts'));

// Move fonts-files to dev directory
gulp.task('move-fonts', require('./gulpy/taskFunctions/moveFonts'));

// Strip console.log and debugger from main.js
gulp.task('strip-debug', require('./gulpy/taskFunctions/stripDebug'));

// Compress js-files and strip debug
gulp.task('compress-main-js', ['strip-debug'], require('./gulpy/taskFunctions/compressMainJs'));

// Convert svg includes to base64 in css
gulp.task('svg-to-base64', require('./gulpy/taskFunctions/svgToBase64'));

// Compress css
gulp.task('compress-css', require('./gulpy/taskFunctions/compressCss'));

// SVG minification
gulp.task('svg-minification', require('./gulpy/taskFunctions/svgMinification'));

// Copy files from dev to build directory
// Create build directory with new build version
gulp.task('pre-build', require('./gulpy/taskFunctions/preBuild'));

// Clean dev directory and cache
gulp.task('clean', require('./gulpy/taskFunctions/clean'));

// Init builder. Make folders
gulp.task('init', require('./gulpy/taskFunctions/init'));

// Move SVG-files to dev directory
gulp.task('move-svg', require('./gulpy/taskFunctions/moveSvg'));

// Create minify-html
gulp.task('minify-html', require('./gulpy/taskFunctions/minifyHtml'));

// Replace static paths and names
gulp.task('replace-static-paths', require('./gulpy/taskFunctions/replaceStaticPaths'));

/* END TASKS */

var watch = require('gulp-watch');

/* WATHERS */

// Build dev-version with watchers and livereloader
gulp.task('dev', ['build-dev'], function() {

    if (useLiveReload) {
        gulp.start('browsersync');
    }


    // You can add you own watcher
    // Example:
    // watchByPattern( path-string to files, that you'd like to watch for, function(filename) {
    //      fileChangedNotify(filename);
    //      gulp.start('example-task'); 
    // });
    //
    // If you need to watch for array of paths, you have to add watcher for each path separately.
    // Example:
    //
    // pathsArray = ['path_1', 'path_2']
    //
    // pathsArray.forEach(function(path) {
    //     watchByPattern(path, function(filename) {
    //         fileChangedNotify(filename);
    //         gulp.start('example-task');
    //     }); 
    // });


    watchByPattern('./markup/static/images/sprite/**/*.png', function(filename) {
        fileChangedNotify(filename);
        gulp.start('make-sprite');
    });

    if (projectConfig.useSVG) {
        watchByPattern('./markup/static/images/svg/**/*.svg', function(filename, cb) {
            fileChangedNotify(filename);
            gulp.start('svg-actions');
        });
    }

    // Watcher for common less-files and less-files of plugins
    watchByPattern('./markup/static/less/**/*.less', function(filename) {
        fileChangedNotify(filename);
        gulp.start('compile-less');
    }); 

    // Watcher for less-files of modules
    watchByPattern('./markup/modules/**/*.less', function(filename) {
        fileChangedNotify(filename);
        if (filename.indexOf('ie8.less') > -1) {
            // Compile less-files for ie8
            gulp.start('compile-less-for-ie8');
        } else if (filename.indexOf('ie9.less') > -1) {
            // Compile less-files for ie9
            gulp.start('compile-less-for-ie9');
        } else {
            // Compile less-files for all browsers
            gulp.start('compile-less');
            gulp.start('compile-less-for-ie8');
            gulp.start('compile-less-for-ie9');
        }
        
    });

    // Watcher for handelbars-files of templates
    watchByPattern('./markup/pages/**/*.html', function(filename) {
        fileChangedNotify(filename);
        gulp.start('compile-handlebars');
    });

    // Watcher for handelbars-files of modules
    watchByPattern('./markup/modules/**/*.html', function(filename) {
        fileChangedNotify(filename);
        gulp.start('compile-handlebars');
    });

    if (projectConfig.jsPathsToConcatBeforeModulesJs.length) {
        // Watcher for js-files after modules js
        projectConfig.jsPathsToConcatBeforeModulesJs.forEach(function(path) {
            watchByPattern(path, function(filename) {
                fileChangedNotify(filename);
                gulp.start('concat-plugins-libs-and-modules-lint-modules-js');
            }); 
        });
    }   

    // Watcher for js-files of modules
    watchByPattern('./markup/modules/**/*.js', function(filename) {
        fileChangedNotify(filename);
        gulp.start('concat-plugins-libs-and-modules-lint-modules-js');
    });

    if (projectConfig.jsPathsToConcatAfterModulesJs.length) {
        // Watcher for js-files after modules js
        projectConfig.jsPathsToConcatAfterModulesJs.forEach(function(path) {
            watchByPattern(path, function(filename) {
                fileChangedNotify(filename);
                gulp.start('concat-plugins-libs-and-modules-lint-modules-js');
            }); 
        });
    }

    // Watcher for js-files of plugins
    watchByPattern('./markup/static/js/plugins/**/*.js', function(filename) {
        fileChangedNotify(filename);
        gulp.start('concat-plugins-libs-and-modules-lint-modules-js');
    });

    // Watcher for js-files of libs
    watchByPattern('./markup/static/js/libs/**/*.js', function(filename) {
        fileChangedNotify(filename);
        gulp.start('concat-plugins-libs-and-modules-lint-modules-js');
    });

    // Watcher for separateLibs js-files
    watchByPattern('./markup/static/js/separateLibs/**/*.js', function(filename) {
        fileChangedNotify(filename);
        gulp.start('copy-separate-libs-js');
    });

    // Watcher for images in assets dir of modules
    watchByPattern('./markup/modules/**/assets/*.*', function(filename) {
        fileChangedNotify(filename);
        gulp.start('move-assets');
    });

    // Watcher for content images
    watchByPattern('./markup/static/images/content/**/*.*', function(filename) {
        fileChangedNotify(filename);
        gulp.start('move-content-img');
    });

    // Watcher for images of plugins
    watchByPattern('./markup/static/images/plugins/**/*.*', function(filename) {
        fileChangedNotify(filename);
        gulp.start('move-plugins-img');
    });

    // Watcher for misc files
    watchByPattern('./markup/static/misc/**/*.*', function(filename) {
        fileChangedNotify(filename);
        gulp.start('move-misc-files');
    });


    // Default gulp watcher for font files.
    // Need restart gulp dev, if new fonts have been added
    gulp.watch('./markup/static/fonts/*.*', function(cb) {
        runSequence(
            'move-fonts',
            'generate-fonts',
            cb
        );
    });
});

/* END WATHERS */


/* MAIN TASKS */

// Build dev-version (without watchers)
// You can add your own tasks in queue

gulp.task('build-dev', function(cb) {
    runSequence(
        'clean',
        'move-svg',
        'raster-svg',
        ['make-sprite-for-svg-fallback', 'make-sprite'],
        ['compile-less', 'compile-less-for-ie8', 'compile-less-for-ie9'],
        [
            'copy-separate-libs-js', 'concat-plugins-libs-and-modules-lint-modules-js', 'compile-handlebars',
            'move-misc-files', 'move-assets', 'move-content-img', 'move-plugins-img', 'move-fonts'
        ],
        'generate-fonts',
        cb
    );
});

// Build release version

// Also you can add your own tasks in queue of build task

gulp.task('build', function(cb) {
    runSequence(
        'build-dev',
        ['svg-minification', 'minify-html'],
        'pre-build',
        'svg-to-base64',
        ['compress-main-js', 'compress-css'],
        'replace-static-paths',
        cb
    );
});

gulp.task('default', function() {
    gulp.start('build');
});

gulp.task('browsersync', function (cb) {
   
    // Serve files and connect browsers
    browserSync({
        server: {
            baseDir: './dev'
        },
        logConnections: true,
        debugInfo: true,
        injectChanges: false,
        port: browserSyncConfig.port,
        open: browserSyncConfig.open,
        browser: browserSyncConfig.browser,
        startPath: browserSyncConfig.startUrl,
        notify: browserSyncConfig.useNotifyInBrowser
    });  

    cb(null);
});

/* END MAIN TASKS */


/* HELPERS TASKS */
gulp.task('svg-actions', function (cb) {
    runSequence(
        'move-svg',
        'raster-svg',
        'make-sprite-for-svg-fallback',
        cb
    );
})
/* END HELPERS TASKS */