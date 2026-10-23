# A wrong-scale owner `placeOrder` reverts with "insufficient allowance", not the documented "transfer amount exceeds balance"

**Severity:** normal
**Area:** docs

## Where
`developers/perps-testnet/README.md` → "Scale quantity by the base asset's decimals": "0.1 SOL written with 18 decimals ... The owner's own `placeOrder` fails differently, with `ERC20: transfer amount exceeds balance`."

## Steps to reproduce
`eth_call` SOL-PERP `placeOrder(true, 0, 0.8×mark (tick-aligned), 1e17 /* 0.1 SOL at 18 decimals */, GTC, 0, 0, 0x0, 0)` from an ordinary account. I tested two:
- a paper-voucher account (`0x13e98d26…ee77`)
- an empty account (`0x…dEaD`)

## Expected
Per the docs: `Error("ERC20: transfer amount exceeds balance")`.

## Actual
Both revert with `Error("ERC20: insufficient allowance")`:
`0x08c379a0…1d45524332303a20696e73756666696369656e7420616c6c6f77616e6365`

The pool's pull fails at the allowance check first, because these accounts never approved the pool or bank for USDso. "transfer amount exceeds balance" only appears for an account that has already granted a large allowance. Someone who searches the documented string won't find their error.

## Suggested fix
List both messages: "insufficient allowance" if the wallet hasn't approved USDso, otherwise "transfer amount exceeds balance".

## Environment
- SDK: `@somnia-chain/markets-sdk@0.32.1` (the version the docs pin), `viem@2.57.10`, Node 20.19.2, Linux
- Network: Somnia Hideki / "Tokyo" perps testnet, chain id 50383, RPC `https://api.hideki2.infra.testnet.somnia.network`, indexer `https://hideki-dev.smk.somnia.host/v1/graphql`
- Wallet: none. Every check is a read or an `eth_call` simulation, with nothing signed or sent
- Observed: 2026-10-23 ~05:40–05:50 UTC (around block 30,823,131)
