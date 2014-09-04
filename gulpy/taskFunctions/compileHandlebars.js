var gulp = require('gulp'),                                     // Gulp JS
    handlebars = require('gulp-compile-handlebars'),
    gulpif = require('gulp-if'),                                // Gulp if module
    notify = require('gulp-notify'),                            // Plugin for notify
    notifyConfig = require('../../projectConfig').notifyConfig, // Notify config
    modifyDate = require('../helpers/modifyDateFormatter'),     // Date formatter for notify
    browserSync = require('browser-sync');                      // Plugin for sync with browser

// Handlebars compilation of pages templates.
// Templates with _ prefix won't be compiled
module.exports = function(cb) {
    var templateData = {
        templateName: 'template'
    },
    options = {
        batch : ['./markup/modules']
        // helpers : {
        //     capitals : function(str){
        //         return str.toUpperCase();
        //     }
        // }
    };

    gulp.src(['./markup/pages/*.html', '!./markup/pages/_*.html'])
        .pipe(handlebars(templateData, options))
        .on('error', notify.onError(function (error) {
            return notifyConfig.errorMessage(error);
        }))
        .pipe(gulp.dest('./dev/'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(
            gulpif(notifyConfig.useNotify, 
                notify({
                    onLast: true,
                    sound: notifyConfig.sounds.onSuccess,
                    title: notifyConfig.title,
                    message: 'Handlebars templates\'ve been compiled \n'+ notifyConfig.taskFinishedText +'<%= options.date %>',
                    templateOptions: {
                        date: modifyDate.getTimeOfModify()
                    }
                })
            )
        );

    cb(null);    
};   