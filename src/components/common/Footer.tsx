import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, setActiveView, categories, setActiveCategory, isAdmin, loginAsDesignatedAdmin } = useStore();

  const cleanWhatsappNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    'Asc Fuad E-Commerce! Waxaan rabaa inaan wax ka ogaado dalabkayga.'
  )}`;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800 text-xs sm:text-sm">
      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 pb-10 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Gaarsiin Itoobiya oo Dhan</h4>
              <p className="text-slate-400 text-xs mt-0.5">Laga bilaabo Shinile ilaa Addis, Jigjiga & Harar.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Lacag-bixin Fudud (ETB)</h4>
              <p className="text-slate-400 text-xs mt-0.5">Telebirr, CBE Bank Transfer, E-Birr & Cash.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Alaab Tayo Leh</h4>
              <p className="text-slate-400 text-xs mt-0.5">Alaab asal ah oo qiimo macquul ah lagu iibiyo.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Adeeg Macmiil Joogto ah</h4>
              <p className="text-slate-400 text-xs mt-0.5">Nala hadal WhatsApp xilli kasta oo aad u baahato.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-extrabold flex items-center justify-center">
                F
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">FUAD E-COMMERCE</span>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed">
              Dukaanka ugu ballaaran ee internetka ee Shinile, Somali Region, Ethiopia. Waxaan bulshada u fududeynaa helitaanka alaab tayo leh oo qiimo jaban.
            </p>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300">
              <span className="text-orange-400 font-semibold">Shinile Hub: </span>
              "Alaabta Fuad E-Commerce waxaa laga dalban karaa meel kasta oo Itoobiya ah. Gaarsiinta waxaa laga maamulaa Shinile."
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Qaybaha Alaabta</h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setActiveView('products');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition hover:underline"
                  >
                    {cat.nameSo} ({cat.nameEn})
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setActiveView('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-orange-400 hover:text-orange-300 font-semibold"
                >
                  Dhammaan Alaabta →
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Adeegga Macmiilka</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveView('track-order');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  La Soco Dalabkaaga (Order Tracking)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('customer-panel');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Koontadayda & Resiidyadayda
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Nagu Saabsan (About Fuad)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('terms');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Shuruudaha & Adeegga (Terms)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('privacy');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Ilaalinta Xogta (Privacy Policy)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details & Payment Gateways */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm mb-2">Nala Soo Xiriir</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{settings.locationFull}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={`tel:${settings.contactPhone}`} className="hover:text-white">
                  {settings.contactPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-semibold">
                  WhatsApp: {settings.whatsappNumber}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
            </div>

            {/* Supported Payment Methods Badges */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Hababka Lacag-Bixinta ee Birr (ETB):
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-emerald-400 border border-emerald-900/50">
                  Telebirr
                </span>
                <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-purple-400 border border-purple-900/50">
                  CBE Bank
                </span>
                <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-amber-400 border border-amber-900/50">
                  E-Birr
                </span>
                <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
                  Cash on Delivery
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © {new Date().getFullYear()} Fuad E-Commerce. Shinile, Somali Region, Ethiopia. Xuquuqda oo dhan way dhowran tahay.
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (isAdmin) {
                setActiveView('admin-panel');
              } else {
                loginAsDesignatedAdmin();
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-slate-400 hover:text-orange-400 text-xs flex items-center gap-1 font-semibold transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
            <span>Xafiiska Maamulka (Admin Portal)</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
