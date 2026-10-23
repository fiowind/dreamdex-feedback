# `PerpMarket.baseSymbol` JSDoc says e.g. "WBTC", but the SDK returns "BTC"

Severity: normal
Area: SDK

## Steps to reproduce
1. Look at `@somnia-chain/markets-sdk@0.32.1` → `dist/markets.d.ts`, type `PerpMarket`:
   - `/** Synthetic-base symbol (e.g. "WBTC"); null when the wrapper exposes none. */ baseSymbol`
   - `baseToken` similarly says "Wrapper token standing in for the synthetic base (e.g. WBTC)".
2. `cd repro && npm i && node basesymbol.mjs`, i.e. `(await markets.client.listPerpMarkets()).map(m => m.baseSymbol)`.

## Expected
Per the JSDoc: wrapper symbols such as "WBTC".

## Actual
`["ZRO","LIT","VVV","1000PEPE","PUMP","ZEC","TAO","WLD","NEAR","XLM","AVAX","LINK","SUI","ADA","BNB","DOGE","XRP","HYPE","SOL","ETH","BTC"]`: plain symbols. That is also what the docs' own example relies on (`perps.find((m) => m.baseSymbol === "BTC")`). A developer who follows the IntelliSense hint and matches on `"WBTC"` gets `undefined`, and the `!` in the docs example then turns that into a crash further down.

## Evidence
- Script: [`repro/basesymbol.mjs`](../repro/basesymbol.mjs); output (incl. the `d.ts` lines mentioning WBTC): [`repro/basesymbol.out.txt`](../repro/basesymbol.out.txt)

## Environment
- SDK: `@somnia-chain/markets-sdk@0.32.1` (the version the docs pin), `viem@2.57.10`, Node 20.19.2, Linux
- Network: Somnia Hideki / "Tokyo" perps testnet, chain id 50383, RPC `https://api.hideki2.infra.testnet.somnia.network`, indexer `https://hideki-dev.smk.somnia.host/v1/graphql`
- Wallet: none. Every check is a read or an `eth_call` simulation; nothing was signed or sent
- Observed: 2026-10-23 ~05:40–05:50 UTC (around block 30,823,131)
