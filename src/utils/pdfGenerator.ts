import { jsPDF } from 'jspdf';
import { Order, StoreSettings } from '../types';
import { formatETB, formatDate, getOrderStatusInfo, getPaymentMethodName, getPaymentStatusInfo } from './formatters';

export function generateOrderReceiptPDF(order: Order, settings: StoreSettings): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [15, 23, 42]; // #0f172a navy
  const accentColor = [234, 88, 12];  // #ea580c orange
  const mutedColor = [100, 116, 139]; // #64748b slate
  const lightBg = [248, 250, 252];    // #f8fafc

  // Header Banner Background
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 42, 'F');

  // Decorative Accent stripe
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(0, 42, 210, 2.5, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('FUAD E-COMMERCE', 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text('Shinile, Somali Region, Ethiopia | Dukaanka Casriga ah', 14, 25);
  doc.text(`Tel: ${settings.contactPhone} | WhatsApp: ${settings.whatsappNumber}`, 14, 31);
  doc.text(`Email: ${settings.contactEmail}`, 14, 37);

  // Right Side Header: RECEIPT / RESIIT
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(251, 146, 60); // Orange
  doc.text('RESIIDKA DALABKA', 196, 18, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text(`Tirada Resiidka: ${order.receiptNumber}`, 196, 26, { align: 'right' });
  doc.text(`Taariikhda: ${formatDate(order.createdAt)}`, 196, 32, { align: 'right' });
  doc.text(`Dalabka #: ${order.id}`, 196, 38, { align: 'right' });

  // Two columns for Customer Details & Delivery Details
  let currentY = 54;

  // Box 1: Customer Details
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(14, currentY, 88, 38, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, 88, 38, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('XOGTA MACMIILKA (Customer Details)', 18, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Magaca: ${order.customerName}`, 18, currentY + 14);
  doc.text(`Telefoonka: ${order.customerPhone}`, 18, currentY + 20);
  if (order.customerEmail) {
    doc.text(`Email: ${order.customerEmail}`, 18, currentY + 26);
  }
  doc.text(`ID-ga Macmiilka: ${order.customerId.slice(0, 14)}`, 18, currentY + 32);

  // Box 2: Delivery Address
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(108, currentY, 88, 38, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(108, currentY, 88, 38, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('GOOBTA GAARSIINTA (Delivery Address)', 112, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const addr = order.deliveryAddress;
  doc.text(`Magaalada / Deegaanka: ${addr.cityOrTown}, ${addr.region}`, 112, currentY + 14);
  if (addr.kebele) doc.text(`Kebele / Xaafadda: ${addr.kebele}`, 112, currentY + 20);
  doc.text(`Goobta u dhow (Landmark): ${addr.landmark}`, 112, currentY + 26);
  doc.text(`Maamulka Gaarsiinta: Shinile Hub -> ${addr.cityOrTown}`, 112, currentY + 32);

  currentY = 100;

  // Table Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(14, currentY, 182, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('ALAABTA (Item Description)', 18, currentY + 5.5);
  doc.text('XABBO (Qty)', 115, currentY + 5.5, { align: 'center' });
  doc.text('QIIMAHA (Unit Price)', 148, currentY + 5.5, { align: 'right' });
  doc.text('ISUGAYN (Total ETB)', 192, currentY + 5.5, { align: 'right' });

  currentY += 8;

  // Item rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  let isEven = false;

  order.items.forEach((item) => {
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, 182, 8, 'F');
    }
    doc.setDrawColor(241, 245, 249);
    doc.line(14, currentY + 8, 196, currentY + 8);

    doc.setTextColor(15, 23, 42);
    // Truncate item name if too long
    const cleanName = item.productName.length > 45 ? item.productName.slice(0, 42) + '...' : item.productName;
    doc.text(cleanName, 18, currentY + 5.5);
    doc.text(item.quantity.toString(), 115, currentY + 5.5, { align: 'center' });
    doc.text(formatETB(item.unitPrice), 148, currentY + 5.5, { align: 'right' });
    doc.text(formatETB(item.totalPrice), 192, currentY + 5.5, { align: 'right' });

    currentY += 8;
    isEven = !isEven;
  });

  // Space before summary
  currentY += 4;

  // Summary box on right
  const summaryX = 118;
  const summaryWidth = 78;

  doc.setDrawColor(226, 232, 240);
  doc.line(summaryX, currentY, 196, currentY);

  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Wadarta Alaabta (Subtotal):', summaryX, currentY + 6);
  doc.text(formatETB(order.subtotal), 194, currentY + 6, { align: 'right' });

  // Delivery Fee
  doc.text('Kharashka Gaarsiinta (Delivery):', summaryX, currentY + 12);
  doc.text(formatETB(order.deliveryFee), 194, currentY + 12, { align: 'right' });

  // Discount if any
  if (order.discountAmount > 0) {
    doc.setTextColor(22, 101, 52); // green
    doc.text('Qiimo Dhimis (Discount):', summaryX, currentY + 18);
    doc.text(`-${formatETB(order.discountAmount)}`, 194, currentY + 18, { align: 'right' });
    currentY += 6;
  }

  // Total Box
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.roundedRect(summaryX, currentY + 16, summaryWidth, 11, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('ISUGAYN GUUD (TOTAL):', summaryX + 4, currentY + 23.5);
  doc.text(formatETB(order.total), 192, currentY + 23.5, { align: 'right' });

  // Payment & Order Status Box on Left
  const payBoxY = currentY - (order.discountAmount > 0 ? 6 : 0);
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(14, payBoxY, 95, 34, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, payBoxY, 95, 34, 2, 2, 'D');

  const payInfo = getPaymentStatusInfo(order.paymentStatus);
  const payMethod = getPaymentMethodName(order.paymentMethod);
  const orderStatusInfo = getOrderStatusInfo(order.orderStatus);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('XAALADDA LACAG-BIXINTA & DALABKA', 18, payBoxY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Habka Lacag-bixinta: ${payMethod.shortName}`, 18, payBoxY + 13);

  // Status highlight
  doc.setFont('helvetica', 'bold');
  if (payInfo.isVerified) {
    doc.setTextColor(22, 101, 52); // Green
    doc.text(`Lacagta: [ WAA LA XAQIIJIYAY / PAID ]`, 18, payBoxY + 19);
  } else {
    doc.setTextColor(194, 65, 12); // Amber
    doc.text(`Lacagta: [ ${payInfo.labelSo.toUpperCase()} ]`, 18, payBoxY + 19);
  }

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  if (order.paymentReference) {
    doc.text(`Tixraaca (Ref #): ${order.paymentReference}`, 18, payBoxY + 25);
  } else {
    doc.text(`Tixraaca: Lama bixin`, 18, payBoxY + 25);
  }
  doc.text(`Xaaladda Dalabka: ${orderStatusInfo.labelSo}`, 18, payBoxY + 30);

  // Notice Banner for Pending Payment
  currentY += 34;
  if (!payInfo.isVerified) {
    doc.setFillColor(254, 243, 199); // amber 100
    doc.setDrawColor(245, 158, 11);
    doc.roundedRect(14, currentY, 182, 11, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(146, 64, 14); // amber 800
    doc.text('OGAYSIIS MUHIIM AH: Lacagta weli lama xaqiijin maamulka dukaanka.', 18, currentY + 5);
    doc.setFont('helvetica', 'normal');
    doc.text('Fadlan hubi inaad dirtay tixraaca Telebirr/CBE ama la xiriir WhatsApp-ka Fuad E-Commerce.', 18, currentY + 9);
    currentY += 15;
  } else {
    currentY += 4;
  }

  // Footer and Official Statement
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 266, 196, 266);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text('"Alaabta Fuad E-Commerce waxaa laga dalban karaa meel kasta oo Itoobiya ah. Gaarsiinta waxaa laga maamulaa Shinile."', 105, 272, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`Fuad E-Commerce • Shinile, Somali Region, Ethiopia • Mahadsanid, macaamil sharaf leh!`, 105, 277, { align: 'center' });
  doc.text(`Generated on ${new Date().toISOString()}`, 105, 282, { align: 'center' });

  return doc;
}

export function downloadOrderReceipt(order: Order, settings: StoreSettings) {
  const doc = generateOrderReceiptPDF(order, settings);
  doc.save(`Fuad_Receipt_${order.id}.pdf`);
}
