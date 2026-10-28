import { 
  Category, 
  DeliveryZone, 
  Order, 
  OrderStatus, 
  PaymentAccountConfig, 
  PaymentStatus, 
  Product, 
  StoreSettings, 
  UserProfile 
} from '../types';

export const DESIGNATED_ADMIN_EMAIL = 'diisyasin@gmail.com';

const STORAGE_KEYS = {
  PRODUCTS: 'fuad_products_v2',
  CATEGORIES: 'fuad_categories_v2',
  ORDERS: 'fuad_orders_v2',
  SETTINGS: 'fuad_settings_v4',
  PAYMENT_CONFIG: 'fuad_payment_config_v4',
  DELIVERY_ZONES: 'fuad_delivery_zones_v2',
  CURRENT_USER: 'fuad_current_user_v2',
  USERS_LIST: 'fuad_registered_users_v2',
};

// Initial Categories
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'dharka',
    nameSo: 'Dharka',
    nameEn: 'Clothing',
    iconName: 'Shirt',
    descriptionSo: 'Dharka dhaqanka iyo kuwa casriga ah ee ragga, dumarka iyo carruurta.',
  },
  {
    id: 'kabaha',
    nameSo: 'Kabaha',
    nameEn: 'Shoes & Footwear',
    iconName: 'Footprints',
    descriptionSo: 'Kabo tayo sare leh oo ku habboon munaasabadaha, shaqada iyo socodka.',
  },
  {
    id: 'elektaroonig',
    nameSo: 'Elektaroonig',
    nameEn: 'Electronics',
    iconName: 'Smartphone',
    descriptionSo: 'Taleefannada gacanta, power-bank cadceedda ah, nalal iyo agab tiknooloji.',
  },
  {
    id: 'agabka-guriga',
    nameSo: 'Agabka Guriga',
    nameEn: 'Home Goods',
    iconName: 'Home',
    descriptionSo: 'Qalabka jikada, dermooyinka, marawaxadaha iyo agabka qurxinta guriga.',
  },
  {
    id: 'quruxda',
    nameSo: 'Quruxda',
    nameEn: 'Beauty & Fragrance',
    iconName: 'Sparkles',
    descriptionSo: 'Uunsiga carfaya, fooxa, maydiga, barafuunnada iyo kiriimooyinka dabiiciga ah.',
  },
  {
    id: 'alaabo-kale',
    nameSo: 'Alaabo Kale',
    nameEn: 'Other Products',
    iconName: 'Package',
    descriptionSo: 'Alaabooyin kala duwan oo faa\'iido u leh nolosha maalinlaha ah.',
  },
];

// Initial realistic inventory reflecting retail in Shinile / Somali Region / Ethiopia
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prd-01',
    nameSo: 'Dirac Shifo Tayo Sare leh (3-Qaybood)',
    nameEn: 'Premium Chiffon Dirac 3-Piece Set',
    descriptionSo: 'Dirac tayo sare leh oo xariir ah oo ay la socdaan gorgorad iyo garbasaar. Ku habboon aroosyada iyo xafladaha gaarka ah.',
    categoryId: 'dharka',
    price: 3800,
    discountPrice: 3400,
    stock: 15,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true,
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    unit: 'joog',
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'prd-02',
    nameSo: 'Macawiis Indooniisiya Asal ah (Super 555)',
    nameEn: 'Authentic Indonesian Macawiis 555',
    descriptionSo: 'Macawiis asal ah oo cudbi jilicsan ah, midabkeedu aanu guurayn, aad u qabow xilliyada kulaylka.',
    categoryId: 'dharka',
    price: 1200,
    discountPrice: 950,
    stock: 35,
    isAvailable: true,
    isFeatured: true,
    isNewArrival: true,
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    unit: 'xabbo',
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'prd-03',
    nameSo: 'Kabo Saandhal Maqaar Asal ah (Ragga)',
    nameEn: 'Handcrafted Leather Sandals',
    descriptionSo: 'Kabo maqaar saafi ah oo gacanta lagu tolay, adkaysi badan oo ku habboon socodka iyo salaadda.',
    categoryId: 'kabaha',
    price: 1850,
    discountPrice: 1600,
    stock: 20,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true,
    imageUrl: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80',
    unit: 'lammaane',
    createdAt: '2026-01-20T12:00:00Z',
  },
  {
    id: 'prd-04',
    nameSo: 'Power Bank Qoraxda ku Shaqeeya (30,000mAh Solar)',
    nameEn: '30,000mAh Solar Power Bank with Torch',
    descriptionSo: 'Qalab kaydiya korontada qoraxda iyo tiiyaha caadiga ah. Leh toosh iftiin xooggan leh iyo afar xadhig oo telefoon kasta gala.',
    categoryId: 'elektaroonig',
    price: 2600,
    discountPrice: 2250,
    stock: 18,
    isAvailable: true,
    isFeatured: true,
    isNewArrival: true,
    imageUrl: 'https://images.unsplash.com/photo-1609592426868-6d55734bc988?auto=format&fit=crop&w=800&q=80',
    unit: 'xabbo',
    createdAt: '2026-02-15T09:00:00Z',
  },
  {
    id: 'prd-05',
    nameSo: 'Uunsi Maydi & Foox Carfaya (Kijooyinka Shinile)',
    nameEn: 'Premium Somali Maydi Frankincense & Bakhoor',
    descriptionSo: 'Uunsi Maydi asal ah oo caraf udgoon leh oo guriga u yeela udgoon soo jiidasho leh oo muddo dheer jiraya.',
    categoryId: 'quruxda',
    price: 900,
    discountPrice: 750,
    stock: 45,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true,
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    unit: 'baakidh',
    createdAt: '2026-01-10T11:00:00Z',
  },
  {
    id: 'prd-06',
    nameSo: 'Termuus Shaah & Bunka ah (2 Litir - Stainless Steel)',
    nameEn: 'Stainless Steel Insulated Vacuum Flask 2L',
    descriptionSo: 'Termuus bir ah oo kulaylka xafidaya in ka badan 24 saacadood. Waxaa ku fiican shaaha iyo bunka.',
    categoryId: 'agabka-guriga',
    price: 1550,
    discountPrice: 1350,
    stock: 22,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    unit: 'xabbo',
    createdAt: '2026-01-25T14:00:00Z',
  },
  {
    id: 'prd-07',
    nameSo: 'Kabo Sneaker Ciyaaraha & Orodka (Dumarka & Ragga)',
    nameEn: 'Breathable Running Sneakers',
    descriptionSo: 'Kabo aad u fudud oo raaxo leh, dusha ka neefsanaya, ku fiican socodka maalinlaha ah iyo ciyaaraha.',
    categoryId: 'kabaha',
    price: 2400,
    discountPrice: 2100,
    stock: 14,
    isAvailable: true,
    isNewArrival: true,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    unit: 'lammaane',
    createdAt: '2026-02-18T16:00:00Z',
  },
  {
    id: 'prd-08',
    nameSo: 'Earbuds Bluetooth Wireless (40 Saacadood Battery)',
    nameEn: 'Wireless Bluetooth Earbuds with ANC',
    descriptionSo: 'Sameecadaha wireless-ka oo leh cod cad, bass fiican, iyo sanduuq batari badan leh. Ku habboon wicitaannada iyo dhagaysiga.',
    categoryId: 'elektaroonig',
    price: 1750,
    discountPrice: 1450,
    stock: 28,
    isAvailable: true,
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    unit: 'xabbo',
    createdAt: '2026-02-01T13:00:00Z',
  },
  {
    id: 'prd-09',
    nameSo: 'Barafuun Carfaya Oud & Amber (100ml)',
    nameEn: 'Royal Oud & Amber Eau de Parfum',
    descriptionSo: 'Barafuun Carbeed oo tayo leh, ku jiri kara maryaha dhowr maalmood. Ku habboon hadiyadaha.',
    categoryId: 'quruxda',
    price: 2100,
    discountPrice: 1800,
    stock: 16,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    unit: 'dhalo',
    createdAt: '2026-01-28T09:00:00Z',
  },
  {
    id: 'prd-10',
    nameSo: 'Qalabka Cadceedda Nalalka Guriga (Solar Home Lighting Kit)',
    nameEn: 'Complete Solar Home Lighting Kit',
    descriptionSo: 'Kit dhammaystiran oo leh 3 nalal LED ah, solar panel, batari xooggan iyo meel taleefannada lagu dallaco.',
    categoryId: 'elektaroonig',
    price: 4900,
    discountPrice: 4400,
    stock: 8,
    isAvailable: true,
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    unit: 'kit',
    createdAt: '2026-02-12T11:00:00Z',
  },
  {
    id: 'prd-11',
    nameSo: 'Marawaxad Rechargable ah oo Koronto & Qorax leh',
    nameEn: 'Rechargeable Table Fan with Light',
    descriptionSo: 'Marawaxad qabow siisa qolka xilliga kulaylka xitaa marka korontadu go\'do. Waxaa ku jira nalka hurdada.',
    categoryId: 'agabka-guriga',
    price: 3200,
    discountPrice: 2850,
    stock: 12,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=800&q=80',
    unit: 'xabbo',
    createdAt: '2026-01-18T10:00:00Z',
  },
  {
    id: 'prd-12',
    nameSo: 'Saacad Casri ah oo Smartwatch ah (Waterproof)',
    nameEn: 'Smart Fitness Watch with Heart Rate',
    descriptionSo: 'Saacad cabbira wadne-garaaca, socodka, tusiya wicitaannada iyo farriimaha WhatsApp-ka.',
    categoryId: 'alaabo-kale',
    price: 2500,
    discountPrice: 2150,
    stock: 15,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    unit: 'xabbo',
    createdAt: '2026-02-05T15:00:00Z',
  },
];

// Initial Delivery Zones across Ethiopia
export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone-shinile',
    nameSo: 'Gudaha Shinile (Xarunta)',
    region: 'Somali Region',
    city: 'Shinile',
    fee: 50,
    estimatedTime: '24 Saacadood Gudahood',
    isFreeEligible: true,
    minOrderForFreeDelivery: 1500,
    isActive: true,
  },
  {
    id: 'zone-diredawa',
    nameSo: 'Dire Dawa Administration',
    region: 'Dire Dawa',
    city: 'Dire Dawa',
    fee: 120,
    estimatedTime: '1 Maalin',
    isFreeEligible: true,
    minOrderForFreeDelivery: 2500,
    isActive: true,
  },
  {
    id: 'zone-jigjiga',
    nameSo: 'Jigjiga (Caasimadda Deegaanka)',
    region: 'Somali Region',
    city: 'Jigjiga',
    fee: 180,
    estimatedTime: '1 - 2 Maalmood',
    isFreeEligible: true,
    minOrderForFreeDelivery: 3000,
    isActive: true,
  },
  {
    id: 'zone-harar',
    nameSo: 'Harar (Harari Region)',
    region: 'Harari',
    city: 'Harar',
    fee: 150,
    estimatedTime: '1 - 2 Maalmood',
    isFreeEligible: true,
    minOrderForFreeDelivery: 3000,
    isActive: true,
  },
  {
    id: 'zone-addis',
    nameSo: 'Addis Ababa (Finfinnee)',
    region: 'Addis Ababa',
    city: 'Addis Ababa',
    fee: 300,
    estimatedTime: '2 - 3 Maalmood',
    isFreeEligible: true,
    minOrderForFreeDelivery: 5000,
    isActive: true,
  },
  {
    id: 'zone-godey',
    nameSo: 'Godey & Kabridahar',
    region: 'Somali Region',
    city: 'Godey / Kabridahar',
    fee: 260,
    estimatedTime: '2 - 4 Maalmood',
    isFreeEligible: false,
    isActive: true,
  },
  {
    id: 'zone-other-ethiopia',
    nameSo: 'Magaalooyinka Kale ee Itoobiya',
    region: 'Other Ethiopia',
    city: 'All Other Cities',
    fee: 350,
    estimatedTime: '3 - 5 Maalmood',
    isFreeEligible: false,
    isActive: true,
  },
];

// Initial Payment Accounts Config
export const INITIAL_PAYMENT_CONFIG: PaymentAccountConfig = {
  telebirr: {
    enabled: true,
    merchantName: 'Fuad E-Commerce (Shinile)',
    accountNumber: '0913080604',
    instructionsSo: '1. Geli *127# ama fur Telebirr App.\n2. Dooro "Pay with Telebirr" ama "Send Money".\n3. Geli Lambarka: 0913080604 (Fuad E-Commerce).\n4. Geli wadarta lacagta saxda ah ee Birr.\n5. Marka lacagtu baxdo, koobi garee "Transaction ID" ama lambarka tixraaca oo ku qor sanduuqa hoose.',
    qrCodeUrl: '',
  },
  ebirr: {
    enabled: true,
    merchantName: 'Fuad E-Commerce Store',
    accountNumber: '0913080604',
    instructionsSo: '1. Isticmaal E-Birr USSD code ama E-Birr Mobile App.\n2. U wareeji lambarka ganacsiga: 0913080604.\n3. Geli tixraaca lacag-bixinta (E-Birr Ref ID) si maamulku u xaqiijiyo.',
    qrCodeUrl: '',
  },
  cbe: {
    enabled: true,
    bankName: 'Commercial Bank of Ethiopia (CBE)',
    accountName: 'Fuad Mohammed Ali',
    accountNumber: '1000456789123',
    instructionsSo: '1. Fur CBE Mobile Banking (*847# ama App-ka CBE Birr / Internet Banking).\n2. Dooro "Transfer to CBE Account".\n3. Lambarka Koontada: 1000456789123 (Fuad Mohammed Ali).\n4. Ka dib markaad lacagta dirto, ku qor Tixraaca Bangiga (CBE Transaction / Journal Reference) sanduuqa hoose.',
    qrCodeUrl: '',
  },
  cashOnDelivery: {
    enabled: true,
    instructionsSo: 'Waxaad lacagta caddaanka ah siinaysaa qofka alaabta kuu keenay markaad alaabta gacanta ku dhigto. (Waxay ka shaqaysaa Shinile iyo Dire Dawa oo kaliya).',
    maxOrderAmount: 5000,
  },
};

// Initial Store Settings
export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Fuad E-Commerce',
  locationName: 'Shinile, Somali Region',
  locationFull: 'Shinile, Somali Region, Ethiopia',
  contactPhone: '+251 913 080 604',
  whatsappNumber: '+251 913 080 604',
  contactEmail: 'diisyasin@gmail.com',
  currencyCode: 'ETB',
  currencySymbol: 'Br',
  headerAnnouncement: 'Alaabta Fuad E-Commerce waxaa laga dalban karaa meel kasta oo Itoobiya ah. Gaarsiinta waxaa laga maamulaa Shinile.',
  heroTagline: 'Ku Soo Dhawoow Fuad E-Commerce — Alaab Tayo Leh, Qiimo Macquul ah.',
  heroSubheadline: 'Dukaanka ugu weyn ee internetka ee Shinile iyo Deegaanka Soomaalida. Ka dalbo meel kasta oo aad Itoobiya kaga sugan tahay!',
  defaultDeliveryFee: 150,
  freeDeliveryThreshold: 3500,
  allowGuestBrowsing: true,
  termsContent: 'Shuruudaha Fuad E-Commerce: Dhammaan alaabooyinka waxaan ku keennaa muddo 24 ilaa 72 saacadood gudahood ah iyadoo ku xiran goobta aad ku sugan tahay. Lacag-bixintu waxay ku socotaa Telebirr, CBE ama E-Birr.',
  privacyContent: 'Xogtaada gaarka ah (magaca, taleefanka, iyo cinwaanka) waxaa loo isticmaalaa oo kaliya in laguugu keeno dalabkaaga. Waxba lama wadaago cid saddexaad.',
  aboutContent: 'Fuad E-Commerce waa ganacsi casri ah oo fadhigiisu yahay degmada Shinile ee Deegaanka Soomaalida Itoobiya. Waxaan u taagannahay inaan bulshada u adeegno alaabooyin tayo sare leh oo qiimo jaban ah.',
};

// Sample Orders to illustrate real order tracking, payment verification & PDF receipts
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'FUAD-2026-1001',
    receiptNumber: 'RCP-78210',
    customerId: 'cust-demo-1',
    customerName: 'Ahmed Omar Hassan',
    customerEmail: 'ahmed.omar@example.com',
    customerPhone: '+251 915 112 233',
    items: [
      {
        productId: 'prd-01',
        productName: 'Dirac Shifo Tayo Sare leh (3-Qaybood)',
        quantity: 1,
        unitPrice: 3400,
        totalPrice: 3400,
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
      },
      {
        productId: 'prd-05',
        productName: 'Uunsi Maydi & Foox Carfaya',
        quantity: 2,
        unitPrice: 750,
        totalPrice: 1500,
        imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
      },
    ],
    subtotal: 4900,
    deliveryFee: 180,
    discountAmount: 0,
    total: 5080,
    deliveryAddress: {
      fullName: 'Ahmed Omar Hassan',
      phone: '+251 915 112 233',
      region: 'Somali Region',
      cityOrTown: 'Jigjiga',
      kebele: '04',
      landmark: 'U dhow Jaamacadda Jigjiga',
      notes: 'Fadlan subaxda hore soo waca.',
    },
    paymentMethod: 'telebirr',
    paymentStatus: 'verified',
    paymentReference: 'TB-9988234190',
    orderStatus: 'waa_la_soo_diray',
    courierName: 'Liibaan (Shinile-Jigjiga Express)',
    courierPhone: '+251 915 445 566',
    estimatedDeliveryDays: '1-2 Maalmood',
    paymentAuditLog: [
      {
        timestamp: '2026-02-20T10:15:00Z',
        action: 'Tixraac Telebirr ayaa la soo gudbiyay (TB-9988234190)',
        by: 'Macmiilka',
      },
      {
        timestamp: '2026-02-20T10:45:00Z',
        action: 'Lacagta Telebirr waa la hubiyay oo la xaqiijiyay',
        by: 'Maamulaha (diisyasin@gmail.com)',
      },
    ],
    createdAt: '2026-02-20T10:10:00Z',
    updatedAt: '2026-02-20T10:45:00Z',
  },
  {
    id: 'FUAD-2026-1002',
    receiptNumber: 'RCP-78211',
    customerId: 'cust-demo-2',
    customerName: 'Fatima Abdi Warsame',
    customerEmail: 'fatima.abdi@example.com',
    customerPhone: '+251 922 778 899',
    items: [
      {
        productId: 'prd-04',
        productName: 'Power Bank Qoraxda ku Shaqeeya (30,000mAh Solar)',
        quantity: 1,
        unitPrice: 2250,
        totalPrice: 2250,
        imageUrl: 'https://images.unsplash.com/photo-1609592426868-6d55734bc988?auto=format&fit=crop&w=400&q=80',
      },
      {
        productId: 'prd-08',
        productName: 'Earbuds Bluetooth Wireless',
        quantity: 1,
        unitPrice: 1450,
        totalPrice: 1450,
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80',
      },
    ],
    subtotal: 3700,
    deliveryFee: 50,
    discountAmount: 0,
    total: 3750,
    deliveryAddress: {
      fullName: 'Fatima Abdi Warsame',
      phone: '+251 922 778 899',
      region: 'Somali Region',
      cityOrTown: 'Shinile',
      kebele: '01',
      landmark: 'U dhow Cisbitaalka Guud ee Shinile',
    },
    paymentMethod: 'cbe',
    paymentStatus: 'pending_verification',
    paymentReference: 'CBE-FT26052098',
    orderStatus: 'waa_la_xaqiijiyay',
    estimatedDeliveryDays: '24 Saacadood',
    paymentAuditLog: [
      {
        timestamp: '2026-02-24T14:30:00Z',
        action: 'Tixraaca CBE FT26052098 ayaa la soo gudbiyay — Xaqiijin sugaya',
        by: 'Macmiilka',
      },
    ],
    createdAt: '2026-02-24T14:20:00Z',
    updatedAt: '2026-02-24T14:30:00Z',
  },
];

// Helper to load or initialize storage
export const StorageService = {
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  },

  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
        return INITIAL_CATEGORIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  },

  getSettings(): StoreSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
        return INITIAL_SETTINGS;
      }
      return { ...INITIAL_SETTINGS, ...JSON.parse(data) };
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: StoreSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  },

  getPaymentConfig(): PaymentAccountConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENT_CONFIG);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PAYMENT_CONFIG, JSON.stringify(INITIAL_PAYMENT_CONFIG));
        return INITIAL_PAYMENT_CONFIG;
      }
      return { ...INITIAL_PAYMENT_CONFIG, ...JSON.parse(data) };
    } catch {
      return INITIAL_PAYMENT_CONFIG;
    }
  },

  savePaymentConfig(config: PaymentAccountConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENT_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save payment config', e);
    }
  },

  getDeliveryZones(): DeliveryZone[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DELIVERY_ZONES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.DELIVERY_ZONES, JSON.stringify(INITIAL_DELIVERY_ZONES));
        return INITIAL_DELIVERY_ZONES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DELIVERY_ZONES;
    }
  },

  saveDeliveryZones(zones: DeliveryZone[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DELIVERY_ZONES, JSON.stringify(zones));
    } catch (e) {
      console.error('Failed to save delivery zones', e);
    }
  },

  getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveCurrentUser(user: UserProfile | null): void {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.error('Failed to save current user', e);
    }
  },

  getRegisteredUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
      const defaults: UserProfile[] = [
        {
          id: 'admin-diis',
          email: DESIGNATED_ADMIN_EMAIL,
          fullName: 'Fuad Diis Yasin (Admin)',
          phone: '+251 915 234 567',
          role: 'admin',
          createdAt: '2026-01-01T00:00:00Z',
        },
        {
          id: 'cust-demo-1',
          email: 'ahmed.omar@example.com',
          fullName: 'Ahmed Omar Hassan',
          phone: '+251 915 112 233',
          role: 'customer',
          savedAddresses: [
            {
              fullName: 'Ahmed Omar Hassan',
              phone: '+251 915 112 233',
              region: 'Somali Region',
              cityOrTown: 'Jigjiga',
              kebele: '04',
              landmark: 'U dhow Jaamacadda Jigjiga',
            },
          ],
          createdAt: '2026-01-10T00:00:00Z',
        },
        {
          id: 'cust-demo-2',
          email: 'fatima.abdi@example.com',
          fullName: 'Fatima Abdi Warsame',
          phone: '+251 922 778 899',
          role: 'customer',
          savedAddresses: [
            {
              fullName: 'Fatima Abdi Warsame',
              phone: '+251 922 778 899',
              region: 'Somali Region',
              cityOrTown: 'Shinile',
              kebele: '01',
              landmark: 'U dhow Cisbitaalka Guud ee Shinile',
            },
          ],
          createdAt: '2026-01-15T00:00:00Z',
        },
      ];
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(defaults));
        return defaults;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveRegisteredUsers(users: UserProfile[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save registered users', e);
    }
  },
};

/**
 * SQL Schema Generator for Supabase
 * Generates ready-to-run PostgreSQL/Supabase migration code with RLS policies
 */
export function generateSupabaseMigrationSQL(): string {
  return `-- ====================================================================
-- FUAD E-COMMERCE (SHINILE, SOMALI REGION, ETHIOPIA)
-- PRODUCTION SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ====================================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name_so TEXT NOT NULL,
  name_en TEXT,
  icon_name TEXT,
  description_so TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name_so TEXT NOT NULL,
  name_en TEXT,
  description_so TEXT NOT NULL,
  category_id TEXT REFERENCES public.categories(id),
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  discount_price NUMERIC(12, 2) CHECK (discount_price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  image_url TEXT NOT NULL,
  unit TEXT DEFAULT 'xabbo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  saved_addresses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Delivery Zones
CREATE TABLE IF NOT EXISTS public.delivery_zones (
  id TEXT PRIMARY KEY,
  name_so TEXT NOT NULL,
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  fee NUMERIC(10, 2) NOT NULL DEFAULT 150.00,
  estimated_time TEXT NOT NULL,
  is_free_eligible BOOLEAN DEFAULT true,
  min_order_for_free_delivery NUMERIC(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  receipt_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  subtotal NUMERIC(12, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL,
  delivery_address JSONB NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('telebirr', 'ebirr', 'cbe', 'cash_on_delivery')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'pending_verification', 'verified', 'rejected', 'refunded')),
  payment_reference TEXT,
  payment_proof_url TEXT,
  order_status TEXT NOT NULL DEFAULT 'dalabka_la_helay' CHECK (order_status IN ('dalabka_la_helay', 'waa_la_xaqiijiyay', 'diyaarinta_alaabta', 'waa_la_soo_diray', 'waa_la_dhiibayaa', 'waa_la_gaarsiiyay', 'waa_la_joojiyay')),
  courier_name TEXT,
  courier_phone TEXT,
  estimated_delivery_days TEXT,
  cancellation_reason TEXT,
  payment_audit_log JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12, 2) NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL,
  image_url TEXT
);

-- 7. Create Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin (diisyasin@gmail.com)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (email = '${DESIGNATED_ADMIN_EMAIL}' OR role = 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Categories & Products: Public can read, only admin can insert/update/delete
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (is_available = true OR public.is_admin());
CREATE POLICY "Admin write products" ON public.products FOR ALL USING (public.is_admin());

CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (public.is_admin());

-- Profiles: Users can read/update their own profile. Admin can view all.
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Orders: Customers can ONLY see their own orders. Admin can see and manage all.
CREATE POLICY "Customers read own orders" ON public.orders FOR SELECT USING (auth.uid() = customer_id OR public.is_admin());
CREATE POLICY "Customers create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Admin manage orders" ON public.orders FOR UPDATE USING (public.is_admin());

-- Order Items: Viewable if user has access to order
CREATE POLICY "Read order items" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.customer_id = auth.uid() OR public.is_admin())
  )
);
CREATE POLICY "Insert order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.customer_id = auth.uid()
  )
);

-- Delivery Zones & Settings
CREATE POLICY "Public read zones" ON public.delivery_zones FOR SELECT USING (true);
CREATE POLICY "Admin manage zones" ON public.delivery_zones FOR ALL USING (public.is_admin());

CREATE POLICY "Public read settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage settings" ON public.store_settings FOR ALL USING (public.is_admin());
`;
}
