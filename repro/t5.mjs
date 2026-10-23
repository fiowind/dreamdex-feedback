import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk"
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"
import { createPublicClient, http } from "viem"
const markets = new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql", addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES })
const c=markets.client
const perps = await c.listPerpMarkets()
const btc=perps.find(m=>m.baseSymbol==="BTC")
const max=await c.getMaxPerpOrderSize({pool:btc.poolAddress,marginBank:btc.marginBank,account:"0x000000000000000000000000000000000000dEaD",isBid:true,price:100000n*10n**18n})
console.log("types", typeof max.maxQuantity, typeof max.maxPositionSize, typeof btc.tickSize, typeof btc.baseDecimals)
perps.sort((a,b)=>Number(a.createdAtTimestamp)-Number(b.createdAtTimestamp))
for(const m of perps) console.log(m.baseSymbol, new Date(Number(m.createdAtTimestamp)*1000).toISOString(), "fw",m.fundingWindowSec,"fi",m.fundingIntervalSec,"trades",m.tradeCount,"stopReg",m.stopRegistry?1:0)
const pc=createPublicClient({transport:http("https://api.hideki2.infra.testnet.somnia.network")})
for (const a of ["0x6B2FbfeD328FF5F20C0BE7D3C3437613aFFE8D3a","0x2ACD9EFdA721450906bfE1bef3edE269636E42C4"]) console.log(a, ((await pc.getCode({address:a}))||"").length)
console.log("chainId", await pc.getChainId())
process.exit(0)
