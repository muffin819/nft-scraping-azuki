import { Alchemy, Network } from "alchemy-sdk";
import { writeFileSync } from 'fs';

const ALCHEMY_API_KEY = "1AUsL_PtNhgdAYATmWummksSUjUytHcv";
const CONTRACT_ADDRESS = "0xED5AF388653567Af2F388E6224dC7C4b3241C544";

const config = {
    apiKey: ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

let metadatas = [];

const JSONToFile = async (obj, filename) =>
    writeFileSync(`${filename}.json`, JSON.stringify(obj, null, 2));

const fetchNftsForContract = async (CONTRACT_ADDRESS, omitMetadata = false) => {
    let pageKey = null;
    let allNfts = [];

    do {
        console.log('pageKey :>> ', pageKey);
        const response = await alchemy.nft.getNftsForContract(CONTRACT_ADDRESS, {
            omitMetadata: omitMetadata,
            pageKey: pageKey,
        });

        allNfts = allNfts.concat(response.nfts);

        // Check if there is another page
        pageKey = response.pageKey;
    } while (pageKey); // Continue fetching if pageKey is not null

    return allNfts;
};

// Usage
const main = async () => {
    const allNfts = await fetchNftsForContract(CONTRACT_ADDRESS);
    for (const nft of allNfts) {
        const attributes = nft.raw.metadata.attributes;
        attributes.map(item => {
            if (item.trait_type == "Background" && item.value == "Dark Blue") {
                metadatas.push(nft.raw.metadata);
                console.log('tracked');
            }
        })
    }
    await JSONToFile(metadatas, 'azuki metadata');
}
main();
