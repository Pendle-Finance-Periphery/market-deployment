import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-contract-sizer';
import '@typechain/hardhat';
import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from 'dotenv';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || '0x1111111111111111111111111111111111111111111111111111111111111111';

const config: HardhatUserConfig = {
  paths: {
    sources: './contracts',
  },
  networks: {
    hardhat: {
      chainId: 1,
      forking: {
        url: 'https://rpc.ankr.com/eth',
      },
      accounts: [
        {
          privateKey: PRIVATE_KEY,
          balance: '1000000000000000000000000000000000000'
        }
      ],
      allowUnlimitedContractSize: false
    },
    mainnet: {
      url: 'https://rpc.ankr.com/eth',
      accounts: [PRIVATE_KEY],
      chainId: 1,
      gasMultiplier: 1.5
    },
    arbitrum: {
      url: 'https://rpc.ankr.com/arbitrum',
      accounts: [PRIVATE_KEY],
      chainId: 42161,
      gasMultiplier: 1.5
    },
    bsc: {
      url: 'https://rpc.ankr.com/bsc',
      accounts: [PRIVATE_KEY],
      chainId: 56,
      gasMultiplier: 1.5
    },
    optimism: {
      url: 'https://rpc.ankr.com/optimism',
      accounts: [PRIVATE_KEY],
      chainId: 10,
      gasMultiplier: 1.5
    },
    mantle: {
      url: 'https://rpc.ankr.com/mantle',
      accounts: [PRIVATE_KEY],
      chainId: 5000,
      gasMultiplier: 1.5
    }
  },
  solidity: {
    compilers: [
        {
            version: '0.8.23',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 1_000_000,
                },
                viaIR: true,
            },
        }
    ],
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
};

export default config;
