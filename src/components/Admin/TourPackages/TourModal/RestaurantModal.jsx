import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import RestaurantForm from "../../../Admin/Restaurant/RestaurantForm/RestaurantForm";

const RestaurantFormModal = ({ isOpen, onClose }) => {
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
            <RestaurantForm isModal />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RestaurantFormModal;
