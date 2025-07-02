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

const PackageCard = () => {
  return (
    <Box
      bg={"gray.700"}
      p={4}
      w={"20%"}
      flexGrow="1"
      rounded={12}
      display={"flex"}
    >
      <Flex direction={"column"} gap={4}>
        <AppTitleDescription
          title={"Paket Bali"}
          description={
            " Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s"
          }
          onEditButton={() => console.log("Edit Button Clicked")}
          onDeleteButton={() => console.log("Delete Button Clicked")}
        />
        <Tabs variant="line" colorScheme="blue" isFitted>
          <TabList>
            {Array.from({ length: 3 }).map((_, index) => {
              return (
                <Tab fontSize={"12px"} key={index}>
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

export default PackageCard;

const AppTitleDescription = (props) => {
  return (
    <Flex direction={"column"} gap={2}>
      <Flex
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Text fontSize={"24px"} fontWeight={"bold"}>
          {props.title || "Bali Paket"}
        </Text>
        <PopoverButton
          onEditButton={props.onEditButton}
          onDeleteButton={props.onDeleteButton}
        />
      </Flex>

      <Text fontSize={"10px"} noOfLines={3}>
        {props.description}
      </Text>
    </Flex>
  );
};

const AppAccomodation = (props) => {
  return (
    <Flex direction={"column"} gap={3}>
      <Text fontSize={"12px"} noOfLines={3} fontWeight={"semibold"}>
        Akomodasi
      </Text>
      <Flex direction={"column"} gap={2}>
        <Flex direction={"column"} w={"full"} gap={2}>
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
              icon="mingcute:hotel-fill"
              className="text-white text-[32px] rounded-full p-[8px] border-1 border-white"
            />
            <Flex direction={"column"} gap={0} w={"full"}>
              <Text fontSize={"12px"} fontWeight={"bold"}>
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
          {/*  */}
          <AppAdditionalCard title={"Breakfast"} count="1" />
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
      w={"full"}
      bg={"gray.800"}
      rounded={"12px"}
      p={"10px"}
    >
      <Icon
        icon="mynaui:gift"
        className="text-white text-[32px] rounded-full p-[8px] border-1 border-white"
      />
      <Flex direction={"column"} gap={0} w={"full"}>
        <Text fontSize={"12px"} fontWeight={"bold"}>
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
    <Flex direction={"column"} gap={3}>
      <Text fontSize={"12px"} noOfLines={3} fontWeight={"semibold"}>
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
          <Text fontSize={"12px"} fontWeight={"bold"}>
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
      <Text fontSize={"12px"} noOfLines={3} fontWeight={"semibold"}>
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
              <Text fontSize={"12px"} fontWeight={"semibold"}>
                Tour Bali 3 Hari
              </Text>
              <Text fontSize={"10px"}>Paket 3</Text>
            </Flex>
            {Array.from({ length: 3 }).map((_, index) => {
              return (
                <Box bg={"gray.700"} p={2} rounded={10}>
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
