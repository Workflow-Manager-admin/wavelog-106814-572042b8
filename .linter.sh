#!/bin/bash
cd /home/kavia/workspace/code-generation/wavelog-106814-572042b8/wave_log_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

