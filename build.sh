#!/bin/bash

for f in ./functions/*; do npx esbuild --bundle "$f" --platform=node > "${f/ts/js}"; done
find . -wholename "./functions/*.ts" -exec rm {} \;