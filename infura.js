import { ethers } from 'ethers';
import axios from 'axios';
import { writeFileSync } from 'fs';
import path from 'path';

const INFRA_API_KEY = "829bf9e346da4b1bb6f943bd900b6337"
const contractAddress = "0xED5AF388653567Af2F388E6224dC7C4b3241C544"; // Replace with your NFT collection's contract address
// ABI fragment to interact with the ERC-721 tokenURI function
const abi = [
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function owner() public view returns (string memory)",
];

const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFRA_API_KEY}`); // Replace with your provider or Infura project ID
// // Connect to the contract
const contract = new ethers.Contract(contractAddress, abi, provider);

const nfts = [];

// Helper function to download images
async function downloadImage(url, filename) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(fs.createWriteStream(filename));
  console.log(`Downloaded image: ${filename}`);
}



const JSONToFile = (obj, filename) =>
  writeFileSync(`${filename}.json`, JSON.stringify(obj, null, 2));

// Main function to scrape NFT metadata and images
async function scrapeNFTCollection() {

  let exist = true;
  let index = 0;

  try {
    for (let i = 0; i < 10; i++) {
      // Fetch token URI from the contract
      const tokenUri = await contract.tokenURI(i);
      const metadataUrl = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");

      // // Fetch metadata JSON from IPFS
      const metadataResponse = await axios.get(metadataUrl);
      const metadata = metadataResponse.data;
      nfts.push(metadata);


      console.log(`Fetched metadata for NFT #${i}:`, metadata);
      JSONToFile(metadata, 'azuki metadata');

      // // Extract and download image
      // const imageCID = metadata.image.replace("ipfs://", "");
      // const imageUrl = `https://ipfs.io/ipfs/${imageCID}`;
      // const filename = path.resolve(__dirname, `images/nft_${i}.png`);

      // await downloadImage(imageUrl, filename);

    }
    console.log('finteredCollection.length :>> ', nfts.length);
  }
  catch (error) {
    console.error(`Error fetching metadata or downloading image for NFT #${i}:`, error.message);
  }

}

scrapeNFTCollection();
