import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { ethers } from "ethers";



// mint an NFT
export const createNft = async (
  minterContract,
  performActions,
  name 
) => {
  await performActions(async (kit) => {
    if (!name) return;
    const { defaultAccount } = kit;

  

    try {
     

      // mint the NFT and save the IPFS url to the blockchain
      let transaction = await minterContract.methods
        .mint(name)
        .send({ from: defaultAccount });

      return transaction;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  });
};



// fetch all NFTs on the smart contract
export const getNfts = async (minterContract) => {
  try {
    const nfts = [];
    const nftsLength = await minterContract.methods.getNFTlength().call();
    // contract starts minting from index 1
    for (let i = 0; i < Number(nftsLength); i++) {
      const nft = new Promise(async (resolve) => {
        const _nft = await minterContract.methods.getAllNFTS(i).call();
        const res = await minterContract.methods.tokenURI(_nft.tokenId).call();
        const meta = await fetchNftMeta(res);
        const owner = await fetchNftOwner(minterContract, i); 
        resolve({
          index: i,
          powerValue: _nft.powerValue,
          name: _nft.name,
          owner: owner,
        });
      });
      nfts.push(nft);
    }
    return Promise.all(nfts);
  } catch (e) {
    console.log({ e });
  }
};

// get the metedata for an NFT from IPFS
export const fetchNftMeta = async (ipfsUrl) => {
  try {
    if (!ipfsUrl) return null;
    const meta = await axios.get(ipfsUrl);
    return meta;
  } catch (e) {
    console.log({ e });
  }
};

// get the owner address of an NFT
export const fetchNftOwner = async (minterContract, index) => {
  try {
    return await minterContract.methods.ownerOf(index).call();
  } catch (e) {
    console.log({ e });
  }
};

export const minted = async (minterContract, _address) => {
  try {
    return await minterContract.methods.hasMinted(_address).call();
  } catch (e) {
    console.log({ e });
  }
};

export const checkPowervalue = async (minterContract, _address, _index) => {
  try {
    return await minterContract.methods.canSwallowNFT(_address, _index).call();
    
  } catch (e) {
    console.log({ e });
  }
};

// get the address that deployed the NFT contract
export const fetchNftContractOwner = async (minterContract) => {
  try {
    let owner = await minterContract.methods.owner().call();
    return owner;
  } catch (e) {
    console.log({ e });
  }
};



export const swallow = async (
  minterContract,
  performActions,
  index,
  
) => {
  try {
    await performActions(async (kit) => {
      try {
        console.log(minterContract, index);
        const { defaultAccount } = kit;
        await minterContract.methods
          .swallowNFT(index)
          .send({ from: defaultAccount});
      } catch (error) {
        console.log({ error });
      }
    });
  } catch (error) {
    console.log(error);
  }
};



export const upgrade = async (
  minterContract,
  performActions,
  index,
  
) => {
  try {
    await performActions(async (kit) => {
      try {
        const price = ethers.utils.parseUnits(String(0.5), "ether");
        const { defaultAccount } = kit;
        await minterContract.methods.upgradeNFT(index).send({ from: defaultAccount, value: price});
      } catch (error) {
        console.log({ error });
      }
    });
  } catch (error) {
    console.log(error);
  }
};


export const remove = async (
  minterContract,
  performActions,
  index,
  
) => {
  try {
    await performActions(async (kit) => {
      try {
        const { defaultAccount } = kit;
        await minterContract.methods.remove(index).send({ from: defaultAccount });
      } catch (error) {
        console.log({ error });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
