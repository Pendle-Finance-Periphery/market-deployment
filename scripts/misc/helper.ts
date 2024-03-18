import hre from 'hardhat';
import { BigNumber as BN, Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import ethereumConfiguration from '@pendle/core-v2/deployments/1-core.json';
import arbitrumConfiguration from '@pendle/core-v2/deployments/42161-core.json';
import bnbConfiguration from '@pendle/core-v2/deployments/56-core.json';
import optimismConfiguration from '@pendle/core-v2/deployments/10-core.json';

import { PendleContracts, SUPPORTED_CHAINS } from './types';
import {
    IERC20,
    PendleMarketFactoryV3,
    PendlePoolDeployHelper,
    PendleYieldContractFactory,
} from '../../typechain-types';

export function getNetwork() {
    return {
        [1]: SUPPORTED_CHAINS.MAINNET,
        [56]: SUPPORTED_CHAINS.BSC,
        [42161]: SUPPORTED_CHAINS.ARBITRUM,
        [10]: SUPPORTED_CHAINS.OPTIMISM,
    }[hre.network.config.chainId!]!;
}

export function toWei(num: number): BN {
    return BN.from(Math.floor(10 ** 9 * num)).mul(10 ** 9);
}

export async function getContractAt<CType extends Contract>(abiType: string, address: string) {
    return (await hre.ethers.getContractAt(abiType, address)) as CType;
}

export async function verifyContract(contract: string, constructor: any[]) {
    try {
        await hre.run('verify:verify', {
            address: contract,
            constructorArguments: constructor,
        });
    } catch (err: any) {
        let errStr: string = err.toString();
        if (errStr.includes('Already Verified')) {
            console.log('[VERIFIED] Alr Verified');
        } else if (errStr.includes('network is hardhat.')) {
        } else {
            console.log('[FATAL] Error occured while verifying contract');
            console.log(errStr);
        }
    }
}

/**
 *
 * @param deployer signer for deployer
 * @param abiType abi type (contract name)
 * @param args constructor arguments
 * @returns the contract itself with specified type
 */
export async function deploy<CType extends Contract>(deployer: SignerWithAddress, abiType: string, args: any[]) {
    console.log(`Deploying ${abiType}...`);
    const contractFactory = await hre.ethers.getContractFactory(abiType);
    const contract = await contractFactory.connect(deployer).deploy(...args);
    await contract.deployed();
    console.log(`[DEPLOYED] ${abiType} / ${(await contract).address}`);
    await delay(15000, 'before verifying contract');
    // await verifyContract(contract.address, args);
    return contract as CType;
}

export async function delay(ms: number, msg: string) {
    console.time(msg);
    if (hre.network.name !== 'hardhat') {
        await new Promise((resolve) => setTimeout(resolve, ms));
    }
    console.timeEnd(msg);
}

export async function getPendleContracts(): Promise<PendleContracts> {
    let config = {
        [SUPPORTED_CHAINS.MAINNET]: ethereumConfiguration,
        [SUPPORTED_CHAINS.ARBITRUM]: arbitrumConfiguration,
        [SUPPORTED_CHAINS.BSC]: bnbConfiguration,
        [SUPPORTED_CHAINS.OPTIMISM]: optimismConfiguration,
    }[getNetwork()];

    return {
        marketFactory: await getContractAt<PendleMarketFactoryV3>('PendleMarketFactoryV3', config.marketFactory),
        yieldContractFactory: await getContractAt<PendleYieldContractFactory>(
            'PendleYieldContractFactory',
            config.yieldContractFactory
        ),
        deployHelper: await getContractAt<PendlePoolDeployHelper>('PendlePoolDeployHelper', config.poolDeployHelper),
    };
}

export function JSONReplacerBigNum(key: string, value: any): string {
    if (typeof value == 'object' && 'type' in value && value['type'] === 'BigNumber') {
        return BN.from(value['hex']).toString();
    }
    return value;
}

export async function safeApprove(deployer: SignerWithAddress, token: string, to: string, amount: BN) {
    const contract = await getContractAt<IERC20>('IERC20', token);
    const allowance = await contract.allowance(deployer.address, to);
    if (allowance.lt(amount)) await contract.connect(deployer).approve(to, amount);
}
