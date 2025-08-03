import React, { useState, useCallback } from "react";
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
  Flex,
  VStack,
  Input,
  Textarea,
  IconButton,
  useToast
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
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
  onEditItemTitle,
  onEditItemDescription,
}) => {
  const [editingItem, setEditingItem] = useState(null);
  const [editValues, setEditValues] = useState({ title: '', description: '' });
  const toast = useToast();

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

  const startEditing = useCallback((dayIndex, itemIndex, currentTitle, currentDescription) => {
    setEditingItem({ dayIndex, itemIndex });
    setEditValues({ title: currentTitle || '', description: currentDescription || '' });
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingItem(null);
    setEditValues({ title: '', description: '' });
  }, []);

  const saveEditing = useCallback(() => {
    if (!editingItem) return;
    const { dayIndex, itemIndex } = editingItem;

    if (onEditItemTitle && editValues.title.trim() !== '') {
      onEditItemTitle(dayIndex, itemIndex, editValues.title.trim());
    }
    if (onEditItemDescription) {
      onEditItemDescription(dayIndex, itemIndex, editValues.description.trim());
    }

    toast({
      title: "Item Updated",
      description: "Item name and description have been updated successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    setEditingItem(null);
    setEditValues({ title: '', description: '' });
  }, [editingItem, editValues, onEditItemTitle, onEditItemDescription, toast]);

  const renderGenericItem = ({
    key,
    itemTitle,
    itemDescription,
    isCurrentlyEditing,
    onChangeTitle,
    onChangeDescription,
    onEditClick,
    saveEditing,
    cancelEditing,
    isReordering,
    canMoveUp,
    canMoveDown,
    onMoveUp,
    onMoveDown,
  }) => {
    const renderItemContent = () => {
      if (isReordering || isCurrentlyEditing) {
        return (
          <VStack align="stretch" spacing={2}>
            <HStack>
              <Text fontSize="sm" fontWeight="bold" minWidth="60px">Name:</Text>
              <Input
                value={itemTitle}
                onChange={(e) => onChangeTitle?.(e.target.value)}
                size="sm"
                placeholder="Enter item name"
                bg="white"
                border="1px solid"
                borderColor="gray.300"
              />
            </HStack>
            <HStack align="flex-start">
              <Text fontSize="sm" fontWeight="bold" minWidth="60px">Desc:</Text>
              <Textarea
                value={itemDescription}
                onChange={(e) => onChangeDescription?.(e.target.value)}
                size="sm"
                placeholder="Enter description (optional)"
                rows={2}
                resize="vertical"
                bg="white"
                border="1px solid"
                borderColor="gray.300"
              />
            </HStack>
            {isCurrentlyEditing && (
              <HStack spacing={1}>
                <IconButton icon={<CheckIcon />} size="xs" colorScheme="green" onClick={saveEditing} aria-label="Save changes" />
                <IconButton icon={<CloseIcon />} size="xs" colorScheme="red" onClick={cancelEditing} aria-label="Cancel editing" />
              </HStack>
            )}
          </VStack>
        );
      }
      return (
        <HStack align="flex-start" spacing={2}>
          <Box flex={1}>
            <Text>• {itemTitle}</Text>
            {itemDescription && (
              <Text fontSize="xs" color="gray.600" fontStyle="italic" ml={3}>{itemDescription}</Text>
            )}
          </Box>
          <IconButton
            icon={<EditIcon />}
            size="xs"
            variant="ghost"
            onClick={onEditClick}
            aria-label="Edit item"
            _hover={{ bg: "gray.100" }}
          />
        </HStack>
      );
    };

    return (
      <Tr key={key}>
        <Td style={itineraryTextStyle} border="1px solid #ddd">
          <Flex justify="space-between" align="center">
            <Box flex="1" textAlign="left">{renderItemContent()}</Box>
            {isReordering && (
              <ReorderControls
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
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

  const renderAllRows = () => {
    const allRows = [];
    days.forEach((day, dayIndex) => {
      allRows.push(
        <Tr key={`day-header-${dayIndex}`}>
          <Td style={dayTitleStyle} border="1px solid #ddd">
            <Flex justify="space-between" align="center">
              <Box flex="1">
                <Text>DAY {day.day || dayIndex + 1} - {day.title || `Day ${dayIndex + 1}`}</Text>
                {day.description && <Text fontSize="xs" fontStyle="italic" color="gray.500">({day.description})</Text>}
                {day.date && <Text fontSize="xs" fontWeight="normal">{formatDate(day.date)}</Text>}
              </Box>
            </Flex>
          </Td>
        </Tr>
      );

      const sources = day.items || day.activities || day.expenseItems || [];
      sources.forEach((item, itemIndex) => {
        if (!item) return;
        const itemTitle = item.item || item.label || item.displayName || item.name || (typeof item === 'string' ? item : 'Unnamed');
        const itemDescription = item.description || (typeof item === 'object' ? item.originalData?.description : null) || '';
        const isCurrentlyEditing = editingItem?.dayIndex === dayIndex && editingItem?.itemIndex === itemIndex;
        const canMoveUp = itemIndex > 0;
        const canMoveDown = itemIndex < sources.length - 1;

        allRows.push(renderGenericItem({
          key: `item-${dayIndex}-${itemIndex}`,
          itemTitle: isCurrentlyEditing ? editValues.title : itemTitle,
          itemDescription: isCurrentlyEditing ? editValues.description : itemDescription,
          isCurrentlyEditing,
          onChangeTitle: isCurrentlyEditing
            ? (val) => setEditValues(prev => ({ ...prev, title: val }))
            : (val) => onEditItemTitle?.(dayIndex, itemIndex, val),
          onChangeDescription: isCurrentlyEditing
            ? (val) => setEditValues(prev => ({ ...prev, description: val }))
            : (val) => onEditItemDescription?.(dayIndex, itemIndex, val),
          onEditClick: () => startEditing(dayIndex, itemIndex, itemTitle, itemDescription),
          saveEditing,
          cancelEditing,
          isReordering,
          canMoveUp,
          canMoveDown,
          onMoveUp: () => onMoveItemUp?.(dayIndex, itemIndex),
          onMoveDown: () => onMoveItemDown?.(dayIndex, itemIndex)
        }));
      });
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
          {days.length > 0 ? renderAllRows() : (
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