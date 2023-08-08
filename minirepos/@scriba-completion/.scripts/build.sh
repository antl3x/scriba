#!/bin/bash
set -e

echo "Building..."
tsc && vite build
