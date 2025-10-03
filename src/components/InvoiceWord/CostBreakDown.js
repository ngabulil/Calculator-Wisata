import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  ShadingType,
} from "docx";


const cellMargins = {
  top: 50,
  left: 35,
  right: 35,
};

function makeCell(text, { bold = false, align = AlignmentType.LEFT, colspan, width, shading } = {}) {
  return new TableCell({
    columnSpan: colspan,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    margins: cellMargins,
    shading: shading ? {
      type: ShadingType.CLEAR,
      fill: shading.fill,
      color: "auto",
    } : undefined,
    children: [
      new Paragraph({
        alignment: align,
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text: String(text), bold })],
      }),
    ],
  });
}

export const buildCostBreakDown = (params) => {
  const {
    hotelData = [],
    transportData = [],
    additionalData = [],
    grandTotal = 0,
    markup = 0,
    selling = 0,
    childGroupsWithPricing = [],
    exchangeRate = 0,
  } = params || {};
  const children = [];


  const hasExtrabed = hotelData.some(h => {
    const extrabedQty = getExtrabedQuantity(h);
    return extrabedQty > 0;
  });

  const headerShading = { fill: "FB8C00" }; 
  const totalShading = { fill: "FFF59D" };  
  const grandTotalShading = { fill: "FFF59D" }; 

  const hotelHeaderCells = [
    makeCell("DAY", { bold: true, width: 800, shading: headerShading }),
    makeCell("NAME", { bold: true, width: 4000, shading: headerShading }),
    makeCell("ROOMS", { bold: true, width: 2000, shading: headerShading }),
    makeCell("PRICE/ROOM", { bold: true, align: AlignmentType.RIGHT, width: 2000, shading: headerShading }),
  ];

  if (hasExtrabed) {
    hotelHeaderCells.push(makeCell("EXTRABED", { bold: true, width: 2000, shading: headerShading }));
  }

  hotelHeaderCells.push(makeCell("TOTAL", { bold: true, align: AlignmentType.RIGHT, width: 2000, shading: headerShading }));

  const hotelRows = [
    new TableRow({
      children: hotelHeaderCells,
    }),
  ];

  let hotelGrandTotal = 0;
  hotelData.forEach((h) => {
    const extrabedQty = getExtrabedQuantity(h);
    const extrabedCost = getExtrabedCost(h);
    
    const rowCells = [
      makeCell(h.day || "-", { width: 800 }),
      makeCell(h.name || "-", { width: 4000 }),
      makeCell(h.rooms ? `${h.rooms} ${h.roomType || ""}` : "-", { width: 2000 }),
      makeCell(h.pricePerNight ? `Rp ${h.pricePerNight.toLocaleString("id-ID")}` : "Rp 0", { align: AlignmentType.RIGHT, width: 2000 }),
    ];

    if (hasExtrabed) {
      const extrabedText = extrabedQty > 0 ? 
        `${extrabedQty} x Rp ${extrabedCost.toLocaleString("id-ID")}` : "-";
      rowCells.push(makeCell(extrabedText, { width: 2000 }));
    }

    rowCells.push(makeCell(h.total ? `Rp ${h.total.toLocaleString("id-ID")}` : "Rp 0", { align: AlignmentType.RIGHT, width: 2000 }));

    hotelRows.push(
      new TableRow({
        children: rowCells,
      })
    );
    hotelGrandTotal += h.total || 0;
  });

  const totalColspan = hasExtrabed ? 5 : 4;
  
  hotelRows.push(
    new TableRow({
      children: [
        makeCell("Total Hotel", { 
          bold: true, 
          colspan: totalColspan, 
          width: hasExtrabed ? 10800 : 8800, 
          shading: totalShading 
        }),
        makeCell(`Rp ${hotelGrandTotal.toLocaleString("id-ID")}`, { 
          bold: true, 
          align: AlignmentType.RIGHT, 
          width: 2000, 
          shading: totalShading 
        }),
      ],
    })
  );

  hotelRows.push(
    new TableRow({
      children: [
        makeCell("Grand Total", { 
          bold: true, 
          colspan: totalColspan, 
          align: AlignmentType.RIGHT,
          width: hasExtrabed ? 10800 : 8800, 
          shading: grandTotalShading 
        }),
        makeCell(`Rp ${hotelGrandTotal.toLocaleString("id-ID")}`, { 
          bold: true, 
          align: AlignmentType.RIGHT, 
          width: 2000, 
          shading: grandTotalShading 
        }),
      ],
    })
  );

  const hotelTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: hotelRows,
  });

  children.push(new Paragraph({ 
    bold: true, 
    children: [new TextRun({ text: "Akomodasi", color: "FB8C00", bold: true, size: 32 })],
    spacing: { before: 100, after: 100 } 
  }));
  children.push(hotelTable);

  const transportRows = [
    new TableRow({
      children: [
        makeCell("DAY", { bold: true, width: 800, shading: headerShading }),
        makeCell("DESCRIPTION", { bold: true, width: 6000, shading: headerShading }),
        makeCell("QTY", { bold: true, align: AlignmentType.CENTER, width: 1500, shading: headerShading }),
        makeCell("PRICE", { bold: true, align: AlignmentType.RIGHT, width: 1800, shading: headerShading }),
        makeCell("TOTAL", { bold: true, align: AlignmentType.RIGHT, width: 1800, shading: headerShading }),
      ],
    }),
  ];

  let transportGrandTotal = 0;
  transportData.forEach((t) => {
    const displayQuantity = t.quantity || 1;
    const parsedQuantity = Number(t.quantity);
    const quantityValue = Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1;
    const parsedPrice = Number(t.price);
    const priceValue = Number.isFinite(parsedPrice) ? parsedPrice : 0;
    const hasExplicitTotal = t.total !== undefined && t.total !== null && t.total !== '';
    const parsedTotal = Number(t.total);
    const totalValue = hasExplicitTotal && Number.isFinite(parsedTotal) ? parsedTotal : priceValue * quantityValue;

    transportRows.push(
      new TableRow({
        children: [
          makeCell(t.day || "-", { width: 800 }),
          makeCell(t.description || "-", { width: 6000 }),
          makeCell(displayQuantity, { align: AlignmentType.CENTER, width: 1500 }),
          makeCell(`Rp ${priceValue.toLocaleString("id-ID")}`, { align: AlignmentType.RIGHT, width: 1800 }),
          makeCell(`Rp ${totalValue.toLocaleString("id-ID")}`, { align: AlignmentType.RIGHT, width: 1800 }),
        ],
      })
    );
    transportGrandTotal += totalValue;
  });

  transportRows.push(
    new TableRow({
      children: [
        makeCell("Total Transport", { 
          bold: true, 
          colspan: 4, 
          width: 10100, 
          shading: totalShading 
        }),
        makeCell(`Rp ${transportGrandTotal.toLocaleString("id-ID")}`, { 
          bold: true, 
          align: AlignmentType.RIGHT, 
          width: 1800, 
          shading: totalShading 
        }),
      ],
    })
  );

  transportRows.push(
    new TableRow({
      children: [
        makeCell("Grand Total", { 
          bold: true, 
          colspan: 4, 
          align: AlignmentType.RIGHT,
          width: 10100, 
          shading: grandTotalShading 
        }),
        makeCell(`Rp ${transportGrandTotal.toLocaleString("id-ID")}`, { 
          bold: true, 
          align: AlignmentType.RIGHT, 
          width: 1800, 
          shading: grandTotalShading 
        }),
      ],
    })
  );

  const transportTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: transportRows,
  });

  children.push(new Paragraph({ 
    children: [new TextRun({ text: "Transportasi", color: "FB8C00", bold: true, size: 32 })],
    spacing: { before: 200, after: 100 } 
  }));
  children.push(transportTable);

  children.push(new Paragraph({ 
    children: [new TextRun({ text: "Tambahan (Akomodasi & Transport)", color: "FB8C00", bold: true, size: 32 })],
    spacing: { before: 200, after: 100 } 
  }));

  if (additionalData.length === 0) {
    children.push(new Paragraph({ text: "Tidak ada tambahan" }));
  } else {
    const additionalRows = [
      new TableRow({
        children: [
          makeCell("DAY", { bold: true, width: 800, shading: headerShading }),
          makeCell("ITEM", { bold: true, width: 5000, shading: headerShading }),
          makeCell("QTY", { bold: true, align: AlignmentType.CENTER, width: 1500, shading: headerShading }),
          makeCell("PRICE", { bold: true, align: AlignmentType.RIGHT, width: 2000, shading: headerShading }),
          makeCell("TOTAL", { bold: true, align: AlignmentType.RIGHT, width: 2000, shading: headerShading }),
        ],
      }),
    ];

    let additionalGrandTotal = 0;
    additionalData.forEach((a) => {
      additionalRows.push(
        new TableRow({
          children: [
            makeCell(a.day || "-", { width: 800 }),
            makeCell(a.name || "-", { width: 5000 }),
            makeCell(a.quantity || "-", { align: AlignmentType.CENTER, width: 1500 }),
            makeCell(a.price ? `Rp ${a.price.toLocaleString("id-ID")}` : "Rp 0", { align: AlignmentType.RIGHT, width: 2000 }),
            makeCell(a.total ? `Rp ${a.total.toLocaleString("id-ID")}` : "Rp 0", { align: AlignmentType.RIGHT, width: 2000 }),
          ],
        })
      );
      additionalGrandTotal += a.total || 0;
    });

    additionalRows.push(
      new TableRow({
        children: [
          makeCell("Total Tambahan", { 
            bold: true, 
            colspan: 4, 
            width: 9300, 
            shading: totalShading 
          }),
          makeCell(`Rp ${additionalGrandTotal.toLocaleString("id-ID")}`, { 
            bold: true, 
            align: AlignmentType.RIGHT, 
            width: 2000, 
            shading: totalShading 
          }),
        ],
      })
    );

    // Grand Total Tambahan Row
    additionalRows.push(
      new TableRow({
        children: [
          makeCell("Grand Total", { 
            bold: true, 
            colspan: 4, 
            align: AlignmentType.RIGHT,
            width: 9300, 
            shading: grandTotalShading 
          }),
          makeCell(`Rp ${additionalGrandTotal.toLocaleString("id-ID")}`, { 
            bold: true, 
            align: AlignmentType.RIGHT, 
            width: 2000, 
            shading: grandTotalShading 
          }),
        ],
      })
    );

    const additionalTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: additionalRows,
    });

    children.push(additionalTable);
  }

  children.push(
    new Paragraph({
      text: "",
      spacing: { before: 400 },
    })
  );

  const summaryRows = [
    new TableRow({
      children: [
        makeCell("TOTAL", { bold: true, width: 4000, shading: headerShading }),
        makeCell(`Rp ${grandTotal.toLocaleString("id-ID")}`, { bold: true, align: AlignmentType.RIGHT, width: 3000, shading: headerShading }),
      ],
    }),
    new TableRow({
      children: [
        makeCell("Markup", { width: 4000, shading: headerShading }),
        makeCell(`Rp ${markup.toLocaleString("id-ID")}`, { align: AlignmentType.RIGHT, width: 3000, shading: headerShading }),
      ],
    }),
    new TableRow({
      children: [
        makeCell("Price Pax Adult", { bold: true, width: 4000, shading: headerShading }),
        makeCell(`Rp ${selling.toLocaleString("id-ID")}`, { bold: true, align: AlignmentType.RIGHT, width: 3000, shading: headerShading }),
      ],
    }),
  ];

  childGroupsWithPricing.forEach((cg) => {
    summaryRows.push(
      new TableRow({
        children: [
          makeCell(`Price Pax ${cg.label}`, { bold: true, width: 4000, shading: headerShading }),
          makeCell(`Rp ${cg.price.toLocaleString("id-ID")}`, { bold: true, align: AlignmentType.RIGHT, width: 3000, shading: headerShading }),
        ],
      })
    );
  });

  summaryRows.push(
    new TableRow({
      children: [
        makeCell("Exchange Rate", { bold: true, width: 4000, shading: headerShading }),
        makeCell(`Rp ${exchangeRate.toLocaleString("id-ID")}`, { bold: true, align: AlignmentType.RIGHT, width: 3000, shading: headerShading }),
      ],
    })
  );

  const summaryTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: summaryRows,
    borders: {
      top: { style: "none" },
      bottom: { style: "none" },
      left: { style: "none" },
      right: { style: "none" },
      insideHorizontal: { style: "none" },
      insideVertical: { style: "none" }
    },
  });

  children.push(summaryTable);

  return children;
};

function getExtrabedQuantity(item) {
  if (!item.extrabedByTraveler) return 0;

  let totalQty = 0;

  Object.keys(item.extrabedByTraveler).forEach(travelerKey => {
    const travelerData = item.extrabedByTraveler[travelerKey];
    if (travelerData && travelerData.use === true) {
      totalQty += parseInt(travelerData.qty) || 0;
    }
  });

  return totalQty;
}

function getExtrabedCost(item) {
  const pricePerExtrabed = item.extrabedPrice || 0;
  return pricePerExtrabed;
}
