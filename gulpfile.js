const { src, dest, watch, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('cssnano');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps')
const terser = require('gulp-terser-js');
const autoprefixer = require('gulp-autoprefixer');

const paths = {
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js'
}

function js(done){
  src(paths.js)
    .pipe( plumber() )
    .pipe( sourcemaps.init() )
    .pipe( terser() )
    .pipe( sourcemaps.write('.') )
    .pipe( dest('build/js') )
  done();
}

function css(done){
  src(paths.scss)
    .pipe( plumber() )
    .pipe( sourcemaps.init() )
    .pipe( sass() )
    .pipe( autoprefixer(), cssnano() )
    .pipe( sourcemaps.write('.') )
    .pipe( dest('build/css') )
  done();
}

function watchArchivos(){
  watch( paths.scss, css );
  watch( paths.js, js );
}

exports.css = css;
exports.js = js;
exports.watchArchivos = watchArchivos;
exports.default = parallel(css, js, watchArchivos);