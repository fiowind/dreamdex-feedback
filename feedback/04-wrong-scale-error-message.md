# A wrong-scale owner `placeOrder` reverts with "insufficient allowance", not the documented "transfer amount exceeds balance"

Severity: normal
Area: docs

## Steps to reproduce
1. `cd repro && npm i && node wrong-scale.mjs`.
2. It `eth_call`s SOL-PERP `placeOrder(true, 0, 0.8×mark (tick-aligned), 1e17 /* 0.1 SOL at 18 decimals; SOL has 9 */, GTC, 0, 0, 0x0, 0)` from two ordinary accounts:
   - a paper-voucher account (`0x13e98d26cec65ac7a32eed3d1f45f8dc6116ee77`)
   - an empty account (`0x000000000000000000000000000000000000dEaD`)

## Expected
Per `developers/perps-testnet/README.md` → "Scale quantity by the base asset's decimals": "0.1 SOL written with 18 decimals ... The owner's own `placeOrder` fails differently, with `ERC20: transfer amount exceeds balance`."

Suggested doc fix: list both messages — "insufficient allowance" if the wallet hasn't approved USDso, otherwise "transfer amount exceeds balance".

## Actual
Both accounts revert with `Error("ERC20: insufficient allowance")`:
`0x08c379a0…1d45524332303a20696e73756666696369656e7420616c6c6f77616e6365`

The pool's pull fails at the allowance check first, because these accounts never approved the pool or bank for USDso. "transfer amount exceeds balance" only appears for an account that has already granted a large allowance, so someone who searches the documented string won't find their error.

## Evidence
- Script: [`repro/wrong-scale.mjs`](../repro/wrong-scale.mjs); output with full revert data: [`repro/wrong-scale.out.txt`](../repro/wrong-scale.out.txt)
- Generic `placeOrder` simulation helper: [`repro/t8.mjs`](../repro/t8.mjs)

## Environment
- SDK: `@somnia-chain/markets-sdk@0.32.1` (the version the docs pin), `viem@2.57.10`, Node 20.19.2, Linux
- Network: Somnia Hideki / "Tokyo" perps testnet, chain id 50383, RPC `https://api.hideki2.infra.testnet.somnia.network`, indexer `https://hideki-dev.smk.somnia.host/v1/graphql`
- Wallet: none. Every check is a read or an `eth_call` simulation; nothing was signed or sent
- Observed: 2026-10-23 ~05:40–05:50 UTC (around block 30,823,131)
