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
import { useMemo } from "react";
import { useExpensesContext } from "../../context/ExpensesContext";
import { usePackageContext } from "../../context/PackageContext";
import { useCheckoutContext } from "../../context/CheckoutContext";

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

  const calculatedTotalPerPax = useMemo(() => {
    const totalAdult = selectedPackage?.totalPaxAdult || 1;

    const totalExpensesFromContext = calculateGrandTotal();
    const adjustedGrandTotal = grandTotal + totalExpensesFromContext;

    return adjustedGrandTotal / totalAdult;
  }, [selectedPackage?.totalPaxAdult, grandTotal, calculateGrandTotal]);


  const allPackages = useMemo(() => {
    const packages = [];

    if (selectedPackage) {
      packages.push({
        no: 1,
        name: selectedPackage.packageName || selectedPackage.name || "Selected Package",
        description: selectedPackage.description || "",
        pricePerPax: calculatedTotalPerPax,
        isSelected: true,
      });
    }
    
    comparisonPackages.forEach((pkg, index) => {
      if (index < 5) {
        packages.push({
          no: index + 2,
          name: pkg.packageName || pkg.name || `Comparison Package ${index + 1}`,
          description: pkg.description || "",
          pricePerPax: pkg.calculatedPrice / selectedPackage?.totalPaxAdult || 1,
          isSelected: false,
        });
      }
    });

    return packages;
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
              PACKAGE CHOICE
            </Th>
            <Th style={tableHeaderStyle} border="1px solid #ddd" width="200px">
              PRICE PER PAX({selectedPackage?.totalPaxAdult || 1} Pax)
            </Th>
          </Tr>
        </Thead>
        <Tbody color={"#222"}>
          {allPackages.map((pkg, index) => (
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
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default PackagesChoiceTable;