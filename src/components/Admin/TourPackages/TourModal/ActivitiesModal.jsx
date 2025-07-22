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

const ActivitiesFormModal = ({ isOpen, onClose }) => {
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
            <ActivitiesForm isModal />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ActivitiesFormModal;
