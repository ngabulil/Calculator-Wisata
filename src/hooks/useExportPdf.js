import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const useExportPdf = () => {
  const exportAsBlob = async (componentRef) => {
    if (!componentRef || !componentRef.current) {
      throw new Error("Component ref is not available");
    }

    const input = componentRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF("p", "mm", [imgHeight + 20, imgWidth]);

    const marginLeft = 0;
    const marginTop = 10;

    pdf.addImage(imgData, "PNG", marginLeft, marginTop, imgWidth, imgHeight);
    return pdf.output("blob");
  };

  const downloadPdf = async (componentRef, filename = "receipt.pdf") => {
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
    downloadPdf,
  };
};

export default useExportPdf;