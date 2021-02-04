let {src, dest} = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  fileinclude = require('gulp-file-include'),
  ttf2woff2 = require('gulp-ttf2woff2'),
  ttf2woff = require('gulp-ttf2woff'),
  gcmq = require('gulp-group-css-media-queries'),
  cleanCSS = require('gulp-clean-css')

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./dist/"
    },
    port: 3002
  })
}

function html() {
  return src(['./src/*.html', '!./src/_*.html'])
    .pipe(fileinclude())
    .pipe(dest('./dist/'))
    .pipe(browsersync.stream())
}

function js() {
  return src('./src/js/*.js')
    .pipe(dest('./dist/js/'))
    .pipe(browsersync.stream())
}

function css() {
  return src(['./src/scss/*.scss', '!./src/scss/_*.scss'])
    .pipe(sass())
    .pipe(gcmq())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(autoprefixer({
      overrideBrowserlist: ["last 5 version"],
      cascade: true
    }))
    .pipe(dest('./dist/css/'))
    .pipe(browsersync.stream())
}

function images() {
  return src('./src/images/*.{jpg, png, svg, gif, webp, ico}')
    .pipe(dest('./dist/images/'))
    .pipe(browsersync.stream())
}

function fonts() {
  src(['./src/fonts/*.ttf'])
    .pipe(ttf2woff())
    .pipe(gulp.dest('./dist/fonts/'))
  return src(['fonts/*.ttf'])
    .pipe(ttf2woff2())
    .pipe(gulp.dest('./dist/fonts/'));
}

function watchFiles() {
  gulp.watch(['./src/*.html'], html)
  gulp.watch(['./src/scss/*.scss'], css)
  gulp.watch(['./src/images/*.{png, jpg, gif, svg, webp}'], images)
  gulp.watch(['./src/fonts/*'], fonts)
  gulp.watch(['./src/js/*'], js)
}

let build = gulp.series(gulp.parallel(html, css, images, fonts, js))
let watch = gulp.parallel(build, watchFiles, browserSync)

exports.js = js
exports.images = images
exports.html = html
exports.watchFiles = watchFiles
exports.css = css
exports.build = build
exports.watch = watch
exports.default = watch