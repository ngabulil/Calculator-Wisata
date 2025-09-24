import {
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";

export const buildInvoiceHeader = ({ packageName, totalAdult, totalChild, adminName }) => {
  const headerTitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Travel Quotation",
        bold: true,
        size: 32,
        color: "FB8C00"
      }),
    ],
    spacing: { after: 100 },
  });

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: "none" },
      bottom: { style: "none" },
      left: { style: "none" },
      right: { style: "none" },
      insideHorizontal: { style: "none" },
      insideVertical: { style: "none" }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            margins: {
              top: 200, 
              bottom: 200, 
              left: 100,
              right: 100,
            },
            shading: { fill: "FB8C00" },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ 
                    text: `Code: ${packageName}`, 
                    bold: true,
                    color: "000000"
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            margins: {
              top: 200, 
              bottom: 200, 
              left: 100,
              right: 100,
            },
            shading: { fill: "FB8C00" },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
              }),
            ],
          })
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            margins: {
              top: 200,
              bottom: 200,
              left: 100,
              right: 100,
            },
            shading: { fill: "FB8C00" },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Total Adult: ${totalAdult}  |  Total Child: ${totalChild}`,
                    bold: true,
                    color: "000000",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            margins: {
              top: 200, 
              bottom: 200,
              left: 100,
              right: 100,
            },
            shading: { fill: "FB8C00" },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ 
                    text: `InputBy: ${adminName}`,
                    bold: true,
                    color: "000000",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  return [headerTitle, headerTable];
};