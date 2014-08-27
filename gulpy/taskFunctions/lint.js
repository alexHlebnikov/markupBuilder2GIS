var gulp = require('gulp'),                                     // Gulp JS
    jshint = require('gulp-jshint'),                            // JS linter
    cache = require('gulp-cached'),                             // Gulp cache module
    jscs = require('gulp-jscs'),                                // JS-style checker
    notify = require('gulp-notify'),                            // Plugin for notify
    projectConfig = require('../../projectConfig'),
    notifyConfig = projectConfig.notifyConfig,           // Notify config
    modifyDate = require('../helpers/modifyDateFormatter'),     // Date formatter for notify
    jsPaths = [];

    if (projectConfig.jsPathsToConcatBeforeModulesJs.length) {
        projectConfig.jsPathsToConcatBeforeModulesJs.forEach(function(path) {
            jsPaths.push(path)
        });
    }

    jsPaths.push('./markup/modules/**/*.js');

    if (projectConfig.jsPathsToConcatAfterModulesJs.length) {
        projectConfig.jsPathsToConcatAfterModulesJs.forEach(function(path) {
            jsPaths.push(path)
        });
    }

// Check JS (code style and errors)
module.exports = function() {

    return gulp.src(jsPaths)
        .pipe(cache('linting'))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jscs())
        .on('error', notify.onError(function (error) {
            return 'There are some errors in JS.\nLook in console!';
        }))
};   