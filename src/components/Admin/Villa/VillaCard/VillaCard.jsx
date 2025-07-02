import { Flex, Text, Box, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { PopoverButton } from "../../../PopoverButton";

const VillaCard = (props) => {
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
          Villa
        </Text>
        <PopoverButton onEditButton={() => {}} onDeleteButton={() => {}} />
      </Flex>

      <Flex direction="column" gap={2}>
        <Box>
          <img
            src={props.photoLink}
            alt="hotel-photos"
            className="object-cover w-full h-[200px] rounded-[8px] "
          />
        </Box>
        <VillaInfoCard
          name={props.name}
          stars={props.stars}
          roomType={props.roomType}
          contractUntil={props.contractUntil}
          extraBed={props.extrabed}
          honeymoonPackage={props.honeymoonPackage}
          seasons={props.seasons}
        />
      </Flex>
    </Flex>
  );
};

const VillaInfoCard = (props) => {
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
      <Flex alignItems={"start"} gap={2} w={"full"}>
        <Flex direction={"column"} w={"full"} gap={1}>
          <Flex
            direction={"row"}
            justifyContent={"space-between"}
            w={"full"}
            fontSize={"10px"}
          >
            <Text w={"50%"} fontSize="12px" fontWeight="bold">
              {props.name}
            </Text>
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
          <Text fontSize={"10px"}>{props.roomType}</Text>
        </Flex>
      </Flex>

      <Flex
        w="full"
        direction="column"
        gap={1}
        fontSize="10px"
        p={"10px"}
        rounded={"12px"}
        bg="gray.800"
      >
        <Text fontSize="10px">
          Extra Bed: {props.extraBed ? "Available" : "Not Available"}
        </Text>
        <Text fontSize="10px">Contract Until: {props.contractUntil}</Text>
        <Text fontSize="10px">Honeymoon Package: {props.honeymoonPackage}</Text>
      </Flex>

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

export default VillaCard;
