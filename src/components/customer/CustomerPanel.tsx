import React, { useState } from 'react';
import { 
  User, 
  Package, 
  Clock, 
  MapPin, 
  FileText, 
  Key, 
  LogOut, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Eye, 
  Truck, 
  RotateCcw,
  Plus,
  ShieldCheck,
  Phone,
  Printer
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { formatETB, formatDate, getOrderStatusInfo, getPaymentMethodName, getPaymentStatusInfo } from '../../utils/formatters';
import { downloadOrderReceipt } from '../../utils/pdfGenerator';

type CustomerTab = 
  | 'dashboard'
  | 'orders'
  | 'tracking'
  | 'profile'
  | 'addresses'
  | 'receipts'
  | 'security';

export const CustomerPanel: React.FC = () => {
  const { 
    currentUser, 
    getCustomerOrders, 
    logout, 
    cancelOrder, 
    updateProfile, 
    settings, 
    setReceiptModalOrder,
    setActiveView,
    selectedOrderId,
    setSelectedOrderId
  } = useStore();

  const [activeTab, setActiveTab] = useState<CustomerTab>('dashboard');
  const [activeOrderForModal, setActiveOrderForModal] = useState<Order | null>(null);
  const [cancelModalOrderId, setCancelModalOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Profile Form state
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  // Customer orders strictly isolated
  const customerOrders = getCustomerOrders();

  // Metrics
  const totalOrders = customerOrders.length;
  const pendingOrders = customerOrders.filter(
    (o) => o.orderStatus !== 'waa_la_gaarsiiyay' && o.orderStatus !== 'waa_la_joojiyay'
  ).length;
  const deliveredOrders = customerOrders.filter((o) => o.orderStatus === 'waa_la_gaarsiiyay').length;

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Fadlan marka hore gal koontadaada</h2>
        <p className="text-xs text-slate-500 mb-6">
          Si aad u aragto dalabyadaada, ula socoto xaaladda gaarsiinta, ama u soo dejisato resiidyadaada.
        </p>
        <button
          onClick={() => setActiveView('home')}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
        >
          Ku Laabo Bogga Hore
        </button>
      </div>
    );
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(fullName, phone);
  };

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (cancelModalOrderId) {
      cancelOrder(cancelModalOrderId, cancelReason || 'Macmiilka ayaa codsaday joojin');
      setCancelModalOrderId(null);
      setCancelReason('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
      
      {/* Customer Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
            {currentUser.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Ku Soo Dhawoow, {currentUser.fullName}
              </h1>
              <span className="text-[10px] font-bold text-orange-400 bg-orange-950/60 border border-orange-800/60 px-2 py-0.5 rounded-full">
                Macaamil
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Email: {currentUser.email} • Tel: {currentUser.phone}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Ka Bax (Logout)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Navigation Sidebar */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4 text-orange-500" />
              <span>Warbixinta Guud (Dashboard)</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'orders'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-orange-500" />
                <span>Dalabyadayda (My Orders)</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'orders' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {totalOrders}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('receipts')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'receipts'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-orange-500" />
              <span>Resiidyada PDF (My Receipts)</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'profile'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4 text-orange-500" />
              <span>Xogtayda Gaarka ah (Profile)</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'security'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Key className="w-4 h-4 text-orange-500" />
              <span>Beddel Furaha Sirta ah</span>
            </button>
          </div>
        </div>

        {/* Right Tab Content */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Dhammaan Dalabyada</span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalOrders}</p>
                  <span className="text-[11px] text-slate-400">Dalabyada aad ka samaysay dukaanka</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-amber-700 font-medium">Dalabyada Socda (Pending)</span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{pendingOrders}</p>
                  <span className="text-[11px] text-slate-400">Diyaarinta & Gaarsiinta ku jira</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-emerald-700 font-medium">Guulaystay (Delivered)</span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">{deliveredOrders}</p>
                  <span className="text-[11px] text-slate-400">Alaabta aad gacanta ku dhigtay</span>
                </div>
              </div>

              {/* Recent Orders List */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Dalabyadii Ugu Dambeeyay (Recent Orders)
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700"
                  >
                    Daawo Dhammaan →
                  </button>
                </div>

                {customerOrders.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    Weli ma aadan samayn wax dalab ah.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {customerOrders.slice(0, 3).map((ord) => {
                      const statusInfo = getOrderStatusInfo(ord.orderStatus);
                      const payInfo = getPaymentStatusInfo(ord.paymentStatus);
                      return (
                        <div key={ord.id} className="p-4 sm:p-5 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900">{ord.id}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.colorClass}`}>
                                {statusInfo.labelSo}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              {formatDate(ord.createdAt)} • {ord.items.length} alaab • Magaalada: {ord.deliveryAddress.cityOrTown}
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3">
                            <span className="font-extrabold text-slate-900 text-sm">
                              {formatETB(ord.total)}
                            </span>
                            <button
                              onClick={() => setActiveOrderForModal(ord)}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Faahfaahin</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">
                  Dhammaan Dalabyadayda (My Orders)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kaliya dalabyadaada ayaa halkan lagu soo bandhigayaa (Customer Ownership Enforced).
                </p>
              </div>

              {customerOrders.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-800 text-sm">Weli ma jiro dalab aad soo dirtay</p>
                  <button
                    onClick={() => setActiveView('products')}
                    className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
                  >
                    Bilow Wax Iibsiga
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {customerOrders.map((ord) => {
                    const statusInfo = getOrderStatusInfo(ord.orderStatus);
                    const payInfo = getPaymentStatusInfo(ord.paymentStatus);
                    const canCancel = ord.orderStatus === 'dalabka_la_helay' || ord.orderStatus === 'waa_la_xaqiijiyay';

                    return (
                      <div key={ord.id} className="p-5 hover:bg-slate-50/60 transition space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-extrabold text-sm text-slate-900">{ord.id}</span>
                              <span className="text-xs text-slate-400">• Resiidka: {ord.receiptNumber}</span>
                            </div>
                            <span className="text-xs text-slate-500">Taariikhda: {formatDate(ord.createdAt)}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.colorClass}`}>
                              {statusInfo.labelSo}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${payInfo.colorClass}`}>
                              {payInfo.labelSo}
                            </span>
                          </div>
                        </div>

                        {/* Items in this order */}
                        <div className="space-y-2">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{item.quantity}x</span>
                                <span>{item.productName}</span>
                              </div>
                              <span className="font-mono font-bold text-slate-900">{formatETB(item.totalPrice)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footnote & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                          <div className="text-slate-600">
                            Wadarta Guud ee Birr: <strong className="text-orange-600 text-sm font-extrabold">{formatETB(ord.total)}</strong>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => downloadOrderReceipt(ord, settings)}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1.5 transition"
                            >
                              <Download className="w-3.5 h-3.5 text-orange-600" />
                              <span>Soo Dejiso Resiidka (PDF)</span>
                            </button>

                            <button
                              onClick={() => setActiveOrderForModal(ord)}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Daawo Faahfaahinta</span>
                            </button>

                            {canCancel && (
                              <button
                                onClick={() => setCancelModalOrderId(ord.id)}
                                className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold transition"
                              >
                                Jooji Dalabka
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RECEIPTS (RESIIDYADA) */}
          {activeTab === 'receipts' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">
                  Resiidyada Dalabyadaada (PDF Receipts & Invoices)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Resiid kasta wuxuu xambaarsan yahay xogta buuxda ee lacagta, alaabta, iyo cinwaankaaga Shinile & Itoobiya.
                </p>
              </div>

              {customerOrders.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500">
                  Ma jiro resiid hadda kuu diyaar ah.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {customerOrders.map((ord) => {
                    const payInfo = getPaymentStatusInfo(ord.paymentStatus);
                    return (
                      <div key={ord.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm hover:bg-slate-50">
                        <div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-orange-600" />
                            <span className="font-mono font-bold text-slate-900">{ord.receiptNumber}</span>
                            <span className="text-slate-400 font-mono">({ord.id})</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {formatDate(ord.createdAt)} • Wadarta: <strong className="text-slate-900">{formatETB(ord.total)}</strong> • {payInfo.labelSo}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => downloadOrderReceipt(ord, settings)}
                            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5 text-orange-400" />
                            <span>Soo Dejiso PDF</span>
                          </button>

                          <button
                            onClick={() => setReceiptModalOrder(ord)}
                            className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5 transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Daabac</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-xl">
              <h3 className="font-bold text-slate-900 text-base mb-1">
                Wax Ka Beddel Xogtaada (My Profile)
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Xogtan waxaa loo isticmaalaa in lagula soo xiriiro marka alaabta laguu keenayo.
              </p>

              <form onSubmit={handleProfileUpdate} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Magacaaga oo Buuxa</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email-kaaga (Lama beddeli karo)</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Taleefankaaga</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow-sm"
                >
                  Kaydi Isbeddelka
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: SECURITY */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-xl">
              <h3 className="font-bold text-slate-900 text-base mb-1">
                Beddel Furahaaga Sirta ah (Change Password)
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Furaha sirta ah waa mid sugan oo qarsoodi ah. Weligaa qof kale ha la wadaagin.
              </p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Furahaaga sirta ah si guul leh ayaa loo cusboonaysiiyay.');
                }} 
                className="space-y-4 text-xs sm:text-sm"
              >
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Furaha Sirta ah ee Hadda</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Furaha Sirta ah ee Cusub</label>
                  <input
                    type="password"
                    required
                    placeholder="Ugu yaraan 6 xaraf"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow-sm"
                >
                  Cusboonaysii Furaha Sirta ah
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* ORDER DETAILS MODAL */}
      {activeOrderForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveOrderForModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold text-slate-900 text-lg">Dalabka #{activeOrderForModal.id}</span>
              <span className="text-xs text-slate-500 font-mono">({activeOrderForModal.receiptNumber})</span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              La sameeyay: {formatDate(activeOrderForModal.createdAt)}
            </p>

            {/* Tracking Progress Timeline */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Xaaladda Gaarsiinta (Tracking Timeline):
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
                  const currentIdx = getOrderStatusInfo(activeOrderForModal.orderStatus).stepIndex;
                  const stepNumber = i + 1;
                  const isDone = currentIdx >= stepNumber;
                  const isCurrent = currentIdx === stepNumber;

                  return (
                    <div key={st.step} className="flex items-center gap-3 text-xs">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0 ${
                        isDone 
                          ? 'bg-emerald-600 text-white' 
                          : isCurrent 
                          ? 'bg-orange-600 text-white animate-pulse' 
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isDone ? '✓' : stepNumber}
                      </div>
                      <span className={`font-semibold ${isDone ? 'text-slate-900 font-bold' : isCurrent ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {activeOrderForModal.courierName && (
                <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-700">
                  <span>Qofka Gaarsiinta (Courier): <strong>{activeOrderForModal.courierName}</strong></span>
                  {activeOrderForModal.courierPhone && (
                    <span className="block mt-0.5">Taleefanka: <strong>{activeOrderForModal.courierPhone}</strong></span>
                  )}
                </div>
              )}
            </div>

            {/* Address & Payment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">Cinwaanka:</p>
                <p>{activeOrderForModal.deliveryAddress.fullName}</p>
                <p>{activeOrderForModal.deliveryAddress.cityOrTown}, {activeOrderForModal.deliveryAddress.region}</p>
                <p className="text-slate-500">{activeOrderForModal.deliveryAddress.landmark}</p>
                <p className="text-slate-500">Tel: {activeOrderForModal.deliveryAddress.phone}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">Lacag-bixinta:</p>
                <p>Habka: <strong>{getPaymentMethodName(activeOrderForModal.paymentMethod).nameSo}</strong></p>
                <p>Xaaladda: <strong className={getPaymentStatusInfo(activeOrderForModal.paymentStatus).isVerified ? 'text-emerald-700' : 'text-amber-700'}>
                  {getPaymentStatusInfo(activeOrderForModal.paymentStatus).labelSo}
                </strong></p>
                {activeOrderForModal.paymentReference && (
                  <p className="font-mono mt-1 text-slate-600">Tixraaca: {activeOrderForModal.paymentReference}</p>
                )}
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6 text-xs">
              <div className="bg-slate-100 p-2.5 font-bold text-slate-800 flex justify-between">
                <span>Alaabta</span>
                <span>Qiimaha</span>
              </div>
              <div className="divide-y divide-slate-100">
                {activeOrderForModal.items.map((it, idx) => (
                  <div key={idx} className="p-2.5 flex justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{it.productName}</p>
                      <p className="text-slate-400">{it.quantity} x {formatETB(it.unitPrice)}</p>
                    </div>
                    <span className="font-bold text-slate-900">{formatETB(it.totalPrice)}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                <span>Wadarta Guud:</span>
                <span className="text-orange-600">{formatETB(activeOrderForModal.total)}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => downloadOrderReceipt(activeOrderForModal, settings)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-orange-400" />
                <span>Soo Dejiso Resiidka (PDF)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CANCEL REASON MODAL */}
      {cancelModalOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Ma hubtaa inaad doonayso inaad joojiso dalabkan?
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Dalabka #{cancelModalOrderId} waa la joojin doonaa, alaabtiina waxaa lagu celin doonaa bakhaarka dukaanka.
            </p>

            <form onSubmit={handleConfirmCancel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sababta aad u joojisay (Ikhtiyaari):
                </label>
                <textarea
                  rows={2}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Tusaale: Waxaan qaatay alaab kale ama cinwaankaan qaldamay..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCancelModalOrderId(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Ka Noqo
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                >
                  Haa, Jooji Dalabka
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
