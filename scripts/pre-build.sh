#!/bin/bash

ENV_FILE=".env"
TS_CONFIG_PATH="./packages/common/config/OAuthConfig.ts"
CHORES=1

if [ $CHORES -ne 1 ] ; then 
  echo "[ERROR] chores are not properly defined" 
  exit
fi

printf "$0: $CHORES chores \n"

if ! test -f $ENV_FILE; then
  echo "[ERROR] Need a .env file for propelr to work"
  exit
fi


GOOGLE_CLIENT_ID=`cat .env | grep GOOGLE_CLIENT_ID  | awk -F '"' '{print $2}'`
GOOGLE_CLIENT_SECRET=`cat .env | grep GOOGLE_CLIENT_SECRET  | awk -F '"' '{print $2}'`

if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
  echo "[ERROR] One or more environment variables are not set"
  exit 1
fi


tsConfigFile=$(cat << EOF
export default {
  GOOGLE_AUTH: {
    CLIENT_ID: "$GOOGLE_CLIENT_ID" ,
    REDIRECT: 'https://propelr.netlify.app/register',
  },
}
EOF
)

`echo "$tsConfigFile" > $TS_CONFIG_PATH`

printf "  Wrote public .env vars to $TS_CONFIG_PATH\n"
