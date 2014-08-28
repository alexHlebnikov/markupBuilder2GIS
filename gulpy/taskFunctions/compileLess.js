var gulp = require('gulp'),                                     // Gulp JS
    concat = require('gulp-concat'),                            // Files concat
    less = require('gulp-less'),                                // Sass compilation
    gulpif = require('gulp-if'),                                // Gulp if module
    autoprefix = require('gulp-autoprefixer'),                  // Autoprefixer for css
    notify = require('gulp-notify'),                            // Plugin for notify
    projectConfig = require('../../projectConfig'),
    notifyConfig = projectConfig.notifyConfig,                  // Notify config
    modifyDate = require('../helpers/modifyDateFormatter'),     // Date formatter for notify
    browserSync = require('browser-sync'),                      // Plugin for sync with browser

    lessFilesToConcatinate = [
        './markup/static/less/reset.less',
        './markup/static/less/mixins.less',
        './markup/static/less/spritesLess/sprite96.less',
        './markup/static/less/spritesLess/sprite.less'
    ];

    if (projectConfig.useSVG) {
        lessFilesToConcatinate.push(
            './markup/static/less/spritesLess/svg-fallback-sprite.less',
            './markup/static/less/spritesLess/svg-sprite.less'
        );
    }

    lessFilesToConcatinate.push(
        './markup/static/less/fonts.less',
        './markup/static/less/vars.less',
        './markup/static/less/GUI.less',
        './markup/static/less/common.less',
        './markup/static/less/plugins/*.less',
        './markup/static/less/plugins/**/*.less',
        './markup/modules/*/*.less'
    );

// Less compilation
module.exports = function(cb) {

    gulp.src(lessFilesToConcatinate)
        .pipe(concat('main.css'))
        .pipe(less())
        .on('error', notify.onError(function (error) {
            return notifyConfig.errorMessage(error);
        }))
        .pipe(autoprefix('last 2 version', 'safari 5', 'opera 12.1', 'ios 6', 'android 4', { cascade: true })) 
        .on('error', notify.onError(function (error) {
            return notifyConfig.errorMessage(error);
        }))
        .pipe(gulp.dest('./dev/static/css/'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(
            gulpif(notifyConfig.useNotify, 
                notify({
                    onLast: true,
                    sound: notifyConfig.sounds.onSuccess,
                    title: notifyConfig.title,
                    message: 'Less-files\'ve been compiled. \n'+ notifyConfig.taskFinishedText +'<%= options.date %>',
                    templateOptions: {
                        date: modifyDate.getTimeOfModify()
                    }
                })
            )
        );

        cb(null);
};   