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
    fontSize: "1rem",
    padding: "2px 20px 12px 10px",
};

const tableSubHeaderStyle = {
    backgroundColor: orangeLight,
    fontWeight: "bold",
    padding: "2px 20px 12px 10px",
};

const tableCellStyle = {
    padding: "2px 30px 12px 10px",
    verticalAlign: "top",
}

const ItineraryTable = ({ days }) => {
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

    return (
        <Box mb={8} borderRadius="md" overflow="hidden">
            <Table variant="simple" size="sm">
                <Thead>
                    <Tr>
                        <Th textAlign="center" width="60px" style={tableHeaderStyle}>Day</Th>
                        <Th style={tableHeaderStyle}>Quotation</Th>
                    </Tr>
                </Thead>
                <Tbody color={"#222"}>
                    {days.map((day, dayIndex) => (
                        <React.Fragment key={dayIndex}>
                            <Tr>
                                <Td textAlign="center" fontWeight="bold" style={tableSubHeaderStyle}>{day.day}</Td>
                                <Td fontWeight="bold" style={tableSubHeaderStyle}>
                                    <Box>
                                        <Text>{day.description}</Text>
                                        <Text fontSize="sm" color="#555" mt={1}>
                                            {formatDate(day.date)}
                                        </Text>
                                    </Box>
                                </Td>
                            </Tr>
                            {day.activities.map((activity, actIndex) => (
                                <Tr key={actIndex} _hover={{ background: gray }}>
                                    <Td></Td>
                                    <Td style={tableCellStyle}>• {activity.item}</Td>
                                </Tr>
                            ))}
                            {/* Display expense items if they exist */}
                            {day.expenseItems && day.expenseItems.map((expenseItem, expIndex) => (
                                <Tr key={`exp-${expIndex}`} _hover={{ background: gray }}>
                                    <Td></Td>
                                    <Td style={tableCellStyle}>• {expenseItem.label}</Td>
                                </Tr>
                            ))}
                        </React.Fragment>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default ItineraryTable;