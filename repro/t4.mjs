import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk"
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"
import { formatUnits } from "viem"
const markets = new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql", addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES })
const c=markets.client
const perps = await c.listPerpMarkets()
console.log("keys", Object.keys(perps[0]).join(","))
const rows=[]
for(const m of perps){
  const r=await c.getPerpRiskParams(m.poolAddress)
  let lev; try{lev=await c.getPerpMaxLeverage({pool:m.poolAddress,marginBank:m.marginBank,account:"0x000000000000000000000000000000000000dEaD"})}catch(e){lev="ERR "+(e.shortMessage||e.message).slice(0,80)}
  rows.push({sym:m.baseSymbol,lev,im:r.initialMarginBps,mm:r.maintenanceMarginBps,co:r.closeOutMarginBps,tick:formatUnits(BigInt(m.tickSize),m.quoteDecimals),min:formatUnits(BigInt(m.minQuantity),m.baseDecimals),oi:formatUnits(BigInt(r.maxOpenInterest),m.baseDecimals),maxPos:formatUnits(BigInt(r.maxPositionSize),m.baseDecimals),ratio:(Number(r.maxOpenInterest)/Number(r.maxPositionSize)).toFixed(3),taker:r.takerFeeBpsTimes1k,maker:r.makerFeeBpsTimes1k})
}
console.table(rows)
process.exit(0)
