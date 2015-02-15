var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var jshint = require('gulp-jshint');
var scsslint = require('gulp-scss-lint');

var paths = {
  sass: ['./scss/**/*.scss'],
  scripts: './scripts/**/*.js'
};

gulp.task('default', ['lint:sass', 'sass', 'lint:js', 'js']);

gulp.task('sass', function() {
  return gulp.src('./scss/ionic.app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./www/css/'))
});

gulp.task('lint:js', function(){
  gulp.src([paths.scripts])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint:sass', function(){
  gulp.src(paths.sass)
        .pipe(scsslint());
});

gulp.task('lint', ['lint:js', 'lint:sass']);

gulp.task('js', function() {
  gulp.src(['./scripts/_lib/**.*.js', './scripts/**/*.module.js', paths.scripts])
        .pipe(ngAnnotate())
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('www/js'))
        //.pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('www/js'))
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.scripts, ['js']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
