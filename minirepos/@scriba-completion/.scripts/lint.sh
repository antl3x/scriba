#!/bin/bash
set -e

echo "Linting..."
eslint --fix --ext .jsx,.ts,.tsx ./
prettier --write --ignore-path --ignore-path .eslintignore --loglevel warn ./src
