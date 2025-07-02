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

const TransportCard = () => {
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
      <Flex direction={"column"} gap={3}>
        <Flex
          direction={"row"}
          alignItems={"center"}
          w={"full"}
          justifyContent={"space-between"}
        >
          <Text fontSize={"18px"} noOfLines={3} fontWeight={"semibold"}>
            Transport
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
              <Flex direction={"column"} gap={3}>
                {Array.from({ length: 2 }).map((_, index) => {
                  return (
                    <AppTransport
                      index={index}
                      title={"Mobil Avanza"}
                      count={"2"}
                    />
                  );
                })}
              </Flex>
            </TabPanel>
            <TabPanel py={4} px={0}>
              <AppTransport title={"Mobil Avanza"} count={"3"} />
            </TabPanel>
            <TabPanel py={4} px={0}>
              <Flex direction={"column"} gap={3}>
                {Array.from({ length: 3 }).map((_, index) => {
                  return (
                    <AppTransport
                      index={index}
                      title={"Mobil Avanza"}
                      count={"2"}
                    />
                  );
                })}
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
};

const AppTransport = (props) => {
  return (
    <Flex
      direction={"row"}
      gap={2}
      alignItems={"center"}
      w={"full"}
      bg={"gray.900"}
      rounded={"12px"}
      p={"12px"}
    >
      <Icon
        icon="mingcute:car-fill"
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
    </Flex>
  );
};

export default TransportCard;
