import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import TransportForm from "../TransportForm/TransportForm";

const TransportFormModal = ({ isOpen, onClose }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Modal
        isOpen={open || isOpen}
        onClose={onClose}
        size="6xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalCloseButton />
        <ModalContent bg="gray.100">
          <ModalBody>
            <TransportForm
              onModalClose={() => {
                setOpen(false);
              onClose?.();
                
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TransportFormModal;
