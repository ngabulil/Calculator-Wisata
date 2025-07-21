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
} from "@chakra-ui/react";

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

const ItineraryTable = ({days = [], title = ""}) => {
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
            days.map((day, index) => (
              <React.Fragment key={index}>
                {/* Judul Hari */}
                <Tr>
                  <Td style={dayTitleStyle} border="1px solid #ddd">
                    <Text>DAY {day.day} - {day.description}</Text>
                    <Text fontSize="sm" fontWeight="normal">{formatDate(day.date)}</Text>
                  </Td>
                </Tr>

                {/* Daftar Aktivitas dari package */}
                {day.activities &&
                  day.activities.map((activity, i) => (
                    <Tr key={i}>
                      <Td style={itineraryTextStyle} border="1px solid #ddd">
                        • {activity}
                      </Td>
                    </Tr>
                  ))}

                {/* Daftar Expense Items dari ExpensesContext */}
                {day.expenseItems && day.expenseItems.length > 0 &&
                  day.expenseItems.map((expenseItem, i) => (
                    <Tr key={`expense-${i}`}>
                      <Td style={itineraryTextStyle} border="1px solid #ddd">
                        • {expenseItem.label}
                      </Td>
                    </Tr>
                  ))}
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