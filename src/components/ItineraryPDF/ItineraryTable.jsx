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
  onMoveDayUp,
  onMoveDayDown,
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

  // Helper function untuk render unified item
  const renderUnifiedItem = (item, itemIndex, dayIndex, currentDay) => {
    const totalItems = currentDay.items?.length || 0;
    const canMoveUp = itemIndex > 0;
    const canMoveDown = itemIndex < totalItems - 1;

    if (item.type === 'activity') {
      return (
        <Tr key={`item-${dayIndex}-${itemIndex}`}>
          <Td style={itineraryTextStyle} border="1px solid #ddd">
            <Flex justify="space-between" align="center">
              <Box flex="1" textAlign="left">
                <Text>• {item.item}</Text>
                {item.originalData?.description && (
                  <Text fontSize="xs" color="gray.600" fontStyle="italic" ml={3}>
                    {item.originalData.description}
                  </Text>
                )}
              </Box>
              {isReordering && (
                <ReorderControls
                  onMoveUp={() => onMoveItemUp?.(dayIndex, itemIndex)}
                  onMoveDown={() => onMoveItemDown?.(dayIndex, itemIndex)}
                  canMoveUp={canMoveUp}
                  canMoveDown={canMoveDown}
                  isVisible={isReordering}
                />
              )}
            </Flex>
          </Td>
        </Tr>
      );
    } else if (item.type === 'expense') {
      return (
        <Tr key={`item-${dayIndex}-${itemIndex}`}>
          <Td style={itineraryTextStyle} border="1px solid #ddd">
            <Flex justify="space-between" align="center">
              <Box flex="1" textAlign="left">
                <Text>• {item.label || item.item || 'Unnamed Item'}</Text>
                {item.description && (
                  <Text fontSize="xs" color="gray.600" fontStyle="italic" ml={3}>
                    {item.description}
                  </Text>
                )}
              </Box>
              {isReordering && (
                <ReorderControls
                  onMoveUp={() => onMoveItemUp?.(dayIndex, itemIndex)}
                  onMoveDown={() => onMoveItemDown?.(dayIndex, itemIndex)}
                  canMoveUp={canMoveUp}
                  canMoveDown={canMoveDown}
                  isVisible={isReordering}
                />
              )}
            </Flex>
          </Td>
        </Tr>
      );
    }

    // Return empty row for unknown types instead of null
    return (
      <Tr key={`item-${dayIndex}-${itemIndex}`}>
        <Td style={itineraryTextStyle} border="1px solid #ddd">
          <Box textAlign="left">
            <Text>• Unknown item type: {item.type || 'undefined'}</Text>
            <Text fontSize="xs" color="gray.500" fontStyle="italic" ml={3}>
              Item data: {JSON.stringify(item, null, 2).substring(0, 100)}...
            </Text>
          </Box>
        </Td>
      </Tr>
    );
  };

  // Helper function untuk render expense item (backward compatibility)
  const renderExpenseItem = (expenseItem, dayIndex, itemIndex, currentDay) => {
    const { label, description } = expenseItem;
    const totalExpenseItems = currentDay.expenseItems?.length || 0;
    const canMoveUp = itemIndex > 0;
    const canMoveDown = itemIndex < totalExpenseItems - 1;
    
    return (
      <Tr key={`expense-${dayIndex}-${itemIndex}`}>
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
                canMoveUp={canMoveUp}
                canMoveDown={canMoveDown}
                isVisible={isReordering}
              />
            )}
          </Flex>
        </Td>
      </Tr>
    );
  };

  // Helper function untuk render activity (backward compatibility)
  const renderActivity = (activity, dayIndex, itemIndex, currentDay) => {
    const totalActivities = currentDay.activities?.length || 0;
    const canMoveUp = itemIndex > 0;
    const canMoveDown = itemIndex < totalActivities - 1;

    // Handle both string and object activities
    const activityName = typeof activity === 'string' ? activity : (activity?.displayName || activity?.name || activity?.item || 'Unnamed Activity');
    const activityDescription = typeof activity === 'object' ? activity?.description : null;

    return (
      <Tr key={`activity-${dayIndex}-${itemIndex}`}>
        <Td style={itineraryTextStyle} border="1px solid #ddd">
          <Flex justify="space-between" align="center">
            <Box flex="1" textAlign="left">
              <Text>• {activityName}</Text>
              {activityDescription && (
                <Text fontSize="xs" color="gray.600" fontStyle="italic" ml={3}>
                  {activityDescription}
                </Text>
              )}
            </Box>
            {isReordering && (
              <ReorderControls
                onMoveUp={() => onMoveItemUp?.(dayIndex, itemIndex, 'activities')}
                onMoveDown={() => onMoveItemDown?.(dayIndex, itemIndex, 'activities')}
                canMoveUp={canMoveUp}
                canMoveDown={canMoveDown}
                isVisible={isReordering}
              />
            )}
          </Flex>
        </Td>
      </Tr>
    );
  };

  // Create all rows as flat array to avoid Fragment issues
  const renderAllRows = () => {
    const allRows = [];
    
    if (!days || !Array.isArray(days)) {
      return allRows;
    }

    days.forEach((day, dayIndex) => {
      // Validate day object to prevent errors
      if (!day || typeof day !== 'object') {
        console.warn(`Invalid day object at index ${dayIndex}:`, day);
        return;
      }

      // Add day header row
      allRows.push(
        <Tr key={`day-header-${dayIndex}`}>
          <Td style={dayTitleStyle} border="1px solid #ddd">
            <Flex justify="space-between" align="center">
              <Box flex="1">
                <Text>DAY {day.day || dayIndex + 1} - {day.title || `Day ${dayIndex + 1}`}</Text>
                {day.description && (
                  <Text fontSize="xs" fontStyle="italic" color="gray.500">({day.description})</Text>
                )}
                {day.date && (
                  <Text fontSize="xs" fontWeight="normal">{formatDate(day.date)}</Text>
                )}
              </Box>
              {isReordering && (
                <ReorderControls
                  onMoveUp={() => {
                    console.log(`Moving day up: dayIndex=${dayIndex}`);
                    onMoveDayUp?.(dayIndex);
                  }}
                  onMoveDown={() => {
                    console.log(`Moving day down: dayIndex=${dayIndex}`);
                    onMoveDayDown?.(dayIndex);
                  }}
                  canMoveUp={dayIndex > 0}
                  canMoveDown={dayIndex < days.length - 1}
                  isVisible={isReordering}
                />
              )}
            </Flex>
          </Td>
        </Tr>
      );

      // Add item rows with error handling
      try {
        if (day.items && Array.isArray(day.items) && day.items.length > 0) {
          // Use unified items array
          day.items.forEach((item, itemIndex) => {
            if (item && typeof item === 'object') {
              const renderedItem = renderUnifiedItem(item, itemIndex, dayIndex, day);
              if (renderedItem) {
                allRows.push(renderedItem);
              }
            } else {
              console.warn(`Invalid item at day ${dayIndex}, item ${itemIndex}:`, item);
            }
          });
        } else {
          // Fallback to separate arrays for backward compatibility
          
          // Render Activities with validation
          if (day.activities && Array.isArray(day.activities)) {
            day.activities.forEach((activity, itemIndex) => {
              if (activity !== null && activity !== undefined) {
                const renderedActivity = renderActivity(activity, dayIndex, itemIndex, day);
                if (renderedActivity) {
                  allRows.push(renderedActivity);
                }
              }
            });
          }
          
          // Render Expense items with validation
          if (day.expenseItems && Array.isArray(day.expenseItems)) {
            day.expenseItems.forEach((expenseItem, itemIndex) => {
              if (expenseItem && typeof expenseItem === 'object') {
                const renderedExpense = renderExpenseItem(expenseItem, dayIndex, itemIndex, day);
                if (renderedExpense) {
                  allRows.push(renderedExpense);
                }
              }
            });
          }
        }
      } catch (error) {
        console.error(`Error rendering items for day ${dayIndex}:`, error);
        // Add error row
        allRows.push(
          <Tr key={`error-${dayIndex}`}>
            <Td style={itineraryTextStyle} border="1px solid #ddd">
              <Text color="red.500" textAlign="left">
                Error loading items for this day. Please check console for details.
              </Text>
            </Td>
          </Tr>
        );
      }
    });

    return allRows;
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
            // Render all rows as flat array
            renderAllRows()
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