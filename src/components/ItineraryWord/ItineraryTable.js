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

export const buildItineraryTable = ({
  days = [],
}) => {
  const beige = "D2CEB1";

  // Helper buat cell dengan spacing
  const makeCell = (
    text,
    {
      bold = false,
      align = AlignmentType.LEFT,
      width = 10000,
      fontSize = 22,
      italics = false,
      shading = null,
      spacingBefore = 100, 
      spacingAfter = 100,  
    } = {}
  ) =>
    new TableCell({
      width: { size: width, type: WidthType.DXA },
      verticalAlign: VerticalAlign.TOP,
      shading: shading
        ? {
            type: ShadingType.CLEAR,
            fill: shading,
            color: "auto",
          }
        : undefined,
      children: [
        new Paragraph({
          alignment: align,
          spacing: {
            before: spacingBefore,
            after: spacingAfter,
          },
          children: [
            new TextRun({
              text: text || "",
              bold,
              size: fontSize,
              font: "Times New Roman",
              italics,
            }),
          ],
        }),
      ],
    });

  // Header utama ITINERARY
  const headerRow = new TableRow({
    children: [
      makeCell(
        `ITINERARY`,
        {
          bold: true,
          align: AlignmentType.CENTER,
          width: 10000,
          fontSize: 24,
          shading: beige,
          spacingBefore: 200, 
          spacingAfter: 200,
        }
      ),
    ],
  });

  const rows = [headerRow];

  days.forEach((day, dayIndex) => {
    const dayTitle = `DAY ${day.day || dayIndex + 1} - ${
      day.title || `Day ${dayIndex + 1}`
    }`;

    // Row untuk judul hari
    rows.push(
      new TableRow({
        children: [
          makeCell(dayTitle, {
            bold: true,
            width: 10000,
            fontSize: 22,
            shading: beige,
            spacingBefore: 150,
            spacingAfter: 150,
          }),
        ],
      })
    );

    const sources = day.items || day.activities || day.expenseItems || [];
    sources.forEach((item, itemIndex) => {
      const itemTitle =
        item?.item ||
        item?.label ||
        item?.displayName ||
        item?.name ||
        (typeof item === "string" ? item : "Unnamed Item");

      const itemDescription =
        item?.description ||
        (typeof item === "object" ? item?.originalData?.description : "") ||
        "";

      const cellChildren = [
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: {
            before: 70, 
            after: 70,
          },
          children: [
            new TextRun({
              text: `• ${itemTitle}`,
              size: 22,
              font: "Times New Roman",
            }),
          ],
        }),
      ];

      if (itemDescription) {
        cellChildren.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: {
              before: 100,
              after: itemIndex === sources.length - 1 ? 200 : 150, // Spacing lebih besar untuk item terakhir
            },
            children: [
              new TextRun({
                text: itemDescription,
                italics: true,
                size: 20,
                font: "Times New Roman",
              }),
            ],
          })
        );
      }

      rows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 10000, type: WidthType.DXA },
              verticalAlign: VerticalAlign.TOP,
              children: cellChildren,
            }),
          ],
        })
      );
    });

    // Tambahkan spacing ekstra setelah setiap hari
    if (dayIndex < days.length - 1) {
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 10000, type: WidthType.DXA },
              verticalAlign: VerticalAlign.TOP,
              children: [
                new Paragraph({
                  spacing: { before: 100, after: 100 },
                  children: [
                    new TextRun({
                      text: "", // Paragraph kosong untuk spacing
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    }
  });

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows,
    layout: "fixed",
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