import { IPAllAction, PendleMarketFactory, PendleYieldContractFactory } from '../typechain-types';

export enum SUPPORTED_CHAINS {
    MAINNET = 1,
    ARBITRUM = 42161,
    BSC = 56,
}

export type PendleContracts = {
    router: IPAllAction;
    marketFactory: PendleMarketFactory;
    yieldContractFactory: PendleYieldContractFactory;
};
