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

const tableHeaderStyle = {
    backgroundColor: orange,
    color: "#222",
    fontWeight: "bold",
    fontSize: "1rem",
    padding: "2px 20px 12px 10px",
};

const tableSubHeaderStyle = {
    backgroundColor: orangeLight,
    fontWeight: "bold",
    padding: "2px 20px 12px 10px",
};

const tableTotalStyle = {
    backgroundColor: orange,
    fontWeight: "bold",
    padding: "2px 20px 12px 10px",
};

const tableCellStyle = {
    padding: "2px 30px 12px 10px",
    verticalAlign: "top",
}

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
        
        // Call the parent functions to update the data
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

    const calculateTotalExpenses = () => {
        let total = 0;
        
        days.forEach(day => {
            const items = day.items || [];
            
            if (items.length > 0) {
                items.forEach(item => {
                    if (item.type === 'activity') {
                        if (item.expense && item.expense !== '-' && item.expense !== 'Rp 0') {
                            const expenseStr = item.expense.toString();
                            const amount = parseFloat(
                                expenseStr.replace(/[^\d,-]/g, '')
                                .replace(/\./g, '')
                                .replace(',', '.')
                            );
                            if (!isNaN(amount) && amount > 0) total += amount;
                        }
                        
                        if (item.kidExpense && item.kidExpense !== '-' && item.kidExpense !== 'Rp 0') {
                            const kidExpenseStr = item.kidExpense.toString();
                            const amount = parseFloat(
                                kidExpenseStr.replace(/[^\d,-]/g, '')
                                .replace(/\./g, '')
                                .replace(',', '.')
                            );
                            if (!isNaN(amount) && amount > 0) total += amount;
                        }
                    } else if (item.type === 'expense') {
                        let totalItemPrice = 0;
                        
                        if (item.adultPrice !== null && item.adultPrice !== undefined) {
                            const adultTotal = (item.adultPrice || 0) * totalAdult;
                            totalItemPrice += adultTotal;
                        }
                        
                        if (item.childPrice !== null && item.childPrice !== undefined) {
                            const childTotal = (item.childPrice || 0) * totalChild;
                            totalItemPrice += childTotal;
                        }
                        
                        if ((item.adultPrice === null || item.adultPrice === undefined) && 
                            (item.childPrice === null || item.childPrice === undefined)) {
                            const price = parseFloat(item.price) || 0;
                            const quantity = parseInt(item.quantity) || 1;
                            totalItemPrice = price * quantity;
                        }
                        
                        if (totalItemPrice > 0) total += totalItemPrice;
                    }
                });
            } else {
                // Fallback to separate arrays for backward compatibility
                day.activities?.forEach(activity => {
                    if (activity.expense && activity.expense !== '-' && activity.expense !== 'Rp 0') {
                        const expenseStr = activity.expense.toString();
                        const amount = parseFloat(
                            expenseStr.replace(/[^\d,-]/g, '')
                            .replace(/\./g, '')
                            .replace(',', '.')
                        );
                        if (!isNaN(amount) && amount > 0) total += amount;
                    }
                    
                    if (activity.kidExpense && activity.kidExpense !== '-' && activity.kidExpense !== 'Rp 0') {
                        const kidExpenseStr = activity.kidExpense.toString();
                        const amount = parseFloat(
                            kidExpenseStr.replace(/[^\d,-]/g, '')
                            .replace(/\./g, '')
                            .replace(',', '.')
                        );
                        if (!isNaN(amount) && amount > 0) total += amount;
                    }
                });
                
                if (day.expenseItems && Array.isArray(day.expenseItems)) {
                    day.expenseItems.forEach(expenseItem => {
                        let totalItemPrice = 0;
                        
                        if (expenseItem.adultPrice !== null && expenseItem.adultPrice !== undefined) {
                            const adultTotal = (expenseItem.adultPrice || 0) * totalAdult;
                            totalItemPrice += adultTotal;
                        }
                        
                        if (expenseItem.childPrice !== null && expenseItem.childPrice !== undefined) {
                            const childTotal = (expenseItem.childPrice || 0) * totalChild;
                            totalItemPrice += childTotal;
                        }
                        
                        if ((expenseItem.adultPrice === null || expenseItem.adultPrice === undefined) && 
                            (expenseItem.childPrice === null || expenseItem.childPrice === undefined)) {
                            const price = parseFloat(expenseItem.price) || 0;
                            const quantity = parseInt(expenseItem.quantity) || 1;
                            totalItemPrice = price * quantity;
                        }
                        
                        if (totalItemPrice > 0) total += totalItemPrice;
                    });
                }
            }
        });
        
        return total;
    };

    // Helper function untuk render unified item dengan editing capability
    const renderUnifiedItem = (item, itemIndex, dayIndex, currentDay) => {
        const totalItems = currentDay.items?.length || 0;
        const canMoveUp = itemIndex > 0;
        const canMoveDown = itemIndex < totalItems - 1;
        const isCurrentlyEditing = editingItem?.dayIndex === dayIndex && editingItem?.itemIndex === itemIndex;

        const renderItemContent = () => {
            // Show editing interface when in reordering mode OR when specifically editing this item
            if (isReordering || isCurrentlyEditing) {
                const itemTitle = item.item || item.label || 'Unnamed Item';
                const itemDescription = item.description || '';
                
                return (
                    <VStack align="stretch" spacing={2}>
                        <HStack>
                            <Text fontSize="sm" fontWeight="bold" minWidth="60px">Name:</Text>
                            <Input
                                value={isCurrentlyEditing ? editValues.title : itemTitle}
                                onChange={(e) => {
                                    if (isCurrentlyEditing) {
                                        setEditValues(prev => ({ ...prev, title: e.target.value }));
                                    } else {
                                        // Direct update in reordering mode
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
                                value={isCurrentlyEditing ? editValues.description : itemDescription}
                                onChange={(e) => {
                                    if (isCurrentlyEditing) {
                                        setEditValues(prev => ({ ...prev, description: e.target.value }));
                                    } else {
                                        // Direct update in reordering mode
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

            // Regular display mode
            const itemTitle = item.item || item.label || 'Unnamed Item';
            const itemDescription = item.description || '';

            return (
                <HStack align="flex-start" spacing={2}>
                    <Box flex={1}>
                        <Text>• {itemTitle}</Text>
                        {itemDescription && (
                            <Text fontSize="xs" color="gray.600" fontStyle="italic" ml={3}>
                                {itemDescription}
                            </Text>
                        )}
                    </Box>
                    <IconButton
                        icon={<EditIcon />}
                        size="xs"
                        variant="ghost"
                        onClick={() => startEditing(dayIndex, itemIndex, itemTitle, itemDescription)}
                        aria-label="Edit item"
                        _hover={{ bg: "gray.100" }}
                    />
                </HStack>
            );
        };

        if (item.type === 'activity') {
            return (
                <Tr key={`item-${dayIndex}-${itemIndex}`} _hover={{ background: !isCurrentlyEditing && !isReordering ? gray : undefined }}>
                    {isReordering && (
                        <Td style={tableCellStyle}>
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
                    <Td style={tableCellStyle}>
                        {renderItemContent()}
                    </Td>
                    <Td style={tableCellStyle}>
                        {item.expense && item.expense !== 'Rp 0' ? item.expense : '-'}
                    </Td>
                    <Td style={tableCellStyle}>
                        {item.kidExpense && item.kidExpense !== 'Rp 0' ? item.kidExpense : '-'}
                    </Td>
                </Tr>
            );
        } else if (item.type === 'expense') {
            // Calculate adult and child totals separately for display
            let adultDisplayTotal = 0;
            let childDisplayTotal = 0;
            
            if (item.adultPrice !== null && item.adultPrice !== undefined) {
                adultDisplayTotal = (item.adultPrice || 0) * totalAdult;
            }
            
            if (item.childPrice !== null && item.childPrice !== undefined) {
                childDisplayTotal = (item.childPrice || 0) * totalChild;
            }
            
            // Fallback jika tidak ada adultPrice/childPrice
            let fallbackTotal = 0;
            if ((item.adultPrice === null || item.adultPrice === undefined) && 
                (item.childPrice === null || item.childPrice === undefined)) {
                fallbackTotal = (item.price || 0) * (item.quantity || 1);
            }

            return (
                <Tr key={`item-${dayIndex}-${itemIndex}`} _hover={{ background: !isCurrentlyEditing && !isReordering ? gray : undefined }}>
                    {isReordering && (
                        <Td style={tableCellStyle}>
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
                    <Td style={tableCellStyle}>
                        {renderItemContent()}
                    </Td>
                    <Td style={tableCellStyle}>
                        {fallbackTotal > 0 
                            ? formatCurrency(fallbackTotal)
                            : adultDisplayTotal > 0 
                                ? formatCurrency(adultDisplayTotal) 
                                : '-'
                        }
                    </Td>
                    <Td style={tableCellStyle}>
                        {childDisplayTotal > 0 && totalChild > 0
                            ? formatCurrency(childDisplayTotal)
                            : '-'
                        }
                    </Td>
                </Tr>
            );
        }

        return null;
    };

    // Fallback functions untuk backward compatibility (jika tidak menggunakan unified items)
    const renderExpenseItem = (expenseItem, expIndex, dayIndex, currentDay) => {
        const { label, description, price, quantity, adultPrice, childPrice } = expenseItem;
        
        // Calculate adult and child totals separately for display
        let adultDisplayTotal = 0;
        let childDisplayTotal = 0;
        
        if (adultPrice !== null && adultPrice !== undefined) {
            adultDisplayTotal = (adultPrice || 0) * totalAdult;
        }
        
        if (childPrice !== null && childPrice !== undefined) {
            childDisplayTotal = (childPrice || 0) * totalChild;
        }
        
        // Fallback jika tidak ada adultPrice/childPrice
        let fallbackTotal = 0;
        if ((adultPrice === null || adultPrice === undefined) && 
            (childPrice === null || childPrice === undefined)) {
            fallbackTotal = (price || 0) * (quantity || 1);
        }

        const totalExpenseItems = currentDay.expenseItems?.length || 0;
        const canMoveUp = expIndex > 0;
        const canMoveDown = expIndex < totalExpenseItems - 1;

        return (
            <Tr key={`exp-${dayIndex}-${expIndex}`} _hover={{ background: gray }}>
                {isReordering && (
                    <Td style={tableCellStyle}>
                        <ReorderControls
                            onMoveUp={() => onMoveItemUp?.(dayIndex, expIndex, 'expenseItems')}
                            onMoveDown={() => onMoveItemDown?.(dayIndex, expIndex, 'expenseItems')}
                            canMoveUp={canMoveUp}
                            canMoveDown={canMoveDown}
                            isVisible={isReordering}
                        />
                    </Td>
                )}
                <Td></Td>
                <Td style={tableCellStyle}>
                    <Box>
                        <Text>• {label || 'Unnamed Item'}</Text>
                        {description && (
                            <Text fontSize="xs" color="gray.600" fontStyle="italic" ml={3}>
                                {description}
                            </Text>
                        )}
                    </Box>
                </Td>
                <Td style={tableCellStyle}>
                    {fallbackTotal > 0 
                        ? formatCurrency(fallbackTotal)
                        : adultDisplayTotal > 0 
                            ? formatCurrency(adultDisplayTotal) 
                            : '-'
                    }
                </Td>
                <Td style={tableCellStyle}>
                    {childDisplayTotal > 0 && totalChild > 0
                        ? formatCurrency(childDisplayTotal)
                        : '-'
                    }
                </Td>
            </Tr>
        );
    };

    const renderActivity = (activity, actIndex, dayIndex, currentDay) => {
        const totalActivities = currentDay.activities?.length || 0;
        const canMoveUp = actIndex > 0;
        const canMoveDown = actIndex < totalActivities - 1;

return (
        <Tr key={`act-${dayIndex}-${actIndex}`} _hover={{ background: gray }}>
            {isReordering && (
                <Td style={tableCellStyle}>
                    <ReorderControls
                        onMoveUp={() => onMoveItemUp?.(dayIndex, actIndex, 'activities')}
                        onMoveDown={() => onMoveItemDown?.(dayIndex, actIndex, 'activities')}
                        canMoveUp={canMoveUp}
                        canMoveDown={canMoveDown}
                        isVisible={isReordering}
                    />
                </Td>
            )}
            <Td></Td>
            <Td style={tableCellStyle}>
                <Box>
                    <Text>• {activity.item}</Text>
                    {/* Display description if available */}
                    {activity.description && (
                        <Text fontSize="xs" color="gray.600" fontStyle="italic" ml={3}>
                            {activity.description}
                        </Text>
                    )}
                </Box>
            </Td>
            <Td style={tableCellStyle}>
                {activity.expense && activity.expense !== 'Rp 0' ? activity.expense : '-'}
            </Td>
            <Td style={tableCellStyle}>
                {activity.kidExpense && activity.kidExpense !== 'Rp 0' ? activity.kidExpense : '-'}
            </Td>
        </Tr>
    );
    };

    return (
        <Box mb={8} borderRadius="md" overflow="hidden">
            <Table variant="simple" size="sm">
                <Thead>
                    <Tr>
                        {isReordering && <Th textAlign="center" width="80px" style={tableHeaderStyle}>Order</Th>}
                        <Th textAlign="center" width="60px" style={tableHeaderStyle}>Day</Th>
                        <Th style={tableHeaderStyle}>Quotation</Th>
                        <Th textAlign="center" width="100px" style={tableHeaderStyle}>Expenses</Th>
                        <Th textAlign="center" width="100px" style={tableHeaderStyle}>Kid 4-9</Th>
                    </Tr>
                </Thead>
                <Tbody color={"#222"}>
                    {days && days.map((day, dayIndex) => (
                        <React.Fragment key={`day-${dayIndex}`}>
                            {/* Day Header */}
                            <Tr>
                                {isReordering && (
                                    <Td style={tableSubHeaderStyle}>

                                    </Td>
                                )}
                                <Td textAlign="center" fontWeight="bold" style={tableSubHeaderStyle}>{day.day}</Td>
                                <Td fontWeight="bold" style={tableSubHeaderStyle}>
                                    <Box>
                                        <Text fontWeight="bold" fontSize="sm">{day.title}</Text>
                                        <Text fontSize="xs" color="gray.600">{day.description}</Text>
                                        <Text fontSize="xs" fontStyle="italic" color="gray.500">
                                            {formatDate(day.date)}
                                        </Text>
                                    </Box>
                                </Td>
                                <Td style={tableSubHeaderStyle}></Td>
                                <Td style={tableSubHeaderStyle}></Td>
                            </Tr>
                            
                            {/* Render Items - Use unified items if available, otherwise fallback to separate arrays */}
                            {day.items && day.items.length > 0 ? (
                                // Use unified items array
                                day.items.map((item, itemIndex) => 
                                    renderUnifiedItem(item, itemIndex, dayIndex, day)
                                )
                            ) : (
                                // Fallback to separate arrays for backward compatibility
                                <>
                                    {/* Render Activities with proper reordering */}
                                    {day.activities && day.activities.map((activity, actIndex) => 
                                        renderActivity(activity, actIndex, dayIndex, day)
                                    )}
                                    
                                    {/* Render Expense items with proper reordering */}
                                    {day.expenseItems && day.expenseItems.map((expenseItem, expIndex) => 
                                        renderExpenseItem(expenseItem, expIndex, dayIndex, day)
                                    )}
                                </>
                            )}
                        </React.Fragment>
                    ))}
                    
                    {/* Total Row */}
                    <Tr>
                        {isReordering && <Td style={tableTotalStyle}></Td>}
                        <Td colSpan={3} style={tableTotalStyle}>
                            Total Expenses
                        </Td>
                        <Td textAlign="right" style={tableTotalStyle}>
                            {formatCurrency(calculateTotalExpenses())}
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
        </Box>
    );
};

export default ItineraryTable;