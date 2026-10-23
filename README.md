# dreamDEX Perps Builder Bounty — Feedback track

These are reproducible feedback items for the dreamDEX perps testnet: Somnia Hideki, chain 50383, SDK 0.32.1. There is one file per issue in `feedback/`. Every check is read-only, using view calls and `eth_call` simulations. No keys were used and no transactions were sent.

| # | Title | Severity | Area |
|---|---|---|---|
| 01 | Paper USDso can open positions in all six "blocked" markets (allowlist = all 21) | major | contracts/docs |
| 02 | OI cap column stale for 20/21 markets (live caps 2×–4×) | normal | docs |
| 03 | "Position cap = 1/10 of OI cap on most markets" holds on 1/21 markets | normal | docs |
| 04 | Wrong-scale owner placeOrder reverts "insufficient allowance", not documented message | normal | docs |
| 05 | github.com/somnia-chain/somnia-skills link 404 | normal | docs |
| 06 | PerpMarket.baseSymbol JSDoc says "WBTC", SDK returns "BTC" | normal | SDK |

## Reproduce
```
cd repro && npm i @somnia-chain/markets-sdk@0.32.1 viem
node voucher-allowlist.mjs   # item 01
node t4.mjs                  # items 02, 03
```
The SDK needs WebSocket access to `wss://api.hideki2.infra.testnet.somnia.network/ws`.

Payout address (EVM): 0x4541e6cf14842C77bCC1b1c942846f28542DF8b8
