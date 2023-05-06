#!/bin/bash

echo "[INFO] Installing deps for backend"
npm install --workspace="@propelr/frontend"
echo "[INFO] Building @proprlr/frontend"
npm run build --workspace="@propelr/frontend"
