#!/bin/bash

COMMON="@propelr/common"
FRONTEND="@propelr/frontend"

npm install --workspace="$COMMON"
npm install --workspace="$FRONTEND"

npm run build --workspace="$COMMON"
npm run build --workspace="$FRONTEND"
