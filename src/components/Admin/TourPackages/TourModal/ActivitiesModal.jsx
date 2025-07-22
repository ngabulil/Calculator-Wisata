import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import ActivitiesForm from "../../../Admin/Activity/ActivityForm/ActivityForm";
import { useState } from "react";

const ActivitiesFormModal = ({ isOpen, onClose }) => {
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
            <ActivitiesForm
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

export default ActivitiesFormModal;
