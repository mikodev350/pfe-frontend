import React from 'react';
import { Button, Modal, Form, Image } from 'react-bootstrap';

const ImageUploader = ({ uploadedImage, setUploadedImage }) => {
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setUploadedImage(null);
  };

  return (
    <>
      {uploadedImage && (
        <Modal show={!!uploadedImage} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Image Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Image src={uploadedImage} rounded fluid />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Remove
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Form.File
        id="image-upload"
        label="Upload Image"
        custom
        onChange={handleImageChange}
      />
    </>
  );
};

export default ImageUploader;
