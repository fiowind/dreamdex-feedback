// Read-only repro for feedback/04: wrong-scale (18-decimal) quantity on SOL-PERP via eth_call. Nothing is signed or sent.
// npm i @somnia-chain/markets-sdk@0.32.1 viem ; node wrong-scale.mjs
import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk"
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"
import { createPublicClient, http, parseAbi, encodeFunctionData, zeroAddress } from "viem"
const pc = createPublicClient({ transport: http("https://api.hideki2.infra.testnet.somnia.network") })
const markets = new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql", addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES })
const abi = parseAbi(["function placeOrder(bool,uint64,uint256,uint256,uint64,uint8,uint8,address,uint96) returns (bool,uint128)"])
const sol = (await markets.client.listPerpMarkets()).find(m => m.baseSymbol === "SOL")
console.log("SOL baseDecimals", sol.baseDecimals)
const tick = BigInt(sol.tickSize), price = (BigInt(sol.markPrice) * 80n / 100n) / tick * tick
const qty = 10n ** 17n // "0.1 SOL" written with 18 decimals
const exp = BigInt(Math.floor(Date.now() / 1000) + 50 * 365 * 86400) * 1_000_000_000n
const data = encodeFunctionData({ abi, functionName: "placeOrder", args: [true, 0n, price, qty, exp, 0, 0, zeroAddress, 0n] })
for (const [label, from] of [["voucher account", "0x13e98d26cec65ac7a32eed3d1f45f8dc6116ee77"], ["empty account", "0x000000000000000000000000000000000000dEaD"]]) {
  try { await pc.call({ account: from, to: sol.poolAddress, data, gas: 10_000_000n }); console.log(label, "SUCCESS (unexpected)") }
  catch (e) { const d = e.walk?.(x => typeof x?.data === "string")?.data ?? e.data; let msg = ""; try { msg = Buffer.from(d.slice(138), "hex").toString("utf8").replace(/\0/g, "") } catch {} console.log(label, "REVERT data:", d, "->", JSON.stringify(msg)) }
}
process.exit(0)
