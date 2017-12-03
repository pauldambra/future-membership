var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// gulpicon stuff (tidy this)
var glob = require("glob");
var gulp = require("gulp");
var gulpicon = require("gulpicon/tasks/gulpicon");

// grab the config, tack on the output destination
var config = require("gulpicon/example/config.js");
config.dest = "icons";

// grab the file paths
var files = glob.sync("_icons/*.svg");

// set up the gulp task
gulp.task("icons", gulpicon(files, config));


/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        },
        ghostMode: false,
        notify: false
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('scss/main.scss')
        .pipe(sass({

            includePaths: [
              'node_modules/coop-frontend-toolkit/styles/',
              'components/',
              'scss'
            ]
//            outputStyle: 'compressed'
        }))
        .on('error', function(err) {
          console.log(err.messageFormatted);
          this.emit('end');
        })
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('public/css'));
//        .pipe(browserSync.reload({stream:true}))
//        .pipe(gulp.dest('css'));
});

gulp.task('js', function() {
    return gulp.src(['js/src/jquery-1.12.4.min.js',
      'js/src/bootstrap.min.js',
      'js/src/jquery.inview.js',
      'js/src/main.js'])
    .pipe(concat('production.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(['components/**/*.scss','scss/*.scss'], ['sass']);
//    gulp.watch('js/src/*.js', ['js']);
//    gulp.watch(['**/*.html', 'js/*.js', 'images/*.jpg', 'images/*.png', '!{_site,_site/**}'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
//gulp.task('default', ['browser-sync', 'watch']);
gulp.task('default', ['sass','watch']);
