import {
  Box,
  Flex,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  Text,
  TabPanel,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { PopoverButton } from "../../../PopoverButton";

const PackageRead = () => {
  return (
    <Box
      bg={"gray.700"}
      p={4}
      w={"full"}
      flexGrow="1"
      rounded={12}
      display={"flex"}
    >
      <Flex direction={"column"} gap={4} w={"full"}>
        <AppTitleDescription
          title={"Paket Bali Read"}
          description={
            " Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s"
          }
          onEditButton={() => console.log("Edit Button Clicked")}
          onDeleteButton={() => console.log("Delete Button Clicked")}
        />
        <Tabs variant="line" colorScheme="blue" isFitted>
          <TabList>
            {Array.from({ length: 3 }).map((_, index) => {
              return (
                <Tab fontSize={"14px"} key={index}>
                  Day {index + 1}
                </Tab>
              );
            })}
          </TabList>

          <TabPanels>
            <TabPanel py={4} px={0}>
              <Flex direction={"column"} gap={2}>
                {/* Accomodation */}
                <AppAccomodation
                  hotelName={"Hotel Bali"}
                  bedRoom={"2 Kamar Tidur"}
                />
                {/* transport */}
                <AppTransport />
                {/* tour packages */}
                <AppTourPackages />
                {/*  */}
              </Flex>
            </TabPanel>
            <TabPanel py={4} px={0}>
              <p>Isi Gallery</p>
            </TabPanel>
            <TabPanel py={4} px={0}>
              <p>Isi Review</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
};

export default PackageRead;

const AppTitleDescription = (props) => {
  return (
    <Flex direction={"column"} gap={2}>
      <Flex direction={"row"} gap={5}>
        <img
          alt="photo-detail"
          src="https://picsum.photos/200/300"
          className="w-[30%] h-[300px] rounded-[12px] object-center"
        />
        <Flex direction={"column"} gap={"15px"} w={"60%"} flexShrink={"1"}>
          <Text fontSize={"32px"} fontWeight={"bold"}>
            {props.title || "Bali Paket"}
          </Text>
          <Text fontSize={"14px"}>{props.description}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

const AppAccomodation = (props) => {
  return (
    <Flex direction={"column"} gap={3}>
      <Text fontSize={"16px"} noOfLines={3} fontWeight={"semibold"}>
        Akomodasi
      </Text>
      <Flex direction={"column"} gap={2}>
        <Flex w={"full"} flex={"wrap"} gap={2}>
          <AppHotelCard hotelName={props.hotelName} bedRoom={props.bedRoom} />
          {/*  */}
          <AppAdditionalCard title={"Breakfast"} count="1" />
        </Flex>
      </Flex>
    </Flex>
  );
};

const AppHotelCard = (props) => {
  return (
    <Flex
      direction={"row"}
      gap={2}
      alignItems={"center"}
      w={"30%"}
      bg={"gray.800"}
      rounded={"12px"}
      p={"10px"}
    >
      <Icon
        icon="mingcute:hotel-fill"
        className="text-white text-[32px] rounded-full p-[8px] border-1 border-white"
      />
      <Flex direction={"column"} gap={0} w={"full"}>
        <Text fontSize={"16px"} fontWeight={"bold"}>
          {props.hotelName}
        </Text>
        <Flex
          direction={"row"}
          w={"full"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text fontSize={"10px"}>{props.bedRoom}</Text>
          <Flex direction={"row"} alignItems={"center"} gap={1}>
            {Array.from({ length: 3 }).map((_, index) => {
              return (
                <Icon
                  key={index}
                  icon="mdi:star"
                  className="text-yellow-400 text-[12px]"
                />
              );
            })}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const AppAdditionalCard = (props) => {
  return (
    <Flex
      direction={"row"}
      gap={2}
      alignItems={"center"}
      w={"30%"}
      bg={"gray.800"}
      rounded={"12px"}
      p={"10px"}
    >
      <Icon
        icon="mynaui:gift"
        className="text-white text-[32px] rounded-full p-[8px] border-1 border-white"
      />
      <Flex direction={"column"} gap={0} w={"full"}>
        <Text fontSize={"16px"} fontWeight={"bold"}>
          {props.title}
        </Text>
        <Flex
          direction={"row"}
          w={"full"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text fontSize={"10px"}>Jumlah</Text>
          <Text fontSize={"10px"}>{props.count}</Text>
        </Flex>
      </Flex>
      {/*  */}
    </Flex>
  );
};

const AppTransport = () => {
  return (
    <Flex direction={"column"} gap={3} w={"30%"}>
      <Text fontSize={"16px"} noOfLines={3} fontWeight={"semibold"}>
        Transports
      </Text>
      <Flex
        direction={"row"}
        gap={2}
        alignItems={"center"}
        w={"full"}
        bg={"gray.800"}
        rounded={"12px"}
        p={"10px"}
      >
        <Icon
          icon="mingcute:car-fill"
          className="text-white text-[32px] rounded-full p-[8px] border-1 border-white"
        />
        <Flex direction={"column"} gap={0} w={"full"}>
          <Text fontSize={"16px"} fontWeight={"bold"}>
            Mobil Avanza
          </Text>
          <Flex
            direction={"row"}
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"10px"}>Jumlah</Text>
            <Text fontSize={"10px"}>2</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const AppTourPackages = () => {
  return (
    <Flex direction={"column"} gap={3}>
      <Text fontSize={"16px"} noOfLines={3} fontWeight={"semibold"}>
        Tour Packages
      </Text>
      <Flex direction={"column"} gap={2}>
        <Flex direction={"column"} w={"full"} gap={2}>
          <Flex
            direction={"column"}
            gap={2}
            alignItems={"center"}
            w={"full"}
            bg={"gray.800"}
            rounded={"12px"}
            p={"15px"}
          >
            <Flex
              direction={"flex"}
              alignItems={"center"}
              w={"full"}
              justifyContent={"space-between"}
            >
              <Text fontSize={"14px"} fontWeight={"semibold"}>
                Tour Bali 3 Hari
              </Text>
              <Text fontSize={"14px"}>Paket 3</Text>
            </Flex>
            <Flex gap={2}>
              {Array.from({ length: 3 }).map((_, index) => {
                return (
                  <Box
                    bg={"gray.700"}
                    p={2}
                    rounded={10}
                    w={"full"}
                    display={"flex"}
                  >
                    <Text fontSize={"12px"}>
                      {index + 1}. Lorem Ipsum is simply dummy text of the
                      printing and typesetting industry. Lorem Ipsum has been
                      the industry's standard dummy text ever since the 1500s,
                      when an unknown printer took a galley of type and
                      scrambled it
                    </Text>
                  </Box>
                );
              })}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
