// Read-only repro for feedback/06: what PerpMarket.baseSymbol actually contains.
// npm i @somnia-chain/markets-sdk@0.32.1 viem ; node basesymbol.mjs
import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk"
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"
const markets = new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql", addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES })
const perps = await markets.client.listPerpMarkets()
console.log("baseSymbol values:", JSON.stringify(perps.map(m => m.baseSymbol)))
console.log('find(baseSymbol === "WBTC"):', perps.find(m => m.baseSymbol === "WBTC"))
console.log('find(baseSymbol === "BTC") pool:', perps.find(m => m.baseSymbol === "BTC")?.poolAddress)
process.exit(0)
