#!/bin/sh
# Repro for feedback/05: unauthenticated status of the somnia-skills repo linked from the docs.
for u in https://github.com/somnia-chain/somnia-skills https://api.github.com/repos/somnia-chain/somnia-skills; do
  printf '%s -> ' "$u"; curl -s -o /dev/null -w '%{http_code}\n' "$u"
done
