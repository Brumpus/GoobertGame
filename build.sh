#!/bin/bash

for file in *.jsx; do
        [ -f "$file" ] || continue
    output="${file%.jsx}.js"
    npx babel --presets @babel/preset-react "$file" --out-file "$output"
done
