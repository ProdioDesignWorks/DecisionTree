#!/bin/sh
rm -rf lib/
# ./node_modules/.bin/babel --presets es2015 src/ --out-dir lib/
BABEL_ENV=development babel src --out-dir lib