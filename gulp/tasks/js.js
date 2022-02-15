const { src, dest, series } = require('gulp');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const { server } = require('./server');
const config = require('../config');

function jsCore () {
  return src(`${config.src.js}/*.js`)
    .pipe(plumber({
      errorHandler: config.errorHandler
    }))
    .pipe(babel())
    .pipe(dest(config.dest.js))
    .pipe(server.reload({stream: true}));
}

exports.jsCore = jsCore;

function jsVendor () {
  return src(`${config.src.js}/vendor/**/*.js`)
    .pipe(plumber({
      errorHandler: config.errorHandler
    }))
    .pipe(dest(config.dest.js))
    .pipe(server.reload({stream: true}));
}

exports.jsVendor = jsVendor;

exports.js = series(jsVendor, jsCore);
