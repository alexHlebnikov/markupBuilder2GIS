var gulp = require('gulp'),                                     // Gulp JS
    minifyHTML = require('gulp-minify-html')
    gutil = require('gulp-util'),                               // Gulp util module
    gulpif = require('gulp-if'),                                // Gulp if module
    notify = require('gulp-notify'),                            // Plugin for notify
    projectConfig = require('../../projectConfig'),             // Project config
    notifyConfig = projectConfig.notifyConfig,                  // Notify config
    modifyDate = require('../helpers/modifyDateFormatter');     // Date formatter for notify

// Minify HTML
module.exports = function(cb) {
    var opts = {
        comments: true,
        spare: true
    };
 
    if (projectConfig.minifyHtml) {

        return gulp.src('./dev/*.html')
            .pipe(minifyHTML(opts))
            .on('error', notify.onError(function (error) {
                return notifyConfig.errorMessage(error);
            }))
            .pipe(gulp.dest('./dev/'))
            .pipe(
                gulpif(notifyConfig.useNotify, 
                    notify({
                        onLast: true,
                        sound: notifyConfig.sounds.onSuccess,
                        title: notifyConfig.title,
                        message: 'Html \'ve been minified \n'+ notifyConfig.taskFinishedText +'<%= options.date %>',
                        templateOptions: {
                            date: modifyDate.getTimeOfModify()
                        }
                    })
                )
            );
    } else {
        gutil.log('!HTML-minify disabled!');
        cb(null);
    }        

    // You can return callback, if you can't return pipe
    // cb(null);    
};   