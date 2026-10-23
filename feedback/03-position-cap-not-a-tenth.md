# "Per-account position cap is a tenth of the OI cap on most markets" is wrong: it is a tenth on only 1 of 21 markets

**Severity:** normal
**Area:** docs

## Where
- `trading/perps-testnet/README.md`, the note under the market table: "A single account is capped at a tenth of it on most markets."
- `developers/perps-testnet/README.md`, Common pitfalls: "Each account has a position cap per market, a tenth of the market's open interest cap on most markets."

## Steps to reproduce
Run `repro/t4.mjs`. For each pool it reads `getPerpRiskParams(pool)` and prints the ratio `maxOpenInterest / maxPositionSize`.

## Expected
A ratio of about 10 on most markets.

## Actual
The ratio is 10 only on TAO. Every other market has a much smaller per-account cap than the docs imply:
- **20×** on all 10x and 20x markets except BTC: ETH, SOL, HYPE, XRP, ADA, AVAX, BNB (19.8), DOGE, LINK, NEAR (20.03), SUI, XLM
- **40×** on ZRO, LIT, VVV, 1000PEPE, PUMP and WLD
- **4×** on ZEC (cap 420 of 1,680)
- **4.94×** on BTC (cap 100 BTC of 493.63)

A bot that sizes from the docs' rule would therefore hit `MaxPositionSizeExceeded()` at half or a quarter of the size it expects. One suggestion: tell readers to read `maxPositionSize` from `getPerpRiskParams` or `getMaxPerpOrderSize` rather than giving a ratio.

## Evidence
`repro/t4.mjs` output, "ratio" column, e.g. `BTC maxPos 100 / oi 493.6309 = 4.936`, `ETH 399.5612 / 7991.225 = 20.000`, `ZRO 25059.9 / 1002398 = 40.000`, `TAO 218.549 / 2185.491 = 10.000`.

## Environment
- SDK: `@somnia-chain/markets-sdk@0.32.1` (the version the docs pin), `viem@2.57.10`, Node 20.19.2, Linux
- Network: Somnia Hideki / "Tokyo" perps testnet, chain id 50383, RPC `https://api.hideki2.infra.testnet.somnia.network`, indexer `https://hideki-dev.smk.somnia.host/v1/graphql`
- Wallet: none. Every check is a read or an `eth_call` simulation, with nothing signed or sent
- Observed: 2026-10-23 ~05:40–05:50 UTC (around block 30,823,131)
