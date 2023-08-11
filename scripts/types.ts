import {
    IPAllAction,
    IPLiquiditySeedingHelper,
    PendleMarketFactory,
    PendleYieldContractFactory,
} from '../typechain-types';

export enum SUPPORTED_CHAINS {
    MAINNET = 1,
    ARBITRUM = 42161,
    BSC = 56,
    MANTLE = 5000,
    OPTIMISM = 10,
}

export type PendleContracts = {
    router: IPAllAction;
    marketFactory: PendleMarketFactory;
    yieldContractFactory: PendleYieldContractFactory;
    liquiditySeedingHelper: IPLiquiditySeedingHelper;
};
