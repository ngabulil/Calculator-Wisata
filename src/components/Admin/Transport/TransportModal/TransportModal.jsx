import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import TransportForm from "../TransportForm/TransportForm";

const TransportFormModal = ({ isOpen, onClose }) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="6xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalCloseButton />

          <ModalBody>
            <TransportForm />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TransportFormModal;
