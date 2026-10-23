# dreamDEX Perps Builder Bounty — Feedback track

Reproducible feedback for the dreamDEX perps testnet (Somnia Hideki, chain 50383, `@somnia-chain/markets-sdk@0.32.1`). There is one Markdown file per issue in [`feedback/`](feedback/), each with `Severity`, `Area`, Steps to reproduce, Expected, Actual, Evidence and Environment. Evidence scripts and their captured output are in [`repro/`](repro/).

Every check is read-only (view calls and `eth_call` simulations). No private keys were used and no transactions were sent.

## Issues (6)

| # | Issue | Severity | Area |
|---|---|---|---|
| 01 | [Paper USDso can open positions in all six markets the docs say it is blocked from (allowlist = all 21 pools)](feedback/01-paper-usdso-allowlist-not-enforced.md) | major | contracts |
| 02 | [“Open interest cap” column stale for 20 of 21 markets (live caps 2×–4×)](feedback/02-oi-cap-column-stale.md) | normal | docs |
| 03 | [“Position cap = 1/10 of OI cap on most markets” holds on only 1 of 21 markets](feedback/03-position-cap-not-a-tenth.md) | normal | docs |
| 04 | [Wrong-scale owner `placeOrder` reverts “insufficient allowance”, not the documented message](feedback/04-wrong-scale-error-message.md) | normal | docs |
| 05 | [`github.com/somnia-chain/somnia-skills` link returns 404](feedback/05-somnia-skills-link-404.md) | normal | docs |
| 06 | [`PerpMarket.baseSymbol` JSDoc says “WBTC”, SDK returns “BTC”](feedback/06-sdk-basesymbol-jsdoc.md) | normal | SDK |

Totals: 0 critical, 1 major, 5 normal.

## Reproduce

```
cd repro && npm i            # installs @somnia-chain/markets-sdk@0.32.1 + viem
node voucher-allowlist.mjs   # 01  (node t7.mjs: allowlist for all 21 pools)
node t4.mjs                  # 02, 03
node wrong-scale.mjs         # 04
sh links-404.sh              # 05
node basesymbol.mjs          # 06
```

The SDK needs WebSocket access to `wss://api.hideki2.infra.testnet.somnia.network/ws`. Captured outputs from 2026-10-23 are in `repro/*.out.txt`.

## Submitter

- Payout address (EVM): `0x4541e6cf14842C77bCC1b1c942846f28542DF8b8`
- Contact: fiowind.zfx@gmail.com
