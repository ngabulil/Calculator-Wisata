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

const DestinationFormModal = ({ isOpen, onClose }) => {
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
            <DestinationForm />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DestinationFormModal;
