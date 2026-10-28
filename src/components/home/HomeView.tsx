import React from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  MessageCircle, 
  CheckCircle2, 
  Flame,
  Clock,
  Layers,
  Phone
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../catalog/ProductCard';
import { formatETB } from '../../utils/formatters';

export const HomeView: React.FC = () => {
  const { 
    settings, 
    products, 
    categories, 
    setActiveView, 
    setActiveCategory 
  } = useStore();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  const cleanWhatsappNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    'Asc Fuad E-Commerce! Waxaan rabaa inaan dalab ka sameeyo dukaankiina.'
  )}`;

  return (
    <div className="space-y-10 sm:space-y-14 pb-12">
      
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden py-14 sm:py-20 px-4 border-b border-slate-800/80 shadow-md">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-orange-400 text-xs font-semibold backdrop-blur-md shadow-xs">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>Shinile, Somali Region, Ethiopia</span>
                </div>
                <a
                  href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-600/20 border border-orange-500/40 text-orange-300 hover:text-white text-xs font-bold transition shadow-xs"
                >
                  <Phone className="w-3 h-3 text-orange-400" />
                  <span>{settings.contactPhone}</span>
                </a>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-[1.15] text-white">
                Ku Soo Dhawoow <span className="text-orange-500">Fuad E-Commerce</span> — Alaab Tayo Leh, Qiimo Macquul ah.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Dukaanka ugu casrisan ee Deegaanka Soomaalida. Ka dalbo dharka, kabaha, elektaroonigga iyo agabka guriga adigoo jooga meel kasta oo Itoobiya ah. Ku bixi <strong>Telebirr, CBE</strong> ama <strong>E-Birr</strong>.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setActiveView('products');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-600/25 transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Daawo Alaabta Hadda</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Nagala Hadal WhatsApp</span>
                </a>
              </div>

              {/* Feature Quick Pills */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Lacagta Birr-ka (ETB)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Telebirr & CBE Transfer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Gaarsiin Degdeg ah</span>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Grid */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-tr from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 border border-slate-700/80 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-orange-400">Xarunta Dhexe</span>
                    <h3 className="font-extrabold text-white text-base">Shinile Logistics & Store</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    Furan Hadda
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                        ETB
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Lacagta Rasmiga ah</p>
                        <p className="text-[11px] text-slate-400">Ethiopian Birr (1,500 Br format)</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-orange-400">100% Sugan</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Magaalooyinka Gaarsiinta</p>
                        <p className="text-[11px] text-slate-400">Shinile, Dire Dawa, Jigjiga, Harar, Addis</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">Itoobiya oo dhan</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Xiriirka Tooska ah</p>
                        <p className="text-[11px] text-slate-400">Wac ama WhatsApp</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`}
                      className="text-xs font-extrabold text-orange-400 hover:underline font-mono"
                    >
                      {settings.contactPhone}
                    </a>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
                  <span>Maamulaha: diisyasin@gmail.com</span>
                  <button 
                    onClick={() => setActiveView('about')}
                    className="text-orange-400 hover:underline"
                  >
                    Xog Dheeraad ah →
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Official Shinile Delivery Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                Gaarsiinta Rasmiga ah
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                "Alaabta Fuad E-Commerce waxaa laga dalban karaa meel kasta oo Itoobiya ah. Gaarsiinta waxaa laga maamulaa Shinile."
              </h2>
              <p className="text-xs sm:text-sm text-orange-100 max-w-2xl">
                Haddii aad ku sugan tahay Shinile, Dire Dawa, Jigjiga, Harar, Addis Ababa ama magaalo kasta oo kale, dalabkaagu wuxuu kugu soo gaarayaa waqti kooban.
              </p>
            </div>

            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveView('products');
              }}
              className="px-6 py-3 bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs sm:text-sm rounded-xl shadow-lg shrink-0 transition active:scale-95"
            >
              Bilow Wax Iibsiga
            </button>
          </div>
        </div>
      </section>

      {/* 3. Product Categories Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Qaybaha Alaabta (Categories)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Dooro qaybta aad doonayso inaad wax ka iibsato.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveCategory('all');
              setActiveView('products');
            }}
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Dhammaan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveView('products');
                }}
                className="group bg-white rounded-2xl border border-slate-200 p-4 text-center hover:border-orange-500/50 hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-orange-600 transition">
                  {cat.nameSo}
                </h3>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {count} Alaab
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Products (Alaabta Gaarka ah) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Alaabta Gaarka ah (Featured Products)
              </h2>
              <p className="text-xs text-slate-500">Alaab tayo sare leh oo lagu xushay qiimaha iyo baahida bulshada.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveCategory('all');
              setActiveView('products');
            }}
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Daawo Wax Badan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((prd) => (
            <ProductCard key={prd.id} product={prd} />
          ))}
        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Ugu Iibka Badan (Best Sellers)
              </h2>
              <p className="text-xs text-slate-500">Alaabooyinka ay macmiishu sida joogtada ah u doortaan.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {bestSellers.map((prd) => (
            <ProductCard key={prd.id} product={prd} />
          ))}
        </div>
      </section>

      {/* 6. Promotional Mid-Page Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 text-white grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-orange-600/30 text-orange-400 text-xs font-bold border border-orange-500/30">
              Fursad Gaar ah
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              Bixi Telebirr ama CBE, Hel Gaarsiin Degdeg ah
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dukaanka Fuad E-Commerce ma jiro wax lacag dheeraad ah oo qarsoon. Qiimaha aad aragto ee Birr-ka (ETB) ayaa ah midka saxda ah. Dalabkaaga waxaa laguugu keenayaa xirmo nabadgelyo leh.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
              <div>✓ Risid Rasmi ah (PDF)</div>
              <div>✓ Tixraac Sugan</div>
              <div>✓ Taageero Joogto ah</div>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Sida Loo Dalbado (3 Talaabo):</span>
            </h4>
            <ol className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center shrink-0">1</span>
                <span>Dooro alaabta aad u baahan tahay oo ku dar gaarigaaga (Cart).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center shrink-0">2</span>
                <span>Geli magaaladaada iyo goobtaada, ka dibna dooro Telebirr, CBE ama E-Birr.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center shrink-0">3</span>
                <span>Soo gudbi tixraaca lacag-bixinta, qaado resiidkaaga (PDF), oo sug gaarsiinta!</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* 7. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Alaab Cusub oo Soo Degtay (New Arrivals)
              </h2>
              <p className="text-xs text-slate-500">Dharkii ugu dambeeyay, elektaroonigga iyo agabka cusub.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {newArrivals.map((prd) => (
            <ProductCard key={prd.id} product={prd} />
          ))}
        </div>
      </section>

    </div>
  );
};
