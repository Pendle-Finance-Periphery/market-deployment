import { ZERO_ADDRESS } from './consts';
import { toWei } from './helper';
import { SUPPORTED_CHAINS } from './types';

export const NETWORK = SUPPORTED_CHAINS.MAINNET;

export const MarketConfiguration = {
    name: 'SY swETH',
    symbol: 'SY-swETH',
    expiry: 1750896000,
    scalarRoot: toWei(112.2782),
    initialRateAnchor: toWei(1.08711),
    doCacheIndex: true,
};

// address(0) is native
// Either you can put the address of the ERC20 underlying token here
export const UNDERLYING_TO_SEED_LIQUIDITY = ZERO_ADDRESS;

// We highly recommend you to put only very minimal amount to seed liquidity
// The rest of the liquidity should be seeded through our UI
// where you have better slippage control

// The toWei function multiply your input with 10^18 by default
// So do consider using customized amount (BN.from(10).pow(6) for example) for other cases
export const AMOUNT_TO_SEED = toWei(0.01);