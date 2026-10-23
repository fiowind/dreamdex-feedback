# The `somnia-chain/somnia-skills` repo linked from two doc pages returns 404

**Severity:** normal
**Area:** docs

## Where
- `developers/contracts/spot-router.md` (line ~502): "`dex-spot-router-interaction` Claude skill → https://github.com/somnia-chain/somnia-skills"
- `trading/spot/operators.md` (line ~90): "`dex-operator-trading` ... https://github.com/somnia-chain/somnia-skills"

## Steps to reproduce
`curl -s -o /dev/null -w "%{http_code}" https://github.com/somnia-chain/somnia-skills` → `404`
`curl -s -o /dev/null -w "%{http_code}" https://api.github.com/repos/somnia-chain/somnia-skills` → `404`

## Expected
A public repo containing the two agent skills.

## Actual
404 when signed out. The repo is either private or was renamed. I checked all 56 unique external links in the docs (llms.txt mirror), and this was the only broken GitHub link.

## Environment
- Docs as served at https://app.testnet.dreamdex.io/llms.txt on 2026-10-23
- Checked with curl, unauthenticated
