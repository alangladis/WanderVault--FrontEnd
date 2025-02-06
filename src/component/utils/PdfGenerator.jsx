import React from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const PdfGenerator = () => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("ISO 9001:2015", 15, 15);

    // Table Data
    const auditDetails = [
      ["01", "AREA AUDITED", ""],
      ["02", "AUDITOR (S)", ""],
      ["03", "DATE & TIME", ""],
    ];

    const checkPoints = [
      ["AUDIT CHECK POINTS", "REFERENCE DOCUMENTS", "NOTES"],
      ["As per Checklist I & II", "", ""],
    ];

    // Audit Details Table
    doc.autoTable({
      startY: 25,
      head: [["#", "Description", "Details"]],
      body: auditDetails,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [200, 200, 200] },
    });

    // ISO Section Title
    let finalY = doc.lastAutoTable.finalY + 5;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Section of ISO 9001:2015:", 15, finalY);

    // Audit Checkpoints Table
    doc.autoTable({
      startY: finalY + 5,
      body: checkPoints,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [200, 200, 200] },
    });

    // Signature Fields
    finalY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.text("Signature of Auditee", 15, finalY);
    doc.text("Signature of Auditors", pageWidth - 60, finalY);
    doc.text("Date:", 15, finalY + 10);
    doc.text("Date:", pageWidth - 60, finalY + 10);

    // Save PDF
    doc.save("ISO_Audit_Sheet.pdf");
  };

  return (
    <div>
      <h1>ISO 9001:2015 Audit PDF Generator</h1>
      <button className="btn-primary" onClick={generatePDF}>
        Generate PDF
      </button>
    </div>
  );
};

export default PdfGenerator;
