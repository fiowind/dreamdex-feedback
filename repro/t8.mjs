import { createPublicClient, http, parseAbi, encodeFunctionData, zeroAddress } from "viem"
const pc=createPublicClient({transport:http("https://api.hideki2.infra.testnet.somnia.network")})
const abi=parseAbi(["function placeOrder(bool isBid, uint64 userData, uint256 price, uint256 quantity, uint64 expireTimestampNs, uint8 orderType, uint8 selfMatchingOption, address builder, uint96 builderFeeBpsTimes1k) returns (bool, uint128)"])
const acct="0x13e98d26cec65ac7a32eed3d1f45f8dc6116ee77"
const fresh="0x000000000000000000000000000000000000dEaD"
const ms=JSON.parse(process.argv[2])
const exp=BigInt(Math.floor(Date.now()/1000)+50*365*86400)*1000000000n
for(const m of ms){
  const tick=BigInt(m.tickSize); let price=BigInt(m.markPrice)*80n/100n; price=price/tick*tick
  const q=BigInt(m.minQuantity)
  for(const from of [acct,fresh]){
    const data=encodeFunctionData({abi,functionName:"placeOrder",args:[true,0n,price,q,exp,0,0,zeroAddress,0n]})
    try{ const r=await pc.call({account:from,to:m.poolAddress,data,gas:10_000_000n}); console.log(m.baseSymbol, from.slice(0,8), "SIM OK", r.data?.slice(0,140)) }
    catch(e){ console.log(m.baseSymbol, from.slice(0,8), "REVERT", (e.cause?.data||e.shortMessage||"").toString().slice(0,120), e.details?.slice?.(0,100)) }
  }
}
