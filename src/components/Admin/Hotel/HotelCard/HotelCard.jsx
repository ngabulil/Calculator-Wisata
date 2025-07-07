import { Flex, Text, Box, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { PopoverButton } from "../../../PopoverButton";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import formatRupiah from "../../../../utils/rupiahFormat";

const HotelCard = (props) => {
  const navigate = useNavigate();

  return (
    <Flex
      direction="column"
      gap={3}
      w={"25%"}
      flexGrow={props.flexGrow || "1"}
      bg="gray.800"
      rounded="12px"
    >
      <Flex direction="column" h={"full"} gap={2}>
        <Box w={"full"} h={"full"} position={"relative"}>
          <img
            src={props.photoLink}
            alt="hotel-photos"
            className="object-cover w-full h-[200px] rounded-t-[8px] relative "
          />
          <Flex
            direction="row"
            alignItems="center"
            w="full"
            justifyContent="flex-end"
            position={"absolute"}
            top={1}
            right={1}
          >
            <PopoverButton
              onEditButton={() => {
                navigate(`/admin/packages/hotel/edit`);
                props.onEditButton();
              }}
              onDeleteButton={() => {
                props.onDeleteButton();
              }}
            />
          </Flex>
        </Box>
        <HotelInfoCard
          name={props.name}
          stars={props.stars}
          roomType={props.roomType}
          contractUntil={props.contractUntil}
          extraBed={props.extraBed}
          seasons={props.seasons}
        />
      </Flex>
    </Flex>
  );
};

const HotelInfoCard = (props) => {
  const [seasonPrice, setSeasonPrice] = useState(0);
  const totalSeasons = Object.fromEntries(
    Object.entries(props.seasons).map(([season, rooms]) => {
      const totalPrice = rooms.reduce((sum, room) => sum + room.price, 0);
      return [season, totalPrice];
    })
  );

  let countExtrabed = 0;

  for (let i = 0; i < props.extraBed.length; i++) {
    countExtrabed += props.extraBed[i].price;
  }

  useEffect(() => {
    setSeasonPrice(totalSeasons.normal);
  }, []);

  return (
    <Flex
      direction="column"
      gap={3}
      p={"14px"}
      alignItems="start"
      w="full"
      h={"full"}
      shadow={"xl"}
      justifyContent={"space-between"}
    >
      <Flex direction={"column"} w={"full"} gap={1}>
        {props.extraBed.length > 0 && (
          <Text
            bg={"gray.600"}
            py={1}
            px={3}
            rounded={"full"}
            w={"max"}
            fontSize="10px"
          >
            {props.extraBed.length} Extra Bed
          </Text>
        )}

        <Flex
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          w={"full"}
          fontSize={"20px"}
          fontWeight="bold"
        >
          <Text>{props.name} </Text>
          <Flex>
            {Array.from({ length: parseInt(props.stars) }, (_, i) => {
              return (
                <Icon
                  key={i}
                  icon="mdi:star"
                  color="orange"
                  className="text-[14px]"
                />
              );
            })}
          </Flex>
        </Flex>
        {props.roomType.length > 0 && (
          <Flex gap={2}>
            {props.roomType.map((room, index) => {
              return (
                <Text key={index} fontSize="12px" rounded={"4px"}>
                  {room.label}
                </Text>
              );
            })}
          </Flex>
        )}
      </Flex>

      <Flex
        w="full"
        direction="column"
        gap={1}
        fontSize="10px"
        color="gray.300"
      >
        {/* <Flex direction={"column"} alignItems="stretch" gap={2} w={"full"}>
          {Object.entries(props.seasons).map(([season, rooms]) => (
            <Box key={season} mb={4}>
              <Text
                fontSize={"10px"}
                fontWeight="bold"
                textTransform="capitalize"
                mb={1}
              >
                {season}
              </Text>

              {rooms.map((room, index) => (
                <Flex
                  key={index}
                  p="8px"
                  bg="gray.700"
                  rounded="10px"
                  direction="row"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Text fontSize="9px" color="gray.200">
                    Room ID: {room.idRoom}
                  </Text>
                  <Text fontSize="9px" color="gray.300">
                    Rp {room.price.toLocaleString("id-ID")}
                  </Text>
                </Flex>
              ))}
            </Box>
          ))}
        </Flex> */}
        <Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}>
          <SeasonSelect
            seasons={totalSeasons}
            onChange={(price) => setSeasonPrice(price)}
          />
          <Text fontSize={18} fontWeight={"bold"}>
            {formatRupiah(
              seasonPrice + (props.extraBed.length > 0 && countExtrabed)
            )}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

const SeasonSelect = (props) => {
  const [select, setSelect] = useState(0);

  return (
    <div className="flex items-center text-white text-[12px] gap-[6px] flex-shrink">
      {Object.entries(props.seasons).map(([season, price], index) => {
        return (
          <p
            style={{
              background: index == select ? "white" : "black",
              color: index == select ? "black" : "white",
              fontWeight: "bold",
            }}
            className="w-[25px] h-[25px] flex text-[10px] items-center justify-center bg-black rounded-full leading-none cursor-pointer"
            onClick={() => {
              setSelect(index);
              props.onChange(price);
            }}
          >
            {season.charAt(0).toUpperCase()}
          </p>
        );
      })}
    </div>
  );
};

export default HotelCard;
