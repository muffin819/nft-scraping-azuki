import { TatumSDK, Network } from "@tatumio/tatum";
import { writeFileSync } from 'fs';

const JSONToFile = async (obj, filename) =>
    writeFileSync(`${filename}.json`, JSON.stringify(obj, null, 2));

(async () => {
    try {
        const tatum = await TatumSDK.init({ network: Network.ETHEREUM, apiKey: 't-672de4f6bc0ed868906d41e1-d240c5462171443bbccde696' });
        const nfts = await tatum.nft.getNftsInCollection({
            collectionAddress: '0xED5AF388653567Af2F388E6224dC7C4b3241C544', // replace with your collection
        });

        // let filteredCollection = [];

        // nfts.data.map(nft => {
        //     nft.metadata.attributes.map(item => {
        //         if(item.trait_type == "Background" && item.value == "Red") {
        //             filteredCollection.push(nft);
        //         }
        //     })
        // })
        await JSONToFile(nfts, 'azuki metadata');
    } catch (error) {
        console.error("Error fetching NFT collection:", error);
    }
})();