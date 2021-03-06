// Use DefinePlugin (Webpack) or loose-envify (Browserify)
// together with Uglify to strip the dev branch in prod build.
if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod.store");
} else {
  module.exports = require("./dev.store");
}
