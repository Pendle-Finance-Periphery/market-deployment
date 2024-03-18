import hre from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ApxETHSY, IStandardizedYield, SwETHSY } from '../typechain-types';
import { delay, deploy, getContractAt } from './misc/helper';
import { MarketConfiguration } from './configuration';

const PIREX_ETH = '0xD664b74274DfEB538d9baC494F3a4760828B02b0'

/**
 * @dev This function aims to deploy your SY contract
 * @dev The below implementation show how to deploy a SwETH SY contract
 *
 * To deploy your own SY contract, you need to:
 * - Change the contract name / type name in "deploy<YOUR_CONTRACT_NAME>(deployer, 'YOUR_CONTRACT_NAME', [...])"
 * - Change the deployment params to match your constructor arguments
 */
export async function deploySY(deployer: SignerWithAddress): Promise<IStandardizedYield> {
    const sy = await deploy<ApxETHSY>(deployer, 'ApxETHSY', [
        PIREX_ETH
    ]);


    if (hre.network.name !== 'hardhat') {
        await delay(15000, 'before verifying contract');
        await hre.run('verify:verify', {
            address: sy.address,
            constructorArguments: [PIREX_ETH],
            contract: 'contracts/ApxETHSY.sol:ApxETHSY',
        });
    }

    return await getContractAt<IStandardizedYield>('IStandardizedYield', sy.address);
}
