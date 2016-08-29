var gulp = require('gulp');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('sass', function(){
    gulp.src('src/css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('tsc', function(){
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest('./dist/js'));
});

//Watch task
gulp.task('default',function() {
    gulp.watch('sass/**/*.scss',['styles']);
});