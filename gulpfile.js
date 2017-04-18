const gulp = require('gulp');
const rollup = require('gulp-rollup');
const babel = require('gulp-babel');
const concat = require('gulp-concat');  
const rename = require('gulp-rename');  
const uglify = require('gulp-uglify');  

const jsFiles = 'src/**/*.js',  
    jsDest = 'dist';

gulp.task('default', function() {  
    return gulp.src(jsFiles)
        .pipe(rollup({
            // any option supported by Rollup can be set here.
            "format": "iife",
            "plugins": [
                require("rollup-plugin-babel")({
                "presets": [["es2015", { "modules": false }]],
                "plugins": ["external-helpers"]
                })
            ], 
            moduleName: 'minimal-binding',
            entry: './src/core/objectBrowser.js'
        }))
        .pipe(gulp.dest(jsDest));
});