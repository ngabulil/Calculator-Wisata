import { Flex, Text, Box, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { PopoverButton } from "../../../PopoverButton";
import { useNavigate } from "react-router-dom";

const HotelCard = (props) => {
  const navigate = useNavigate();
  return (
    <Flex
      direction="column"
      gap={3}
      w="20%"
      flexGrow="1"
      bg="gray.800"
      p="15px"
      rounded="12px"
    >
      <Flex
        direction="row"
        alignItems="center"
        w="full"
        justifyContent="space-between"
      >
        <Text fontSize="18px" noOfLines={3} fontWeight="semibold">
          Hotel
        </Text>
        <PopoverButton
          onEditButton={() => {
            navigate(`/admin/packages/hotel/edit`);
            props.onEditButton();
          }}
          onDeleteButton={() => {}}
        />
      </Flex>

      <Flex direction="column" gap={2}>
        <Box>
          <img
            src={props.photoLink}
            alt="hotel-photos"
            className="object-cover w-full h-[200px] rounded-[8px] "
          />
        </Box>
        <HotelInfoCard
          name={props.name}
          stars={props.stars}
          roomType={props.roomType}
          contractUntil={props.contractUntil}
          extraBed={props.extrabed}
          seasons={props.seasons}
        />
      </Flex>
    </Flex>
  );
};

const HotelInfoCard = (props) => {
  return (
    <Flex
      direction="column"
      gap={2}
      alignItems="start"
      w="full"
      bg="gray.900"
      rounded="12px"
      p="10px"
    >
      <Flex alignItems={"center"} gap={2} w={"full"}>
        <Icon
          icon="mdi:hotel"
          className="text-white text-[38px] rounded-full p-[8px] border-1 border-white"
        />
        <Flex direction={"column"} w={"full"}>
          <Text fontSize="12px" fontWeight="bold">
            {props.name}
          </Text>
          <Flex
            direction={"row"}
            justifyContent={"space-between"}
            w={"full"}
            fontSize={"10px"}
          >
            <Text> {props.roomType} </Text>
            <Flex>
              {Array.from({ length: parseInt(props.stars) }, (_, i) => {
                return (
                  <Icon
                    key={i}
                    icon="mdi:star"
                    className="text-yellow-400 text-[14px]"
                  />
                );
              })}
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Flex
        w="full"
        direction="column"
        gap={1}
        fontSize="10px"
        color="gray.300"
      ></Flex>
      <Text fontSize="10px">
        Extra Bed: {props.extraBed ? "Available" : "Not Available"}
      </Text>
      <Text fontSize="10px">Contract Until: {props.contractUntil}</Text>
      <Flex direction={"column"} alignItems="stretch" gap={2} w={"full"}>
        {Object.entries(props.seasons).map(([season, price]) => (
          <Flex
            key={season}
            p={"10px"}
            bg="gray.700"
            rounded="10px"
            direction={"row"}
            justifyContent={"space-between"}
            w={"full"}
          >
            <Text
              fontSize={"10px"}
              fontWeight="bold"
              textTransform="capitalize"
            >
              {season}
            </Text>
            <Text fontSize={"9px"} color="gray.300">
              Rp {price}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default HotelCard;
