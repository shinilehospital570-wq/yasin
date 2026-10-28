import React from 'react';
import { X, Download, Printer, ShieldCheck, MapPin, AlertTriangle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatETB, formatDate, getPaymentMethodName, getPaymentStatusInfo } from '../../utils/formatters';
import { downloadOrderReceipt } from '../../utils/pdfGenerator';

export const ReceiptModal: React.FC = () => {
  const { receiptModalOrder, setReceiptModalOrder, settings } = useStore();

  if (!receiptModalOrder) return null;

  const order = receiptModalOrder;
  const payInfo = getPaymentStatusInfo(order.paymentStatus);
  const payMethod = getPaymentMethodName(order.paymentMethod);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Action Toolbar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Resiidka Rasmiga ah (Receipt)</span>
            <span className="text-xs text-orange-400 font-mono">#{order.receiptNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadOrderReceipt(order, settings)}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Soo Dejiso PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Daabac</span>
            </button>

            <button
              onClick={() => setReceiptModalOrder(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm" id="printable-receipt">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-orange-400 font-extrabold text-sm flex items-center justify-center">
                  F
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  FUAD E-COMMERCE
                </h1>
              </div>
              <p className="text-xs text-slate-500">Shinile, Somali Region, Ethiopia</p>
              <p className="text-xs text-slate-500">Tel: {settings.contactPhone} | WhatsApp: {settings.whatsappNumber}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-base sm:text-lg font-bold text-orange-600 uppercase tracking-wider block">
                RESIIDKA DALABKA
              </span>
              <p className="font-mono font-bold text-slate-900 mt-1">Resiid #: {order.receiptNumber}</p>
              <p className="font-mono text-slate-600">Dalabka #: {order.id}</p>
              <p className="text-slate-500">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Xogta Macmiilka:
              </h4>
              <p className="font-bold text-slate-900">{order.customerName}</p>
              <p className="text-slate-600">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-slate-500">{order.customerEmail}</p>}
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Goobta Gaarsiinta:
              </h4>
              <p className="font-semibold text-slate-900">{order.deliveryAddress.cityOrTown}, {order.deliveryAddress.region}</p>
              <p className="text-slate-600">{order.deliveryAddress.landmark}</p>
              {order.deliveryAddress.kebele && <p className="text-slate-500">Kebele: {order.deliveryAddress.kebele}</p>}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Alaabta (Description)</th>
                  <th className="py-2.5 px-3 text-center">Xabbo (Qty)</th>
                  <th className="py-2.5 px-3 text-right">Qiimaha (Price)</th>
                  <th className="py-2.5 px-3 text-right">Isugayn (ETB)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{item.productName}</td>
                    <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right">{formatETB(item.unitPrice)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatETB(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            
            {/* Payment Status Box */}
            <div className="w-full sm:w-1/2 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <p className="font-bold text-slate-900">Habka Lacag-Bixinta:</p>
              <p className="text-slate-700">{payMethod.nameSo}</p>
              
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block mb-0.5">Xaaladda Lacagta:</span>
                <span className={`inline-block font-extrabold px-2.5 py-0.5 rounded-md border text-xs ${
                  payInfo.isVerified ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}>
                  {payInfo.labelSo}
                </span>
              </div>

              {order.paymentReference && (
                <p className="text-[11px] font-mono text-slate-600 pt-1">
                  Tixraaca: {order.paymentReference}
                </p>
              )}
            </div>

            {/* Subtotal & Total */}
            <div className="w-full sm:w-1/2 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Wadarta Alaabta:</span>
                <span className="font-bold text-slate-900">{formatETB(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Kharashka Gaarsiinta:</span>
                <span className="font-bold text-slate-900">{formatETB(order.deliveryFee)}</span>
              </div>
              <div className="pt-2 border-t-2 border-slate-900 flex justify-between font-extrabold text-base text-slate-900">
                <span>WADARTA GUUD (TOTAL):</span>
                <span className="text-orange-600 text-lg">{formatETB(order.total)}</span>
              </div>
            </div>

          </div>

          {/* Transparent Notice if Unpaid */}
          {!payInfo.isVerified && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Ogaysiis:</strong> Resiidkan waxaa ku cad in lacagta weli la sugayo xaqiijinteeda rasmiga ah.
              </span>
            </div>
          )}

          {/* Footer Statement */}
          <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-500 space-y-1">
            <p className="italic">"Alaabta Fuad E-Commerce waxaa laga dalban karaa meel kasta oo Itoobiya ah. Gaarsiinta waxaa laga maamulaa Shinile."</p>
            <p className="font-semibold text-slate-700">Fuad E-Commerce • Mahadsanid, macaamil sharaf leh!</p>
          </div>

        </div>

      </div>
    </div>
  );
};
