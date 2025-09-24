import {
  Table,
  TableRow,
  TableCell,
  Paragraph,
  TextRun,
  AlignmentType,
  WidthType,
  VerticalAlign,
  ShadingType,
} from "docx";

export const buildHotelChoiceTable = ({
  akomodasiDays = [],
  accommodationData = {},
  selectedPackage = {},
  childTotal = 0,
  transportType = "6 Seater",
  formatCurrency = (amount) => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount),
  getAlternativePrices = () => ({ adultPrice: 0, childPriceTotals: {} })
}) => {

  const orange = "D2CEB1";

  const makeCell = (
    text,
    {
      bold = false,
      align = AlignmentType.LEFT,
      width = 2000,
      widthType = WidthType.DXA,
      fontSize = 22,
      shading = null,
      colspan = 1,
      rowspan = 1,
      multiLine = false,
      spacing = { before: 100, after: 100 }, // Default spacing
    } = {}
  ) => {
    let childrenParagraph;

    if (multiLine && text && text.includes("\n")) {
      const parts = text.split("\n");
      const runs = [];
      parts.forEach((p, idx) => {
        runs.push(
          new TextRun({
            text: p,
            break: idx === 0 ? 0 : 1,
            bold,
            size: fontSize,
            font: "Times New Roman",
          })
        );
      });
      childrenParagraph = new Paragraph({
        alignment: align,
        spacing: spacing, // Terapkan spacing di sini
        children: runs,
      });
    } else {
      childrenParagraph = new Paragraph({
        alignment: align,
        spacing: spacing, // Terapkan spacing di sini
        children: [
          new TextRun({
            text: text || "",
            bold,
            size: fontSize,
            font: "Times New Roman",
          }),
        ],
      });
    }

    let widthConfig;
    if (typeof width === 'object' && width.size && width.type) {
      widthConfig = width;
    } else {
      widthConfig = { size: width, type: widthType };
    }

    return new TableCell({
      width: widthConfig,
      columnSpan: colspan > 1 ? colspan : undefined,
      rowSpan: rowspan > 1 ? rowspan : undefined,
      verticalAlign: VerticalAlign.CENTER,
      shading: shading
        ? {
            type: ShadingType.CLEAR,
            fill: shading,
            color: "auto",
          }
        : undefined,
      children: [childrenParagraph],
    });
  };

  const { 
    allAccommodations = [], 
    accommodationNights = 0, 
    firstRowPrices = null 
  } = accommodationData;

  let totalNights = accommodationNights;
  if (!totalNights) {
    akomodasiDays.forEach((day) => {
      if (day?.hotels?.length) {
        day.hotels.forEach((hotel) => {
          totalNights = Math.max(totalNights, hotel.jumlahMalam || 0);
        });
      }
      if (day?.villas?.length) {
        day.villas.forEach((villa) => {
          totalNights = Math.max(totalNights, villa.jumlahMalam || 0);
        });
      }
    });
  }

  const hasChildren = (selectedPackage?.totalPaxChildren > 0) || (childTotal > 0);
  const totalPaxAdult = selectedPackage?.totalPaxAdult;

  const headerRow1 = new TableRow({
    children: [
      makeCell("NO", {
        bold: true,
        align: AlignmentType.CENTER,
        width: { size: 8, type: WidthType.PERCENTAGE },
        fontSize: 24,
        shading: orange,
        rowspan: 2,
        spacing: { before: 200, after: 200 }, // Spacing lebih longgar untuk header
      }),
      makeCell(`HOTEL CHOICE\n(${totalNights} Night Hotel)`, {
        bold: true,
        align: AlignmentType.CENTER,
        width: { size: 50, type: WidthType.PERCENTAGE },
        fontSize: 24,
        shading: orange,
        rowspan: 2,
        multiLine: true,
        spacing: { before: 200, after: 200 }, // Spacing lebih longgar untuk header
      }),
      makeCell("PRICE PER PAX", {
        bold: true,
        align: AlignmentType.CENTER,
        width: { size: 35, type: WidthType.PERCENTAGE },
        fontSize: 24,
        shading: orange,
        colspan: hasChildren ? 2 : 1,
        spacing: { before: 200, after: 200 }, // Spacing lebih longgar untuk header
      }),
    ],
  });

  const headerRow2 = new TableRow({
    children: [
      makeCell(`A${totalPaxAdult}+C${childTotal}\nTransport ${transportType}`, {
        bold: true,
        align: AlignmentType.CENTER,
        width: { size: 35, type: WidthType.PERCENTAGE },
        fontSize: 18,
        shading: orange,
        multiLine: true,
        spacing: { before: 200, after: 200 }, // Spacing lebih longgar untuk header
      }),
    ],
  });

  const rows = [headerRow1, headerRow2];

  if (allAccommodations && allAccommodations.length > 0) {
    allAccommodations.forEach((item, index) => {
      const isFirst = index === 0;

      const prices = isFirst && firstRowPrices
        ? firstRowPrices
        : getAlternativePrices(item.price, item.extrabedPrice);

      let hotelName = item.name ? item.name.toUpperCase() : "UNNAMED HOTEL";
      if (item.stars) {
        hotelName += ` (${item.stars}*)`;
      }

      let roomDetails = "";
      if (item.type !== "Package") {
        roomDetails = `(${item.jumlahKamar || 1} ${item.roomType || "Room"}`;
        if (item.hasExtrabed && item.extrabedCount > 0) {
          roomDetails += ` + ${item.extrabedCount} Extrabed`;
        }
        roomDetails += ")";
      }

      const hotelCellContent = roomDetails 
        ? `${hotelName}\n${roomDetails}`
        : hotelName;

      let priceContent = `ADULT : ${formatCurrency(prices.adultPrice || prices.adultBase || 0)} / Pax`;
      

      if (prices.childGroups && prices.childPriceTotals) {
        prices.childGroups.forEach(group => {
          const childPrice = prices.childPriceTotals[group.id] || 0;
          priceContent += `\nCHILD ${group.age} : ${formatCurrency(childPrice)} / Pax`;
        });
      }

      const accommodationRow = new TableRow({
        children: [
          makeCell((item.no || (index + 1)).toString(), {
            bold: true,
            align: AlignmentType.CENTER,
            width: { size: 15, type: WidthType.PERCENTAGE },
            fontSize: 20,
            spacing: { before: 150, after: 150 },
          }),
          makeCell(hotelCellContent, {
            bold: true,
            align: AlignmentType.LEFT,
            width: { size: 50, type: WidthType.PERCENTAGE },
            fontSize: 20,
            multiLine: true,
            spacing: { before: 150, after: 150 },
          }),
          makeCell(priceContent, {
            bold: true,
            align: AlignmentType.LEFT,
            width: { size: 35, type: WidthType.PERCENTAGE },
            fontSize: 18,
            multiLine: true,
            spacing: { before: 150, after: 150 },
          }),
        ],
      });

      rows.push(accommodationRow);
    });
  } else {
    const placeholderRow = new TableRow({
      children: [
        makeCell("1", {
          bold: true,
          align: AlignmentType.CENTER,
          width: { size: 15, type: WidthType.PERCENTAGE },
          fontSize: 20,
          spacing: { before: 150, after: 150 },
        }),
        makeCell("NO ACCOMMODATION DATA AVAILABLE", {
          bold: true,
          align: AlignmentType.CENTER,
          width: { size: 50, type: WidthType.PERCENTAGE },
          fontSize: 20,
          spacing: { before: 150, after: 150 },
        }),
        makeCell("CONTACT FOR PRICING", {
          bold: true,
          align: AlignmentType.CENTER,
          width: { size: 35, type: WidthType.PERCENTAGE },
          fontSize: 18,
          spacing: { before: 150, after: 150 },
        }),
      ],
    });

    rows.push(placeholderRow);
  }

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows,
    borders: {
      top: { style: "single", size: 4, color: "000000" },
      bottom: { style: "single", size: 4, color: "000000" },
      left: { style: "single", size: 4, color: "000000" },
      right: { style: "single", size: 4, color: "000000" },
      insideHorizontal: { style: "single", size: 2, color: "000000" },
      insideVertical: { style: "single", size: 2, color: "000000" },
    },
  });

  return [table];
};