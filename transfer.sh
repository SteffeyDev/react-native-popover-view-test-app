#!/bin/bash
# Transfers react-native-popover-view package files to node_modules
# Usage: ./transfer.sh <path-to-package-dir>

PATH_TO_REACT_NATIVE_POPOVER_VIEW_PACKAGE_DIR=$1

[ -z "$1" ] && echo "Error: Package directory path required" && exit 1
[ ! -d "$1" ] && echo "Error: Invalid directory path" && exit 1

mkdir -p node_modules/react-native-popover-view || exit 1
cp -rf $1/package.json node_modules/react-native-popover-view
cp -rf $1/dist node_modules/react-native-popover-view

echo "Package files transferred successfully"
