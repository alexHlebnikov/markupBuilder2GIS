var gulp = require('gulp'),                                         // Gulp JS
    imagemin = require('gulp-imagemin'),
    gutil = require('gulp-util'),                               // Gulp util module
    gulpif = require('gulp-if'),                                    // Gulp if module
    notify = require('gulp-notify'),                                // Plugin for notify
    projectConfig = require('../../projectConfig'),
    notifyConfig = projectConfig.notifyConfig,                      // Notify config
    modifyDate = require('../helpers/modifyDateFormatter'),         // Date formatter for notify
    buildVersionGenerator = require('../helpers/buildVersionGenerator'),
    os = require('os'),                                             // Node os module
    notMs = true;                                                   // Windows System Detect

// Minify sprite img
module.exports = function() {

    if (projectConfig.useSVG) {

        return gulp.src('./dev/static/img/svg/*.svg')
            .pipe(imagemin(
                    {
                        progressive: true,
                        svgoPlugins: [{removeViewBox: false}],
                        use: []
                    }
                )
            )
            .on('error', notify.onError(function (error) {
                return notifyConfig.errorMessage(error);
            }))
            .pipe(gulp.dest('./dev/static/img/svg/'))
            .pipe(
                gulpif(notifyConfig.useNotify, 
                    notify({
                        onLast: true,
                        sound: notifyConfig.sounds.onSuccess,
                        title: notifyConfig.title,
                        message: 'SVG\'ve been minified \n'+ notifyConfig.taskFinishedText +'<%= options.date %>',
                        templateOptions: {
                            date: modifyDate.getTimeOfModify()
                        }
                    })
                )
            );

    } else {
        gutil.log('!SVG is not used!');
        cb(null);
    }        
};