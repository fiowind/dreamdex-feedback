// Read-only repro: paper-USDso market allowlist. No signing, no state change (eth_call only).
// npm i @somnia-chain/markets-sdk@0.32.1 viem ; node voucher-allowlist.mjs
import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk"
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"
import { createPublicClient, http, parseAbi, encodeFunctionData, zeroAddress } from "viem"
const RPC = "https://api.hideki2.infra.testnet.somnia.network"
const MB = "0x478769E1177C0773c43A593DCCc4Ad15F15F1394"
// Any address that claimed the voucher and holds nothing else; this one had equity == credit floor == 1000 USDso.
const ACCT = process.argv[2] ?? "0x13e98d26cec65ac7a32eed3d1f45f8dc6116ee77"
const markets = new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql", addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES })
const pc = createPublicClient({ transport: http(RPC) })
const bankAbi = parseAbi(["function isVoucherMarketAllowed(address) view returns (bool)", "function getCreditFloor(address) view returns (uint256)"])
const poolAbi = parseAbi(["function placeOrder(bool,uint64,uint256,uint256,uint64,uint8,uint8,address,uint96) returns (bool,uint128)"])
console.log("creditFloor", await pc.readContract({ address: MB, abi: bankAbi, functionName: "getCreditFloor", args: [ACCT] }))
console.log("equity", await markets.client.tryGetPerpAccountEquity(MB, ACCT))
const exp = BigInt(Math.floor(Date.now() / 1000) + 50 * 365 * 86400) * 1_000_000_000n
for (const m of await markets.client.listPerpMarkets()) {
  if (!["ZRO", "LIT", "VVV", "1000PEPE", "PUMP", "ZEC"].includes(m.baseSymbol)) continue
  const allowed = await pc.readContract({ address: MB, abi: bankAbi, functionName: "isVoucherMarketAllowed", args: [m.poolAddress] })
  const max = await markets.client.getMaxPerpOrderSize({ pool: m.poolAddress, marginBank: MB, account: ACCT, isBid: true, price: BigInt(m.markPrice) })
  const tick = BigInt(m.tickSize), price = (BigInt(m.markPrice) * 80n / 100n) / tick * tick
  const data = encodeFunctionData({ abi: poolAbi, functionName: "placeOrder", args: [true, 0n, price, BigInt(m.minQuantity), exp, 0, 0, zeroAddress, 0n] })
  let sim; try { await pc.call({ account: ACCT, to: m.poolAddress, data, gas: 10_000_000n }); sim = "eth_call placeOrder (min size, resting bid 20% under mark): SUCCESS" } catch (e) { sim = "REVERT " + e.shortMessage }
  console.log(m.baseSymbol, { isVoucherMarketAllowed: allowed, placeable: max.placeable, limitedBy: max.limitedBy, maxQuantity: max.maxQuantity }, sim)
}
process.exit(0)
