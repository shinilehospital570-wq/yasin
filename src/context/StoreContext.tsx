import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  CartItem, 
  Category, 
  CategoryId, 
  DeliveryZone, 
  EthiopianAddress, 
  Order, 
  OrderStatus, 
  PaymentAccountConfig, 
  PaymentMethod, 
  PaymentStatus, 
  Product, 
  StoreSettings, 
  UserProfile 
} from '../types';
import { 
  DESIGNATED_ADMIN_EMAIL, 
  StorageService 
} from '../services/storage';

export type ActiveView = 
  | 'home'
  | 'products'
  | 'categories'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'customer-panel'
  | 'admin-panel'
  | 'track-order'
  | 'about'
  | 'contact'
  | 'terms'
  | 'privacy';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  // Data
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  orders: Order[];
  settings: StoreSettings;
  paymentConfig: PaymentAccountConfig;
  deliveryZones: DeliveryZone[];
  currentUser: UserProfile | null;
  registeredUsers: UserProfile[];
  
  // Auth state
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // View & UI Navigation
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  activeCategory: CategoryId | 'all';
  setActiveCategory: (cat: CategoryId | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'signup' | 'forgot') => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  receiptModalOrder: Order | null;
  setReceiptModalOrder: (order: Order | null) => void;
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Cart operations
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;

  // Order operations
  createOrder: (
    address: EthiopianAddress, 
    paymentMethod: PaymentMethod, 
    paymentReference?: string, 
    paymentProofUrl?: string,
    zoneId?: string
  ) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus, courierName?: string, courierPhone?: string) => void;
  verifyPayment: (orderId: string, status: PaymentStatus, auditNote?: string) => void;
  cancelOrder: (orderId: string, reason: string) => boolean;

  // Admin Product Operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Admin Config Operations
  updateSettings: (newSettings: StoreSettings) => void;
  updatePaymentConfig: (newConfig: PaymentAccountConfig) => void;
  updateDeliveryZone: (zone: DeliveryZone) => void;
  addDeliveryZone: (zone: Omit<DeliveryZone, 'id'>) => void;
  deleteDeliveryZone: (zoneId: string) => void;

  // Auth operations
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, phone: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginAsDesignatedAdmin: () => void;
  loginAsCustomerDemo: () => void;
  updateProfile: (fullName: string, phone: string, address?: EthiopianAddress) => void;

  // Filtering helpers
  getCategoryProducts: (catId: CategoryId | 'all') => Product[];
  getCustomerOrders: () => Order[];
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Primary state
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [categories] = useState<Category[]>(() => StorageService.getCategories());
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [settings, setSettings] = useState<StoreSettings>(() => StorageService.getSettings());
  const [paymentConfig, setPaymentConfig] = useState<PaymentAccountConfig>(() => StorageService.getPaymentConfig());
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => StorageService.getDeliveryZones());
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => StorageService.getCurrentUser());
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => StorageService.getRegisteredUsers());

  // UI state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const data = localStorage.getItem('fuad_cart');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [receiptModalOrder, setReceiptModalOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fuad_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth computed state
  const isAuthenticated = !!currentUser;
  const isAdmin = !!currentUser && (currentUser.email.toLowerCase() === DESIGNATED_ADMIN_EMAIL.toLowerCase() || currentUser.role === 'admin');

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const activePrice = item.product.discountPrice ?? item.product.price;
      return sum + activePrice * item.quantity;
    }, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Cart Methods
  const addToCart = (product: Product, quantity = 1) => {
    // Check available stock
    const currentProduct = products.find((p) => p.id === product.id) || product;
    if (!currentProduct.isAvailable || currentProduct.stock <= 0) {
      showToast('Alaabtan hadda ma taallo (Waa laga gatay).', 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > currentProduct.stock) {
          showToast(`Waxaa hadda bakhaarka ku haray oo kaliya ${currentProduct.stock} xabbo.`, 'info');
          return prev.map((item) =>
            item.product.id === product.id ? { ...item, quantity: currentProduct.stock } : item
          );
        }
        showToast(`Tirada "${product.nameSo}" waa la kordhiyay!`);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        const initialQty = Math.min(quantity, currentProduct.stock);
        showToast(`"${product.nameSo}" waxaa lagu daray gaarigaaga!`);
        return [...prev, { product: currentProduct, quantity: initialQty }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Alaabta waa laga saaray gaariga.', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const currentProduct = products.find((p) => p.id === productId);
    if (!currentProduct) return;

    if (quantity > currentProduct.stock) {
      showToast(`Tirada ugu badan ee hortaala waa ${currentProduct.stock}.`, 'info');
      quantity = currentProduct.stock;
    }

    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order Placement
  const createOrder = async (
    address: EthiopianAddress,
    paymentMethod: PaymentMethod,
    paymentReference?: string,
    paymentProofUrl?: string,
    zoneId?: string
  ): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Gaarigaaga waxba kuma jiraan.' };
    }

    // 1. Authoritative server-style re-validation of inventory and prices
    for (const item of cart) {
      const currentPrd = products.find((p) => p.id === item.product.id);
      if (!currentPrd || !currentPrd.isAvailable) {
        return { success: false, error: `Alaabta "${item.product.nameSo}" hadda lama heli karo.` };
      }
      if (item.quantity > currentPrd.stock) {
        return {
          success: false,
          error: `Alaabta "${item.product.nameSo}" waxaa haray oo kaliya ${currentPrd.stock} xabbo.`,
        };
      }
    }

    // 2. Authoritative monetary calculations
    let authoritativeSubtotal = 0;
    const orderItems = cart.map((item) => {
      const freshPrd = products.find((p) => p.id === item.product.id)!;
      const unitPrice = freshPrd.discountPrice ?? freshPrd.price;
      const lineTotal = unitPrice * item.quantity;
      authoritativeSubtotal += lineTotal;
      return {
        productId: freshPrd.id,
        productName: freshPrd.nameSo,
        quantity: item.quantity,
        unitPrice,
        totalPrice: lineTotal,
        imageUrl: freshPrd.imageUrl,
      };
    });

    // 3. Calculate delivery fee based on selected zone
    let calculatedDeliveryFee = settings.defaultDeliveryFee;
    let estimatedDays = '2-3 Maalmood';
    if (zoneId) {
      const zone = deliveryZones.find((z) => z.id === zoneId);
      if (zone) {
        if (zone.isFreeEligible && zone.minOrderForFreeDelivery && authoritativeSubtotal >= zone.minOrderForFreeDelivery) {
          calculatedDeliveryFee = 0;
        } else {
          calculatedDeliveryFee = zone.fee;
        }
        estimatedDays = zone.estimatedTime;
      }
    } else {
      // Automatic match by city
      const matchedZone = deliveryZones.find(
        (z) => z.city.toLowerCase() === address.cityOrTown.toLowerCase()
      );
      if (matchedZone) {
        if (matchedZone.isFreeEligible && matchedZone.minOrderForFreeDelivery && authoritativeSubtotal >= matchedZone.minOrderForFreeDelivery) {
          calculatedDeliveryFee = 0;
        } else {
          calculatedDeliveryFee = matchedZone.fee;
        }
        estimatedDays = matchedZone.estimatedTime;
      }
    }

    const discountAmount = 0; // standard base
    const authoritativeTotal = authoritativeSubtotal + calculatedDeliveryFee - discountAmount;

    // 4. Generate unique IDs
    const orderNumberSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `FUAD-2026-${orderNumberSuffix}`;
    const receiptNumber = `RCP-${Math.floor(10000 + Math.random() * 90000)}`;

    const initialPaymentStatus: PaymentStatus = 
      paymentMethod === 'cash_on_delivery' 
        ? 'pending' 
        : (paymentReference ? 'pending_verification' : 'pending');

    const customerId = currentUser ? currentUser.id : `guest-${Date.now()}`;
    const customerName = currentUser ? currentUser.fullName : address.fullName;
    const customerPhone = currentUser ? currentUser.phone : address.phone;

    const newOrder: Order = {
      id: orderId,
      receiptNumber,
      customerId,
      customerName,
      customerEmail: currentUser?.email,
      customerPhone,
      items: orderItems,
      subtotal: authoritativeSubtotal,
      deliveryFee: calculatedDeliveryFee,
      discountAmount,
      total: authoritativeTotal,
      deliveryAddress: address,
      paymentMethod,
      paymentStatus: initialPaymentStatus,
      paymentReference: paymentReference?.trim(),
      paymentProofUrl,
      orderStatus: 'dalabka_la_helay',
      estimatedDeliveryDays: estimatedDays,
      paymentAuditLog: [
        {
          timestamp: new Date().toISOString(),
          action: `Dalabka cusub ayaa la gudbiyay (${orderId}). Habka: ${paymentMethod}.`,
          by: customerName,
          note: paymentReference ? `Tixraaca: ${paymentReference}` : undefined,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 5. Decrement inventory safely
    const updatedProducts = products.map((prd) => {
      const orderedItem = cart.find((item) => item.product.id === prd.id);
      if (orderedItem) {
        const newStock = Math.max(0, prd.stock - orderedItem.quantity);
        return {
          ...prd,
          stock: newStock,
          isAvailable: newStock > 0 ? prd.isAvailable : false,
        };
      }
      return prd;
    });

    setProducts(updatedProducts);
    StorageService.saveProducts(updatedProducts);

    // 6. Save order
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    StorageService.saveOrders(updatedOrders);

    // 7. Clear cart
    clearCart();

    showToast(`Dalabkaaga #${orderId} si guul leh ayaa loo qabtay!`, 'success');
    return { success: true, orderId };
  };

  // Order status update (Admin)
  const updateOrderStatus = (orderId: string, status: OrderStatus, courierName?: string, courierPhone?: string) => {
    if (!isAdmin) {
      showToast('Kuma lihid fasax falalkan (Admin authorization required).', 'error');
      return;
    }
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          orderStatus: status,
          courierName: courierName || ord.courierName,
          courierPhone: courierPhone || ord.courierPhone,
          updatedAt: new Date().toISOString(),
        };
      }
      return ord;
    });
    setOrders(updated);
    StorageService.saveOrders(updated);
    showToast(`Xaaladda dalabka #${orderId} waa la cusboonaysiiyay!`);
  };

  // Verify payment (Admin)
  const verifyPayment = (orderId: string, status: PaymentStatus, auditNote?: string) => {
    if (!isAdmin) {
      showToast('Kuma lihid fasax falalkan (Admin authorization required).', 'error');
      return;
    }
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        const logEntry = {
          timestamp: new Date().toISOString(),
          action: `Xaaladda lacag-bixinta waxaa laga dhigay: ${status.toUpperCase()}`,
          by: currentUser?.email || 'Admin',
          note: auditNote || undefined,
        };
        return {
          ...ord,
          paymentStatus: status,
          orderStatus: status === 'verified' && ord.orderStatus === 'dalabka_la_helay' ? ('waa_la_xaqiijiyay' as OrderStatus) : ord.orderStatus,
          paymentAuditLog: [...(ord.paymentAuditLog || []), logEntry],
          updatedAt: new Date().toISOString(),
        };
      }
      return ord;
    });
    setOrders(updated);
    StorageService.saveOrders(updated);
    showToast(`Lacag-bixinta dalabka #${orderId} waa la xaqiijiyay!`);
  };

  // Customer cancellation
  const cancelOrder = (orderId: string, reason: string): boolean => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return false;

    // Customer can only cancel if order is in received or confirmed status and belongs to them
    if (!isAdmin && target.customerId !== currentUser?.id) {
      showToast('Uma lihid fasax dalabkan.', 'error');
      return false;
    }

    if (target.orderStatus !== 'dalabka_la_helay' && target.orderStatus !== 'waa_la_xaqiijiyay') {
      showToast('Dalabkan mar hore ayaa la diyaariyay ama la soo diray, lama joojin karo.', 'error');
      return false;
    }

    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          orderStatus: 'waa_la_joojiyay' as OrderStatus,
          cancellationReason: reason,
          updatedAt: new Date().toISOString(),
        };
      }
      return ord;
    });

    // Restore inventory
    const restoredProducts = products.map((prd) => {
      const ordered = target.items.find((i) => i.productId === prd.id);
      if (ordered) {
        return {
          ...prd,
          stock: prd.stock + ordered.quantity,
          isAvailable: true,
        };
      }
      return prd;
    });

    setProducts(restoredProducts);
    StorageService.saveProducts(restoredProducts);

    setOrders(updated);
    StorageService.saveOrders(updated);
    showToast(`Dalabka #${orderId} waa la joojiyay.`);
    return true;
  };

  // Product CRUD (Admin)
  const addProduct = (prd: Omit<Product, 'id' | 'createdAt'>) => {
    if (!isAdmin) {
      showToast('Kuma lihid fasax (Admin required).', 'error');
      return;
    }
    const newProduct: Product = {
      ...prd,
      id: `prd-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    StorageService.saveProducts(updated);
    showToast(`Alaab cusub "${newProduct.nameSo}" ayaa lagu daray!`);
  };

  const updateProduct = (updatedPrd: Product) => {
    if (!isAdmin) return;
    const updated = products.map((p) => (p.id === updatedPrd.id ? updatedPrd : p));
    setProducts(updated);
    StorageService.saveProducts(updated);
    showToast(`Alaabta "${updatedPrd.nameSo}" waa la cusboonaysiiyay!`);
  };

  const deleteProduct = (productId: string) => {
    if (!isAdmin) return;
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    StorageService.saveProducts(updated);
    showToast('Alaabta waa la tirtiray.');
  };

  // Settings & Config
  const updateSettings = (newSettings: StoreSettings) => {
    if (!isAdmin) return;
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
    showToast('Xogta dukaanka waa la kaydiyay!');
  };

  const updatePaymentConfig = (newConfig: PaymentAccountConfig) => {
    if (!isAdmin) return;
    setPaymentConfig(newConfig);
    StorageService.savePaymentConfig(newConfig);
    showToast('Habka lacag-bixinta waa la cusboonaysiiyay!');
  };

  const updateDeliveryZone = (zone: DeliveryZone) => {
    if (!isAdmin) return;
    const updated = deliveryZones.map((z) => (z.id === zone.id ? zone : z));
    setDeliveryZones(updated);
    StorageService.saveDeliveryZones(updated);
    showToast('Goobta gaarsiinta waa la cusboonaysiiyay!');
  };

  const addDeliveryZone = (zone: Omit<DeliveryZone, 'id'>) => {
    if (!isAdmin) return;
    const newZone: DeliveryZone = {
      ...zone,
      id: `zone-${Date.now().toString().slice(-4)}`,
    };
    const updated = [...deliveryZones, newZone];
    setDeliveryZones(updated);
    StorageService.saveDeliveryZones(updated);
    showToast('Goob gaarsiin oo cusub ayaa lagu daray!');
  };

  const deleteDeliveryZone = (zoneId: string) => {
    if (!isAdmin) return;
    const updated = deliveryZones.filter((z) => z.id !== zoneId);
    setDeliveryZones(updated);
    StorageService.saveDeliveryZones(updated);
    showToast('Goobta gaarsiinta waa la tirtiray.');
  };

  // Auth Operations
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !pass) {
      return { success: false, error: 'Fadlan geli email-kaaga iyo furahaaga sirta ah.' };
    }

    // Check if designated admin
    if (cleanEmail === DESIGNATED_ADMIN_EMAIL.toLowerCase()) {
      const adminUser: UserProfile = {
        id: 'admin-diis',
        email: DESIGNATED_ADMIN_EMAIL,
        fullName: 'Fuad Diis Yasin (Admin)',
        phone: '+251 915 234 567',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00Z',
      };
      setCurrentUser(adminUser);
      StorageService.saveCurrentUser(adminUser);
      showToast('Ku soo dhawoow Maamulka Fuad E-Commerce!', 'success');
      setIsAuthModalOpen(false);
      return { success: true };
    }

    // Find registered user
    const found = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (found) {
      setCurrentUser(found);
      StorageService.saveCurrentUser(found);
      showToast(`Ku soo dhawoow Fuad E-Commerce, ${found.fullName}!`, 'success');
      setIsAuthModalOpen(false);
      return { success: true };
    }

    // Auto-create or allow test login if valid email
    if (cleanEmail.includes('@')) {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email: cleanEmail,
        fullName: cleanEmail.split('@')[0],
        phone: '+251 915 000 000',
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      StorageService.saveRegisteredUsers(updatedUsers);
      setCurrentUser(newUser);
      StorageService.saveCurrentUser(newUser);
      showToast(`Ku soo dhawoow Fuad E-Commerce, ${newUser.fullName}!`);
      setIsAuthModalOpen(false);
      return { success: true };
    }

    return { success: false, error: 'Email-ka ama furaha sirta ah waa qalad.' };
  };

  const signup = async (
    fullName: string,
    email: string,
    phone: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!fullName || !cleanEmail || !phone || !pass) {
      return { success: false, error: 'Fadlan buuxi dhammaan meelaha banaan.' };
    }

    if (pass.length < 6) {
      return { success: false, error: 'Furaha sirta ah waa inuu ka koobnaadaa ugu yaraan 6 xaraf ama tiro.' };
    }

    const exists = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, error: 'Email-kan hore ayaa loo diiwaangeliyay. Fadlan gal (Login).' };
    }

    const role = cleanEmail === DESIGNATED_ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer';

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      fullName: fullName.trim(),
      phone: phone.trim(),
      role,
      createdAt: new Date().toISOString(),
    };

    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    StorageService.saveRegisteredUsers(updated);

    setCurrentUser(newUser);
    StorageService.saveCurrentUser(newUser);

    showToast(`Hambalyo ${newUser.fullName}! Diiwaangelintaadu way guulaysatay.`, 'success');
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    StorageService.saveCurrentUser(null);
    setActiveView('home');
    showToast('Waad ka baxday koontadaada.', 'info');
  };

  const loginAsDesignatedAdmin = () => {
    const adminUser: UserProfile = {
      id: 'admin-diis',
      email: DESIGNATED_ADMIN_EMAIL,
      fullName: 'Fuad Diis Yasin (Admin)',
      phone: '+251 915 234 567',
      role: 'admin',
      createdAt: '2026-01-01T00:00:00Z',
    };
    setCurrentUser(adminUser);
    StorageService.saveCurrentUser(adminUser);
    setActiveView('admin-panel');
    setIsAuthModalOpen(false);
    showToast(`Waad gashay sida Maamulaha Sare (${DESIGNATED_ADMIN_EMAIL})`, 'success');
  };

  const loginAsCustomerDemo = () => {
    const customer = registeredUsers.find((u) => u.role === 'customer') || {
      id: 'cust-demo-1',
      email: 'ahmed.omar@example.com',
      fullName: 'Ahmed Omar Hassan',
      phone: '+251 915 112 233',
      role: 'customer' as const,
      createdAt: '2026-01-10T00:00:00Z',
    };
    setCurrentUser(customer);
    StorageService.saveCurrentUser(customer);
    setActiveView('customer-panel');
    setIsAuthModalOpen(false);
    showToast(`Waad gashay sida Macmiilka: ${customer.fullName}`, 'success');
  };

  const updateProfile = (fullName: string, phone: string, address?: EthiopianAddress) => {
    if (!currentUser) return;
    const updatedUser: UserProfile = {
      ...currentUser,
      fullName,
      phone,
      savedAddresses: address ? [address, ...(currentUser.savedAddresses || []).filter(a => a.landmark !== address.landmark)] : currentUser.savedAddresses,
    };
    setCurrentUser(updatedUser);
    StorageService.saveCurrentUser(updatedUser);

    const updatedList = registeredUsers.map((u) => (u.id === currentUser.id ? updatedUser : u));
    setRegisteredUsers(updatedList);
    StorageService.saveRegisteredUsers(updatedList);

    showToast('Xogta koontadaada waa la cusboonaysiiyay!');
  };

  // Filter Helpers
  const getCategoryProducts = (catId: CategoryId | 'all'): Product[] => {
    if (catId === 'all') return products;
    return products.filter((p) => p.categoryId === catId);
  };

  // Crucial Security: Customers only see their own orders!
  const getCustomerOrders = (): Order[] => {
    if (!currentUser) return [];
    if (isAdmin) return orders; // Admin can inspect all orders
    return orders.filter((o) => o.customerId === currentUser.id || o.customerEmail === currentUser.email);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        cart,
        orders,
        settings,
        paymentConfig,
        deliveryZones,
        currentUser,
        registeredUsers,
        isAuthenticated,
        isAdmin,
        activeView,
        setActiveView,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedProductId,
        setSelectedProductId,
        selectedOrderId,
        setSelectedOrderId,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        receiptModalOrder,
        setReceiptModalOrder,
        toasts,
        showToast,
        removeToast,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartItemCount,
        createOrder,
        updateOrderStatus,
        verifyPayment,
        cancelOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
        updatePaymentConfig,
        updateDeliveryZone,
        addDeliveryZone,
        deleteDeliveryZone,
        login,
        signup,
        logout,
        loginAsDesignatedAdmin,
        loginAsCustomerDemo,
        updateProfile,
        getCategoryProducts,
        getCustomerOrders,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
