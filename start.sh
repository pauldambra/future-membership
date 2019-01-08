#!/usr/bin/env bash

echo "Running Fractal and Gulp"
npx fractal start --watch --sync &
npx gulp
