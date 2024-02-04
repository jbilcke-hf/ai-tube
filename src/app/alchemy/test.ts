import { Network, Alchemy, AssetTransfersCategory } from 'alchemy-sdk';

const settings = {
  apiKey: `${process.env.AUTH_ALCHEMY_API_KEY || ""}`,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// get the latest block
const latestBlock = alchemy.core.getBlock("latest").then(console.log);

// get all the sent transactions from given address
const sentTransactions = alchemy.core.getAssetTransfers({
  fromBlock: "0x0",
  fromAddress: "0x994b342dd87fc825f66e51ffa3ef71ad818b6893",
  category: [
    // ERC721 transfers.
    AssetTransfersCategory.ERC721,

    // Top level ETH transactions that occur where the `fromAddress` is an
    // external user-created address. External addresses have private keys and are
    // accessed by users.
    AssetTransfersCategory.EXTERNAL,

    // ERC20 transfers
    AssetTransfersCategory.ERC20
   ],
}).then(console.log);
