import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Search, 
  Package, 
  CheckCircle2, 
  Truck, 
  Clock, 
  ShieldCheck, 
  Download, 
  Eye,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatETB, formatDate, getOrderStatusInfo, getPaymentStatusInfo } from '../../utils/formatters';
import { downloadOrderReceipt } from '../../utils/pdfGenerator';

/**
 * About Page Component
 */
export const AboutView: React.FC = () => {
  const { settings, setActiveView } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in">
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-bold text-xs uppercase tracking-wider">
          Nagu Saabsan
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Ku Soo Dhawoow Dukaanka Fuad E-Commerce
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Dukaanka ugu ballaaran uguna casrisan ee internetka ee Shinile, Deegaanka Soomaalida Itoobiya.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div>
          <h2 className="font-extrabold text-slate-900 text-base sm:text-lg mb-2">
            Hadafkayaga (Our Mission)
          </h2>
          <p>
            {settings.aboutContent} Waxaan dhisnay Fuad E-Commerce si aan bulshada ku nool degmada Shinile, magaalada Dire Dawa, Jigjiga, Harar, iyo dhammaan gobollada dalka Itoobiya ugu fududeyno inay si nabadgelyo iyo kalsooni leh alaab tayo sare leh uga dalbadaan internetka iyagoo isticmaalaya lacagta Birr-ka Itoobiya (ETB).
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Xarunta Dhexe: Shinile, Somali Region</span>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            "Alaabta Fuad E-Commerce waxaa laga dalban karaa meel kasta oo Itoobiya ah. Gaarsiinta waxaa laga maamulaa Shinile."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="font-bold text-slate-900">Alaab Tayo Leh</h3>
            <p className="text-xs text-slate-500">Dhammaan alaabtayada waxaa lagu soo xushay tayo sare iyo qiimo macquul ah.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="font-bold text-slate-900">Bixi Telebirr & CBE</h3>
            <p className="text-xs text-slate-500">Kuma khasbinno kaarar qalaad — waxaad ku bixin kartaa Telebirr, CBE Bank ama E-Birr.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="font-bold text-slate-900">Gaarsiin Toos ah</h3>
            <p className="text-xs text-slate-500">Xirmooyin sugan oo laguugu keeno goobtaada iyo xaafaddaada.</p>
          </div>
        </div>

        <div className="pt-4 text-center">
          <button
            onClick={() => setActiveView('products')}
            className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition shadow-md"
          >
            Bilow Wax Iibsiga Hadda →
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Contact Us Page Component
 */
export const ContactView: React.FC = () => {
  const { settings, showToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const cleanWhatsappNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    'Asc Fuad E-Commerce! Waxaan rabaa inaan idinla soo xiriiro.'
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Farriintaada si guul leh ayaa loo diray! Goor dhow ayaan kula soo xiriiri doonnaa.');
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in">
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider">
          Nala Soo Xiriir
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Waxaan Halkan U Joognaa Inaan Ku Caawinno
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Su'aal ma ka qabtaa alaabta, lacag-bixinta, ama gaarsiinta? Nagala soo xiriir taleefan ama WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Contact Info Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
          <h2 className="font-extrabold text-lg text-white">Xafiiska Fuad E-Commerce</h2>
          
          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Goobta Ganacsiga:</p>
                <p>{settings.locationFull}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Degmada Shinile, Somali Region, Ethiopia</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Taleefanka:</p>
                <a href={`tel:${settings.contactPhone}`} className="hover:text-white font-mono">
                  {settings.contactPhone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">WhatsApp-ka Tooska ah:</p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-mono">
                  {settings.whatsappNumber}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Email:</p>
                <p>{settings.contactEmail}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Fur WhatsApp-ka Dukaanka</span>
            </a>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="font-extrabold text-slate-900 text-base sm:text-lg mb-1">
            Noo Soo Dir Farriin
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Waxaan kaaga soo jawaabi doonnaa waqti aad u kooban.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Magacaaga *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Magacaaga oo buuxa"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Lambarkaaga Taleefanka *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0915234567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Farriintaada *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Maxaan kugu caawinnaa?"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
            >
              Dir Farriinta
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

/**
 * Public Order Tracking Page Component
 */
export const TrackOrderView: React.FC = () => {
  const { orders, settings, setReceiptModalOrder } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setNotFound(false);
    const clean = searchTerm.trim().toLowerCase();
    if (!clean) return;

    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === clean ||
        o.receiptNumber.toLowerCase() === clean ||
        o.customerPhone.includes(clean)
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchedOrder(null);
      setNotFound(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in">
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-bold text-xs uppercase tracking-wider">
          La Soco Dalabkaaga
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Baadi-Goobka & Xaaladda Dalabkaaga
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Geli Lambarka Dalabkaaga (Tusaale: FUAD-2026-1001) ama Taleefankaaga si aad u aragto meesha ay alaabtu kuu marayso.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-lg mx-auto">
        <div className="relative flex items-center">
          <input
            type="text"
            required
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Geli Order ID ama Taleefankaaga..."
            className="w-full pl-10 pr-28 py-3 rounded-2xl border-2 border-slate-300 focus:outline-none focus:border-slate-900 text-xs sm:text-sm bg-white shadow-sm"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition"
          >
            Baadh
          </button>
        </div>
      </form>

      {/* Not Found Alert */}
      {notFound && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center max-w-md mx-auto">
          Lama helin dalab leh lambarka ama telefoonka aad gelisay. Fadlan hubi inaad si sax ah u qortay.
        </div>
      )}

      {/* Searched Order Details & Visual Timeline */}
      {searchedOrder && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-slate-900 text-lg">
                  Dalabka #{searchedOrder.id}
                </span>
                <span className="text-xs text-slate-400 font-mono">({searchedOrder.receiptNumber})</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                La gudbiyay: {formatDate(searchedOrder.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                getOrderStatusInfo(searchedOrder.orderStatus).colorClass
              }`}>
                {getOrderStatusInfo(searchedOrder.orderStatus).labelSo}
              </span>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Socodka Dalabka (Timeline):
            </h4>

            <div className="space-y-3">
              {[
                { step: 'dalabka_la_helay', label: '1. Dalabka Waa La Helay' },
                { step: 'waa_la_xaqiijiyay', label: '2. Waa La Xaqiijiyay' },
                { step: 'diyaarinta_alaabta', label: '3. Diyaarinta Alaabta' },
                { step: 'waa_la_soo_diray', label: '4. Waa La Soo Diray (Shinile Hub)' },
                { step: 'waa_la_dhiibayaa', label: '5. Waa La Dhiibayaa (Out for Delivery)' },
                { step: 'waa_la_gaarsiiyay', label: '6. Waa La Gaarsiiyay' },
              ].map((st, i) => {
                const currentIdx = getOrderStatusInfo(searchedOrder.orderStatus).stepIndex;
                const stepNum = i + 1;
                const isDone = currentIdx >= stepNum;
                const isCurrent = currentIdx === stepNum;

                return (
                  <div key={st.step} className="flex items-center gap-3 text-xs">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0 ${
                      isDone 
                        ? 'bg-emerald-600 text-white' 
                        : isCurrent 
                        ? 'bg-orange-600 text-white animate-pulse' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isDone ? '✓' : stepNum}
                    </div>
                    <span className={`font-semibold ${isDone ? 'text-slate-900 font-bold' : isCurrent ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block mb-1">Goobta Gaarsiinta:</span>
              <p>Magaalada: <strong>{searchedOrder.deliveryAddress.cityOrTown}, {searchedOrder.deliveryAddress.region}</strong></p>
              <p>Goobta u dhow: <strong>{searchedOrder.deliveryAddress.landmark}</strong></p>
              <p>Qiyaasta Waqtiga: <strong>{searchedOrder.estimatedDeliveryDays}</strong></p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block mb-1">Xogta Lacag-bixinta:</span>
              <p>Wadarta Guud: <strong className="text-orange-600 text-sm font-extrabold">{formatETB(searchedOrder.total)}</strong></p>
              <p>Xaaladda: <strong className={getPaymentStatusInfo(searchedOrder.paymentStatus).isVerified ? 'text-emerald-700' : 'text-amber-700'}>
                {getPaymentStatusInfo(searchedOrder.paymentStatus).labelSo}
              </strong></p>
              {searchedOrder.paymentReference && (
                <p className="font-mono text-slate-500">Ref: {searchedOrder.paymentReference}</p>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => downloadOrderReceipt(searchedOrder, settings)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition"
            >
              <Download className="w-3.5 h-3.5 text-orange-400" />
              <span>Soo Dejiso Resiidka (PDF)</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

/**
 * Terms and Conditions Page
 */
export const TermsView: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6 animate-in fade-in text-xs sm:text-sm text-slate-700 leading-relaxed">
      <h1 className="text-2xl font-extrabold text-slate-900">
        Shuruudaha & Adeegga (Terms and Conditions)
      </h1>
      <p className="text-slate-500">La cusboonaysiiyay: Febraayo 2026 • Shinile, Itoobiya</p>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="font-bold text-slate-900 text-base">1. Xarunta iyo Gaarsiinta</h2>
        <p>
          Dukaanka Fuad E-Commerce wuxuu fadhigiisu yahay degmada Shinile ee Deegaanka Soomaalida Itoobiya. Alaabta waxaa laga dalban karaa gobol kasta oo Itoobiya ah waxaana laga maamulaa Shinile Logistics Hub.
        </p>

        <h2 className="font-bold text-slate-900 text-base">2. Lacagta & Bixinta (ETB)</h2>
        <p>
          Dhammaan qiimayaasha alaabta waxaa lagu qeexaa Birr-ka Itoobiya (ETB). Lacagaha waxaa lagu bixin karaa Telebirr, Commercial Bank of Ethiopia (CBE), ama E-Birr. Maamulku wuxuu xaqiijiyaa tixraaca ka hor inta aan alaabta la soo dirin.
        </p>

        <h2 className="font-bold text-slate-900 text-base">3. Joojinta Dalabka</h2>
        <p>
          Macaamiishu waxay dalabka joojin karaan kaliya inta uu ku jiro heerarka "Dalabka Waa La Helay" ama "Waa La Xaqiijiyay" ka hor inta aan la soo dirin.
        </p>
      </div>
    </div>
  );
};

/**
 * Privacy Policy Page
 */
export const PrivacyView: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6 animate-in fade-in text-xs sm:text-sm text-slate-700 leading-relaxed">
      <h1 className="text-2xl font-extrabold text-slate-900">
        Ilaalinta Xogta Gaarka ah (Privacy Policy)
      </h1>
      <p className="text-slate-500">La cusboonaysiiyay: Febraayo 2026 • Shinile, Itoobiya</p>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="font-bold text-slate-900 text-base">1. Xogta Aan Ururinno</h2>
        <p>
          Waxaan ururinaa oo kaliya magacaaga, lambarkaaga taleefanka, iyo goobtaada gaarsiinta (Magaalada, Kebele, iyo Landmark) si aan si toos ah kuugu keeno dalabkaaga.
        </p>

        <h2 className="font-bold text-slate-900 text-base">2. Amniga Lacag-bixinta</h2>
        <p>
          Fuad E-Commerce weligeed kuma weydiinayso PIN, password, ama OTP-ga bangigaaga. Waxaan kaliya kaydinnaa tixraaca rasmiga ah ee Telebirr/CBE si xaqiijin loogu sameeyo.
        </p>

        <h2 className="font-bold text-slate-900 text-base">3. Ilaalinta Qaanuuniga ah</h2>
        <p>
          Xogtaada lama wadaago cid kale ama shirkado xayaysiis. Waxaa loo isticmaalaa oo kaliya fulinta adeegga dukaanka Fuad E-Commerce.
        </p>
      </div>
    </div>
  );
};
