#!/bin/bash
# Reset the demo speaking lesson on dev (fresh transcript, no mistakes/vocabulary, status review).
cd /home/user/Omnica-English
ARGS=$(python3 -c "
import json;a={x['key']:x['externalId'] for x in json.load(open('.qa/accounts.json'))['accounts']}
print(json.dumps({'teacherId':a['teacher'],'studentId':a['student']}))")
NODE_USE_ENV_PROXY=1 npx convex run qaDemo:seedSpeakingLesson "$ARGS" 2>&1 | grep -v -i "warning\|trace-warn"
