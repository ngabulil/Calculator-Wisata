import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState, useEffect } from "react";
import { useExpensesContext } from "../../context/ExpensesContext";
import { usePackageContext } from "../../context/PackageContext";
import { useCheckoutContext } from "../../context/CheckoutContext";
import parseAndMergeDays from "../../utils/parseAndMergeDays";

const orange = "#FB8C00";
const gray = "#F5F5F5";

const tableHeaderStyle = {
  backgroundColor: orange,
  color: "#222",
  fontWeight: "bold",
  fontSize: "1rem",
  textAlign: "center",
  padding: "2px 40px 12px 40px",
};

const tableCellStyle = {
  padding: "2px 40px 12px 40px",
  verticalAlign: "top",
};

const PackagesChoiceTable = () => {
  const { 
    calculateGrandTotal, 
    formatCurrency, 
    comparisonPackages 
  } = useExpensesContext();
  const { selectedPackage } = usePackageContext();
  const { grandTotal } = useCheckoutContext();
  
  const [allPackages, setAllPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const calculatedTotalPerPax = useMemo(() => {
    const totalAdult = selectedPackage?.totalPaxAdult || 1;
    const totalExpensesFromContext = calculateGrandTotal();
    const adjustedGrandTotal = grandTotal + totalExpensesFromContext;
    return adjustedGrandTotal / totalAdult;
  }, [selectedPackage?.totalPaxAdult, grandTotal, calculateGrandTotal]);

  const getDisplayName = async (pkg, fallback) => {
  try {
    if (pkg.days && pkg.days.length > 0) {
      const mergedDays = await parseAndMergeDays(pkg.days);

      for (const day of mergedDays) {
        if (day.hotels && day.hotels.length > 0) {
          const hotel = day.hotels.find(h => h.displayName);
          if (hotel) return hotel.displayName;
        }
        if (day.villas && day.villas.length > 0) {
          const villa = day.villas.find(v => v.displayName);
          if (villa) return villa.displayName;
        }
      }
    }

    return pkg.packageName || pkg.name || fallback;
  } catch (error) {
    console.warn("Error getting display name:", error);
    return pkg.packageName || pkg.name || fallback;
  }
};

  useEffect(() => {
    const buildPackagesList = async () => {
      if (!selectedPackage && comparisonPackages.length === 0) {
        setAllPackages([]);
        return;
      }

      setIsLoading(true);
      const packages = [];

      try {
        if (selectedPackage) {
          const selectedDisplayName = await getDisplayName(
            selectedPackage, 
            "Selected Package"
          );
          
          packages.push({
            no: 1,
            name: selectedDisplayName,
            description: selectedPackage.description || "",
            pricePerPax: calculatedTotalPerPax,
            isSelected: true,
          });
        }

        const comparisonPromises = comparisonPackages
          .slice(0, 5)
          .map(async (pkg, index) => {
            const displayName = await getDisplayName(
              pkg, 
              `Comparison Package ${index + 1}`
            );
            
            return {
              no: index + 2,
              name: displayName,
              description: pkg.description || "",
              pricePerPax: pkg.calculatedPrice / (selectedPackage?.totalPaxAdult || 1),
              isSelected: false,
            };
          });

        const comparisonResults = await Promise.all(comparisonPromises);
        packages.push(...comparisonResults);

        setAllPackages(packages);
      } catch (error) {
        console.error("Error building packages list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    buildPackagesList();
  }, [selectedPackage, comparisonPackages, calculatedTotalPerPax]);

  const hasPackages = useMemo(() => {
    return selectedPackage || comparisonPackages.length > 0;
  }, [selectedPackage, comparisonPackages]);

  if (!hasPackages) {
    return null;
  }

  return (
    <Box mb={8}>
      <Table variant="simple" size="sm" border="1px solid #ddd">
        <Thead>
          <Tr>
            <Th style={tableHeaderStyle} border="1px solid #ddd" width="60px">
              NO
            </Th>
            <Th style={tableHeaderStyle} border="1px solid #ddd">
              <Text>PACKAGE CHOICE</Text>
              <Text fontSize="10PX">(ACCOMMODATION)</Text>
            </Th>
            <Th style={tableHeaderStyle} border="1px solid #ddd" width="200px">
              PRICE PER PAX({selectedPackage?.totalPaxAdult || 1} Pax)
            </Th>
          </Tr>
        </Thead>
        <Tbody color={"#222"}>
          {isLoading ? (
            <Tr>
              <Td colSpan={3} style={tableCellStyle} textAlign="center">
                <Text>Loading package details...</Text>
              </Td>
            </Tr>
          ) : (
            allPackages.map((pkg, index) => (
              <Tr 
                key={`package-${index}`} 
                _hover={{ background: gray }}
              >
                <Td style={tableCellStyle} fontWeight="bold" textAlign="center">
                  {pkg.no}
                </Td>
                <Td style={tableCellStyle}>
                  <VStack align="flex-start" spacing={1}>
                    <Text 
                      fontWeight="bold" 
                      color={"#222"}
                    >
                      {pkg.name.toUpperCase()}
                      {pkg.isSelected}
                    </Text>
                    {pkg.description && (
                      <Text fontSize="sm" color="gray.600">
                        {pkg.description}
                      </Text>
                    )}
                  </VStack>
                </Td>
                <Td style={tableCellStyle} fontWeight="bold" textAlign="center">
                  {formatCurrency(pkg.pricePerPax)}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default PackagesChoiceTable;