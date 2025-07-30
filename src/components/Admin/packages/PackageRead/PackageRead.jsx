import {
  Box,
  Flex,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  Text,
  TabPanel,
  Container,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { useAdminPackageContext } from "../../../../context/Admin/AdminPackageContext";
import { parsePaketDays } from "../../../../utils/parseOnePaket";
import { useEffect, useState } from "react";

const PackageRead = () => {
  const { onePackageFull } = useAdminPackageContext();
  const [paketDay, setPaketDay] = useState([]);

  const handlePaketRead = async () => {
    const data = await parsePaketDays(onePackageFull.days);

    setPaketDay(data);
  };

  useEffect(() => {
    handlePaketRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      bg={"gray.800"}
      p={4}
      flexGrow="1"
      rounded={12}
      maxW="7xl"
      display={"flex"}
    >
      <Flex direction={"column"} gap={4} w={"full"}>
        <AppTitleDescription
          title={onePackageFull.name}
          description={onePackageFull.description}
        />
        <Tabs variant="line" colorScheme="blue" isFitted>
          <TabList>
            {onePackageFull.days.map((_, index) => (
              <Tab
                key={index}
                fontSize="14px"
                fontWeight="medium"
                borderTopLeftRadius="md"
                borderTopRightRadius="md"
                border="1px solid"
                borderColor="transparent"
                _selected={{
                  bg: "whiteAlpha.100",
                  borderColor: "gray.500 gray.500 white",
                  color: "green.300",
                  fontWeight: "bold",
                }}
                _hover={{
                  bg: "gray.600",
                  color: "white",
                }}
                transition="all 0.2s"
                px={4}
                py={2}
              >
                Day {index + 1}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {paketDay.map((day, index) => {
              return (
                <TabPanel
                  key={index}
                  p={2}
                  bg={"gray.900"}
                  roundedBottom={"12px"}
                >
                  <Flex direction={"column"} gap={4}>
                    <Flex direction={"column"} gap={2}>
                      <Text fontSize={"24px"} fontWeight={"bold"}>
                        {day.name}
                      </Text>
                      <Text fontSize={"14px"} w={"70%"}>
                        {day.description_day}
                      </Text>
                    </Flex>
                    {/* Accomodation */}
                    <AppHeadComponent
                      bg={"gray.700"}
                      p="4"
                      rounded={8}
                      title="Akomodasi"
                    >
                      {" "}
                      <AppHeadComponent title={"Hotel"} isChild isOpen>
                        {" "}
                        {day.hotels.length <= 0 ? (
                          <AppEmptyComponent />
                        ) : (
                          day.hotels.map((hotel) => {
                            return (
                              <AppHomeStayCard
                                isVilla={false}
                                name={hotel.name}
                                photos={hotel.link_photo}
                                star={hotel.star}
                              />
                            );
                          })
                        )}
                      </AppHeadComponent>
                      <AppHeadComponent title={"Villa"} isChild isOpen>
                        {" "}
                        {day.villas.length <= 0 ? (
                          <AppEmptyComponent />
                        ) : (
                          day.villas.map((villa) => {
                            return (
                              <AppHomeStayCard
                                isVilla={true}
                                name={villa.name}
                                photos={villa.link_photo}
                                star={villa.star}
                              />
                            );
                          })
                        )}
                      </AppHeadComponent>
                      <AppHeadComponent title={"Tambahan"} isChild isOpen>
                        {" "}
                        {day.akomodasi_additionals.length <= 0 ? (
                          <AppEmptyComponent />
                        ) : (
                          day.akomodasi_additionals.map((add, index) => {
                            return (
                              <AppAdditionalCard key={index} title={add.name} />
                            );
                          })
                        )}
                      </AppHeadComponent>
                    </AppHeadComponent>
                    {/* tour packages */}
                    <AppHeadComponent
                      bg={"gray.700"}
                      p="4"
                      rounded={8}
                      title="Tour"
                    >
                      <AppHeadComponent title={"Destinasi"} isChild isOpen>
                        {day.destinations.length <= 0 ? (
                          <AppEmptyComponent />
                        ) : (
                          day.destinations.map((dest) => {
                            return (
                              <AppDestinationCard
                                title={dest.name}
                                subtitle={dest.note}
                              />
                            );
                          })
                        )}
                      </AppHeadComponent>
                      <AppHeadComponent title={"Aktitvitas"} isChild isOpen>
                        {day.activities.length <= 0 ? (
                          <AppEmptyComponent />
                        ) : (
                          day.activities.map((act, index) => {
                            return (
                              <AppActivityCard key={index} title={act.name} />
                            );
                          })
                        )}
                      </AppHeadComponent>
                      <AppHeadComponent title={"Restaurant"} isChild isOpen>
                        {day.restaurants.length <= 0 ? (
                          <AppEmptyComponent />
                        ) : (
                          day.restaurants.map((resto, index) => {
                            return (
                              <AppRestaurantCard
                                key={index}
                                title={resto.name}
                              />
                            );
                          })
                        )}
                      </AppHeadComponent>
                    </AppHeadComponent>
                    {/* transport */}
                    <AppHeadComponent
                      bg={"gray.700"}
                      p="4"
                      rounded={8}
                      title="Transport"
                    >
                      <AppHeadComponent title={"Mobil"} isChild isOpen>
                        {day.mobils.length <= 0 ? (
                          <AppEmptyComponent />
                        ) : (
                          day.mobils.map((mobil, index) => {
                            return (
                              <AppTransportCard
                                key={index}
                                title={mobil.name}
                                vendor={mobil.vendor}
                              />
                            );
                          })
                        )}{" "}
                      </AppHeadComponent>
                      <AppHeadComponent title={"Tambahan"} isChild isOpen>
                        {day.transport_additionals.length <= 0 ? (
                          <AppEmptyComponent />
                        ) : (
                          day.akomodasi_additionals.map((add, index) => {
                            return (
                              <AppAdditionalCard key={index} title={add.name} />
                            );
                          })
                        )}
                      </AppHeadComponent>
                    </AppHeadComponent>
                    {/*  */}
                  </Flex>
                </TabPanel>
              );
            })}
          </TabPanels>
        </Tabs>
      </Flex>
    </Container>
  );
};

export default PackageRead;

const AppTitleDescription = (props) => {
  return (
    <Flex direction={"column"} gap={2}>
      <Flex direction={"row"} gap={5}>
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

const AppEmptyComponent = () => {
  return (
    <Box bg={"gray.600"} p={3} rounded={"8px"} w={"full"}>
      <Text fontSize={"16px"} color={"gray.400"} textAlign={"center"}>
        {"Data tidak tersedia"}
      </Text>
    </Box>
  );
};

const AppHeadComponent = (props) => {
  const [open, setOpen] = useState(props.isOpen ? true : false);

  return (
    <Flex direction={"column"} bg={props.bg} rounded={props.rounded} gap={2}>
      <Text
        fontSize={!props.isChild ? "20px" : "16px"}
        noOfLines={3}
        bg={!props.isChild && "blue.600"}
        w={"full"}
        p={!props.isChild && 4}
        roundedTop={!props.isChild && "8px"}
        roundedBottom={!props.isChild && !open && "8px"}
        boxShadow={!props.isChild && "md"}
        fontWeight={"semibold"}
        cursor={!props.isChild ? "pointer" : "default"}
        onClick={() => {
          if (!props.isOpen) setOpen(!open);
        }}
      >
        {props.title}
      </Text>
      {open && (
        <Flex
          w={"full"}
          flex={"wrap"}
          direction={props.isChild ? "row" : "column"}
          p={2}
          gap={4}
          overflowX={props.isChild ? "auto" : "hidden"}
        >
          {props.children}
        </Flex>
      )}
    </Flex>
  );
};

const cardBaseStyle = {
  bg: "gray.800",
  rounded: "12px",
  p: 3,
  w: "30%",
  transition: "all 0.2s ease-in-out",
  _hover: {
    bg: "gray.600",
    cursor: "pointer",
    transform: "translateY(-2px)",
  },
};

const AppHomeStayCard = (props) => (
  <Flex direction="column" gap={3} align="start" {...cardBaseStyle}>
    <Flex align="center" gap={2}>
      <Icon
        icon="mingcute:hotel-fill"
        className="text-white text-[24px] p-[4px] border border-white rounded-full"
      />
      <Text fontWeight="bold">{props.isVilla ? "Villa" : "Hotel"}</Text>
    </Flex>

    <img
      src={props.photos || "https://picsum.photos/200/300"}
      alt="hotel"
      className="w-full h-[200px] object-cover rounded-md"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "/default-img.jpg";
      }}
    />

    <Flex direction="column" gap={1} w="full">
      <Text fontSize="16px" fontWeight="bold">
        {props.name}
      </Text>
      <Flex align="center" gap={1}>
        {Array.from({ length: props.star }).map((_, index) => (
          <Icon
            key={index}
            icon="mdi:star"
            className="text-yellow-400 text-[14px]"
          />
        ))}
      </Flex>
    </Flex>
  </Flex>
);

const AppAdditionalCard = (props) => (
  <Flex align="center" gap={3} {...cardBaseStyle}>
    <Icon
      icon="mynaui:gift"
      className="text-white text-[32px] p-[6px] border border-white rounded-full"
    />
    <Flex direction="column" gap={1} w="full">
      <Text fontSize="16px" fontWeight="bold">
        {props.title}
      </Text>
      <Flex justify="space-between" fontSize="12px" color="gray.400"></Flex>
    </Flex>
  </Flex>
);

const AppTransportCard = (props) => (
  <Flex direction="column" gap={3} {...cardBaseStyle}>
    <Flex align="center" gap={3}>
      <Icon
        icon="mingcute:car-fill"
        className="text-white text-[32px] p-[6px] border border-white rounded-full"
      />
      <Flex direction="column" w="full">
        <Text fontSize="16px" fontWeight="bold">
          {props.title}
        </Text>
        <Text fontSize="12px" color="gray.400">
          {props.vendor}
        </Text>
      </Flex>
    </Flex>
  </Flex>
);

const AppRestaurantCard = (props) => (
  <Flex align="center" gap={3} {...cardBaseStyle}>
    <Icon
      icon="famicons:restaurant-sharp"
      className="text-white text-[32px] p-[6px] border border-white rounded-full"
    />
    <Flex direction="column" gap={1} w="full">
      <Text fontSize="14px" fontWeight="bold">
        {props.title}
      </Text>
      <Text fontSize="12px" color="gray.400">
        {props.subtitle}
      </Text>
    </Flex>
  </Flex>
);

const AppDestinationCard = (props) => (
  <Flex align="center" gap={3} {...cardBaseStyle}>
    <Icon
      icon="fluent:people-queue-32-filled"
      className="text-white text-[32px] p-[6px] border border-white rounded-full"
    />
    <Flex direction="column" gap={1} w="full">
      <Text fontSize="14px" fontWeight="bold">
        {props.title}
      </Text>
      <Text fontSize="12px" color="gray.400">
        {props.subtitle}
      </Text>
    </Flex>
  </Flex>
);

const AppActivityCard = (props) => (
  <Flex align="center" gap={3} {...cardBaseStyle}>
    <Icon
      icon="ic:round-local-activity"
      className="text-white text-[32px] p-[6px] border border-white rounded-full"
    />
    <Text fontSize="14px" fontWeight="bold">
      {props.title}
    </Text>
  </Flex>
);
