#!/bin/bash

# Fix import paths in all tool files
find src/tools -name "*.ts" -exec sed -i '' 's|from "../utils/|from "../lib/utils/|g' {} \;

echo "Updated import paths in all tool files"