#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

cd $SCRIPT_DIR

cp ../../resume.yaml .

cat resume.yaml | yq e -j > resume.json

resume export --theme elegant resume.html

mkdir -p ../../out/resume/assets

mv resume.html ../../out/resume/


rm resume.yaml resume.json

rm -r ../../out/resume/assets/icomoon

cp -r ./node_modules/jsonresume-theme-elegant/assets/icomoon ../../out/resume/assets/icomoon


npm run build:pdf
