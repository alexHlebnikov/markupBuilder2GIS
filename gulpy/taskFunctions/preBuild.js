var gulp = require('gulp'),                                     // Gulp JS
    gulpif = require('gulp-if'),                                // Gulp if module
    notify = require('gulp-notify'),                            // Plugin for notify
    gutil = require('gulp-util'),                               // Gulp util module
    fs = require('fs'),
    notifyConfig = require('../../projectConfig').notifyConfig,           // Notify config
    modifyDate = require('../helpers/modifyDateFormatter'),     // Date formatter for notify
    hashGenerator = require('../helpers/hashGenerator');

// Copy files from dev to build directory
// Create build directory with new build version
module.exports = function() {

    hashGenerator.generateHash();

    return gulp.src('./dev/**/*.*', { base: './dev/' })
        .on('error', notify.onError(function (error) {
            return notifyConfig.errorMessage(error);
        }))
        .pipe(gulp.dest('./build/'))
        .pipe(
            gulpif(notifyConfig.useNotify, 
                notify({
                    onLast: true,
                    sound: notifyConfig.sounds.onSuccess,
                    title: notifyConfig.title,
                    message: 'Pre-build task is finished\n'+ notifyConfig.taskFinishedText +'<%= options.date %>',
                    templateOptions: {
                        date: modifyDate.getTimeOfModify()
                    }
                })
            )
        );
};   