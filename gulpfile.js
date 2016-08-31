var gulp = require('gulp');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');
var browserify = require('browserify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps')


var tsProject = ts.createProject('tsconfig.json');

gulp.task('sass', function(){
    return gulp.src('src/css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('typescript', function(){
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest('./dist'));
});

var bundle = function () {

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
    .pipe(gulp.dest("dist/js"));

  // transform regular node stream to gulp (buffered vinyl) stream
//   var browserified = transform(function(filename) {
//       var b = browserify({ entries: filename, debug: true });
//       return b.bundle();
//   });

//   return gulp.src('./dist/js/js/checklist-app.js')
//              .pipe(browserified)
//              .pipe(sourcemaps.init({ loadMaps: true }))
//              .pipe(uglify())
//              .pipe(sourcemaps.write('./'))
//              .pipe(gulp.dest('./dist/js/js/main.js'));
};

//Watch task
gulp.task('watch',function() {
    gulp.watch('src/css/*.scss',['sass']);
    gulp.watch('*.ts', ['typescript'], function(){
        bundle();
    })
});

gulp.task('build', ['sass', 'typescript'], function(){
    bundle();
});