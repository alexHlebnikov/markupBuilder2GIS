var gulp = require('gulp'),                                     // Gulp JS
    stripDebug = require('gulp-strip-debug'),                   // Console.log and debugger striper
    gulpif = require('gulp-if'),                                // Gulp if module
    notify = require('gulp-notify'),                            // Plugin for notify
    notifyConfig = require('../../projectConfig').notifyConfig,           // Notify config
    modifyDate = require('../helpers/modifyDateFormatter'),     // Date formatter for notify
    buildVersionGenerator = require('../helpers/buildVersionGenerator');

// Strip console.log and debugger from main.js
module.exports = function() {

    return gulp.src('./build/static/js/main.js')
        .pipe(stripDebug())
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
                    message: 'JS is ready for minify \n'+ notifyConfig.taskFinishedText +'<%= options.date %>',
                    templateOptions: {
                        date: modifyDate.getTimeOfModify()
                    }
                })
            )
        );
};   