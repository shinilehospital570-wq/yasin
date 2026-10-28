import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Package, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  Truck, 
  Settings, 
  BarChart3, 
  Database, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Download, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  MapPin,
  Clock,
  Printer
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { 
  Category, 
  CategoryId, 
  DeliveryZone, 
  Order, 
  OrderStatus, 
  PaymentMethod, 
  PaymentStatus, 
  Product, 
  StoreSettings 
} from '../../types';
import { 
  DESIGNATED_ADMIN_EMAIL, 
  generateSupabaseMigrationSQL 
} from '../../services/storage';
import { 
  formatETB, 
  formatDate, 
  formatDateTime, 
  getOrderStatusInfo, 
  getPaymentMethodName, 
  getPaymentStatusInfo 
} from '../../utils/formatters';
import { downloadOrderReceipt } from '../../utils/pdfGenerator';

type AdminTab = 
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'customers'
  | 'payments'
  | 'delivery'
  | 'settings'
  | 'reports'
  | 'database';

export const AdminPanel: React.FC = () => {
  const { 
    currentUser, 
    isAdmin, 
    products, 
    orders, 
    registeredUsers, 
    settings, 
    paymentConfig, 
    deliveryZones, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus, 
    verifyPayment, 
    updateSettings, 
    updatePaymentConfig, 
    updateDeliveryZone, 
    addDeliveryZone, 
    deleteDeliveryZone,
    categories,
    loginAsDesignatedAdmin,
    setReceiptModalOrder,
    setActiveView
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Search & Filter States
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState<CategoryId | 'all'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');

  // Modals state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [deleteConfirmProductId, setDeleteConfirmProductId] = useState<string | null>(null);
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);
  const [auditNote, setAuditNote] = useState('');
  const [courierNameInput, setCourierNameInput] = useState('');
  const [courierPhoneInput, setCourierPhoneInput] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  // New/Edit Product Form State
  const [productForm, setProductForm] = useState<Partial<Product>>({
    nameSo: '',
    nameEn: '',
    descriptionSo: '',
    categoryId: 'dharka',
    price: 1000,
    discountPrice: undefined,
    stock: 20,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    unit: 'xabbo',
  });

  // Settings Form State
  const [storeSettingsForm, setStoreSettingsForm] = useState<StoreSettings>({ ...settings });
  
  // Strict Authorization Check
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Galka Maamulka Waa La Xannibay (Access Restricted)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          Keliya maamulaha rasmiga ah ee leh email-ka <strong className="text-slate-900">{DESIGNATED_ADMIN_EMAIL}</strong> ayaa awood u leh inuu galo qeybta maamulka dukaanka Fuad E-Commerce.
        </p>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left mb-6 space-y-2">
          <strong className="block font-bold">Tilmaamaha Maamulaha:</strong>
          <p>Haddii aad tahay Fuad Diis Yasin ({DESIGNATED_ADMIN_EMAIL}), waxaad halkan toos uga geli kartaa adigoo isticmaalaya badhanka hoose ee xaqiijinta maamulka.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => loginAsDesignatedAdmin()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm transition shadow-md"
          >
            Gal Maamulka ({DESIGNATED_ADMIN_EMAIL})
          </button>
          <button
            onClick={() => setActiveView('home')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition"
          >
            Ku Laabo Bogga Hore
          </button>
        </div>
      </div>
    );
  }

  // Dashboard Aggregates
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalSales = orders
    .filter((o) => o.paymentStatus === 'verified')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus !== 'waa_la_gaarsiiyay' && o.orderStatus !== 'waa_la_joojiyay'
  ).length;
  const pendingPaymentsCount = orders.filter((o) => o.paymentStatus === 'pending_verification').length;
  const verifiedPaymentsCount = orders.filter((o) => o.paymentStatus === 'verified').length;
  const deliveredOrdersCount = orders.filter((o) => o.orderStatus === 'waa_la_gaarsiiyay').length;
  const totalCustomers = registeredUsers.length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  // Copy SQL Schema helper
  const handleCopySQL = () => {
    const sql = generateSupabaseMigrationSQL();
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Download SQL Schema helper
  const handleDownloadSQL = () => {
    const sql = generateSupabaseMigrationSQL();
    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fuad_ecommerce_supabase_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Receipt #', 'Date', 'Customer', 'Phone', 'City', 'Subtotal ETB', 'Delivery Fee ETB', 'Total ETB', 'Payment Method', 'Payment Status', 'Order Status'];
    const rows = orders.map((o) => [
      o.id,
      o.receiptNumber,
      o.createdAt,
      `"${o.customerName}"`,
      o.customerPhone,
      `"${o.deliveryAddress.cityOrTown}"`,
      o.subtotal,
      o.deliveryFee,
      o.total,
      o.paymentMethod,
      o.paymentStatus,
      o.orderStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fuad_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      
      {/* Admin Top Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 mb-8 border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-600 text-white font-bold text-[10px] uppercase tracking-wider">
              Xafiiska Maamulka
            </span>
            <span className="text-xs text-slate-400">Shinile Central Operations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold mt-1 tracking-tight">
            Maamulka Dukaanka Fuad E-Commerce
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Maamulaha Sare: <strong className="text-orange-400 font-mono">{DESIGNATED_ADMIN_EMAIL}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('database')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
          >
            <Database className="w-4 h-4 text-orange-400" />
            <span>Supabase & SQL</span>
          </button>

          <button
            onClick={() => setActiveView('home')}
            className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-sm"
          >
            Fiiri Dukaanka Dadweynaha
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {[
          { id: 'dashboard', label: 'Warbixinta Guud', icon: BarChart3 },
          { id: 'orders', label: `Dalabyada (${totalOrders})`, icon: ShoppingCart },
          { id: 'payments', label: `Lacag-bixinta (${pendingPaymentsCount} cusub)`, icon: CreditCard },
          { id: 'products', label: `Alaabta (${totalProducts})`, icon: Package },
          { id: 'delivery', label: 'Gaarsiinta & Magaalooyinka', icon: Truck },
          { id: 'customers', label: `Macaamiisha (${totalCustomers})`, icon: Users },
          { id: 'settings', label: 'Xogta Dukaanka', icon: Settings },
          { id: 'reports', label: 'Warbixinnada & CSV', icon: BarChart3 },
          { id: 'database', label: 'Supabase & Amniga', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition active:scale-95 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Iibka Guud ee Xaqiijisan</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{formatETB(totalSales)}</p>
              <span className="text-[11px] text-emerald-600 font-medium">ETB (Birr)</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Wadarta Dalabyada</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalOrders}</p>
              <span className="text-[11px] text-slate-500">{pendingOrdersCount} ayaa hadda socda</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Lacagaha Xaqiijin Sugaya</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{pendingPaymentsCount}</p>
              <span className="text-[11px] text-amber-700">Telebirr / CBE Tixraac</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alaabta Bakhaarka</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalProducts}</p>
              <span className="text-[11px] text-rose-600 font-medium">{lowStockProducts.length} ayaa gabaabsi ah</span>
            </div>
          </div>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <div className="text-xs sm:text-sm text-rose-900">
                  <strong>Digtooni Bakhaar:</strong> Waxaa jira {lowStockProducts.length} alaab oo tiradoodu ka yar tahay 5 xabbo (Gabaabsi).
                </div>
              </div>
              <button
                onClick={() => setActiveTab('products')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shrink-0"
              >
                Cusboonaysii Bakhaarka
              </button>
            </div>
          )}

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Dalabyadii Ugu Dambeeyay (Recent Orders)</h3>
                <p className="text-xs text-slate-500">Isku darka dhammaan macaamiisha Itoobiya.</p>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-orange-600 hover:underline"
              >
                Daawo Dhammaan →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Dalabka #</th>
                    <th className="py-3 px-4">Macmiilka & Tel</th>
                    <th className="py-3 px-4">Magaalada</th>
                    <th className="py-3 px-4">Wadarta (ETB)</th>
                    <th className="py-3 px-4">Habka Lacagta</th>
                    <th className="py-3 px-4">Xaaladda Lacagta</th>
                    <th className="py-3 px-4">Xaaladda Dalabka</th>
                    <th className="py-3 px-4 text-right">Ficil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((ord) => {
                    const statusInfo = getOrderStatusInfo(ord.orderStatus);
                    const payInfo = getPaymentStatusInfo(ord.paymentStatus);
                    const payMethod = getPaymentMethodName(ord.paymentMethod);
                    return (
                      <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{ord.id}</td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900">{ord.customerName}</p>
                          <p className="text-slate-400 text-[11px]">{ord.customerPhone}</p>
                        </td>
                        <td className="py-3 px-4">{ord.deliveryAddress.cityOrTown}</td>
                        <td className="py-3 px-4 font-extrabold text-slate-900">{formatETB(ord.total)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${payMethod.badgeColor}`}>
                            {payMethod.shortName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${payInfo.colorClass}`}>
                            {payInfo.labelSo}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.colorClass}`}>
                            {statusInfo.labelSo}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setInspectOrder(ord)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Kormeer Dalabka"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs shadow-xs">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Raadi Order ID, Macmiilka, ama Telefoonka..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:outline-none"
              >
                <option value="all">Dhammaan Xaaladaha Dalabka</option>
                <option value="dalabka_la_helay">Dalabka Waa La Helay</option>
                <option value="waa_la_xaqiijiyay">Waa La Xaqiijiyay</option>
                <option value="diyaarinta_alaabta">Diyaarinta Alaabta</option>
                <option value="waa_la_soo_diray">Waa La Soo Diray</option>
                <option value="waa_la_dhiibayaa">Waa La Dhiibayaa</option>
                <option value="waa_la_gaarsiiyay">Waa La Gaarsiiyay</option>
                <option value="waa_la_joojiyay">Waa La Joojiyay</option>
              </select>

              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:outline-none"
              >
                <option value="all">Dhammaan Lacag-bixinta</option>
                <option value="pending_verification">Sugaya Xaqiijin</option>
                <option value="verified">Waa La Xaqiijiyay</option>
                <option value="pending">Lama Bixin</option>
                <option value="rejected">Waa La Diiday</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Dalabka #</th>
                    <th className="py-3 px-4">Macmiilka & Tel</th>
                    <th className="py-3 px-4">Magaalada</th>
                    <th className="py-3 px-4">Wadarta (ETB)</th>
                    <th className="py-3 px-4">Lacagta</th>
                    <th className="py-3 px-4">Xaaladda Dalabka</th>
                    <th className="py-3 px-4 text-right">Tallaabooyin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders
                    .filter((ord) => {
                      if (orderStatusFilter !== 'all' && ord.orderStatus !== orderStatusFilter) return false;
                      if (paymentStatusFilter !== 'all' && ord.paymentStatus !== paymentStatusFilter) return false;
                      if (orderSearch.trim()) {
                        const q = orderSearch.toLowerCase();
                        return (
                          ord.id.toLowerCase().includes(q) ||
                          ord.receiptNumber.toLowerCase().includes(q) ||
                          ord.customerName.toLowerCase().includes(q) ||
                          ord.customerPhone.includes(q)
                        );
                      }
                      return true;
                    })
                    .map((ord) => {
                      const statusInfo = getOrderStatusInfo(ord.orderStatus);
                      const payInfo = getPaymentStatusInfo(ord.paymentStatus);
                      return (
                        <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            {ord.id}
                            <span className="block text-[10px] text-slate-400 font-normal">{ord.receiptNumber}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900">{ord.customerName}</p>
                            <p className="text-slate-500 text-[11px]">{ord.customerPhone}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-800">{ord.deliveryAddress.cityOrTown}</span>
                            <span className="block text-[10px] text-slate-400">{ord.deliveryAddress.region}</span>
                          </td>
                          <td className="py-3.5 px-4 font-extrabold text-slate-900">{formatETB(ord.total)}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${payInfo.colorClass}`}>
                              {payInfo.labelSo}
                            </span>
                            {ord.paymentReference && (
                              <span className="block font-mono text-[10px] text-slate-500 mt-0.5">
                                Ref: {ord.paymentReference}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.colorClass}`}>
                              {statusInfo.labelSo}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => downloadOrderReceipt(ord, settings)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                                title="Soo Dejiso Resiidka (PDF)"
                              >
                                <Download className="w-3.5 h-3.5 text-orange-600" />
                              </button>

                              <button
                                onClick={() => setInspectOrder(ord)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1 transition"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Maamul</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT VERIFICATION */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">Xafiiska Xaqiijinta Lacag-Bixinta (Manual Verification):</strong>
              Maamulaha ayaa si toos ah u xaqiijinaya tixraacyada Telebirr, CBE, iyo E-Birr. Weligaa dalab ha ka dhigin "Waa La Xaqiijiyay" ilaa aad ka hubiso in lacagtu dhab ahaan ku soo dhacday akoonkaaga dukaanka.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Dalabyada Sugaya Xaqiijinta Lacagta</h3>
              <p className="text-xs text-slate-500">Kala xaqiiji ama diid tixraacyada ay macaamiishu soo gudbiyeen.</p>
            </div>

            <div className="divide-y divide-slate-100">
              {orders
                .filter((o) => o.paymentStatus === 'pending_verification' || o.paymentStatus === 'pending')
                .map((ord) => {
                  const payMethod = getPaymentMethodName(ord.paymentMethod);
                  return (
                    <div key={ord.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-900">{ord.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${payMethod.badgeColor}`}>
                            {payMethod.nameSo}
                          </span>
                        </div>
                        <p className="text-slate-600">
                          Macmiilka: <strong>{ord.customerName}</strong> ({ord.customerPhone})
                        </p>
                        <p className="text-slate-600">
                          Wadarta Guud: <strong className="text-orange-600 text-sm font-extrabold">{formatETB(ord.total)}</strong>
                        </p>
                        <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 font-mono text-slate-800">
                          Tixraaca (TXN ID): <strong className="text-slate-900">{ord.paymentReference || 'Weli lama soo gelin'}</strong>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => verifyPayment(ord.id, 'verified', 'Xaqiijiyay Telebirr/CBE account')}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Xaqiiji Lacagta (Mark as Paid)</span>
                        </button>

                        <button
                          onClick={() => verifyPayment(ord.id, 'rejected', 'Tixraaca ma jiro ama lacagtu ma soo dhicin')}
                          className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5 transition"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Diid Lacagta</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Raadi magaca alaabta..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedProductCategory}
                onChange={(e) => setSelectedProductCategory(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium focus:outline-none"
              >
                <option value="all">Dhammaan Qaybaha</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.nameSo}</option>
                ))}
              </select>

              <button
                onClick={() => {
                  setProductForm({
                    nameSo: '',
                    nameEn: '',
                    descriptionSo: '',
                    categoryId: 'dharka',
                    price: 1500,
                    discountPrice: undefined,
                    stock: 20,
                    isAvailable: true,
                    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
                    unit: 'xabbo',
                  });
                  setIsNewProductModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Ku Dar Alaab Cusub</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Sawirka</th>
                    <th className="py-3 px-4">Magaca Alaabta</th>
                    <th className="py-3 px-4">Qaybta</th>
                    <th className="py-3 px-4">Qiimaha (ETB)</th>
                    <th className="py-3 px-4">Bakhaarka (Stock)</th>
                    <th className="py-3 px-4">Diyaar ahaanshaha</th>
                    <th className="py-3 px-4 text-right">Ficil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products
                    .filter((p) => {
                      if (selectedProductCategory !== 'all' && p.categoryId !== selectedProductCategory) return false;
                      if (productSearch.trim()) {
                        return p.nameSo.toLowerCase().includes(productSearch.toLowerCase());
                      }
                      return true;
                    })
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4">
                          <img src={p.imageUrl} alt={p.nameSo} className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200" />
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{p.nameSo}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {p.id}</p>
                        </td>
                        <td className="py-3 px-4 capitalize">{p.categoryId.replace('-', ' ')}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {formatETB(p.discountPrice ?? p.price)}
                          {p.discountPrice && (
                            <span className="block text-[10px] text-slate-400 line-through">
                              {formatETB(p.price)}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-bold ${p.stock <= 5 ? 'text-rose-600' : 'text-slate-800'}`}>
                            {p.stock} {p.unit || 'xabbo'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => updateProduct({ ...p, isAvailable: !p.isAvailable })}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              p.isAvailable && p.stock > 0
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {p.isAvailable && p.stock > 0 ? 'Furan (Available)' : 'Xiran (Unavailable)'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProductForm(p);
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                              title="Wax ka beddel"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmProductId(p.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                              title="Tirtir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DELIVERY MANAGEMENT */}
      {activeTab === 'delivery' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Maamulka Gaarsiinta Itoobiya (Delivery Zones & Fees)
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Xarunta Fuad E-Commerce waxay ku taallaa Shinile, Somali Region. Halkan waxaad kaga qeexi kartaa kharashka gaarsiinta magaalada kasta ee Itoobiya.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveryZones.map((zone) => (
                <div key={zone.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{zone.nameSo}</h4>
                      <p className="text-slate-500">{zone.region} • {zone.city}</p>
                    </div>
                    <span className="font-extrabold text-orange-600 text-base">
                      {formatETB(zone.fee)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>Waqtiga: <strong>{zone.estimatedTime}</strong></div>
                    <div>Gaarsiin Bilaash ah: <strong>{zone.isFreeEligible ? `Haddii dalabku > ${formatETB(zone.minOrderForFreeDelivery)}` : 'Maya'}</strong></div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        const newFee = prompt(`Geli kharashka cusub ee Birr ee ${zone.nameSo}:`, zone.fee.toString());
                        if (newFee !== null && !isNaN(Number(newFee))) {
                          updateDeliveryZone({ ...zone, fee: Number(newFee) });
                        }
                      }}
                      className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                    >
                      Beddel Qiimaha
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CUSTOMER MANAGEMENT */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Macaamiisha Diiwaangashan (Registered Customers)</h3>
            <p className="text-xs text-slate-500">Furayaasha sirta ah marna lama muujinayo (Password Security Enforced).</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Magaca</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Taleefanka</th>
                  <th className="py-3 px-4">Doorka (Role)</th>
                  <th className="py-3 px-4">Taariikhda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registeredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.fullName}</td>
                    <td className="py-3 px-4 font-mono">{u.email}</td>
                    <td className="py-3 px-4">{u.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: STORE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl space-y-5 text-xs sm:text-sm">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Habaynta Dukaanka (Store Settings)</h3>
            <p className="text-xs text-slate-500">Kala beddel lambarka WhatsApp-ka, taleefanka xafiiska Shinile, iyo ogaysiisyada.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateSettings(storeSettingsForm);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block font-bold text-slate-700 mb-1">Magaca Dukaanka</label>
              <input
                type="text"
                value={storeSettingsForm.storeName}
                onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Taleefanka Ganacsiga</label>
                <input
                  type="text"
                  value={storeSettingsForm.contactPhone}
                  onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, contactPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lambarka WhatsApp-ka</label>
                <input
                  type="text"
                  value={storeSettingsForm.whatsappNumber}
                  onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, whatsappNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Farriinta Ogaysiiska ee Sare (Header Announcement)</label>
              <textarea
                rows={2}
                value={storeSettingsForm.headerAnnouncement}
                onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, headerAnnouncement: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow-sm"
            >
              Kaydi Isbeddelka Dukaanka
            </button>
          </form>
        </div>
      )}

      {/* TAB 8: REPORTS & EXPORT */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Warbixinta Iibka & Dalabyada</h3>
              <p className="text-xs text-slate-500">Kala soo deg dhammaan xogta dalabyada qaab CSV (Excel).</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>Kala Soo Deg CSV (Export to Excel)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Wadarta Dakhliga Xaqiijisan:</span>
              <p className="text-xl font-extrabold text-slate-900 mt-1">{formatETB(totalSales)}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Isku-celceliska Dalabka (AOV):</span>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                {formatETB(orders.length > 0 ? totalSales / (verifiedPaymentsCount || 1) : 0)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Dalabyada Guulaystay (Delivered):</span>
              <p className="text-xl font-extrabold text-emerald-600 mt-1">{deliveredOrdersCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: SUPABASE & DATABASE SCHEMA */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <span>Supabase PostgreSQL Schema & RLS Policies</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Waxaad halkan ka helaysaa SQL code-ka buuxa ee loo baahan yahay in lagu shubo Supabase si loo helo database sugan oo leh Row Level Security (RLS).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySQL}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copiedSql ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Waa La Koobiyeeyay!' : 'Koobiyeey SQL'}</span>
              </button>

              <button
                onClick={handleDownloadSQL}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <Download className="w-4 h-4 text-orange-400" />
                <span>Soo Dejiso fuad_schema.sql</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <strong className="block font-bold">Tilmaamaha Supabase ee Af-Soomaaliga:</strong>
            <ol className="list-decimal list-inside space-y-1 text-amber-800">
              <li>Tag bogga <strong>supabase.com</strong> oo abuur mashruuc bilaash ah (Free Tier).</li>
              <li>Tag qeybta <strong>SQL Editor</strong> oo ku shub SQL code-ka hoose.</li>
              <li>Riix <strong>Run</strong> — dhammaan miisaska (Tables) iyo xeerarka amniga (RLS) ayaa toos u dhismi doona.</li>
              <li>Ku dar email-kaaga <strong>diisyasin@gmail.com</strong> si aad u noqoto Maamulaha Sare ee la aqoonsan yahay.</li>
            </ol>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed border border-slate-800">
            {generateSupabaseMigrationSQL()}
          </pre>
        </div>
      )}

      {/* INSPECT ORDER MODAL */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setInspectOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold text-slate-900 text-lg">Maamul Dalabka #{inspectOrder.id}</span>
              <span className="text-xs text-slate-400 font-mono">({inspectOrder.receiptNumber})</span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Macmiilka: <strong>{inspectOrder.customerName}</strong> ({inspectOrder.customerPhone})
            </p>

            {/* Quick Status Update */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900">Beddel Xaaladda Dalabka (Order Pipeline):</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'dalabka_la_helay', label: '1. Dalabka La Helay' },
                  { id: 'waa_la_xaqiijiyay', label: '2. Waa La Xaqiijiyay' },
                  { id: 'diyaarinta_alaabta', label: '3. Diyaarinta' },
                  { id: 'waa_la_soo_diray', label: '4. Waa La Soo Diray' },
                  { id: 'waa_la_dhiibayaa', label: '5. Waa La Dhiibayaa' },
                  { id: 'waa_la_gaarsiiyay', label: '6. Waa La Gaarsiiyay' },
                  { id: 'waa_la_joojiyay', label: 'Jooji' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      updateOrderStatus(inspectOrder.id, s.id as OrderStatus);
                      setInspectOrder({ ...inspectOrder, orderStatus: s.id as OrderStatus });
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${
                      inspectOrder.orderStatus === s.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Courier info assignment */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Magaca Qofka Gaarsiinta (Courier)</label>
                  <input
                    type="text"
                    defaultValue={inspectOrder.courierName || ''}
                    onBlur={(e) => updateOrderStatus(inspectOrder.id, inspectOrder.orderStatus, e.target.value, inspectOrder.courierPhone)}
                    placeholder="Tusaale: Liibaan Express"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Taleefanka Qofka Gaarsiinta</label>
                  <input
                    type="text"
                    defaultValue={inspectOrder.courierPhone || ''}
                    onBlur={(e) => updateOrderStatus(inspectOrder.id, inspectOrder.orderStatus, inspectOrder.courierName, e.target.value)}
                    placeholder="Tusaale: +251 915..."
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Payment Verification Controls */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 mb-6 space-y-3 text-xs text-amber-950">
              <h4 className="font-bold flex items-center justify-between">
                <span>Xaqiijinta Lacagta:</span>
                <span className="font-mono text-xs">{inspectOrder.paymentReference || 'Tixraac Lama Hayo'}</span>
              </h4>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    verifyPayment(inspectOrder.id, 'verified', 'Xaqiijiyay');
                    setInspectOrder({ ...inspectOrder, paymentStatus: 'verified' });
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition"
                >
                  Xaqiiji (Mark Verified / Paid)
                </button>
                <button
                  onClick={() => {
                    verifyPayment(inspectOrder.id, 'rejected', 'Diiday');
                    setInspectOrder({ ...inspectOrder, paymentStatus: 'rejected' });
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition"
                >
                  Diid Lacagta (Reject)
                </button>
              </div>
            </div>

            {/* Download Receipt */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <span className="font-extrabold text-base text-slate-900">
                Wadarta: {formatETB(inspectOrder.total)}
              </span>

              <button
                onClick={() => downloadOrderReceipt(inspectOrder, settings)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-orange-400" />
                <span>Soo Dejiso Resiidka (PDF)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {(isNewProductModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsNewProductModalOpen(false);
                setEditingProduct(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>

            <h3 className="font-extrabold text-slate-900 text-lg mb-1">
              {editingProduct ? 'Wax Ka Beddel Alaabta' : 'Ku Dar Alaab Cusub Dukaanka'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Alaabtu waxay toos ugu soo bixi doontaa buugga alaabta ee dadweynaha.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingProduct) {
                  updateProduct({ ...(editingProduct as Product), ...(productForm as Product) });
                  setEditingProduct(null);
                } else {
                  addProduct(productForm as any);
                  setIsNewProductModalOpen(false);
                }
              }}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Magaca Alaabta (Somali) *</label>
                <input
                  type="text"
                  required
                  value={productForm.nameSo || ''}
                  onChange={(e) => setProductForm({ ...productForm, nameSo: e.target.value })}
                  placeholder="Tusaale: Dirac Shifo Tayo Sare leh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Qaybta (Category) *</label>
                  <select
                    value={productForm.categoryId || 'dharka'}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.nameSo}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hal-beegga (Unit)</label>
                  <input
                    type="text"
                    value={productForm.unit || 'xabbo'}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="xabbo, joog, dhalo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Qiimaha (ETB) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={productForm.price || ''}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Qiimo Dhimis (ETB)</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.discountPrice || ''}
                    onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Ikhtiyaari"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tirada Taalla (Stock) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stock ?? ''}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sawirka Alaabta (Image URL) *</label>
                <input
                  type="url"
                  required
                  value={productForm.imageUrl || ''}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Faahfaahinta Alaabta (Somali) *</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.descriptionSo || ''}
                  onChange={(e) => setProductForm({ ...productForm, descriptionSo: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured || false}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="rounded text-orange-600"
                  />
                  <span>Featured (Alaab Gaar ah)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller || false}
                    onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                    className="rounded text-orange-600"
                  />
                  <span>Best Seller (Ugu Iibka Badan)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Ka Noqo
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition"
                >
                  {editingProduct ? 'Cusboonaysii Alaabta' : 'Keydi Alaabta Cusub'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Ma hubtaa inaad tirtirto?</h3>
            <p className="text-xs text-slate-500 mb-6">Alaabtan si toos ah ayaa looga saarayaa dukaanka.</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setDeleteConfirmProductId(null)}
                className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 text-xs font-semibold"
              >
                Ka Noqo
              </button>
              <button
                onClick={() => {
                  deleteProduct(deleteConfirmProductId);
                  setDeleteConfirmProductId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Haa, Tirtir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
