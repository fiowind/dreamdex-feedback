# Paper USDso can open positions in all six markets the docs say it is blocked from

**Severity:** major
**Area:** contracts (docs also affected)

## Summary
The docs say three times that the Perps Arena paper USDso credit can't open or increase positions in six markets (1000PEPE, LIT, PUMP, VVV, ZEC, ZRO):
- the "Paper USDso = No" column in `trading/perps-testnet/README.md#markets`
- "The six newest markets are not on that list" in `margin-and-liquidations.md#paper-usdso`
- the "Paper USDso blocks some markets ... reports it as `limitedBy: \"voucherBlocked\"`" pitfall in `developers/perps-testnet/README.md`

On chain, `MarginBank.isVoucherMarketAllowed(pool)` returns **true for all 21 pools**. An account funded only by the voucher can place orders in those six markets. Either the allowlist is misconfigured, so the rule isn't enforced, or every doc page above is out of date.

## Steps to reproduce
1. Pick an account that claimed the voucher and holds nothing else. Example: `0x13e98d26cec65ac7a32eed3d1f45f8dc6116ee77`. Its `getCreditFloor` is 1000e18 and `tryGetPerpAccountEquity` is also 1000e18, so the voucher is its only margin. It is a voucher claimant found in recent `VoucherDistributor` logs.
2. Run `repro/voucher-allowlist.mjs`. It is read-only and only does view calls and `eth_call`. For each of ZRO, LIT, VVV, 1000PEPE, PUMP and ZEC it:
   - calls `MarginBank(0x4787…1394).isVoucherMarketAllowed(pool)`
   - calls `client.getMaxPerpOrderSize({pool, marginBank, account, isBid: true, price: mark})`
   - simulates `pool.placeOrder(true, 0, 0.8×mark (tick-aligned), minQuantity, GTC expiry, 0, 0, 0x0, 0)` from that account with `eth_call`

## Expected
For the six "No" markets:
- `isVoucherMarketAllowed` returns false.
- `getMaxPerpOrderSize` returns `placeable: false, limitedBy: "voucherBlocked"`.
- `placeOrder` reverts with `VoucherMarketNotAllowed`.

## Actual
In all six markets:
- `isVoucherMarketAllowed` returns **true**.
- `getMaxPerpOrderSize` returns `placeable: true, limitedBy: "collateral"`. For example, ZRO reports `maxQuantity` 2820.7 ZRO, which locks about 999.97 USDso, i.e. the whole voucher.
- The `placeOrder` simulation **succeeds** and returns `(true, orderId)`.

All 21 pools return `isVoucherMarketAllowed = true`. That includes TAO and WLD, which the docs mark "Yes", so the allowlist appears to be "everything".

## Evidence
- `repro/voucher-allowlist.out.txt` (full output)
- Extract:
```
creditFloor 1000000000000000000000n   equity 1000000000000000000000n
ZRO  { isVoucherMarketAllowed: true, placeable: true, limitedBy: 'collateral', maxQuantity: 2820700000000000000000n } eth_call placeOrder: SUCCESS
LIT  { isVoucherMarketAllowed: true, placeable: true, limitedBy: 'collateral', ... } SUCCESS
VVV / 1000PEPE / PUMP / ZEC: same, all SUCCESS
```

## Environment
- SDK: `@somnia-chain/markets-sdk@0.32.1` (the version the docs pin), `viem@2.57.10`, Node 20.19.2, Linux
- Network: Somnia Hideki / "Tokyo" perps testnet, chain id 50383, RPC `https://api.hideki2.infra.testnet.somnia.network`, indexer `https://hideki-dev.smk.somnia.host/v1/graphql`
- Wallet: none. Every check is a read or an `eth_call` simulation, with nothing signed or sent
- Observed: 2026-10-23 ~05:40–05:50 UTC (around block 30,823,131)
