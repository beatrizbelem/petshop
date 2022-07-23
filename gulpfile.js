const $ = require('gulp-load-plugins')(),
  browserSync = require('browser-sync').create(),
  del = require('del'),
  gulp = require('gulp')

function clean() {
  return del('build'), del('maps')
}

function html() {
  return gulp
    .src('source/**/*.html')
    .pipe(
      $.htmlmin({
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
      })
    )
    .pipe(gulp.dest('build'))
}

function css() {
  return gulp
    .src('source/styles/main.scss')
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer({ overrideBrowserslist: ['last 2 versions'] }))
    .pipe($.cssnano())
    .pipe($.sourcemaps.write('../maps'))
    .pipe(gulp.dest('build'))
    .pipe(browserSync.stream())
}

function js() {
  return gulp
    .src('source/scripts/main.js')
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.concat('main.js'))
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'))
    .pipe($.babel())
    .pipe($.uglify())
    .pipe($.sourcemaps.write('../maps'))
    .pipe(gulp.dest('build'))
}

function images() {
  return gulp
    .src('source/images/**/*')
    .pipe(
      $.imagemin([
        $.imagemin.gifsicle({ interlaced: true }),
        $.imagemin.mozjpeg({ progressive: true }),
        $.imagemin.optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(gulp.dest('build/images'))
}

function watch() {
  gulp.watch('source/**/*.html', html).on('change', browserSync.reload)
  gulp.watch('source/scripts/*.js', js).on('change', browserSync.reload)
  gulp.watch('source/styles/**/*.scss', css)
  gulp.watch('source/images/**/*', images).on('change', browserSync.reload)

  browserSync.init({
    server: {
      baseDir: 'build',
    },
    browser: 'google chrome',
    notify: false,
  })
}

exports.default = gulp.series(clean, html, css, js, images, watch)
