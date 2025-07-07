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

const orange = "#FFA726";
const orangeLight = "#FFE0B2";

const tableHeaderStyle = {
  backgroundColor: orange,
  color: "#222",
  fontWeight: "bold",
  fontSize: "1rem",
};

const tableSubHeaderStyle = {
  backgroundColor: orangeLight,
  fontWeight: "bold",
};

const ItineraryTable = ({ days = [] }) => {
  return (
    <Box
    >
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th textAlign="center" width="50px" style={tableHeaderStyle} py={4}>
              Day
            </Th>
            <Th style={tableHeaderStyle} py={4}>Itinerary</Th>
          </Tr>
        </Thead>
        <Tbody color={"#222"}>
          {days.length > 0 ? (
            days.map((day, dayIndex) => (
              <React.Fragment key={dayIndex}>
                <Tr>
                  <Td
                    textAlign="center"
                    fontWeight="bold"
                    style={tableSubHeaderStyle}
                    py={4}
                  >
                    {day.day}
                  </Td>
                  <Td fontWeight="bold" colSpan={1} style={tableSubHeaderStyle} py={4}>
                    {day.title} - {day.description}
                  </Td>
                </Tr>
                {/* Daftar aktivitas tanpa harga */}
                {day.activities && day.activities.length > 0 && 
                  day.activities.map((activity, actIndex) => (
                    <Tr key={actIndex}>
                      <Td py={3}></Td>
                      <Td py={3}>• {activity}</Td>
                    </Tr>
                  ))
                }

              </React.Fragment>
            ))
          ) : (
            <Tr>
              <Td colSpan={2} textAlign="center" py={4}>
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