#!/usr/bin/env bash
#
# Script to initialize chemocompile repo
# - install required node packages
# - install required bower packages
# - install git hooks


node=`which node 2>&1`
if [ $? -ne 0 ]; then
  echo "Please install NodeJS."
  echo "http://nodejs.org/"
  exit 1
fi

npm=`which npm 2>&1`
if [ $? -ne 0 ]; then
  echo "Please install NPM."
fi

cd ui/
echo "Installing required npm packages..."
npm install

echo "Installing required JavaScript vendors..."
bower install
