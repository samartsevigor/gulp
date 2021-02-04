let {src, dest} = require('gulp')
let gulp = require('gulp')
let browsersync = require('browser-sync').create();
let sass = require('gulp-sass')
let autoprefixer = require('gulp-autoprefixer')
let fileinclude = require('gulp-file-include')
let imagemin = require('gulp-imagemin')
let ttf2woff2 = require('gulp-ttf2woff2')
let ttf2woff = require('gulp-ttf2woff')

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./dist/"
    },
    port: 3002
  })
}

function html () {
  return src(['./src/*.html', '!./src/_*.html'])
    .pipe(fileinclude())
    .pipe(dest('./dist/'))
    .pipe(browsersync.stream())
}

function css () {
  return src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserlist:["last 5 version"],
      cascade: true
    }))
    .pipe(dest('./dist/css/'))
    .pipe(browsersync.stream())
}
function images () {
  return src('./src/images/*.{png, jpg, gif, svg, webp}')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      interlaced: true,
      optimizationLevel: 3
    }))
    .pipe(dest('./dist/images/'))
    .pipe(browsersync.stream())
}

function fonts () {
  src(['./src/fonts/*.ttf'])
    .pipe(ttf2woff())
    .pipe(gulp.dest('./dist/fonts/'))
  return src(['fonts/*.ttf'])
    .pipe(ttf2woff2())
    .pipe(gulp.dest('./dist/fonts/'));
}

function watchFiles () {
  gulp.watch(['./src/*.html'], html)
  gulp.watch(['./src/scss/*.scss'], css)
  gulp.watch(['./src/images/*.{png, jpg, gif, svg, webp}'], images)
  gulp.watch(['./src/fonts/*'], fonts)
}

let build = gulp.series(gulp.parallel(html,  css, images, fonts))
let watch = gulp.parallel(build,watchFiles,browserSync)

exports.images = images
exports.html = html
exports.watchFiles = watchFiles
exports.css = css
exports.build = build
exports.watch = watch
exports.default = watch