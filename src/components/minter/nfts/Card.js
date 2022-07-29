import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack } from "react-bootstrap";
import { truncateAddress } from "../../../utils";
import Identicon from "../../ui/Identicon";
import { Button } from "react-bootstrap";


  const NftCard = ({ nft, isOwner, deleteNFT, swallownft, upgradenft }) => {
  const { owner, name, powerValue, index } = nft;

  

  return (
    <Col key={index}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <Identicon address={owner} size={28} />
            <span className="font-monospace text-secondary">
              {truncateAddress(owner)}
            </span>
            <Badge bg="secondary" className="ms-auto">
              {index} ID
            </Badge>
            <Badge bg="secondary" className="ms-auto">
              {powerValue} VALUE POINT
            </Badge>
          </Stack>
        </Card.Header>

        <div className=" ratio ratio-4x3">
          <img src="https://techcrunch.com/wp-content/uploads/2019/09/monster-dot-com.jpg"  style={{ objectFit: "cover" }} />
        </div>

        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{name}</Card.Title>
        
              
      {isOwner === false && (
            <>
              <Button variant="primary" onClick={() => swallownft(index)}>
               Swallow this NFT
              </Button>
            </>
          )}

          
      {isOwner === true && (
            <>
              <Button variant="primary mt-2" onClick={() => upgradenft(index)}>
               upgrade
              </Button>
            </>
          )}
      

      {isOwner === true && (
            <>
              
              <Button
                variant="danger mt-2"
                onClick={() => deleteNFT(index)}
              >
               Remove
              </Button>
            </>
          )}

  

        </Card.Body>
      </Card>
    </Col>

  );
};

NftCard.propTypes = {
  // props passed into this component
  nft: PropTypes.instanceOf(Object).isRequired,
  modPrice: PropTypes.func.isRequired,

};

export default NftCard;
