import {
  Box,
  Text,
  Flex,
  Button,
  Container,
  Textarea,
  Input,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useState } from "react";
import HotelCard from "../../components/Admin/Hotel/HotelCard/HotelCard";
import HotelForm from "../../components/Admin/Hotel/HotelForm/HotelForm";
import hotels from "../../data/hotels.json";

const AdminHotelPage = () => {
  const [formActive, setFormActive] = useState(false);

  return (
    <Container maxW="container.xl" p={0} borderRadius="lg">
      <Flex direction={"column"} gap="12px">
        <Flex direction={"row"} justifyContent={"flex-end"} w="full" gap={2}>
          <Button bg={"blue.500"} onClick={() => setFormActive(!formActive)}>
            <AddIcon pr={"5px"} /> {formActive ? "Back" : "Create"}
          </Button>
        </Flex>
        {formActive ? (
          <HotelForm />
        ) : (
          <Flex direction={"row"} gap={"25px"} wrap={"wrap"}>
            {hotels.map((hotel, index) => (
              <HotelCard
                key={index}
                photoLink={`https://picsum.photos/id/2${index}/200/300`}
                name={hotel.hotelName}
                stars={hotel.stars}
                seasons={hotel.seasons}
                roomType={hotel.roomType}
                contractUntil={hotel.contractUntil}
              />
            ))}
          </Flex>
        )}
      </Flex>
    </Container>
  );
};

export default AdminHotelPage;
