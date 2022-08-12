import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";


const AddNfts = ({ save, address }) => {
  const [name, setName] = useState("");
  

  //store attributes of an NFT
  const [show, setShow] = useState(false);

  // check if all form data has been filled
  const isFormFilled = () =>
    name;

  // close the popup modal
  const handleClose = () => {
    setShow(false);
  };

  // display the popup modal
  const handleShow = () => setShow(true);

 

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill px-0"
        style={{ width: "38px" }}
      >
        <i className="bi bi-plus"></i>
      </Button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create NFT</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FloatingLabel
              controlId="inputLocation"
              label="Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Name of NFT"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </FloatingLabel>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>

          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save(
                name
              );
              handleClose();
            }}
          >
            Create NFT
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddNfts.propTypes = {
  // props passed into this component
  save: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired,
};

export default AddNfts;
