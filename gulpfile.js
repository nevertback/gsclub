let gulp = require('gulp'),
rename = require('gulp-rename'),
uglify = require('gulp-uglify'),
autoprefixer = require('gulp-autoprefixer'),
cleanCSS = require('gulp-clean-css'),
concat = require('gulp-concat'),
sass = require('gulp-sass'),
notify = require('gulp-notify'),
plumber = require('gulp-plumber'),
browserSync = require('browser-sync').create(),
reload= browserSync.reload,
fileinclude = require('gulp-file-include'),
sourcemaps = require('gulp-sourcemaps'),
babel = require("gulp-babel"),
clean = require('gulp-clean');
//目录
let rootpath = 'project/';
//其他目录
let myroot = rootpath,
	mypath = {		
		css:       rootpath + 'css',            //css输出目录		
		sass:      rootpath + 'sass/*.scss',    //sass目录		
		js:        rootpath + 'js/',            //js目录
		jsmin:     rootpath + 'jsmin/',         //js输出目录
        ol:        rootpath + 'ol/',            //ol目录
		tpl:       rootpath + 'tpl/'            //模板目录
	};
//include html
gulp.task('fileinclude', function() {
    gulp.src(mypath.tpl + '*.html')
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(gulp.dest(myroot));
});
//css
gulp.task('dosass',function(){
    return gulp.src(mypath.sass)
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(sass({outputStyle: 'compact'}).on('error',sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true,
            remove:false
        }))
        .pipe(cleanCSS({format: 'keep-breaks'}))
        .pipe(gulp.dest(mypath.css))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(mypath.css))
        .pipe(reload({stream: true}));
});
//js
gulp.task('jsmin', function() {
  return gulp.src(mypath.js+'*.js')
	  .pipe(sourcemaps.init())
      .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
      .pipe(gulp.dest(mypath.jsmin))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(mypath.jsmin));
});
let reloadFiles = [
    mypath.jsmin + "*.js",
	mypath.ol + "*.js",
    myroot + "ja/*.js",
    myroot + "ja/wap/*.js",
	myroot + "*.html"
];
gulp.task('develop', function() {
	browserSync.init({
        server: myroot,
        open:'external'
    });
	gulp.watch([mypath.sass], ['dosass']);
	gulp.watch([mypath.js + '*.js'], ['jsmin']);
	gulp.watch([mypath.tpl + "*.html",mypath.tpl + "*/*.html"], ['fileinclude']);
	gulp.watch(reloadFiles).on('change', reload);
});
let distFiles = [
    myroot + '*.html',
    mypath.css + '/*.css',
    mypath.jsmin + '/*.js',
    mypath.ol + '/*.js'
];
gulp.task('cleandist',function () {
    return gulp.src('dist')
        .pipe(clean());
});
gulp.task('build',function(){
	return gulp.src(distFiles,{base:'project'})
		.pipe(gulp.dest('dist'));
});
gulp.task('dev',['develop']);
gulp.task('pub',['cleandist'],function () {
    gulp.start('build');
});