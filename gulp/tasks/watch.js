const { watch } = require('gulp');
const { ajax } = require('./ajax');
const { fonts, images, svg, favicons } = require('./assets');
const { styles } = require('./styles');
const { html } = require('./html');
const { vendor } = require('./vendor');
const config = require('../config');

function watchFiles () {
  watch(`${config.src.ajax}/*.*`, ajax);
  watch(`${config.src.sass}/**/*.{sass,scss}`, styles);
  // css
  watch(`${config.src.css}/**/*.css`, vendor);
  // html
  watch(`${config.src.templates}/**/*.html`, html);
  // assets
  watch(`${config.src.fonts}/*.{${config.ext.fonts}}`, fonts);
  watch(`${config.src.images}/*.{${config.ext.images}}`, images);
  watch(`${config.src.images}/svg/*.{${config.ext.images}}`, svg);
  watch(`${config.src.favicons}/*.*`, favicons);
}

exports.watchFiles = watchFiles;
