const theme = require("jsonresume-theme-elegant");

function render(resume) {
  return theme.render(resume);
}

module.exports = { resume };
