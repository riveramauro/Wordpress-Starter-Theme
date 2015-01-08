'use strict';

var gulp = require('gulp');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var sass =  require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var bowerDir = 'bower_components/';

gulp.task('sass', function (){
	var sassConfig = {
		includePaths: ['bower_components/foundation/scss'],
		outputStyle: (argv.dev ? 'nested' : 'compressed' ),
		errLogToConsole: true
	};
	return gulp.src('./sass/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass(sassConfig))
		.pipe(autoprefixer('last 2 versions', 'ie 8', 'ie 9', 'ios 6', 'android 4'))
		.pipe(gulpif(argv.dev, sourcemaps.write()))
		.pipe(gulp.dest('./css'))
		.pipe(reload({stream:true}));
});

gulp.task('js-libraries', function(){
	return gulp.src([
			bowerDir + 'modernizr/modernizr.js',
			bowerDir + 'foundation/js/foundation.js'
		])
		.pipe(concat('libraries.js'))
		.pipe(gulpif(!argv.dev, uglify()))
		.pipe(gulp.dest('./js'));
});

gulp.task('js-script', function(){
	return gulp.src('./js/script.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(gulpif(!argv.dev, concat('script.min.js')))
		.pipe(gulpif(!argv.dev, uglify()))
		.pipe(gulp.dest('./js'));
});

gulp.task('js', ['js-libraries', 'js-script']);

gulp.task('browser-sync', function(){
	browserSync.init(['./css/style.css', './js/script.js', '*.php'], {
        proxy: 'http://laiglesia.dev' // Add local url ex: wp.devsite.dev
        // host: '127.94.0.1'
    });
});

gulp.task('watch', function(){
	gulp.watch('./sass/*.scss', ['sass']);
	gulp.watch('./js/*.js', ['js-script']);
});

gulp.task('default', ['sass', 'js', 'watch', 'browser-sync']);