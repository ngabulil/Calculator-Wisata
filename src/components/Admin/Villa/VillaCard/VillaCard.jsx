import { Flex, Text, Box, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { PopoverButton } from "../../../PopoverButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import formatRupiah from "../../../../utils/rupiahFormat";

const VillaCard = (props) => {
  const navigate = useNavigate();

  return (
    <Flex
      direction="column"
      gap={3}
      w="20%"
      flexGrow="1"
      bg="gray.800"
      rounded="12px"
    >
      <Flex direction="column" h={"full"} gap={2}>
        <Box w={"full"} h={"full"} position={"relative"}>
          <img
            src={props.photoLink}
            alt="Villa-photos"
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
                navigate(`/admin/packages/Villa/edit`);
                props.onEditButton();
              }}
              onDeleteButton={() => {}}
            />
          </Flex>
        </Box>
        <VillaInfoCard
          name={props.name}
          stars={props.stars}
          roomType={props.roomType}
          contractUntil={props.contractUntil}
          honeymoonPackage={props.honeymoonPackage}
          extraBed={props.extraBed}
          seasons={props.seasons}
        />
      </Flex>
    </Flex>
  );
};

const VillaInfoCard = (props) => {
  const [seasonPrice, setSeasonPrice] = useState(props.seasons.normal);
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
        <Flex gap={2}>
          {props.extraBed && (
            <Text
              bg={"gray.600"}
              py={1}
              px={3}
              rounded={"full"}
              w={"max"}
              fontSize="10px"
            >
              Extra Bed
            </Text>
          )}
          {props.honeymoonPackage && (
            <Text
              bg={"gray.600"}
              py={1}
              px={3}
              rounded={"full"}
              w={"max"}
              fontSize="10px"
            >
              Honey Moon
            </Text>
          )}
        </Flex>

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
        <Text fontSize="12px">{props.roomType}</Text>
      </Flex>

      <Flex
        w="full"
        direction="column"
        gap={1}
        fontSize="10px"
        color="gray.300"
      >
        {props.contractUntil && (
          <Text alignSelf={"end"} fontSize="10px">
            {props.contractUntil}
          </Text>
        )}
        {/* <Flex direction={"column"} alignItems="stretch" gap={2} w={"full"}>
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
      </Flex> */}
        <Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}>
          <SeasonSelect
            seasons={props.seasons}
            onChange={(price) => setSeasonPrice(price)}
          />
          <Text fontSize={18} fontWeight={"bold"}>
            {formatRupiah(
              seasonPrice + (props.extraBed && parseInt(props.extraBed))
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

export default VillaCard;
