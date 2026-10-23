import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk"
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"
import { createPublicClient, http, parseAbi } from "viem"
const J=o=>JSON.stringify(o,(k,v)=>typeof v==='bigint'?v.toString():v)
const markets = new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql", addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES })
const c=markets.client
const pc=createPublicClient({transport:http("https://api.hideki2.infra.testnet.somnia.network")})
const MB="0x478769E1177C0773c43A593DCCc4Ad15F15F1394"
const abi=parseAbi(["function isVoucherMarketAllowed(address) view returns (bool)","function getCreditFloor(address) view returns (uint256)","function getVoucherLeverageCap() view returns (uint256)"])
const perps=await c.listPerpMarkets()
const acct="0x13e98d26cec65ac7a32eed3d1f45f8dc6116ee77"
const head=await pc.getBlockNumber()
console.log("block",head, "time", (await pc.getBlock({blockNumber:head})).timestamp)
console.log("voucherLevCap", await pc.readContract({address:MB,abi,functionName:"getVoucherLeverageCap"}), "creditFloor", await pc.readContract({address:MB,abi,functionName:"getCreditFloor",args:[acct]}))
for(const m of perps){ console.log(m.baseSymbol, "allowed=", await pc.readContract({address:MB,abi,functionName:"isVoucherMarketAllowed",args:[m.poolAddress]})) }
const zro=perps.find(m=>m.baseSymbol==="ZRO")
const mx=await c.getMaxPerpOrderSize({pool:zro.poolAddress,marginBank:MB,account:acct,isBid:true,price:BigInt(zro.markPrice)})
console.log("ZRO max", J(mx))
console.log("equity", J(await c.tryGetPerpAccountEquity(MB,acct).catch(e=>e.message)))
process.exit(0)
