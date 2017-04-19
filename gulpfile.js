const gulp = require('gulp');
const concat = require('gulp-concat');  
const rename = require('gulp-rename');  
const uglify = require('gulp-uglify');  
const rollup = require('gulp-rollup');

const srcFiles = 'src/**/*.js',  
      buildFolder = 'build',
      buildFile = buildFolder + '/*.js',
      distFolder = 'dist';

const banner = '/*!\n' +
            ' * (c) 2017 Hung Le\n' +
            ' * Released under the MIT License.\n' +
            ' */';

gulp.task('default', ['build']);

gulp.task('release', ['build'], function() {  
    return gulp.src('build/*.js')
        .pipe(concat('minimal-binding.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('minimal-binding.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['auditor', 'component']);

// ----------------------module--------------------------

gulp.task('auditor', function() {  
    return gulp.src(srcFiles)
        .pipe(rollup({
            format: 'umd',
            "plugins": [
                require("rollup-plugin-babel")({
                "presets": [["es2015", { "modules": false }]],
                "plugins": ["external-helpers"]
                })
            ], 
            sourceMap: true,
            moduleName: 'Auditor',
            entry: ['./src/auditor.js'],
            banner, 
        }))
        .pipe(gulp.dest(buildFolder));
});
gulp.task('component', function() {  
    return gulp.src(srcFiles)
        .pipe(rollup({
            allowRealFiles: true,
            format: 'umd',
            "plugins": [
                require("rollup-plugin-babel")({
                "presets": [["es2015", { "modules": false }]],
                "plugins": ["external-helpers"]
                })
            ], 
            sourceMap: true,
            moduleName: 'Component',
            entry: ['./src/component.js'],
            banner, 
        }))
        .pipe(gulp.dest(buildFolder));
});