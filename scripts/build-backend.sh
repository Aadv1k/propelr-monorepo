#!/bin/bash

COMMON="@propelr/common"
BACKEND="@propelr/backend"

npm install --workspace="$COMMON"
npm install --workspace="$BACKEND"

npm run build --workspace="$COMMON"
npm run build --workspace="$BACKEND"
