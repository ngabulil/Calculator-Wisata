import { Flex, Text, Box } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { PopoverButton } from "../../../PopoverButton";

const TourPackagesCard = () => {
  return (
    <Flex
      direction={"column"}
      gap={3}
      w={"20%"}
      flexGrow="1"
      bg={"gray.800"}
      p={"15px"}
      rounded={"12px"}
    >
      <Flex
        direction={"row"}
        alignItems={"center"}
        w={"full"}
        justifyContent={"space-between"}
      >
        <Text fontSize={"18px"} noOfLines={3} fontWeight={"semibold"}>
          Tour Packages
        </Text>
        <PopoverButton onEditButton={() => {}} onDeleteButton={() => {}} />
      </Flex>
      <Flex direction={"column"} gap={2}>
        <Flex direction={"column"} w={"full"} gap={2}>
          <Flex
            direction={"column"}
            gap={2}
            alignItems={"center"}
            w={"full"}
            bg={"gray.800"}
          >
            {/* title description */}
            <Flex
              direction={"flex"}
              alignItems={"center"}
              w={"full"}
              justifyContent={"space-between"}
            >
              <Text fontSize={"12px"} fontWeight={"semibold"}>
                Tour Bali 3 Hari
              </Text>
              <Text fontSize={"10px"}>Paket 3</Text>
            </Flex>
            {/* restaurant Card */}
            <AppRestaurantCard title="Restoran Bali" subtitle="Buffet Lunch" />
            {/* traveler Card */}
            <AppTravelerCard title="Traveler" subtitle="2 Adults, 1 Child" />
            {/* day description */}
            {Array.from({ length: 3 }).map((_, index) => {
              return (
                <Box bg={"gray.900"} p={2} rounded={10}>
                  <Text fontSize={"10px"}>
                    {index + 1}. Lorem Ipsum is simply dummy text of the
                    printing and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an
                    unknown printer took a galley of type and scrambled it
                  </Text>
                </Box>
              );
            })}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const AppRestaurantCard = (props) => {
  return (
    <Flex
      direction={"row"}
      gap={2}
      alignItems={"center"}
      w={"full"}
      bg={"gray.900"}
      rounded={"12px"}
      p={"10px"}
    >
      <Icon
        icon="famicons:restaurant-sharp"
        className="text-white text-[38px] rounded-full p-[8px] border-1 border-white"
      />
      <Flex direction={"column"} gap={0} w={"full"}>
        <Text fontSize={"12px"} fontWeight={"bold"}>
          {props.title}
        </Text>
        <Flex
          w={"full"}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text fontSize={"10px"}>{props.subtitle}</Text>
          <Flex gap={1} alignItems={"center"}>
            <Icon icon="mdi:people" className="text-white text-[14px]" />
            <Text fontSize={"12px"}>2</Text>
          </Flex>
        </Flex>
      </Flex>
      {/*  */}
    </Flex>
  );
};

const AppTravelerCard = (props) => {
  return (
    <Flex
      direction={"row"}
      gap={2}
      alignItems={"center"}
      w={"full"}
      bg={"gray.900"}
      rounded={"12px"}
      p={"10px"}
    >
      <Icon
        icon="fluent:people-queue-32-filled"
        className="text-white text-[38px] rounded-full p-[8px] border-1 border-white"
      />
      <Flex direction={"column"} gap={0} w={"full"}>
        <Text fontSize={"12px"} fontWeight={"bold"}>
          {props.title}
        </Text>
        <Flex
          w={"full"}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text fontSize={"10px"}>{props.subtitle}</Text>
        </Flex>
      </Flex>
      {/*  */}
    </Flex>
  );
};

export default TourPackagesCard;
