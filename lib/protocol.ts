// Frontend-only protocol data model.
// Shapes mirror what will later be read from the on-chain contracts
// (PriceOracle, RiskEngine, InterestRateModel, LendingPool) so the UI
// layer stays stable when live reads are wired in.

export type AssetSymbol = 'ETH' | 'wstETH' | 'wBTC'

export interface CollateralAsset {
  symbol: AssetSymbol
  name: string
  /** oracle price in USD */
  price: number
  /** protocol max loan-to-value, 0-1 */
  maxLtv: number
  /** liquidation threshold, 0-1 */
  liquidationThreshold: number
  /** user wallet balance */
  walletBalance: number
  /** user amount supplied to the protocol */
  supplied: number
  /** requires ERC-20 approval before deposit/repay */
  isErc20: boolean
  /** total value locked across the protocol for this asset (USD) */
  tvl: number
}

export const NETWORK = {
  name: 'Ethereum',
  chainId: 1,
  explorer: 'https://etherscan.io',
}

export const CONTRACTS: { label: string; address: string }[] = [
  { label: 'ICFT', address: '0x9a1FEbE7c8f0e4A2d3B5C6d7E8f9A0b1C2d3E4f5' },
  { label: 'LendingPool', address: '0x3B2c1D0e9F8a7B6c5D4e3F2a1B0c9D8e7F6a5B4c' },
  { label: 'RiskEngine', address: '0x7C6b5A4d3E2f1a0B9c8D7e6F5a4B3c2D1e0F9a8B' },
  { label: 'PriceOracle', address: '0x1D2e3F4a5B6c7D8e9F0a1B2c3D4e5F6a7B8c9D0e' },
  { label: 'InterestRateModel', address: '0x5E4d3C2b1A0f9E8d7C6b5A4f3E2d1C0b9A8f7E6d' },
  { label: 'LiquidationEngine', address: '0x8F7e6D5c4B3a2F1e0D9c8B7a6F5e4D3c2B1a0F9e' },
]

export const COLLATERAL: CollateralAsset[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3324.18,
    maxLtv: 0.8,
    liquidationThreshold: 0.85,
    walletBalance: 4.812,
    supplied: 1.5,
    isErc20: false,
    tvl: 18_420_000,
  },
  {
    symbol: 'wstETH',
    name: 'Wrapped staked ETH',
    price: 3906.44,
    maxLtv: 0.75,
    liquidationThreshold: 0.8,
    walletBalance: 2.45,
    supplied: 0.4,
    isErc20: true,
    tvl: 9_130_000,
  },
  {
    symbol: 'wBTC',
    name: 'Wrapped Bitcoin',
    price: 96_140.72,
    maxLtv: 0.7,
    liquidationThreshold: 0.78,
    walletBalance: 0.184,
    supplied: 0.02,
    isErc20: true,
    tvl: 24_760_000,
  },
]

export const ICFT = {
  symbol: 'ICFT' as const,
  name: 'ICFT Stable',
  price: 1.0,
  walletBalance: 1_240.55,
  borrowApr: 0.0842,
  availableLiquidity: 2_845_120,
  utilization: 0.6714,
}

// ---- Derived user position (frontend computed from the model above) ----

export function collateralValue(assets: CollateralAsset[] = COLLATERAL): number {
  return assets.reduce((sum, a) => sum + a.supplied * a.price, 0)
}

export function weightedLiquidationThreshold(assets: CollateralAsset[] = COLLATERAL): number {
  const total = collateralValue(assets)
  if (total === 0) return 0
  return assets.reduce((s, a) => s + a.supplied * a.price * a.liquidationThreshold, 0) / total
}

export function weightedMaxLtv(assets: CollateralAsset[] = COLLATERAL): number {
  const total = collateralValue(assets)
  if (total === 0) return 0
  return assets.reduce((s, a) => s + a.supplied * a.price * a.maxLtv, 0) / total
}

export const DEBT = {
  principal: 4_000,
  interest: 84.32,
  get total() {
    return this.principal + this.interest
  },
}

export interface Position {
  collateralValue: number
  debt: number
  interest: number
  ltv: number
  maxBorrow: number
  availableBorrow: number
  healthFactor: number
  liquidationThreshold: number
  status: 'healthy' | 'at-risk' | 'liquidatable'
}

export function getPosition(): Position {
  const cv = collateralValue()
  const debt = DEBT.total
  const lt = weightedLiquidationThreshold()
  const maxLtv = weightedMaxLtv()
  const ltv = cv > 0 ? debt / cv : 0
  const maxBorrow = cv * maxLtv
  const availableBorrow = Math.max(0, maxBorrow - debt)
  const healthFactor = debt > 0 ? (cv * lt) / debt : Number.POSITIVE_INFINITY
  const status: Position['status'] =
    healthFactor >= 1.5 ? 'healthy' : healthFactor >= 1.05 ? 'at-risk' : 'liquidatable'

  return {
    collateralValue: cv,
    debt,
    interest: DEBT.interest,
    ltv,
    maxBorrow,
    availableBorrow,
    healthFactor,
    liquidationThreshold: lt,
    status,
  }
}

export interface Tx {
  id: string
  type: 'Deposit' | 'Borrow' | 'Repay' | 'Withdraw'
  asset: AssetSymbol | 'ICFT'
  amount: number
  status: 'Confirmed' | 'Pending'
  hash: string
  time: string
}

export const TX_HISTORY: Tx[] = [
  { id: '1', type: 'Deposit', asset: 'ETH', amount: 1.0, status: 'Confirmed', hash: '0xa1b2c3', time: '2h ago' },
  { id: '2', type: 'Borrow', asset: 'ICFT', amount: 2500, status: 'Confirmed', hash: '0xd4e5f6', time: '2h ago' },
  { id: '3', type: 'Deposit', asset: 'wstETH', amount: 0.4, status: 'Confirmed', hash: '0x7a8b9c', time: '1d ago' },
  { id: '4', type: 'Repay', asset: 'ICFT', amount: 200, status: 'Confirmed', hash: '0x0d1e2f', time: '3d ago' },
  { id: '5', type: 'Withdraw', asset: 'ETH', amount: 0.2, status: 'Confirmed', hash: '0x3a4b5c', time: '5d ago' },
]
