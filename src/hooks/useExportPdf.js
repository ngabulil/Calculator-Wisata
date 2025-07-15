import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const useExportPdf = () => {
  const exportAsBlob = async (componentRef) => {
    if (!componentRef || !componentRef.current) {
      throw new Error("Component ref is not available");
    }

    const input = componentRef.current;
    const canvas = await html2canvas(input, { scale: 1 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
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