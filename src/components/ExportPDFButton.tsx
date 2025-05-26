import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaFilePdf } from "react-icons/fa";

interface ExportPDFButtonProps {
  targetId: string;
  filename: string;
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ targetId, filename }) => {
  const handleExport = async () => {
    const element = document.getElementById(targetId);
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 } as any);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200"
    >
      <FaFilePdf className="text-lg" />
      <span>Exportar PDF</span>
    </button>
  );
};

export default ExportPDFButton;
