import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
} from "docx";

export const buildItineraryTable = ({ 
  days = [], 
  childGroups = [],
  formatCurrency
}) => {
  const children = [];

  children.push(
    new Paragraph({
      text: "",
      bold: true,
      spacing: { after: 200 },
      style: "Heading2",
    })
  );

  const cellMargins = {
    top: 50,
    left: 35,
    right: 35,
  };

  const hasChildren = childGroups && childGroups.length > 0;
  const childColumnCount = hasChildren ? childGroups.length : 0;
  
  const dayWidth = 5;
  const quotationWidth = hasChildren ? Math.max(50, 75 - (childColumnCount * 5)) : 75;
  const adultWidth = hasChildren ? 15 : 20;
  const childWidth = hasChildren ? Math.floor(15 / childColumnCount) : 0;

  const headerCells = [
    new TableCell({
      width: { size: dayWidth, type: WidthType.PERCENTAGE },
      margins: cellMargins,
      shading: { fill: "FB8C00" },
      children: [
        new Paragraph({ 
          spacing: { before: 40, after: 40 },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "DAY", bold: true, size: 24 })],
        })
      ],
    }),
    new TableCell({
      width: { size: quotationWidth, type: WidthType.PERCENTAGE },
      margins: cellMargins,
      shading: { fill: "FB8C00" },
      children: [
        new Paragraph({ 
          alignment: AlignmentType.CENTER,
          spacing: { before: 40, after: 40 },
          children: [new TextRun({ text: "QUOTATION", bold: true, size: 24 })],
        })
      ],
    }),
    new TableCell({
      width: { size: adultWidth, type: WidthType.PERCENTAGE },
      margins: cellMargins,
      shading: { fill: "FB8C00" },
      children: [
        new Paragraph({ 
          alignment: AlignmentType.CENTER,
          spacing: { before: 40, after: 40 },
          children: [new TextRun({ text: "ADULT", bold: true, size: 24 })],
        })
      ],
    }),
  ];

  if (hasChildren) {
    childGroups.forEach((child) => {
      headerCells.push(
        new TableCell({
          width: { size: childWidth, type: WidthType.PERCENTAGE },
          margins: cellMargins,
          shading: { fill: "FB8C00" },
          children: [
            new Paragraph({ 
              alignment: AlignmentType.CENTER,
              spacing: { before: 40, after: 40 },
              children: [new TextRun({ text: `CHILD ${child.age}`, bold: true, size: 24 })],
            })
          ],
        })
      );
    });
  }

  const tableRows = [
    new TableRow({
      children: headerCells,
    }),
  ];

  const totalHeaderCols = headerCells.length;

  const calculateItemPrice = (item) => {
    const quantities = item.originalData?.quantities || {};
    const hargaAdult = Number(item.adultPrice || item.originalData?.hargaAdult || 0);
    const hargaChild = Number(item.childPrice || item.originalData?.hargaChild || 0);
    const adultQty = Number(quantities.adult || 0);
    const adultExpense = adultQty * hargaAdult;
    const childExpenses = childGroups.map((child) => {
      const childQty = Number(quantities[child.id] || quantities.child || 0);
      return childQty * hargaChild;
    });

    return {
      adultExpense,
      childExpenses,
      total: adultExpense + childExpenses.reduce((sum, expense) => sum + expense, 0),
    };
  };

  const formatCurrencyValue = (amount) => {
    if (!formatCurrency) {
      return amount > 0 ? `Rp ${amount.toLocaleString('id-ID')}` : "-";
    }
    return amount > 0 ? formatCurrency(amount) : "-";
  };

  let grandTotal = 0;

  days.forEach((day, dayIndex) => {
    const dayHeaderCells = [
      new TableCell({
        margins: cellMargins,
        verticalAlign: "top",
        shading: { fill: "FFE0B2" },
        children: [
          new Paragraph({
            text: `${dayIndex + 1}`,
            bold: true,
            spacing: { before: 50, after: 50 },
            alignment: AlignmentType.CENTER
          }),
        ],
      }),
      new TableCell({
        margins: cellMargins,
        verticalAlign: "top",
        shading: { fill: "FFE0B2" },
        columnSpan: totalHeaderCols - 1, 
        children: [
          new Paragraph({
            spacing: { before: 50, after: 50 },
            children: [
              new TextRun({ 
                text: day.title || day.name || `Day ${dayIndex + 1}`, 
                bold: true 
              }),
            ],
          }),
        ],
      }),
    ];

    tableRows.push(
      new TableRow({
        children: dayHeaderCells,
      })
    );

    (day.items || []).forEach((item) => {
      const itemTitle = item.item || item.label || "Unnamed Item";
      const { adultExpense, childExpenses } = calculateItemPrice(item);
      
      grandTotal += adultExpense + childExpenses.reduce((sum, exp) => sum + exp, 0);

      const itemCells = [
        new TableCell({ 
          margins: cellMargins,
          verticalAlign: "top",
          children: [new Paragraph({ text: "", spacing: { before: 40, after: 40 } })] 
        }),
        new TableCell({
          margins: cellMargins,
          verticalAlign: "top",
          children: [
            new Paragraph({
              spacing: { before: 40, after: 20, line: 120 },
              children: [
                new TextRun({ 
                  text: `• ${itemTitle}`, 
                }),
              ],
            }),
            ...(item.description 
              ? [new Paragraph({
                  spacing: { before: 0, after: 40 },
                  children: [
                    new TextRun({
                      text: item.description,
                      italics: true,
                      color: "666666",
                      size: 20,
                    }),
                  ],
                })]
              : [])
          ],
        }),
        new TableCell({
          margins: cellMargins,
          verticalAlign: "top",
          children: [
            new Paragraph({
              text: formatCurrencyValue(adultExpense),
              alignment: AlignmentType.RIGHT,
              spacing: { before: 40, after: 40 },
            }),
          ],
        }),
      ];

      if (hasChildren) {
        childExpenses.forEach((childExpense) => {
          itemCells.push(
            new TableCell({
              margins: cellMargins,
              verticalAlign: "top",
              children: [
                new Paragraph({
                  text: formatCurrencyValue(childExpense),
                  alignment: AlignmentType.RIGHT,
                  spacing: { before: 40, after: 40 },
                }),
              ],
            })
          );
        });
      }

      tableRows.push(
        new TableRow({
          children: itemCells,
        })
      );
    });
  });

  const grandTotalCells = [
    new TableCell({
      margins: cellMargins,
      columnSpan: 2, 
      shading: { fill: "FB8C00" },
      children: [
        new Paragraph({ 
          children: [new TextRun({ text: "Grand Total", bold: true })],
          spacing: { before: 50, after: 50 }
        })
      ],
    }),
    new TableCell({
      margins: cellMargins,
      columnSpan: totalHeaderCols - 2, 
      shading: { fill: "FB8C00" },
      children: [
        new Paragraph({
          text: formatCurrencyValue(grandTotal),
          bold: true,
          alignment: AlignmentType.RIGHT,
          spacing: { before: 50, after: 50 },
        }),
      ],
    })
  ];

  tableRows.push(
    new TableRow({
      children: grandTotalCells,
    })
  );

  const itineraryTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows,
  });

  children.push(itineraryTable);

  return children;
};
