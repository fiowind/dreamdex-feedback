import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk"
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"
const markets = new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql", addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES })
const p=await markets.client.listPerpMarkets()
console.log(JSON.stringify(p.map(m=>({baseSymbol:m.baseSymbol,poolAddress:m.poolAddress,tickSize:m.tickSize,minQuantity:m.minQuantity,markPrice:m.markPrice}))))
process.exit(0)
