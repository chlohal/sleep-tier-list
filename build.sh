#!/bin/bash

for f in ./functions/*; do esbuild --bundle $f --platform=node > ${f/ts/js}; done