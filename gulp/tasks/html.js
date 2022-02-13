const { src, dest } = require('gulp');
const changed = require('gulp-changed');
const prettify = require('gulp-prettify');
const { server } = require('./server');
const config = require('../config');

function html () {
  return src(`${config.src.templates}/*.html`)
    .pipe(changed(config.dest.html))
    .pipe(prettify({
      indent_size: 4,
      wrap_attributes: 'auto',
      preserve_newlines: false,
      // unformatted: [],
      end_with_newline: true
    }))
    .pipe(dest(config.dest.html))
    .pipe(server.reload({stream: true}));
}

exports.html = html;
