import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const useExportPdf = () => {
  const exportAsBlob = async (componentRef) => {
    if (!componentRef || !componentRef.current) {
      throw new Error("Component ref is not available");
    }

  const input = componentRef.current;

  // Tangkap canvas dengan kualitas tinggi
  const canvas = await html2canvas(input, { scale: 1 });

  const imgWidth = 210; // PDF width in mm (A4)
  const pageHeight = 297; // PDF height in mm (A4)
  const marginTopBottom = 20; // mm
  const usableHeight = pageHeight - 2 * marginTopBottom;

  // const imgHeight = (canvas.height * imgWidth) / canvas.width; // full height
  const ratio = canvas.width / imgWidth; // px per mm

  const pdf = new jsPDF("p", "mm", "a4");

  let positionY = 0;
  let pageCount = 0;

  while (positionY < canvas.height) {
    const canvasPage = document.createElement("canvas");
    canvasPage.width = canvas.width;
    canvasPage.height = usableHeight * ratio;

    const ctx = canvasPage.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasPage.width, canvasPage.height);
    ctx.drawImage(
      canvas,
      0,
      positionY,
      canvas.width,
      usableHeight * ratio,
      0,
      0,
      canvas.width,
      usableHeight * ratio
    );

    const imgData = canvasPage.toDataURL("image/png");
    if (pageCount > 0) pdf.addPage();

    pdf.addImage(imgData, "PNG", 0, marginTopBottom, imgWidth, usableHeight);
    positionY += usableHeight * ratio;
    pageCount++;
  }

    return pdf.output("blob");
  };

  const downloadPdf = async (componentRef, filename = "document.pdf") => {
    const blob = await exportAsBlob(componentRef);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return { 
    exportAsBlob, 
    downloadPdf 
  };
};

export default useExportPdf;