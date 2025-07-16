import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import ExpenseItem from "./ExpensesItem";

const DayCard = ({
  day,
  dayIndex,
  editingItem,
  setEditingItem,
  removeDay,
  calculateDayTotal,
  formatCurrency,
  addExpenseItem,
  removeExpenseItem,
  updateExpenseItem,
}) => {
  const bg = useColorModeValue("gray.700", "gray.800");

  const handleAddExpenseItem = () => {
    const newItemIndex = addExpenseItem(dayIndex);
    setEditingItem({ dayIndex, itemIndex: newItemIndex, isNew: true });
  };

  return (
    <Box
      borderWidth="1px"
      borderColor="gray.200"
      rounded="lg"
      p={5}
      bg={bg}
      position="relative"
    >
      <Flex justify="space-between" align="start" mb={4}>
        <Flex direction="column" flex="1">
          <Flex align="center" mb={2}>
            <Text fontSize="lg" fontWeight="semibold" color="white">
              {day.day_name}
            </Text>
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              ml={2}
              colorScheme="red"
              aria-label="Hapus hari"
              alignSelf="flex-end"
              onClick={() => removeDay(dayIndex)}
            />
          </Flex>
        </Flex>

        <Flex direction="column" align="flex-end">
          <Text fontSize="sm" color="white">
            Total Hari Ini:
          </Text>
          <Text fontSize="lg" fontWeight="bold" color="green.600">
            {formatCurrency(calculateDayTotal(dayIndex))}
          </Text>
        </Flex>
      </Flex>

      <VStack spacing={3} align="stretch">
        {day.totals && day.totals.length > 0 ? (
          day.totals.map((item, itemIndex) => (
            <ExpenseItem
              key={`${dayIndex}-${itemIndex}`}
              item={item}
              dayIndex={dayIndex}
              itemIndex={itemIndex}
              editingItem={editingItem}
              setEditingItem={setEditingItem}
              updateExpenseItem={updateExpenseItem}
              removeExpenseItem={removeExpenseItem}
              formatCurrency={formatCurrency}
            />
          ))
        ) : (
          <Box p={4} textAlign="center">
            <Text color="gray.400" fontSize="sm">
              Belum ada expense item untuk hari ini
            </Text>
          </Box>
        )}

        {/* Add Expense Button */}
        <Button
          leftIcon={<AddIcon />}
          variant="outline"
          colorScheme="purple"
          onClick={handleAddExpenseItem}
        >
          Tambah Expense Item
        </Button>
      </VStack>
    </Box>
  );
};

export default DayCard;