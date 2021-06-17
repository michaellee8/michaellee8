const fs = require("fs");
const process = require("process");
const remark = require("remark");
const recommended = require("remark-preset-lint-recommended");
const html = require("remark-html");
const gfm = require("remark-gfm");

const ourDir = `${__dirname}/../../out/home/`;

let mdText = fs.readFileSync(`${__dirname}/../../README.md`, "utf-8");

const target = process.argv[2] ? process.argv[2] : null;

const startRegex = /start-only\[(\w+)\]: ((?:[\w\.]+,?)+)/;

const endRegex = /end-only\[(\w+)\]/;

function getOnlyMarkersPosition(text) {
  const lines = text.split("\n");
  let startMarkers = {};
  let endMarkers = {};
  for (let [i, line] of lines.entries()) {
    const startMatch = line.match(startRegex);
    if (startMatch !== null) {
      const [_, tagId, targetStr] = startMatch;
      startMarkers[tagId] = { line: i, targets: targetStr.split(",") };
    }
    const endMatch = line.match(endRegex);
    if (endMatch !== null) {
      const [_, tagId] = endMatch;
      endMarkers[tagId] = { line: i };
    }
  }
  let markers = {};
  for (let [k, v] of Object.entries(startMarkers)) {
    markers[k] = { start: v.line, end: endMarkers[k].line, targets: v.targets };
  }
  return markers;
}

function removeLines(text, lineIndices) {
  const lineToRemove = Symbol("lineToRemove");
  let lines = text.split("\n");
  for (let [i, line] of lines.entries()) {
    if (lineIndices.indexOf(i) !== -1) {
      lines[i] = lineToRemove;
    }
  }
  lines = lines.filter((l) => l !== lineToRemove);
  return lines.join("\n");
}

if (target) {
  const markers = getOnlyMarkersPosition(mdText);
  let lineIndices = [];
  for (let [_, marker] of Object.entries(markers)) {
    if (marker.targets.indexOf(target) !== -1) {
      lineIndices.push(marker.start, marker.end);
    }
  }
  mdText = removeLines(mdText, lineIndices);
}

remark()
  .use(recommended)
  .use(html)
  .use(gfm)
  .process(mdText, function (err, file) {
    if (err) {
      console.log(err);
      return;
    }
    let output = String(file);
    output = `
<html>
<head>
<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
<meta content="utf-8" http-equiv="encoding">
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>michaellee8.com</title>
<script src="script.js"></script>
<link rel="stylesheet" href="https://unpkg.com/marx-css/css/marx.min.css">
<link rel="stylesheet" href="style.css"/>
</head>
<body>
<main>
${output}
</main>
</body>
</html>
    `;
    fs.writeFileSync(`${ourDir}/index.html`, output);
  });
