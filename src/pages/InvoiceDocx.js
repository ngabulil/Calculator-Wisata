import {
  Document,
  Packer,
  PageBreak,
} from "docx";
import { buildInvoiceHeader } from "../components/InvoiceWord/InvoiceHeader";
import { buildItineraryTable } from "../components/InvoiceWord/ItineraryTable";
import { buildCostBreakDown } from "../components/InvoiceWord/CostBreakDown";

export function generateInvoiceDocx(invoiceData = {}) {
  const {
    packageName = "",
    totalAdult = 0,
    totalChild = 0,
    adminName = "",
    days = [],
    hotelData = [],
    transportData = [],
    additionalData = [],
    grandTotal = 0,
    markup = 0,
    selling = 0,
    childGroupsWithPricing = [],
    exchangeRate = 0,
  } = invoiceData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const header = buildInvoiceHeader({
    packageName,
    totalAdult,
    totalChild,
    adminName,
  });

  const itineraryTable = buildItineraryTable({
    days: days,
    childGroups: childGroupsWithPricing,
    formatCurrency: formatCurrency, 
  });

  const costBreakdown = buildCostBreakDown({
    hotelData,
    transportData,
    additionalData,
    grandTotal,
    markup,
    selling,
    childGroupsWithPricing,
    exchangeRate,
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          ...header,
          new PageBreak(),
          ...itineraryTable,
          new PageBreak(),
          ...costBreakdown,
        ],
      },
    ],
  });

  return doc;
}

export async function generateInvoiceBlob(invoiceData, options = {}) {
  const doc = generateInvoiceDocx(invoiceData, options);
  const blob = await Packer.toBlob(doc);
  return blob;
}