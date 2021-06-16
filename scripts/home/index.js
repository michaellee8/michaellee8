const fs = require("fs");
const process = require("process");

let mdText = fs.readFileSync(`${__dirname}/../../README.md`, "utf-8");

const target = process.argv[2] ? process.argv[2] : null;

const startRegex = /start-only\[(\w+)\]: ((?:[\w\.]+,?)+)/;

const endRegex = /end-only\[(\w+)\]/;

function getOnlyMarkersPosition(text) {
  const lines = text.split("\n");
  let startMarkers = {};
  let endMarkers = {};
  for (let line of lines) {
  }
}

if (target) {
}
