import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import DestinationForm from "../../../../components/Admin/Destination/DestinationForm/DestinationForm";
import { useState } from "react";

const DestinationFormModal = ({ isOpen, onClose }) => {
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
        <ModalContent bg="gray.800">
          <ModalCloseButton />

          <ModalBody>
            <DestinationForm
              isModal
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

export default DestinationFormModal;
