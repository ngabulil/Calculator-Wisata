import React, { useState, useCallback } from 'react';
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
    Textarea,
    Input,
    IconButton,
    VStack,
    useToast
} from '@chakra-ui/react';
import { EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import ReorderControls from '../ReorderControls';

const orange = "#FFA726";
const orangeLight = "#FFE0B2";
const gray = "#F5F5F5";

const tableStyles = {
    header: {
        backgroundColor: orange,
        color: "#222",
        fontWeight: "bold",
        fontSize: "1rem",
        padding: "2px 20px 12px 10px",
    },
    subHeader: {
        backgroundColor: orangeLight,
        fontWeight: "bold",
        padding: "2px 20px 12px 10px",
    },
    total: {
        backgroundColor: orange,
        fontWeight: "bold",
        padding: "2px 20px 12px 10px",
    },
    cell: {
        padding: "2px 30px 12px 10px",
        verticalAlign: "top",
    }
};

const ItineraryTable = ({ 
    days, 
    formatCurrency, 
    isReordering = false,
    onMoveItemUp,
    onMoveItemDown,
    onEditItemTitle,
    onEditItemDescription,
    totalAdult = 0,
    totalChild = 0
}) => {
    const [editingItem, setEditingItem] = useState(null);
    const [editValues, setEditValues] = useState({ title: '', description: '' });
    const toast = useToast();

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('id-ID', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    // Normalize data structure - convert legacy format to unified items
    const normalizedDays = days?.map(day => ({
        ...day,
        items: day.items?.length ? day.items : [
            ...(day.activities?.map(act => ({ ...act, type: 'activity' })) || []),
            ...(day.expenseItems?.map(exp => ({ ...exp, type: 'expense' })) || [])
        ]
    })) || [];

    const startEditing = useCallback((dayIndex, itemIndex, currentTitle, currentDescription) => {
        setEditingItem({ dayIndex, itemIndex });
        setEditValues({ 
            title: currentTitle || '', 
            description: currentDescription || '' 
        });
    }, []);

    const cancelEditing = useCallback(() => {
        setEditingItem(null);
        setEditValues({ title: '', description: '' });
    }, []);

    const saveEditing = useCallback(() => {
        if (!editingItem) return;

        const { dayIndex, itemIndex } = editingItem;
        
        if (onEditItemTitle && editValues.title.trim()) {
            onEditItemTitle(dayIndex, itemIndex, editValues.title.trim());
        }
        
        if (onEditItemDescription) {
            onEditItemDescription(dayIndex, itemIndex, editValues.description.trim());
        }

        toast({
            title: "Item Updated",
            description: "Item has been updated successfully",
            status: "success",
            duration: 2000,
            isClosable: true,
        });

        setEditingItem(null);
        setEditValues({ title: '', description: '' });
    }, [editingItem, editValues, onEditItemTitle, onEditItemDescription, toast]);

    const parseExpense = (expense) => {
        if (!expense || expense === '-' || expense === 'Rp 0') return 0;
        const amount = parseFloat(
            expense.toString()
                .replace(/[^\d,-]/g, '')
                .replace(/\./g, '')
                .replace(',', '.')
        );
        return isNaN(amount) ? 0 : amount;
    };

    const calculateItemTotal = (item) => {
        if (item.type === 'activity') {
            return parseExpense(item.expense) + parseExpense(item.kidExpense);
        }

        // For expense items
        const adultTotal = (item.adultPrice || 0) * totalAdult;
        const childTotal = (item.childPrice || 0) * totalChild;
        
        if (item.adultPrice != null || item.childPrice != null) {
            return adultTotal + childTotal;
        }
        
        return (item.price || 0) * (item.quantity || 1);
    };

    const calculateTotalExpenses = () => {
        return normalizedDays.reduce((total, day) => 
            total + (day.items?.reduce((dayTotal, item) => 
                dayTotal + calculateItemTotal(item), 0) || 0), 0
        );
    };

  const getItemDisplayValues = (item) => {
    const title = item.item || item.label || 'Unnamed Item';
    const description = item.description || '';

    if (item.type === 'activity') {
        return {
            title,
            description,
            adultExpense: parseExpense(item.expense),
            childExpense: parseExpense(item.kidExpense)
        };
    }
    let adultDisplay = 0;
    let childDisplay = 0;

    if (item.adultPrice != null) {
        adultDisplay = (item.adultPrice || 0) * totalAdult;
    }
    if (item.childPrice != null) {
        childDisplay = (item.childPrice || 0) * totalChild;
    }

    if (item.adultPrice == null && item.childPrice == null) {
        adultDisplay = (item.price || 0) * (item.quantity || 1);
        childDisplay = 0; 
    }
    
    return {
        title,
        description,
        adultExpense: adultDisplay,
        childExpense: totalChild > 0 ? childDisplay : 0
    };
};
    const renderItemContent = (item, dayIndex, itemIndex) => {
        const isCurrentlyEditing = editingItem?.dayIndex === dayIndex && editingItem?.itemIndex === itemIndex;
        const { title, description } = getItemDisplayValues(item);

        if (isReordering || isCurrentlyEditing) {
            return (
                <VStack align="stretch" spacing={2}>
                    <HStack>
                        <Text fontSize="sm" fontWeight="bold" minWidth="60px">Name:</Text>
                        <Input
                            value={isCurrentlyEditing ? editValues.title : title}
                            onChange={(e) => {
                                if (isCurrentlyEditing) {
                                    setEditValues(prev => ({ ...prev, title: e.target.value }));
                                } else {
                                    onEditItemTitle?.(dayIndex, itemIndex, e.target.value);
                                }
                            }}
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
                            value={isCurrentlyEditing ? editValues.description : description}
                            onChange={(e) => {
                                if (isCurrentlyEditing) {
                                    setEditValues(prev => ({ ...prev, description: e.target.value }));
                                } else {
                                    onEditItemDescription?.(dayIndex, itemIndex, e.target.value);
                                }
                            }}
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
                            <IconButton
                                icon={<CheckIcon />}
                                size="xs"
                                colorScheme="green"
                                onClick={saveEditing}
                                aria-label="Save changes"
                            />
                            <IconButton
                                icon={<CloseIcon />}
                                size="xs"
                                colorScheme="red"
                                onClick={cancelEditing}
                                aria-label="Cancel editing"
                            />
                        </HStack>
                    )}
                </VStack>
            );
        }

        return (
            <HStack align="flex-start" spacing={2}>
                <Box flex={1}>
                    <Text>• {title}</Text>
                    {description && (
                        <Text fontSize="xs" color="gray.600" fontStyle="italic" ml={3}>
                            {description}
                        </Text>
                    )}
                </Box>
                <IconButton
                    icon={<EditIcon />}
                    size="xs"
                    variant="ghost"
                    onClick={() => startEditing(dayIndex, itemIndex, title, description)}
                    aria-label="Edit item"
                    _hover={{ bg: "gray.100" }}
                />
            </HStack>
        );
    };

    const renderItem = (item, itemIndex, dayIndex, currentDay) => {
        const totalItems = currentDay.items?.length || 0;
        const canMoveUp = itemIndex > 0;
        const canMoveDown = itemIndex < totalItems - 1;
        const isCurrentlyEditing = editingItem?.dayIndex === dayIndex && editingItem?.itemIndex === itemIndex;
        const { adultExpense, childExpense } = getItemDisplayValues(item);

        return (
            <Tr 
                key={`item-${dayIndex}-${itemIndex}`} 
                _hover={{ background: !isCurrentlyEditing && !isReordering ? gray : undefined }}
            >
                {isReordering && (
                    <Td style={tableStyles.cell}>
                        <ReorderControls
                            onMoveUp={() => onMoveItemUp?.(dayIndex, itemIndex)}
                            onMoveDown={() => onMoveItemDown?.(dayIndex, itemIndex)}
                            canMoveUp={canMoveUp}
                            canMoveDown={canMoveDown}
                            isVisible={isReordering}
                        />
                    </Td>
                )}
                <Td></Td>
                <Td style={tableStyles.cell}>
                    {renderItemContent(item, dayIndex, itemIndex)}
                </Td>
                <Td style={tableStyles.cell}>
                    {adultExpense > 0 ? formatCurrency(adultExpense) : '-'}
                </Td>
                <Td style={tableStyles.cell}>
                    {childExpense > 0 ? formatCurrency(childExpense) : '-'}
                </Td>
            </Tr>
        );
    };

    return (
        <Box mb={8} borderRadius="md" overflow="hidden">
            <Table variant="simple" size="sm">
                <Thead>
                    <Tr>
                        {isReordering && <Th textAlign="center" width="80px" style={tableStyles.header}>Order</Th>}
                        <Th textAlign="center" width="60px" style={tableStyles.header}>Day</Th>
                        <Th style={tableStyles.header}>Quotation</Th>
                        <Th textAlign="center" width="100px" style={tableStyles.header}>Expenses</Th>
                        <Th textAlign="center" width="100px" style={tableStyles.header}>Kid 4-9</Th>
                    </Tr>
                </Thead>
                <Tbody color="#222">
                    {normalizedDays.map((day, dayIndex) => (
                        <React.Fragment key={`day-${dayIndex}`}>
                            {/* Day Header */}
                            <Tr>
                                {isReordering && <Td style={tableStyles.subHeader}></Td>}
                                <Td textAlign="center" fontWeight="bold" style={tableStyles.subHeader}>
                                    {day.day}
                                </Td>
                                <Td fontWeight="bold" style={tableStyles.subHeader}>
                                    <Box>
                                        <Text fontWeight="bold" fontSize="sm">{day.title}</Text>
                                        <Text fontSize="xs" color="gray.600">{day.description}</Text>
                                        <Text fontSize="xs" fontStyle="italic" color="gray.500">
                                            {formatDate(day.date)}
                                        </Text>
                                    </Box>
                                </Td>
                                <Td style={tableStyles.subHeader}></Td>
                                <Td style={tableStyles.subHeader}></Td>
                            </Tr>
                            
                            {/* Render Items */}
                            {day.items?.map((item, itemIndex) => 
                                renderItem(item, itemIndex, dayIndex, day)
                            )}
                        </React.Fragment>
                    ))}
                    
                    {/* Total Row */}
                    <Tr>
                        {isReordering && <Td style={tableStyles.total}></Td>}
                        <Td colSpan={3} style={tableStyles.total}>
                            Total Expenses
                        </Td>
                        <Td textAlign="right" style={tableStyles.total}>
                            {formatCurrency(calculateTotalExpenses())}
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
        </Box>
    );
};

export default ItineraryTable;