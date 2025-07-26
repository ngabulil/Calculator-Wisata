import React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    HStack
} from '@chakra-ui/react';
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
    onMoveDayUp,
    onMoveDayDown
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

    const calculateTotalExpenses = () => {
        let total = 0;
        
        days.forEach(day => {
            // Total dari aktivitas utama
            day.activities.forEach(activity => {
                // Parse expense amount
                if (activity.expense && activity.expense !== '-' && activity.expense !== 'Rp 0') {
                    const expenseStr = activity.expense.toString();
                    const amount = parseFloat(
                        expenseStr.replace(/[^\d,-]/g, '')
                        .replace(/\./g, '')
                        .replace(',', '.')
                    );
                    if (!isNaN(amount) && amount > 0) total += amount;
                }
                
                // Parse kid expense amount
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
            
            // Total dari expense items - Updated calculation
            if (day.expenseItems && Array.isArray(day.expenseItems)) {
                day.expenseItems.forEach(expenseItem => {
                    // Handle both old and new structure
                    let totalItemPrice = 0;
                    
                    if (expenseItem.adultPrice !== null || expenseItem.childPrice !== null) {
                        // New structure with adult/child pricing
                        const adultTotal = (expenseItem.adultPrice || 0) * (expenseItem.adultQuantity || 1);
                        const childTotal = (expenseItem.childPrice || 0) * (expenseItem.childQuantity || 1);
                        totalItemPrice = adultTotal + childTotal;
                    } else {
                        // Old structure with single price
                        const price = parseFloat(expenseItem.price) || 0;
                        const quantity = parseInt(expenseItem.quantity) || 1;
                        totalItemPrice = price * quantity;
                    }
                    
                    if (totalItemPrice > 0) total += totalItemPrice;
                });
            }
        });
        
        return total;
    };

    // Helper function untuk render expense item dengan format yang konsisten
    const renderExpenseItem = (expenseItem, expIndex, dayIndex, currentDay) => {
        const { label, description, price, quantity, adultPrice, childPrice } = expenseItem;
        
        // Calculate total for display
        let displayTotal = 0;
        if (adultPrice !== null || childPrice !== null) {
            const adultTotal = (adultPrice || 0) * (expenseItem.adultQuantity || 1);
            const childTotal = (childPrice || 0) * (expenseItem.childQuantity || 1);
            displayTotal = adultTotal + childTotal;
        } else {
            displayTotal = (price || 0) * (quantity || 1);
        }

        // FIX: Expense items memiliki reordering sendiri, tidak perlu offset
        const totalExpenseItems = currentDay.expenseItems?.length || 0;

        return (
            <Tr key={`exp-${dayIndex}-${expIndex}`} _hover={{ background: gray }}>
                {isReordering && (
                    <Td style={tableCellStyle}>
                        <ReorderControls
                            onMoveUp={() => onMoveItemUp?.(dayIndex, expIndex, 'expenseItems')}
                            onMoveDown={() => onMoveItemDown?.(dayIndex, expIndex, 'expenseItems')}
                            canMoveUp={expIndex > 0}
                            canMoveDown={expIndex < totalExpenseItems - 1}
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
                    {formatCurrency(displayTotal)}
                </Td>
                <Td style={tableCellStyle}>-</Td>
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
                        <React.Fragment key={dayIndex}>
                            <Tr>
                                {isReordering && (
                                    <Td style={tableSubHeaderStyle}>
                                        <ReorderControls
                                            onMoveUp={() => onMoveDayUp?.(dayIndex)}
                                            onMoveDown={() => onMoveDayDown?.(dayIndex)}
                                            canMoveUp={dayIndex > 0}
                                            canMoveDown={dayIndex < days.length - 1}
                                            isVisible={isReordering}
                                        />
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
                            
                            {/* Activities */}
                            {day.activities && day.activities.map((activity, actIndex) => {
                                return (
                                    <Tr key={`act-${dayIndex}-${actIndex}`} _hover={{ background: gray }}>
                                        {isReordering && (
                                            <Td style={tableCellStyle}>
                                                <ReorderControls
                                                    onMoveUp={() => onMoveItemUp?.(dayIndex, actIndex, 'activities')}
                                                    onMoveDown={() => onMoveItemDown?.(dayIndex, actIndex, 'activities')}
                                                    canMoveUp={actIndex > 0}
                                                    canMoveDown={actIndex < day.activities.length - 1}
                                                    isVisible={isReordering}
                                                />
                                            </Td>
                                        )}
                                        <Td></Td>
                                        <Td style={tableCellStyle}>• {activity.item}</Td>
                                        <Td style={tableCellStyle}>
                                            {activity.expense && activity.expense !== 'Rp 0' ? activity.expense : '-'}
                                        </Td>
                                        <Td style={tableCellStyle}>
                                            {activity.kidExpense && activity.kidExpense !== 'Rp 0' ? activity.kidExpense : '-'}
                                        </Td>
                                    </Tr>
                                );
                            })}
                            
                            {/* Expense items - FIXED untuk reordering yang benar */}
                            {day.expenseItems && day.expenseItems.map((expenseItem, expIndex) => 
                                renderExpenseItem(expenseItem, expIndex, dayIndex, day)
                            )}
                        </React.Fragment>
                    ))}
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