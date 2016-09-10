var gulp = require('gulp');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');
var browserify = require('browserify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var connect = require('gulp-connect');
var watchify = require('watchify');
var gutil = require('gulp-util');
var pug = require('gulp-pug');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('views', function(){
    gulp.src('views/partials/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('dist/views'))
        .pipe(livereload());
});

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
        .pipe(notify({message: 'Finished compiling typescript', onLast: true}))
        .pipe(livereload());
});

var buildScripts = function (watch) {

    var bundler =  browserify({
            basedir: '.',
            debug: true,
            entries: ['src/js/checklist-app.ts'],
            cache: {},
            packageCache: {}
        })
        .plugin(tsify);

    var build = function(){
        return bundler
            .bundle()
            .pipe(source('bundle.js'))
            // .pipe(buffer())
            // .pipe(sourcemaps.init({loadMaps: true}))
            // .pipe(uglify())  
            // .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest("dist/js"))
            .pipe(notify({message: 'Finished browserify', onLast: true}))
            .pipe(livereload());
    }

    if(!watch){
        return build();
    }

    bundler
        .plugin(watchify)
        .on('update', function() {
            gutil.log(gutil.colors.grey('Rebuilding...'));
            build();
        })
        .on('log', gutil.log);

    return build();
};

gulp.task('browserify', function(){
    buildScripts(false);
})

gulp.task('connect', function() {
  connect.server({
    root: '/',
    livereload: true
  });
});

gulp.task('watch', function() {
    gulp.watch('src/css/*.scss',['sass']);
    //gulp.watch('src/js/**/*.ts', ['browserify']);
    gulp.watch('views/partials/*.pug', ['views']);
    gulp.watch('src/server/**/*.ts', ['typescript']);

    livereload.listen({ 
        start: true,
        post: 35729
    });

    buildScripts(true);
});

gulp.task('build', ['views', 'sass', 'typescript', 'browserify']);