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

export const buildInclusionExclusion = ({ data = {} }) => {
  const orange = "D2CEB1";
  const defaultData = {
    inclusions: [
      "Stay for 3 Nights at 4 stars Hotel in Kuta Area",
      "All entrance fees, meals, and activities as mention in program",
      "Welcome flower in Ngurah Rai International",
      "Transport: 6 Seaters car (use maximum 10-12 hours/day)",
      "Private experience driver",
    ],
    estimationTime: {
      title: "Suggest Estimation Time :",
      items: [
        "Arrival in Bali around 12 Pm (afternoon)",
        "Departure Time From Bali Anytime",
        "NOTE : Premium Meal",
      ],
    },
    exclusions: [
      "Flight tickets",
      "Shopping, Laundry, Medicine, And any others",
      "Tipping for Driver ( RM 10/Pax/Day )",
    ],
    priceChanges: {
      title: "PRICE PROMO VALID FOR PERIOD:",
      items: ["Promo Valid Until June 2025"],
    },
    otherProvisions:
      "We at Bali Sundaram Travel are not responsible for delays or cancellations Flight Schedules for both Arrivals and Departures so that you can change the Package Schedule Tour that has been programmed.",
  };

  const mergedData = { ...defaultData, ...data };

  const makeCell = (
    text,
    {
      bold = false,
      fontSize = 22,
      align = AlignmentType.LEFT,
      shading = null,
      width = 50,
      colspan = 1,
      spacing = 100,
    } = {}
  ) =>
    new TableCell({
      width: colspan > 1 ? undefined : { size: width, type: WidthType.PERCENTAGE },
      columnSpan: colspan > 1 ? colspan : undefined,
      verticalAlign: VerticalAlign.TOP,
      shading: shading
        ? { type: ShadingType.CLEAR, fill: shading, color: "000000" }
        : undefined,
      children: [
        new Paragraph({
          alignment: align,
          spacing: { before: spacing, after: spacing },
          children: [
            new TextRun({
              text: text || "",
              bold,
              size: fontSize,
              font: "Times New Roman",
            }),
          ],
        }),
      ],
    });

  const makeListCells = (items, symbol = "•") =>
    items.map(
      (i) =>
        new Paragraph({
          spacing: { before: 100, after: 100 },
          children: [
            new TextRun({ text: `${symbol} `, bold: true, size: 22, font: "Times New Roman" }),
            new TextRun({ text: i, size: 22, font: "Times New Roman" }),
          ],
        })
    );

  const mainTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          makeCell("INCLUSION", {
            bold: true,
            fontSize: 24,
            align: AlignmentType.CENTER,
            shading: orange,
            width: 50,
            spacing: 20,
          }),
          makeCell("Estimation Time", {
            bold: true,
            fontSize: 24,
            align: AlignmentType.CENTER,
            shading: orange,
            width: 50,
            spacing: 20,
          }),
        ],
      }),

      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            children: makeListCells(mergedData.inclusions, "✓"),
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: mergedData.estimationTime.title,
                    bold: true,
                    size: 22,
                  }),
                ],
              }),
              ...makeListCells(mergedData.estimationTime.items, "•"),
            ],
          }),
        ],
      }),

      new TableRow({
        children: [
          makeCell("EXCLUSIONS:", {
            bold: true,
            fontSize: 24,
            align: AlignmentType.CENTER,
            shading: orange,
            width: 50,
            spacing: 20,
          }),
          makeCell("PRICE CHANGES:", {
            bold: true,
            fontSize: 24,
            align: AlignmentType.CENTER,
            shading: orange,
            width: 50,
            spacing: 20,
          }),
        ],
      }),

      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            children: makeListCells(mergedData.exclusions, "X"),
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: mergedData.priceChanges.title,
                    bold: true,
                    size: 22,
                  }),
                ],
              }),
              ...makeListCells(mergedData.priceChanges.items, "•"),
            ],
          }),
        ],
      }),

      new TableRow({
        children: [
          makeCell("OTHER PROVISIONS", {
            bold: true,
            fontSize: 24,
            align: AlignmentType.CENTER,
            shading: orange,
            colspan: 2,
            spacing: 12,
          }),
        ],
      }),

      new TableRow({
        children: [
          new TableCell({
            columnSpan: 2,
            verticalAlign: VerticalAlign.TOP,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 80 },
                children: [
                  new TextRun({
                    text: mergedData.otherProvisions,
                    size: 22,
                    font: "Times New Roman",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
    borders: {
      top: { style: "single", size: 4, color: "000000" },
      bottom: { style: "single", size: 4, color: "000000" },
      left: { style: "single", size: 4, color: "000000" },
      right: { style: "single", size: 4, color: "000000" },
      insideHorizontal: { style: "single", size: 2, color: "000000" },
      insideVertical: { style: "single", size: 2, color: "000000" },
    },
  });

  return [mainTable];
};
