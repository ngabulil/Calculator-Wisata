import { Tr, Td, Button, HStack } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
const AdminAccountCard = ({ nomor, account, onEditButton, onDeleteButton }) => {
  const navigate = useNavigate();
  return (
    <Tr>
      <Td>{nomor}</Td>
      <Td>{account.username}</Td>
      <Td>{account.name}</Td>
      <Td>{account.role}</Td>
      <Td>{new Date(account.createdAt).toLocaleString()}</Td>
      <Td>{new Date(account.updatedAt).toLocaleString()}</Td>
      <Td>
        <HStack spacing={2}>
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<EditIcon />}
            onClick={() => {
              onEditButton();
              navigate("/admin/manage/edit");
            }}
          >
            Update
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            leftIcon={<DeleteIcon />}
            onClick={onDeleteButton}
          >
            Delete
          </Button>
        </HStack>
      </Td>
    </Tr>
  );
};

export default AdminAccountCard;
