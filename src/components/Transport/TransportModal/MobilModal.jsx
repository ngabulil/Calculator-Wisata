import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import TransportForm from "../../Admin/Transport/TransportForm/TransportForm";
import { useState } from "react";

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
        <ModalContent bg="gray.700">
          <ModalBody>
            <TransportForm
              isModal
              onModalClose={(val) => {
                setOpen(false);
                onClose?.(val);
              }}
            />
            <ModalCloseButton />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TransportFormModal;
