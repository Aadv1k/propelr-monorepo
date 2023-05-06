#!/bin/bash

ENV_FILE=".env"

if ! test -f $ENV_FILE; then
  echo "[ERROR] Need a .env file for backend to work"
  exit
fi

echo "[INFO] Installing deps for backend"
npm install --workspace="@propelr/backend"
echo "[INFO] Building @proprlr/backend"
npm run build --workspace="@propelr/backend"
