import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './InvoiceGenerator.css';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

const InvoiceGenerator: React.FC = () => {
  const [clientName, setClientName] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, rate: 0, total: 0 }
  ]);

  const addRow = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0, total: 0 }]);
  };

  const removeRow = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    updateTotal(newItems);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      total: field === 'quantity' || field === 'rate'
        ? Number(newItems[index].quantity) * Number(newItems[index].rate)
        : newItems[index].total
    };
    setItems(newItems);
    updateTotal(newItems);
  };

  const updateTotal = (currentItems: InvoiceItem[] = items) => {
    return currentItems.reduce((sum, item) => sum + item.total, 0);
  };

  const exportInvoice = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Add header
    doc.setFontSize(24);
    doc.text('INVOICE', pageWidth / 2, yPos, { align: 'center' });
    yPos += 20;

    // Add client info
    doc.setFontSize(12);
    doc.text(`Client: ${clientName}`, margin, yPos);
    yPos += 10;
    doc.text(`Date: ${invoiceDate}`, margin, yPos);
    yPos += 20;

    // Add table header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const headers = ['Description', 'Qty', 'Rate', 'Total'];
    const colWidths = [80, 30, 30, 30];
    let xPos = margin;
    
    headers.forEach((header, i) => {
      doc.text(header, xPos, yPos);
      xPos += colWidths[i];
    });
    yPos += 10;

    // Add items
    doc.setFont('helvetica', 'normal');
    items.forEach(item => {
      if (yPos > 250) { // Check if we need a new page
        doc.addPage();
        yPos = 20;
      }
      
      xPos = margin;
      doc.text(item.description, xPos, yPos);
      xPos += colWidths[0];
      doc.text(item.quantity.toString(), xPos, yPos);
      xPos += colWidths[1];
      doc.text(`₦${item.rate.toFixed(2)}`, xPos, yPos);
      xPos += colWidths[2];
      doc.text(`₦${item.total.toFixed(2)}`, xPos, yPos);
      yPos += 10;
    });

    // Add total
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ₦${updateTotal().toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' });

    // Add footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your business!', pageWidth / 2, 280, { align: 'center' });

    // Save the PDF
    doc.save(`invoice-${clientName}-${invoiceDate}.pdf`);
  };

  return (
    <div className="container">
      <h1>🧾 Invoice Generator</h1>

      <label htmlFor="clientName">Client Name</label>
      <input
        id="clientName"
        type="text"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        placeholder="e.g. John Doe"
      />

      <label htmlFor="invoiceDate">Invoice Date</label>
      <input
        id="invoiceDate"
        type="date"
        value={invoiceDate}
        onChange={(e) => setInvoiceDate(e.target.value)}
      />

      <h3>Items</h3>
      <table id="invoiceTable">
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  aria-label={`Item ${index + 1} description`}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                  aria-label={`Item ${index + 1} quantity`}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={item.rate}
                  onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                  aria-label={`Item ${index + 1} rate`}
                />
              </td>
              <td className="row-total">₦{item.total.toFixed(2)}</td>
              <td>
                <button 
                  onClick={() => removeRow(index)}
                  aria-label={`Remove item ${index + 1}`}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addRow}>➕ Add Item</button>

      <div className="total">
        Total: ₦{updateTotal().toFixed(2)}
      </div>

      <div className="actions">
        <button onClick={exportInvoice}>📄 Export as PDF</button>
        <a href="/"><button>⬅️ Back to Dashboard</button></a>
      </div>
    </div>
  );
};

export default InvoiceGenerator; 