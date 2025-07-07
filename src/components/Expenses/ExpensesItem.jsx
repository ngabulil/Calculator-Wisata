import {
  Box, Flex, Text, Input, IconButton, HStack, useColorModeValue
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

const ExpenseItem = ({
  item,
  dayIndex,
  itemIndex,
  editingItem,
  setEditingItem,
  updateExpenseItem,
  removeExpenseItem,
  formatCurrency,
}) => {
  const bg = useColorModeValue("gray.700", "gray.800");

  const isEditing = editingItem?.dayIndex === dayIndex && editingItem?.itemIndex === itemIndex;
  const isNewItem = isEditing && editingItem.isNew; 

  const handleCancelEdit = () => {
    if (isNewItem) {
      removeExpenseItem(dayIndex, itemIndex);
    }
    setEditingItem(null); 
  };

  return (
    <Box
      bg={bg}
      rounded="md"
      p={4}
      borderWidth="1px"
      borderColor="gray.200"
    >
      {isEditing ? (
        <HStack spacing={3} align="center">
          <Input
            value={item.label}
            onChange={(e) => updateExpenseItem(dayIndex, itemIndex, 'label', e.target.value)}
            placeholder="Label/Deskripsi"
            flex="1"
            color={"white"}
          />
          <Input
            type="number"
            value={item.price === null ? '' : item.price}
            onChange={(e) => updateExpenseItem(dayIndex, itemIndex, 'price', e.target.value)}
            placeholder="Harga"
            w="120px"
            color={"white"}
          />
          <IconButton
            icon={<CheckIcon />}
            colorScheme="green"
            aria-label="Simpan"
            onClick={() => {
                setEditingItem(null);
            }}
            color={"white"}
          />
          <IconButton
            icon={<CloseIcon />}
            colorScheme="red"
            aria-label="Batal"
            onClick={handleCancelEdit}
            color={"white"}
          />
        </HStack>
      ) : (
        <Flex justify="space-between" align="center">
          <Box flex="1">
            <Text fontWeight="medium" color={"white"}>
              {item.label || 'No label'}
            </Text>
          </Box>
          <Flex align="center" gap={2}>
            <Text fontWeight="semibold" color={"white"}>
              {item.price ? formatCurrency(item.price) : 'Free'}
            </Text>
            <IconButton
              icon={<EditIcon />}
              size="sm"
              colorScheme="blue"
              aria-label="Edit"
              onClick={() => setEditingItem({ dayIndex, itemIndex, isNew: false })}
            />
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              colorScheme="red"
              aria-label="Hapus"
              onClick={() => removeExpenseItem(dayIndex, itemIndex)}
            />
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default ExpenseItem;