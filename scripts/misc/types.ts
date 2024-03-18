import { PendleMarketFactoryV3, PendlePoolDeployHelper, PendleYieldContractFactory } from '../../typechain-types';

export enum SUPPORTED_CHAINS {
    MAINNET = 1,
    ARBITRUM = 42161,
    BSC = 56,
    OPTIMISM = 10,
}

export type PendleContracts = {
    marketFactory: PendleMarketFactoryV3;
    yieldContractFactory: PendleYieldContractFactory;
    deployHelper: PendlePoolDeployHelper;
};
