import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InvoiceData {
  invoiceNumber: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  planName: string;
  planDays?: number;
  quantity?: number;
  amount: number;
  totalAmount?: number;
  paymentDate?: string;
}

export const generateInvoiceBlob = async (data: InvoiceData): Promise<Blob> => {
  const doc = new jsPDF();

  const companyName = "Shwetha Initiative";
  const brandName = "The Property For You";
  const gstNumber = "29ACRPH7504H1ZA";
  const dateStr = new Date().toLocaleDateString("en-IN");
  
  // Calculate GST (18% inclusive)
  // amount = base + base * 0.18 = base * 1.18
  // base = amount / 1.18
  // gstAmount = amount - base
  const amount = data.amount;
  const basePrice = amount / 1.18;
  const gstAmount = amount - basePrice;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(0, 51, 153);
  doc.text(companyName, 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Brand: ${brandName}`, 14, 30);
  doc.text(`GSTIN: ${gstNumber}`, 14, 36);

  // Invoice Title
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("TAX INVOICE", 140, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Invoice No: ${data.invoiceNumber}`, 140, 30);
  doc.text(`Date: ${data.paymentDate || dateStr}`, 140, 36);

  doc.setLineWidth(0.5);
  doc.line(14, 42, 196, 42);

  // Billed To
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("Billed To:", 14, 52);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(data.userName || "Customer", 14, 60);
  doc.text(data.userEmail || "", 14, 66);
  if (data.userPhone) {
    doc.text(data.userPhone, 14, 72);
  }

  const quantity = data.quantity || 1;
  const totalAmount = data.totalAmount || amount * quantity;

  // Table
  autoTable(doc, {
    startY: 85,
    head: [["Description", "Days", "Qty", "Amount (INR)"]],
    body: [
      [`${data.planName}`, data.planDays ? `${data.planDays} Days` : "N/A", `${quantity}`, amount.toFixed(2)],
    ],
    foot: [
      ["", "", "Base Price", basePrice.toFixed(2)],
      ["", "", "CGST (9%)", cgst.toFixed(2)],
      ["", "", "SGST (9%)", sgst.toFixed(2)],
      ["", "", "Total (Inclusive of GST)", totalAmount.toFixed(2)],
    ],
    theme: "striped",
    headStyles: { fillColor: [0, 51, 153] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
  });

  // Footer notes
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Thank you for your business!", 14, finalY);
  doc.text("This is a computer-generated invoice and requires no signature.", 14, finalY + 6);

  // Return as Blob
  return doc.output("blob");
};
