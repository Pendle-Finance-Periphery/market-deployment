import { ethers } from 'hardhat';
import { delay, getPendleContracts, safeApprove } from './helper';
import { SAFE_WAIT_TIME, ZERO_ADDRESS } from './consts';
import { AMOUNT_TO_SEED, UNDERLYING_TO_SEED_LIQUIDITY } from './configuration';
import marketAddresses from '../deployments/SY-swETH.json';

async function main() {
    const [deployer] = await ethers.getSigners();

    const pendleContracts = await getPendleContracts();

    let overrides = {};
    if (UNDERLYING_TO_SEED_LIQUIDITY == ZERO_ADDRESS) {
        overrides = {
            value: AMOUNT_TO_SEED,
        };
    } else {
        await safeApprove(
            deployer,
            UNDERLYING_TO_SEED_LIQUIDITY,
            pendleContracts.liquiditySeedingHelper.address,
            AMOUNT_TO_SEED
        );
        await delay(SAFE_WAIT_TIME, 'after approve underlying');
    }
    await pendleContracts.liquiditySeedingHelper.seedLiquidity(
        marketAddresses.market,
        UNDERLYING_TO_SEED_LIQUIDITY,
        AMOUNT_TO_SEED,
        { ...overrides }
    );

    // console.log((await tx.wait()).gasUsed);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
