import { useEffect, useState } from "react";
import { VStack } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { useCheckoutContext } from "../../../context/CheckoutContext";
import { parseAndMergeDays } from "../../../utils/parseAndMergeDays"; 
import DaySummary from "./DaySummary";
import DayDetails from "./DayDetails";

const DayBreakdown = ({ days, formatCurrency }) => {
  const accentColor = useColorModeValue("teal.300", "teal.400");

  const {
    dayTotals,
    detailedBreakdown,
    akomodasiTotal,
    transportTotal,
    tourTotal,
  } = useCheckoutContext();

  const [mergedDays, setMergedDays] = useState([]);

useEffect(() => {
  const processDays = async () => {
    if (days?.length > 0) {
      try {
        const merged = await parseAndMergeDays(days);
        setMergedDays(merged);
      } catch (err) {
        console.error("Gagal memproses days:", err);
        setMergedDays(days);
      }
    }
  };
  processDays();
}, [days]);

  return (
    <VStack spacing={6} align="stretch">
      <DaySummary
        akomodasiTotal={akomodasiTotal}
        transportTotal={transportTotal}
        tourTotal={tourTotal}
        formatCurrency={formatCurrency}
      />
      <DayDetails
        mergedDays={mergedDays}
        dayTotals={dayTotals}
        detailedBreakdown={detailedBreakdown}
        formatCurrency={formatCurrency}
        accentColor={accentColor}
      />
    </VStack>
  );
};

export default DayBreakdown;
