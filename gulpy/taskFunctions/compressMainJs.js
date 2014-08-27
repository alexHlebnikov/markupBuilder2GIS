var gulp = require('gulp'),                                     // Gulp JS
    uglify = require('gulp-uglifyjs'),                          // JS minify
    gulpif = require('gulp-if'),                                // Gulp if module
    notify = require('gulp-notify'),                            // Plugin for notify
    notifyConfig = require('../../projectConfig').notifyConfig,           // Notify config
    modifyDate = require('../helpers/modifyDateFormatter'),     // Date formatter for notify
    hashGenerator = require('../helpers/hashGenerator');     

// Compress js-files
module.exports = function() {

    return gulp.src('./build/static/js/main.js')
        .pipe(uglify('main' + hashGenerator.newHash + '.min.js', {
            mangle: false
        }))
        .on('error', notify.onError(function (error) {
            return notifyConfig.errorMessage(error);
        }))
        .pipe(gulp.dest('./build/static/js/'))
        .pipe(
            gulpif(notifyConfig.useNotify, 
                notify({
                    onLast: true,
                    sound: notifyConfig.sounds.onSuccess,
                    title: notifyConfig.title,
                    message: 'JS\'ve been minified \n'+ notifyConfig.taskFinishedText +'<%= options.date %>',
                    templateOptions: {
                        date: modifyDate.getTimeOfModify()
                    }
                })
            )
        );
};   