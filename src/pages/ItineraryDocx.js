import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from "docx";

import { buildHotelChoiceTable } from "../components/ItineraryWord/HotelChoice";
import { buildItineraryTable } from "../components/ItineraryWord/ItineraryTable";
import { buildInclusionExclusion } from "../components/ItineraryWord/InclusionExclusion";
import { formatCurrencyWithCode } from "../utils/currencyUtills";

export function generateItineraryDocx(itineraryData = {}) {
  const {
    mergedDays = [],
    reorderedDays = [],
    inclusionExclusionData = {},
    accommodationData = {},
    selectedPackage = {},
    adultPriceTotal = 0,
    childPriceTotal = 0,
    childTotal = 0,
    paxCount = 2,
    getAlternativePrices = () => ({ adultPrice: 0, childPriceTotals: {} }),
    currency = "IDR",
    formatCurrency = (amount) => formatCurrencyWithCode(amount, currency), 
  } = itineraryData;

  const hotelChoiceTable = buildHotelChoiceTable({
    akomodasiDays: mergedDays,
    accommodationData,
    selectedPackage,
    childTotal,
    adultPriceTotal,
    childPriceTotal,
    formatCurrency,
    currency, 
    paxCount,
    getAlternativePrices
  });

  const itineraryTable = buildItineraryTable({
    days: reorderedDays,
  });

  const inclusionExclusion = buildInclusionExclusion({
    data: inclusionExclusionData,
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 150, after: 200 },
            children: [
              new TextRun({ 
                text: "Travel Itinerary", 
                bold: true,
                size: 32,
                color: "000000",
             }),
            ],
          }),
          ...hotelChoiceTable,
          new Paragraph({
            children: [
              new TextRun({ text: "", break: 2 }),
            ],
          }),
          ...itineraryTable,
          new Paragraph({
            children: [
              new TextRun({ text: "", break: 2 }),
            ],
          }),
          ...inclusionExclusion,
        ],
      },
    ],
  });

  return doc;
}

export async function generateItineraryBlob(itineraryData, options = {}) {
  const doc = generateItineraryDocx(itineraryData, options);
  const blob = await Packer.toBlob(doc);
  return blob;
}