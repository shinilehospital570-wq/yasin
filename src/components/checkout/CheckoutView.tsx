import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  Printer, 
  MessageCircle, 
  ArrowLeft,
  Upload,
  Info,
  Clock,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../context/StoreContext';
import { EthiopianAddress, PaymentMethod } from '../../types';
import { formatETB, getPaymentMethodName } from '../../utils/formatters';
import { downloadOrderReceipt } from '../../utils/pdfGenerator';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    deliveryZones, 
    settings, 
    paymentConfig, 
    currentUser, 
    createOrder, 
    setActiveView,
    orders,
    setReceiptModalOrder
  } = useStore();

  // If cart is empty and no confirmed order yet
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Address form
  const [address, setAddress] = useState<EthiopianAddress>({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    altPhone: '',
    region: 'Somali Region',
    cityOrTown: 'Shinile',
    kebele: '01',
    streetOrHouse: '',
    landmark: 'U dhow Cisbitaalka Shinile',
    notes: '',
  });

  // Selected Zone
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-shinile');

  // Payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('telebirr');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentProofFile, setPaymentProofFile] = useState<string | null>(null);

  // Calculate delivery fee
  const currentZone = deliveryZones.find((z) => z.id === selectedZoneId) || deliveryZones[0];
  const isFreeDelivery = currentZone?.isFreeEligible && currentZone.minOrderForFreeDelivery && cartSubtotal >= currentZone.minOrderForFreeDelivery;
  const deliveryFee = isFreeDelivery ? 0 : (currentZone ? currentZone.fee : settings.defaultDeliveryFee);
  const authoritativeTotal = cartSubtotal + deliveryFee;

  // Handle proof upload
  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!address.fullName.trim()) {
      setErrorMessage('Fadlan qor magacaaga oo buuxa.');
      return;
    }

    if (!address.phone.trim() || address.phone.length < 9) {
      setErrorMessage('Fadlan qor lambarkaaga taleefanka oo sax ah (Tusaale: 0915234567 ama +251 915...).');
      return;
    }

    if (!address.cityOrTown.trim()) {
      setErrorMessage('Fadlan geli magaalada aad ku sugan tahay.');
      return;
    }

    if (!address.landmark.trim()) {
      setErrorMessage('Fadlan xus meel caan ah oo aad u dhowdahay (Landmark).');
      return;
    }

    // Require transaction reference for electronic payments if not Cash on Delivery
    if (selectedPaymentMethod !== 'cash_on_delivery' && !paymentReference.trim()) {
      setErrorMessage('Fadlan geli Tixraaca Lacag-bixinta (Transaction ID) ee Telebirr/CBE/E-Birr.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createOrder(
        address,
        selectedPaymentMethod,
        paymentReference,
        paymentProofFile || undefined,
        selectedZoneId
      );

      if (res.success && res.orderId) {
        setCompletedOrderId(res.orderId);
        // Celebration confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      } else {
        setErrorMessage(res.error || 'Khalad ayaa dhacay intii lagu guda jiray qabashada dalabka.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Khalad ayaa dhacay.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If an order has just been completed, show success screen
  if (completedOrderId) {
    const savedOrder = orders.find((o) => o.id === completedOrderId);
    const cleanWhatsapp = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const payMethodName = savedOrder ? getPaymentMethodName(savedOrder.paymentMethod).nameSo : selectedPaymentMethod;

    const whatsappOrderSummary = `Asc Fuad E-Commerce! Waxaan soo diray dalab cusub:
*Dalabka #:* ${savedOrder?.id || completedOrderId}
*Tirada Resiidka:* ${savedOrder?.receiptNumber}
*Wadarta Guud:* ${formatETB(savedOrder?.total || authoritativeTotal)}
*Magaalada:* ${address.cityOrTown}, ${address.region}
*Habka Lacag-bixinta:* ${payMethodName}
*Tixraaca (TXN ID):* ${savedOrder?.paymentReference || 'Cash on Delivery'}
*Magaca:* ${address.fullName}
*Taleefanka:* ${address.phone}

Fadlan ii xaqiiji dalabkayga iyo gaarsiinta Shinile.`;

    const whatsappLink = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(whatsappOrderSummary)}`;

    return (
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 animate-in fade-in">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 text-center">
          
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-3 uppercase tracking-wider">
            Dalabkaagu Wuu Guulaystay
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Mahadsanid, {address.fullName}!
          </h1>

          <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6">
            Dalabkaaga lambarkiisu yahay <strong className="text-slate-900 font-mono">#{completedOrderId}</strong> si buuxda ayaa loogu diiwaangeliyay nidaamka Fuad E-Commerce ee xarunta Shinile.
          </p>

          {/* Payment Status Transparency Card */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-left mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-900">
                <p className="font-bold text-amber-950 mb-1">
                  Xaaladda Lacag-bixinta: "Lacagta Weli Lama Xaqiijin" (Pending Verification)
                </p>
                <p className="text-amber-800 leading-relaxed">
                  Maamulka dukaanku wuxuu si toos ah u xaqiijin doonaa tixraacaada Telebirr/CBE ({paymentReference || 'Lama bixin'}). Marka la xaqiijiyo, xaaladdu waxay isku beddeli doontaa <strong>Waa La Xaqiijiyay (Paid)</strong> waxaana bilaabanaysa diyaarinta alaabtaada.
                </p>
              </div>
            </div>
          </div>

          {/* Order Details Quick Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 text-left mb-8 space-y-2">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Tirada Resiidka:</span>
              <span className="font-mono font-bold text-slate-900">{savedOrder?.receiptNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Wadarta Guud ee Birr (ETB):</span>
              <span className="font-extrabold text-orange-600 text-base">{formatETB(savedOrder?.total)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Goobta Gaarsiinta:</span>
              <span className="font-medium text-slate-900">{address.cityOrTown}, {address.region} ({address.landmark})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Xilliga Lagu Qiyaasay:</span>
              <span className="font-medium text-slate-900">{savedOrder?.estimatedDeliveryDays}</span>
            </div>
          </div>

          {/* Action Buttons: PDF Receipt Download & WhatsApp Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {savedOrder && (
              <button
                onClick={() => downloadOrderReceipt(savedOrder, settings)}
                className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-95"
              >
                <Download className="w-4 h-4 text-orange-400" />
                <span>Soo Dejiso Resiidka (Download PDF)</span>
              </button>
            )}

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>U Dir Koontada WhatsApp-ka</span>
            </a>
          </div>

          {/* Secondary Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
            {savedOrder && (
              <button
                onClick={() => setReceiptModalOrder(savedOrder)}
                className="text-slate-800 hover:text-orange-600 flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Daabac Resiidka (Print)</span>
              </button>
            )}

            <button
              onClick={() => setActiveView('customer-panel')}
              className="text-slate-800 hover:text-orange-600 flex items-center gap-1"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>La Soco Dalabkaaga (Track Order)</span>
            </button>

            <button
              onClick={() => setActiveView('products')}
              className="text-orange-600 hover:text-orange-700 font-bold"
            >
              Ku Laabo Dukaanka →
            </button>
          </div>

        </div>
      </div>
    );
  }

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Gaarigaagu waxba kuma jiraan</h2>
        <p className="text-xs text-slate-500 mb-6">
          Kuma sii gudbi kartid bixinta (Checkout) sababtoo ah ma jiraan alaab aad hadda dooratay.
        </p>
        <button
          onClick={() => setActiveView('products')}
          className="px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
        >
          Daawo Alaabta Dukaanka
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
      
      {/* Top Banner: Nationwide Delivery from Shinile */}
      <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between gap-4 border border-slate-700 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              Shinile Logistics Hub — Itoobiya oo Dhan
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-300">
              "Alaabta Fuad E-Commerce waxaa laga dalban karaa meel kasta oo Itoobiya ah. Gaarsiinta waxaa laga maamulaa Shinile."
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveView('cart')}
          className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ku laabo Gaariga</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Address & Payment Selection */}
        <div className="lg:col-span-7 space-y-8">
          
          <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-8">
            
            {/* 1. Address Section */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Goobta Gaarsiinta (Ethiopian Delivery Address)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Magacaaga oo Buuxa *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder="Tusaale: Ahmed Omar Hassan"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lambarka Taleefanka *
                  </label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="Tusaale: 0915234567 ama +251 915..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Delivery Zone Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Magaalada / Deegaanka aad ku sugan tahay *
                </label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => {
                    const zId = e.target.value;
                    setSelectedZoneId(zId);
                    const z = deliveryZones.find((item) => item.id === zId);
                    if (z) {
                      setAddress({ ...address, region: z.region, cityOrTown: z.city });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  {deliveryZones.filter(z => z.isActive).map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.nameSo} — {zone.fee === 0 ? 'Bilaash' : formatETB(zone.fee)} ({zone.estimatedTime})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kebele / Xaafadda (Haddii ay jirto)
                  </label>
                  <input
                    type="text"
                    value={address.kebele}
                    onChange={(e) => setAddress({ ...address, kebele: e.target.value })}
                    placeholder="Tusaale: Kebele 02 ama Xaafadda 1aad"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Goob Caanka ah oo aad u dhowdahay (Landmark) *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.landmark}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    placeholder="Tusaale: U dhow Masaajidka Weyn, Cisbitaalka, ama Saldhigga"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fariin Dheeraad ah oo Ku Saabsan Gaarsiinta (Ikhtiyaari)
                </label>
                <textarea
                  rows={2}
                  value={address.notes}
                  onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                  placeholder="Tusaale: Subaxda hore ayaan guriga joogaa..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            {/* 2. Payment Method Section */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Habka Lacag-Bixinta (Ethiopian Birr - ETB)
                </h3>
              </div>

              {/* Payment Security Alert */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-900">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5">Badbaadada Lacagtaada:</strong>
                  Fuad E-Commerce weligeed ku weydiin mayso lambarkaaga sirta ah (PIN), OTP, ama furaha bangigaaga. Waxaad kaliya soo gudbinaysaa Tixraaca (Transaction ID) ee bixinta ka dib.
                </div>
              </div>

              {/* Payment Radio Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Telebirr */}
                {paymentConfig.telebirr.enabled && (
                  <div
                    onClick={() => setSelectedPaymentMethod('telebirr')}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                      selectedPaymentMethod === 'telebirr'
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={selectedPaymentMethod === 'telebirr'}
                      onChange={() => setSelectedPaymentMethod('telebirr')}
                      className="mt-1 text-emerald-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block mb-1">
                        Telebirr
                      </span>
                      <p className="font-bold text-slate-900 text-sm">Telebirr (Ethio Telecom)</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Lambarka: {paymentConfig.telebirr.accountNumber}</p>
                    </div>
                  </div>
                )}

                {/* CBE Bank */}
                {paymentConfig.cbe.enabled && (
                  <div
                    onClick={() => setSelectedPaymentMethod('cbe')}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                      selectedPaymentMethod === 'cbe'
                        ? 'border-purple-500 bg-purple-50/50 ring-2 ring-purple-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={selectedPaymentMethod === 'cbe'}
                      onChange={() => setSelectedPaymentMethod('cbe')}
                      className="mt-1 text-purple-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md inline-block mb-1">
                        CBE Bank
                      </span>
                      <p className="font-bold text-slate-900 text-sm">Commercial Bank of Ethiopia</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Koontada: {paymentConfig.cbe.accountNumber}</p>
                    </div>
                  </div>
                )}

                {/* E-Birr */}
                {paymentConfig.ebirr.enabled && (
                  <div
                    onClick={() => setSelectedPaymentMethod('ebirr')}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                      selectedPaymentMethod === 'ebirr'
                        ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={selectedPaymentMethod === 'ebirr'}
                      onChange={() => setSelectedPaymentMethod('ebirr')}
                      className="mt-1 text-amber-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md inline-block mb-1">
                        E-Birr
                      </span>
                      <p className="font-bold text-slate-900 text-sm">E-Birr Mobile Money</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Lambarka: {paymentConfig.ebirr.accountNumber}</p>
                    </div>
                  </div>
                )}

                {/* Cash on Delivery */}
                {paymentConfig.cashOnDelivery.enabled && (
                  <div
                    onClick={() => setSelectedPaymentMethod('cash_on_delivery')}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                      selectedPaymentMethod === 'cash_on_delivery'
                        ? 'border-slate-800 bg-slate-100 ring-2 ring-slate-800/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={selectedPaymentMethod === 'cash_on_delivery'}
                      onChange={() => setSelectedPaymentMethod('cash_on_delivery')}
                      className="mt-1 text-slate-800"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded-md inline-block mb-1">
                        Cadaan (Cash)
                      </span>
                      <p className="font-bold text-slate-900 text-sm">Cash on Delivery</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Shinile & Dire Dawa oo kaliya</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Instructions Details Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-orange-600" />
                  <span>Tilmaamaha Bixinta Lacagta ({selectedPaymentMethod.toUpperCase()}):</span>
                </h4>

                {selectedPaymentMethod === 'telebirr' && (
                  <div className="text-xs text-slate-700 space-y-2 whitespace-pre-line leading-relaxed">
                    <p>{paymentConfig.telebirr.instructionsSo}</p>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-xs">
                      <strong>Magaca Ganacsiga:</strong> {paymentConfig.telebirr.merchantName}<br />
                      <strong>Lambarka Telebirr:</strong> {paymentConfig.telebirr.accountNumber}<br />
                      <strong>Wadarta Guud ee Birr:</strong> <span className="text-orange-600 font-bold">{formatETB(authoritativeTotal)}</span>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'cbe' && (
                  <div className="text-xs text-slate-700 space-y-2 whitespace-pre-line leading-relaxed">
                    <p>{paymentConfig.cbe.instructionsSo}</p>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-xs">
                      <strong>Bankiga:</strong> {paymentConfig.cbe.bankName}<br />
                      <strong>Magaca Koontada:</strong> {paymentConfig.cbe.accountName}<br />
                      <strong>Lambarka Koontada:</strong> {paymentConfig.cbe.accountNumber}<br />
                      <strong>Wadarta Guud ee Birr:</strong> <span className="text-orange-600 font-bold">{formatETB(authoritativeTotal)}</span>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'ebirr' && (
                  <div className="text-xs text-slate-700 space-y-2 whitespace-pre-line leading-relaxed">
                    <p>{paymentConfig.ebirr.instructionsSo}</p>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-xs">
                      <strong>Magaca:</strong> {paymentConfig.ebirr.merchantName}<br />
                      <strong>Lambarka:</strong> {paymentConfig.ebirr.accountNumber}<br />
                      <strong>Wadarta Guud ee Birr:</strong> <span className="text-orange-600 font-bold">{formatETB(authoritativeTotal)}</span>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'cash_on_delivery' && (
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {paymentConfig.cashOnDelivery.instructionsSo}
                  </p>
                )}

                {/* Transaction Reference Input */}
                {selectedPaymentMethod !== 'cash_on_delivery' && (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        Tixraaca Lacag-Bixinta (Transaction ID / Reference Number) *
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="Tusaale: TB98273645 ama CBE-FT260589"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Ka soo koobi garee SMS-ka Telebirr ama resiidka CBE ee laguugu soo diray telefoonka.
                      </p>
                    </div>

                    {/* Optional Screenshot Upload */}
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        Sawirka Resiidka / Screenshot (Ikhtiyaari):
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer transition">
                          <Upload className="w-3.5 h-3.5 text-slate-500" />
                          <span>Dooro Sawir</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProofUpload}
                            className="hidden"
                          />
                        </label>
                        {paymentProofFile && (
                          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Sawirka waa la doortay
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Place Order Mobile Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="lg:hidden w-full py-4 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-orange-600/30 transition active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Dalabka waa la qabanayaa...' : `Xaqiiji Dalabka (${formatETB(authoritativeTotal)})`}
            </button>

          </form>

        </div>

        {/* Right Sticky Sidebar: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm sticky top-24 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Soo Koobidda Dalabka
              </h3>
              <span className="text-xs font-bold text-slate-500">
                {cart.length} nooc oo alaab ah
              </span>
            </div>

            {/* Itemized List */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => {
                const prd = item.product;
                const unitPrice = prd.discountPrice ?? prd.price;
                return (
                  <div key={prd.id} className="flex items-center justify-between gap-3 text-xs">
                    <img
                      src={prd.imageUrl}
                      alt={prd.nameSo}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{prd.nameSo}</p>
                      <p className="text-slate-500">
                        {item.quantity} x {formatETB(unitPrice)}
                      </p>
                    </div>
                    <span className="font-extrabold text-slate-900 shrink-0">
                      {formatETB(unitPrice * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Financial Calculations in Birr */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Wadarta Alaabta (Subtotal):</span>
                <span className="font-bold text-slate-900">{formatETB(cartSubtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Kharashka Gaarsiinta ({currentZone?.city}):</span>
                <span className="font-bold text-slate-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">Bilaash (Free Delivery)</span>
                  ) : (
                    formatETB(deliveryFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-extrabold text-slate-900 block">WADARTA GUUD (TOTAL):</span>
                  <span className="text-[11px] text-slate-400">Dhammaan canshuuraha waa ku jiraan</span>
                </div>
                <span className="text-2xl font-extrabold text-orange-600">
                  {formatETB(authoritativeTotal)}
                </span>
              </div>
            </div>

            {/* Desktop Form Submit Trigger */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="hidden lg:flex w-full py-4 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-orange-600/30 transition items-center justify-center gap-2 active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>Fadlan sug, dalabka ayaa la qabanayaa...</span>
              ) : (
                <span>Xaqiiji Dalabka Hadda ({formatETB(authoritativeTotal)})</span>
              )}
            </button>

            {/* Guarantees */}
            <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Resiidka PDF waxaa la soo degsan karaa isla markiiba.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Xaqiijinta Telebirr & CBE waxaa gacanta ku haya maamulka.</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
