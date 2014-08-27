var gulp = require('gulp'),                                     // Gulp JS
    gulpif = require('gulp-if'),                                // Gulp if module
    notify = require('gulp-notify'),                            // Plugin for notify
    projectConfig = require('../../projectConfig'),             // Project config
    notifyConfig = projectConfig.notifyConfig,                  // Notify config
    replace = require('gulp-replace-task'),
    modifyDate = require('../helpers/modifyDateFormatter'),     // Date formatter for notify
    hashGenerator = require('../helpers/hashGenerator');     


// Task description
module.exports = function(cb) {

    var patterns = [
        {
            match: 'main.css',
            replacement: 'main' + hashGenerator.newHash + '.min.css'
        },  {
            match: 'main_ie9.css',
            replacement: 'main_ie9' + hashGenerator.newHash + '.min.css'
        },  {
            match: 'main_ie8.css',
            replacement: 'main_ie8' + hashGenerator.newHash + '.min.css'
        },  {
            match: 'main.js',
            replacement: 'main' + hashGenerator.newHash + '.min.js'
        }
    ];

    return gulp.src('./build/*.html')
        .pipe(replace({
          patterns: patterns,
          usePrefix: false
        }))
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
                    message: 'Static paths\'ve been changed \n'+ notifyConfig.taskFinishedText +'<%= options.date %>',
                    templateOptions: {
                        date: modifyDate.getTimeOfModify()
                    }
                })
            )
        );    
};   