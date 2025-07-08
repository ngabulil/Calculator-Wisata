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
import { PopoverButton } from "../../../PopoverButton";
import { useAdminPackageContext } from "../../../../context/Admin/AdminPackageContext";
import { parsePaketDays } from "../../../../utils/parseOnePaket";
import { useEffect, useState } from "react";
import App from "../../../../App";

const PackageRead = () => {
  const { onePackageFull } = useAdminPackageContext();
  const [paketDay, setPaketDay] = useState([]);

  const handlePaketRead = async () => {
    const data = await parsePaketDays(onePackageFull.days);
    console.log(data);
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
            {onePackageFull.days.map((_, index) => {
              return (
                <Tab fontSize={"14px"} key={index}>
                  Day {index + 1}
                </Tab>
              );
            })}
          </TabList>

          <TabPanels>
            {paketDay.map((day, index) => {
              return (
                <TabPanel key={index} py={4} px={0}>
                  <Flex direction={"column"} gap={4}>
                    <Flex direction={"column"} gap={0}>
                      <Text fontSize={"24px"} fontWeight={"bold"}>
                        {day.name}
                      </Text>
                      <Text fontSize={"14px"}>{day.description_day}</Text>
                    </Flex>
                    {/* Accomodation */}
                    <AppHeadComponent
                      bg={"gray.700"}
                      p="4"
                      rounded={8}
                      title="Akomodasi"
                    >
                      {" "}
                      <AppHeadComponent title={"Hotel"} isChild>
                        {" "}
                        {day.hotels.map((hotel, index) => {
                          return (
                            <AppHomeStayCard
                              isVilla={false}
                              name={hotel.name}
                              photos={"https://picsum.photos/200/300"}
                              star={hotel.star}
                            />
                          );
                        })}
                      </AppHeadComponent>
                      <AppHeadComponent title={"Villa"} isChild>
                        {" "}
                        {day.villas.map((villa, index) => {
                          return (
                            <AppHomeStayCard
                              isVilla={true}
                              name={villa.name}
                              photos={"https://picsum.photos/200/300"}
                              star={villa.star}
                            />
                          );
                        })}
                      </AppHeadComponent>
                      <AppHeadComponent title={"Tambahan"} isChild>
                        {" "}
                        {day.akomodasi_additionals.map((add, index) => {
                          return (
                            <AppAdditionalCard key={index} title={add.name} />
                          );
                        })}
                      </AppHeadComponent>
                    </AppHeadComponent>
                    {/* tour packages */}
                    <AppHeadComponent
                      bg={"gray.700"}
                      p="4"
                      rounded={8}
                      title="Tour"
                    >
                      <AppHeadComponent title={"Destinasi"} isChild>
                        {day.destinations.map((dest, index) => {
                          return (
                            <AppDestinationCard
                              title={dest.name}
                              subtitle={dest.note}
                            />
                          );
                        })}
                      </AppHeadComponent>
                      <AppHeadComponent title={"Aktitvitas"} isChild>
                        {day.activities.map((act, index) => {
                          return (
                            <AppActivityCard key={index} title={act.name} />
                          );
                        })}
                      </AppHeadComponent>
                      <AppHeadComponent title={"Restaurant"} isChild>
                        {day.restaurants.map((resto, index) => {
                          return (
                            <AppRestaurantCard key={index} title={resto.name} />
                          );
                        })}
                      </AppHeadComponent>
                    </AppHeadComponent>
                    {/* transport */}
                    <AppHeadComponent
                      bg={"gray.700"}
                      p="4"
                      rounded={8}
                      title="Transport"
                    >
                      <AppHeadComponent title={"Mobil"} isChild>
                        {day.mobils.map((mobil, index) => {
                          return (
                            <AppTransportCard
                              key={index}
                              title={mobil.name}
                              vendor={mobil.vendor}
                            />
                          );
                        })}{" "}
                      </AppHeadComponent>
                      <AppHeadComponent title={"Tambahan"} isChild>
                        {day.akomodasi_additionals.map((add, index) => {
                          return (
                            <AppAdditionalCard key={index} title={add.name} />
                          );
                        })}
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
        <img
          alt="photo-detail"
          src="https://picsum.photos/200/300"
          className="w-[40%] h-[300px] rounded-[12px] object-cover"
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

const AppHeadComponent = (props) => {
  return (
    <Flex
      direction={"column"}
      p={props.p}
      bg={props.bg}
      rounded={props.rounded}
      gap={2}
    >
      <Text
        fontSize={!props.isChild ? "20px" : "16px"}
        noOfLines={3}
        bg={!props.isChild && "gray.900"}
        w={"max"}
        p={!props.isChild && 2}
        rounded={!props.isChild && "8px"}
        fontWeight={"semibold"}
      >
        {props.title}
      </Text>
      <Flex
        w={"full"}
        flex={"wrap"}
        direction={props.isChild ? "row" : "column"}
        gap={4}
      >
        {props.children}
      </Flex>
    </Flex>
  );
};

const AppHomeStayCard = (props) => {
  return (
    <Flex
      direction={"column"}
      gap={3}
      alignItems={"start"}
      w={"30%"}
      bg={"gray.800"}
      rounded={"12px"}
      p={"10px"}
    >
      <Flex direction={"row"} alignItems={"center"} gap={2}>
        <Icon
          icon="mingcute:hotel-fill"
          className="text-white text-[24px] rounded-full p-[4px] border-1 border-white"
        />
        <Text fontWeight={"bold"}> {props.isVilla ? "Villa" : "Hotel"} </Text>
      </Flex>
      <img
        src={props.photos || "https://picsum.photos/200/300"}
        alt="hotel-photos"
        className="w-full h-[200px] rounded-[8px] object-cover"
      />
      <Flex direction={"column"} gap={1} w={"full"}>
        <Text fontSize={"16px"} fontWeight={"bold"}>
          {props.name}
        </Text>
        <Flex direction={"row"} alignItems={"center"} gap={1}>
          {Array.from({ length: props.star }).map((_, index) => {
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

const AppTransportCard = (props) => {
  return (
    <Flex direction={"column"} gap={3} w={"30%"}>
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
          className="text-white text-[34px] rounded-full p-[6px] border-1 border-white"
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
            <Text fontSize={"10px"}>{props.vendor}</Text>
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
      w={"30%"}
      bg={"gray.800"}
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
        </Flex>
      </Flex>
      {/*  */}
    </Flex>
  );
};

const AppDestinationCard = (props) => {
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
const AppActivityCard = (props) => {
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
        icon="ic:round-local-activity"
        className="text-white text-[38px] rounded-full p-[8px] border-1 border-white"
      />
      <Text fontSize={"12px"} fontWeight={"bold"}>
        {props.title}
      </Text>

      {/*  */}
    </Flex>
  );
};
