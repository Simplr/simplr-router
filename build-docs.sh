#!/bin/bash

cd rocket-docs
npm run docs
cd ..
cp -r rocket-docs/_site/* docs/
