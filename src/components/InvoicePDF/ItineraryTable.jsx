import React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text
} from '@chakra-ui/react';

const orange = "#FFA726";
const orangeLight = "#FFE0B2";
const gray = "#F5F5F5";

const tableHeaderStyle = {
    backgroundColor: orange,
    color: "#222",
    fontWeight: "bold",
    fontSize: "1rem"
};

const tableSubHeaderStyle = {
    backgroundColor: orangeLight,
    fontWeight: "bold"
};

const tableTotalStyle = {
    backgroundColor: orange,
    fontWeight: "bold"
};

const ItineraryTable = ({ days, formatCurrency }) => {
    const calculateTotalExpenses = () => {
        let total = 0;
        days.forEach(day => {
            day.activities.forEach(activity => {
                if (activity.expense) {
                    const amount = parseFloat(
                        activity.expense.replace(/[^\d,-]/g, '')
                        .replace(/\./g, '')
                        .replace(',', '.')
                    );
                    if (!isNaN(amount)) {
                        total += amount;
                    }
                }
            });
        });
        return total;
    };

    return (
        <Box mb={8} borderRadius="md" overflow="hidden">
            <Table variant="simple" size="sm">
                <Thead>
                    <Tr>
                        <Th textAlign="center" width="60px" style={tableHeaderStyle}>Day</Th>
                        <Th style={tableHeaderStyle}>Quotation</Th>
                        <Th textAlign="center" width="100px" style={tableHeaderStyle}>Expenses</Th>
                        <Th textAlign="center" width="100px" style={tableHeaderStyle}>Kid 4-9</Th>
                    </Tr>
                </Thead>
                <Tbody color={"#222"}>
                    {days.map((day, dayIndex) => (
                        <React.Fragment key={dayIndex}>
                            <Tr>
                                <Td textAlign="center" fontWeight="bold" style={tableSubHeaderStyle}>{day.day}</Td>
                                <Td fontWeight="bold" style={tableSubHeaderStyle}>({day.description})</Td>
                                <Td style={tableSubHeaderStyle}></Td>
                                <Td style={tableSubHeaderStyle}></Td>
                            </Tr>
                            {day.activities.map((activity, actIndex) => (
                                <Tr key={actIndex} _hover={{ background: gray }}>
                                    <Td></Td>
                                    <Td pl={6}>• {activity.item}</Td>
                                    <Td textAlign="right">{activity.expense}</Td>
                                    <Td></Td>
                                </Tr>
                            ))}
                        </React.Fragment>
                    ))}
                <Tr>
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