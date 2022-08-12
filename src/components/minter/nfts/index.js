import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import AddNfts from "./Add";
import Nft from "./Card";
import Loader from "../../ui/Loader";
import { NotificationSuccess, NotificationError } from "../../ui/Notifications";
import { getNfts, createNft, swallow, remove, upgrade, minted, checkPowervalue} from "../../../utils/minter";
import { Row } from "react-bootstrap";

const NftList = ({ minterContract, name, updateBalance }) => {
  /* performActions : used to run smart contract interactions in order
   *  address : fetch the address of the connected wallet
   */
  const { performActions, address } = useContractKit();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAssets = useCallback(async () => {
    try {
      setLoading(true);

      // fetch all nfts from the smart contract
      const allNfts = await getNfts(minterContract);
      if (!allNfts) return;
      await updateBalance();
      setNfts(allNfts);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [minterContract, updateBalance]);

  const addNft = async (name) => {
    try {
      setLoading(true);

      // create an nft functionality
      await createNft(
        minterContract,
        performActions,
        name
      );
      toast(<NotificationSuccess text="Updating NFT list...." />);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create an NFT." />);
    } finally {
      setLoading(false);
    }
  };

  const swallownft = async (index) => {
    const check = await minted(minterContract, address);
    const checkPowerValue = await checkPowervalue(minterContract, address, index);
    if(check===true && checkPowerValue === true){
      
    try {
      setLoading(true);
      await swallow(
        minterContract,
        performActions,
        index
      );

      toast(<NotificationSuccess text="Updating NFT list...." />);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to swallow NFT." />);
    } finally {
      setLoading(false);
    }
  }else{
    toast(<NotificationError text="You can't swallow. Either you don't have a monster nft fighter or your powervalue is less " />);
    console.log(check);
      console.log(checkPowerValue);
    
  }
  };

  const upgradenft = async (index) => {
    try {
      setLoading(true);

      await upgrade(
        minterContract,
        performActions,
        index
      );

      toast(<NotificationSuccess text="Updating NFT list...." />);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to upgrade NFT." />);
    } finally {
      setLoading(false);
    }
  };

  const deleteNFT = async (index) => {
    try {
      setLoading(true);

      await remove(
        minterContract,
        performActions,
        index
      );

      toast(<NotificationSuccess text="Updating NFT list...." />);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to delete NFT." />);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    try {
      if (address && minterContract) {
        getAssets();
      }
    } catch (error) {
      console.log({ error });
    }
  }, [minterContract, address, getAssets]);
  if (address) {
    return (
      <>
        {!loading ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-4 fw-bold mb-0">{name}</h1>

              <AddNfts save={addNft} address={address} />
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
              {/* display all NFTs */}
              {nfts.map((_nft) => (
                <Nft
                  key={_nft.index}
                  deleteNFT={() => deleteNFT(_nft.index)}
                  swallownft={() => swallownft(_nft.index)}
                  upgradenft={() => upgradenft(_nft.index)}
               
                  nft={{
                    ..._nft,
                  }}
                  isOwner={_nft.owner === address}
                  
                />
              ))}
            </Row>
          </>
        ) : (
          <Loader />
        )}
      </>
    );
  }
  return null;
};

NftList.propTypes = {
  // props passed into this component
  minterContract: PropTypes.instanceOf(Object),
  marketplaceContract: PropTypes.instanceOf(Object),
  updateBalance: PropTypes.func.isRequired,
};

NftList.defaultProps = {
  minterContract: null,
  marketplaceContract: null,
};

export default NftList;
