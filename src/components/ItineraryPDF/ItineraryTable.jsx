import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  HStack,
  Flex
} from "@chakra-ui/react";
import ReorderControls from '../ReorderControls';

const orange = "#FB8C00";
const orangeLight = "#FFE0B2";

const tableHeaderStyle = {
  backgroundColor: orange,
  color: "#222",
  fontWeight: "bold",
  fontSize: "1rem",
  textAlign: "center",
  padding: "2px 40px 12px 40px",
};

const dayTitleStyle = {
  backgroundColor: orangeLight,
  fontWeight: "bold",
  padding: "2px 40px 12px 40px",
  verticalAlign: "top",
};

const itineraryTextStyle = {
  fontSize: "sm",
  padding: "2px 40px 12px 40px",
  verticalAlign: "top",
};

const ItineraryTable = ({
  days = [], 
  title = "",
  isReordering = false,
  onMoveItemUp,
  onMoveItemDown,
  // onMoveDayUp,
  // onMoveDayDown
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
  };

  // Helper function untuk render expense item dengan label dan description
  const renderExpenseItem = (expenseItem, dayIndex, itemIndex) => {
    const { label, description } = expenseItem;
    
    return (
      <Tr key={`expense-${itemIndex}`}>
        <Td style={itineraryTextStyle} border="1px solid #ddd">
          <Flex justify="space-between" align="center">
            <Box flex="1" textAlign="left">
              <Text>• {label || 'Unnamed Item'}</Text>
              {description && (
                <Text fontSize="xs" color="gray.600" fontStyle="italic" ml={3}>
                  {description}
                </Text>
              )}
            </Box>
            {isReordering && (
              <ReorderControls
                onMoveUp={() => onMoveItemUp?.(dayIndex, itemIndex, 'expenseItems')}
                onMoveDown={() => onMoveItemDown?.(dayIndex, itemIndex, 'expenseItems')}
                canMoveUp={itemIndex > 0}
                canMoveDown={itemIndex < expenseItem.totalLength - 1}
                isVisible={isReordering}
              />
            )}
          </Flex>
        </Td>
      </Tr>
    );
  };

  return (
    <Box>
      <Table variant="simple" size="sm" border="1px solid #ddd">
        <Thead>
          <Tr>
            <Th style={tableHeaderStyle} border="1px solid #ddd">
              {title.toUpperCase()}
            </Th>
          </Tr>
        </Thead>
        <Tbody color="#222" textAlign="center">
          {days.length > 0 ? (
            days.map((day, dayIndex) => (
              <React.Fragment key={dayIndex}>
                {/* Judul Hari */}
                <Tr>
                  <Td style={dayTitleStyle} border="1px solid #ddd">
                    <Flex justify="space-between" align="center">
                      <Box flex="1">
                        <Text>DAY {day.day} - {day.title}</Text>
                        <Text fontSize="xs" fontStyle="italic" color="gray.500">({day.description})</Text>
                        <Text fontSize="xs" fontWeight="normal">{formatDate(day.date)}</Text>
                      </Box>
                    </Flex>
                  </Td>
                </Tr>

                {/* Daftar Aktivitas dari package */}
                {day.activities && day.activities.map((activity, i) => (
                  <Tr key={i}>
                    <Td style={itineraryTextStyle} border="1px solid #ddd">
                      <Flex justify="space-between" align="center">
                        <Text flex="1" textAlign="left">• {activity}</Text>
                        {isReordering && (
                          <ReorderControls
                            onMoveUp={() => onMoveItemUp?.(dayIndex, i, 'activities')}
                            onMoveDown={() => onMoveItemDown?.(dayIndex, i, 'activities')}
                            canMoveUp={i > 0}
                            canMoveDown={i < day.activities.length - 1}
                            isVisible={isReordering}
                          />
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                ))}

                {/* Daftar Expense Items dari ExpensesContext - UPDATED */}
                {day.expenseItems && day.expenseItems.length > 0 &&
                  day.expenseItems.map((expenseItem, i) => {
                    // Tambahkan totalLength untuk reorder controls
                    const itemWithLength = {
                      ...expenseItem,
                      totalLength: day.expenseItems.length
                    };
                    return renderExpenseItem(itemWithLength, dayIndex, i);
                  })}
              </React.Fragment>
            ))
          ) : (
            <Tr>
              <Td textAlign="center" py={4} border="1px solid #ddd">
                <Text color="gray.500">No itinerary data available</Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ItineraryTable;