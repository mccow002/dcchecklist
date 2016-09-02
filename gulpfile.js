var gulp = require('gulp');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');
var browserify = require('browserify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('gulp-watchify');
var buffer = require('vinyl-buffer');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var connect = require('gulp-connect');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('sass', function(){
    return gulp.src('src/css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'))
        .pipe(livereload());
});

gulp.task('typescript', function(){
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest('./dist/server'))
        .pipe(notify('Finished compiling typescript'))
        .pipe(livereload());
});

gulp.task('browserify', function () {

    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/js/checklist-app.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("dist/js"))
    .pipe(notify('Finished browserify'))
    .pipe(livereload());
});

gulp.task('connect', function() {
  connect.server({
    root: '/',
    livereload: true
  });
});

gulp.task('watch', function() {
    gulp.watch('src/css/*.scss',['sass']);
    gulp.watch('src/js/**/*.ts', ['browserify']);

    livereload.listen({ 
        start: true,
        post: 35729
    });
});

gulp.task('build', ['sass', 'typescript', 'browserify']);