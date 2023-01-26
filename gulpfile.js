const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const purgecss = require("gulp-purgecss");
const uglify = require("gulp-uglify");

function buildStyles() {
  return (
    src("scss/**/*.scss")
      .pipe(sass({ outputStyle: "compressed" }))
      // .pipe(purgecss({ content: ["*.html"] }))
      .pipe(dest("css"))
  );
}

function watchTask() {
  watch(["scss/**/*.scss", "*.html"], buildStyles);
}

function buildJavascript() {
  return src("javascript/*.js").pipe(uglify()).pipe(dest("js"));
}

exports.default = series(buildStyles, buildJavascript, watchTask);
