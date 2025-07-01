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

const PackageCard = () => {
  return (
    <Box
      bg={"gray.700"}
      p={4}
      w={"30%"}
      flexGrow="1"
      rounded={12}
      display={"flex"}
    >
      <Flex direction={"column"} gap={4}>
        <Flex direction={"column"} gap={2}>
          <Flex
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Text fontSize={"24px"} fontWeight={"bold"}>
              Bali Paket
            </Text>
            <Icon icon={"mage:dots"} className="text-white text-[20px]" />
          </Flex>

          <Text fontSize={"10px"} noOfLines={3}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </Text>
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
                            Solaris Hotel Kuta
                          </Text>
                          <Flex
                            direction={"row"}
                            w={"full"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Text fontSize={"10px"}>Deluxe Room</Text>
                            <Flex
                              direction={"row"}
                              alignItems={"center"}
                              gap={1}
                            >
                              {Array.from({ length: 3 }).map((_, index) => {
                                return (
                                  <Icon
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
                            Makanan / Minuman
                          </Text>
                          <Flex
                            direction={"row"}
                            w={"full"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Text fontSize={"10px"}>Jumlah</Text>
                            <Text fontSize={"10px"}>1</Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
                {/*  */}
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
                {/*  */}
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
                        p={"20px"}
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
                        <Tabs variant="line" colorScheme="blue" isFitted>
                          <TabList>
                            {Array.from({ length: 3 }).map((_, index) => {
                              return (
                                <Tab fontSize={"10px"}>Day {index + 1}</Tab>
                              );
                            })}
                          </TabList>

                          <TabPanels>
                            {Array.from({ length: 3 }).map((_, index) => {
                              return (
                                <TabPanel key={index} px={0}>
                                  <Text fontSize={"10px"}>
                                    {index + 1}. Lorem Ipsum is simply dummy
                                    text of the printing and typesetting
                                    industry. Lorem Ipsum has been the
                                    industry's standard dummy text ever since
                                    the 1500s, when an unknown printer took a
                                    galley of type and scrambled it
                                  </Text>
                                </TabPanel>
                              );
                            })}
                          </TabPanels>
                        </Tabs>
                      </Flex>
                      {/*  */}

                      {/*  */}
                    </Flex>
                  </Flex>
                </Flex>
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
