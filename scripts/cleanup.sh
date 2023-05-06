#!/bin/bash 

echo "$0: Cleaning up..."
find . -type d \( -path "*/node_modules/*" -prune -o \( -name "build" -o -name "dist" -o -name "html-cache" \) \) -exec rm -r {} \;
echo "$0: Done"
