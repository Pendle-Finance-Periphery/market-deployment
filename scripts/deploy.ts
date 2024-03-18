import { ethers } from 'hardhat';
import { delay, getPendleContracts, safeApprove } from './misc/helper';
import { AMOUNT_TO_SEED, MarketConfiguration, UNDERLYING_TO_SEED_LIQUIDITY } from './configuration';
import { SAFE_WAIT_TIME, ZERO_ADDRESS } from './misc/consts';
import { deploySY } from './deploy-sy';

async function main() {
    const [deployer] = await ethers.getSigners();

    const pendleContracts = await getPendleContracts();

    const sy = await deploySY(deployer);
    await delay(SAFE_WAIT_TIME, 'before deploying pendle pool');

    let overrides = {};
    if (UNDERLYING_TO_SEED_LIQUIDITY == ZERO_ADDRESS) {
        overrides = {
            value: AMOUNT_TO_SEED,
        };
    } else {
        await safeApprove(deployer, UNDERLYING_TO_SEED_LIQUIDITY, pendleContracts.deployHelper.address, AMOUNT_TO_SEED);
        await delay(SAFE_WAIT_TIME, 'after approve underlying');
    }

    await pendleContracts.deployHelper.deploy5115MarketAndSeedLiquidity(
        sy.address,
        {
            expiry: MarketConfiguration.expiry,
            lnFeeRateRoot: MarketConfiguration.fee,
            scalarRoot: MarketConfiguration.scalarRoot,
            initialRateAnchor: MarketConfiguration.initialRateAnchor,
            doCacheIndexSameBlock: MarketConfiguration.doCacheIndex,
        },
        UNDERLYING_TO_SEED_LIQUIDITY,
        AMOUNT_TO_SEED,
        {
            ...overrides,
        }
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
