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
import { useState } from "react";

const RestaurantFormModal = ({ isOpen, onClose }) => {
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
            <RestaurantForm
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

export default RestaurantFormModal;
