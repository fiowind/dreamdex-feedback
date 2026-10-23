import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk"
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"
import { parseUnits, createPublicClient, http, parseAbi } from "viem"
const J=o=>JSON.stringify(o,(k,v)=>typeof v==='bigint'?v.toString():v)
const markets = new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql", addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES })
const c=markets.client
const perps = await c.listPerpMarkets()
const btc = perps.find(m=>m.baseSymbol==="BTC")
const account="0x000000000000000000000000000000000000dEaD"
console.log("BTC row", J({tick:btc.tickSize,lot:btc.lotSize,min:btc.minQuantity,mark:btc.markPrice,markAt:btc.markPriceUpdatedAt,now:Math.floor(Date.now()/1000)}))
const qty=parseUnits("0.001",btc.baseDecimals); const price=parseUnits("100000",btc.quoteDecimals)
console.log("doc qty",qty, "min",btc.minQuantity, "qty>=min", qty>=BigInt(btc.minQuantity), "qty%lot", qty%BigInt(btc.lotSize), "price%tick", price%BigInt(btc.tickSize))
const tryit=async(n,f)=>{try{const r=await f();console.log("OK",n,J(r).slice(0,600))}catch(e){console.log("ERR",n,(e.shortMessage||e.message||String(e)).slice(0,400))}}
await tryit("getMaxPerpOrderSize", ()=>c.getMaxPerpOrderSize({pool:btc.poolAddress,marginBank:btc.marginBank,account,isBid:true,price}))
await tryit("getPerpSystemConfig", ()=>c.getPerpSystemConfig(btc.marginBank))
await tryit("voucherElig", ()=>c.getPerpVoucherEligibility(btc.marginBank, account))
await tryit("voucherCampaign", ()=>c.getPerpVoucherCampaign(btc.marginBank))
await tryit("getPerpFeedStatus", ()=>c.getPerpFeedStatus(btc.poolAddress))
await tryit("getPerpPlaneStatus", ()=>c.getPerpPlaneStatus())
await tryit("listPerpPoolStatuses", ()=>c.listPerpPoolStatuses())
await tryit("listTradeablePerpPools", ()=>c.listTradeablePerpPools())
await tryit("getPerpRiskParams", ()=>c.getPerpRiskParams(btc.poolAddress))
await tryit("getPerpMaxLeverage", ()=>c.getPerpMaxLeverage(btc.poolAddress))
console.log("SDK addr collateral", SOMNIA_HIDEKI_TESTNET_ADDRESSES.collateral)
const pc=createPublicClient({transport:http("https://api.hideki2.infra.testnet.somnia.network")})
for(const m of perps){
  try{const r=await pc.readContract({address:m.poolAddress,abi:parseAbi(["function getOrderBookParameters() view returns (uint256,uint256,uint256)"]),functionName:"getOrderBookParameters"})
   const ok=r[0].toString()===m.tickSize&&r[1].toString()===m.minQuantity&&r[2].toString()===m.lotSize
   console.log(m.baseSymbol, ok?"match":"MISMATCH chain="+J(r)+" idx="+J([m.tickSize,m.minQuantity,m.lotSize]), "markAge", Math.floor(Date.now()/1000)-Number(m.markPriceUpdatedAt), "imBps",m.initialMarginBps)
  }catch(e){console.log(m.baseSymbol,"ERR",e.shortMessage)}
}
process.exit(0)
