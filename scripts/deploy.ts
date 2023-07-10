import { ethers } from 'hardhat';
import { JSONReplacerBigNum, delay, deploy, getPendleContracts } from './helper';
import { SwETHSY } from '../typechain-types';
import { MarketConfiguration } from './configuration';
import { SUPPORTED_CHAINS } from './types';
import fs from 'fs';
import path from 'path';
import { SAFE_WAIT_TIME } from './consts';

const SWETH = '0xf951E335afb289353dc249e82926178EaC7DEd78';

async function main() {
    const [deployer] = await ethers.getSigners();

    const pendleContracts = await getPendleContracts();

    const sy = await deploy<SwETHSY>(deployer, 'SwETHSY', [
        MarketConfiguration.name,
        MarketConfiguration.symbol,
        SWETH,
    ]);

    await delay(SAFE_WAIT_TIME, 'before deploying PT/YT');

    const [PT, YT] = await pendleContracts.yieldContractFactory.callStatic.createYieldContract(
        sy.address,
        MarketConfiguration.expiry,
        MarketConfiguration.doCacheIndex
    );

    await pendleContracts.yieldContractFactory.createYieldContract(
        sy.address,
        MarketConfiguration.expiry,
        MarketConfiguration.doCacheIndex
    );

    await delay(SAFE_WAIT_TIME, 'before deploying markets');

    const market = await pendleContracts.marketFactory.callStatic.createNewMarket(
        PT,
        MarketConfiguration.scalarRoot,
        MarketConfiguration.initialRateAnchor
    );

    await pendleContracts.marketFactory.createNewMarket(
        PT,
        MarketConfiguration.scalarRoot,
        MarketConfiguration.initialRateAnchor
    );

    fs.writeFileSync(
        path.resolve(__dirname, '../deployments', `${MarketConfiguration.symbol}.json`),
        JSON.stringify(
            {
                ...MarketConfiguration,
                SY: sy.address,
                PT,
                YT,
                market,
            },
            JSONReplacerBigNum,
            4
        )
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
