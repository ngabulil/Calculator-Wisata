import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import HotelForm from "../HotelForm/HotelForm"; // sesuaikan path jika perlu

const HotelFormModal = ({ isOpen, onClose }) => {
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
            <HotelForm isModal />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HotelFormModal;
