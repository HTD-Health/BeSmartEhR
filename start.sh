#!/bin/bash

# Default to practitioner-app if DEPLOY_APP is not set
APP_DIR=${DEPLOY_APP:-practitioner-app}

# Change to the specified app directory and start
cd "$APP_DIR" && npm start