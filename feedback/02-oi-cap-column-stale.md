# The "Open interest cap" column in the perps market table is stale for 20 of 21 markets

**Severity:** normal
**Area:** docs

## Steps to reproduce
1. Run `repro/t4.mjs`. It calls `client.getPerpRiskParams(pool)` for every row of `client.listPerpMarkets()` and formats `maxOpenInterest` with `baseDecimals`.
2. Compare the output with the "Open interest cap" column in `trading/perps-testnet/README.md#markets`. The note under that table says: "These figures are read from the live markets".

## Expected
The live caps match the table, or the table says when it was last read.

## Actual
Only TAO matches. Every other cap on chain is 2× or 4× the documented figure:

| Market | Docs | Live `maxOpenInterest` | × |
|---|---|---|---|
| BTC | 246.81545 | 493.6309 | 2 |
| ETH | 3,995.6125 | 7,991.225 | 2 |
| HYPE | 23,812.72 | 47,625.44 | 2 |
| SOL | 47,654.44 | 95,308.88 | 2 |
| XRP | 344,632 | 1,378,528 | 4 |
| ADA | 2,254,678 | 9,018,712 | 4 |
| AVAX | 66,672.2 | 266,688.8 | 4 |
| BNB | 693.975 | 2,775.9 | 4 |
| DOGE | 5,613,590 | 22,454,360 | 4 |
| LINK | 42,643.6 | 170,574.4 | 4 |
| NEAR | 250,410 | 1,001,640 | 4 |
| SUI | 635,009 | 2,540,036 | 4 |
| XLM | 2,677,780 | 10,711,120 | 4 |
| 1000PEPE | 130,285,600 | 521,142,400 | 4 |
| LIT | 138,896.6 | 555,586.4 | 4 |
| PUMP | 87,993,700 | 351,974,800 | 4 |
| VVV | 21,786.14 | 87,144.56 | 4 |
| WLD | 1,264,000 | 5,056,000 | 4 |
| ZEC | 420 | 1,680 | 4 |
| ZRO | 250,599.5 | 1,002,398 | 4 |
| TAO | 2,185.491 | 2,185.491 | 1 |

The other columns are correct for all 21 markets: max leverage, IM/MM, tick, min size, and base decimals.

## Evidence
`repro/t4.mjs` prints a `console.table` of `maxOpenInterest`, `maxPositionSize`, IM/MM/close-out bps, tick and min size for each market.

## Environment
- SDK: `@somnia-chain/markets-sdk@0.32.1` (the version the docs pin), `viem@2.57.10`, Node 20.19.2, Linux
- Network: Somnia Hideki / "Tokyo" perps testnet, chain id 50383, RPC `https://api.hideki2.infra.testnet.somnia.network`, indexer `https://hideki-dev.smk.somnia.host/v1/graphql`
- Wallet: none. Every check is a read or an `eth_call` simulation, with nothing signed or sent
- Observed: 2026-10-23 ~05:40–05:50 UTC (around block 30,823,131)
