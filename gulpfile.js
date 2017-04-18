const srcFile = 'src/**/*.js',  
      buildFolder = 'build',
      buildFile = buildFolder + '/*.js',
      distFolder = 'dist';

const gulp = require('gulp');
const rollup = require('gulp-rollup');
gulp.task('default', function() {  
    return gulp.src(srcFile)
        .pipe(rollup({
            // any option supported by Rollup can be set here.
            format: 'umd',
            moduleName: 'Auditor',
            sourceMap: true,
            banner: '/*!\n' +
            ' * auditor.js\n' +
            ' * (c) 2017 Hung Le\n' +
            ' * Released under the MIT License.\n' +
            ' */',
            "plugins": [
                require("rollup-plugin-babel")({
                "presets": [["es2015", { "modules": false }]],
                "plugins": ["external-helpers"]
                })
            ], 
            entry: ['./src/auditor.js']
        }))
        .pipe(gulp.dest(buildFolder));
});

const concat = require('gulp-concat');  
const rename = require('gulp-rename');  
const uglify = require('gulp-uglify');  
gulp.task('release', function() {  
    return gulp.src('build/*.js')
        .pipe(concat('minimal-binding.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('minimal-binding.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});