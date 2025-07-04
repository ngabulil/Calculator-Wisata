import {
  Flex,
  Text,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { PopoverButton } from "../../../PopoverButton";

const AccomodationCard = () => {
  return (
    <Flex
      direction={"column"}
      gap={3}
      bg={"gray.800"}
      p={"12px"}
      rounded={12}
      w={"20%"}
      flexGrow={"1"}
      shadow={"xl"}
    >
      <Flex
        direction={"row"}
        alignItems={"center"}
        w={"full"}
        justifyContent={"space-between"}
      >
        <Text fontSize={"18px"} noOfLines={3} fontWeight={"semibold"}>
          Akomodasi
        </Text>
        <PopoverButton onEditButton={() => {}} onDeleteButton={() => {}} />
      </Flex>
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
              <Flex direction={"column"} w={"full"} gap={3}>
                <AppTitleDescription
                  title={"Hari Pertama"}
                  description={
                    "Doloribus magnam ad voluptatum harum consequuntur facilis eligendi qui. Harum explicabo assumenda iure eum et soluta. Id dolorem dignissimos consequatur enim laboriosam libero minima ipsum. Ut enim excepturi et sit sit quis. Tempora quo beatae. Ut dolorum ut sapiente officia voluptates."
                  }
                />
                <AppHotelCard />
                {/*  */}
                <AppAdditionalCard title={"Breakfast"} count="1" />
              </Flex>
            </Flex>
          </TabPanel>
          <TabPanel py={4} px={0}>
            <Flex direction={"column"} gap={2}>
              <Flex direction={"column"} w={"full"} gap={3}>
                <AppHotelCard />
              </Flex>
            </Flex>
          </TabPanel>
          <TabPanel py={4} px={0}>
            <Flex direction={"column"} gap={2}>
              <Flex direction={"column"} w={"full"} gap={3}>
                <AppAdditionalCard title={"Breakfast"} count="1" />
              </Flex>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

const AppTitleDescription = (props) => {
  return (
    <Flex direction={"column"} gap={"2"}>
      <Text fontSize={"14px"} fontWeight={"bold"}>
        {props.title}
      </Text>
      <Text fontSize={"10px"} color={"gray.400"}>
        {props.description}
      </Text>
    </Flex>
  );
};

const AppHotelCard = () => {
  return (
    <Flex
      direction={"row"}
      gap={2}
      alignItems={"center"}
      w={"full"}
      rounded={"12px"}
      bg={"gray.700"}
      p={"10px"}
    >
      <Icon
        icon="mingcute:hotel-fill"
        className="text-white text-[32px] rounded-full p-[8px] border-1 border-white"
      />
      <Flex direction={"column"} gap={0} w={"full"}>
        <Text fontSize={"12px"} fontWeight={"bold"}>
          Hotel Name Here
        </Text>
        <Flex
          direction={"row"}
          w={"full"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text fontSize={"10px"}>Bedroom Cool</Text>
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
      w={"full"}
      rounded={"12px"}
      bg={"gray.700"}
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

export default AccomodationCard;
