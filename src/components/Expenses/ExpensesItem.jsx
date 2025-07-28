import {
  Box,
  Flex,
  Text,
  Input,
  IconButton,
  HStack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";

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

  const isEditing =
    editingItem?.dayIndex === dayIndex && editingItem?.itemIndex === itemIndex;
  const isNewItem = isEditing && editingItem.isNew;

  const handleCancelEdit = () => {
    if (isNewItem) {
      removeExpenseItem(dayIndex, itemIndex);
    }
    setEditingItem(null);
  };

  return (
    <Box bg={bg} rounded="md" p={4} borderWidth="1px" borderColor="gray.200">
      {isEditing ? (
        <HStack spacing={3} align="center">
          <Input
            value={item.label}
            onChange={(e) =>
              updateExpenseItem(dayIndex, itemIndex, "label", e.target.value)
            }
            placeholder="Label"
            flex="1"
            color={"white"}
          />
          <Input
            value={item.description}
            onChange={(e) =>
              updateExpenseItem(
                dayIndex,
                itemIndex,
                "description",
                e.target.value
              )
            }
            placeholder="Description"
            flex="1"
            color={"white"}
          />
          <Input
            type="number"
            value={item.adultPrice === null ? "" : item.adultPrice}
            onChange={(e) =>
              updateExpenseItem(
                dayIndex,
                itemIndex,
                "adultPrice",
                e.target.value
              )
            }
            placeholder="Price Adult"
            w="120px"
            color={"white"}
          />
          <Input
            type="number"
            value={item.childPrice === null ? "" : item.childPrice}
            onChange={(e) =>
              updateExpenseItem(
                dayIndex,
                itemIndex,
                "childPrice",
                e.target.value
              )
            }
            placeholder="Price Child"
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
            <Text fontWeight="bold" fontSize="md" color="white">
              {item.label || "No label"}
            </Text>
            {item.description && (
              <Text fontSize="sm" color="gray.300">
                {item.description}
              </Text>
            )}
          </Box>

          <Flex align="center" gap={2}>
            <VStack mt={1} paddingRight={2}>
              <Text fontSize="sm" color="gray.200">
                Adult: {item.adultPrice ? formatCurrency(item.adultPrice) : ""}
              </Text>
              <Text fontSize="sm" color="gray.200">
                Child: {item.childPrice ? formatCurrency(item.childPrice) : "-"}
              </Text>
            </VStack>
            <IconButton
              icon={<EditIcon />}
              size="sm"
              colorScheme="blue"
              aria-label="Edit"
              onClick={() =>
                setEditingItem({ dayIndex, itemIndex, isNew: false })
              }
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
