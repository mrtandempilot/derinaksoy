import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language, LanguageContextType } from '../types';

const translations = {
  en: {
    // Navigation
    home: 'Home',
    tours: 'Tours',
    about: 'About',
    contact: 'Contact',
    admin: 'Admin',
    
    // Hero
    heroTitle: 'Experience the Thrill of Paragliding in Ölüdeniz',
    heroSubtitle: 'Soar above the stunning turquoise waters and mountains of Turkey',
    bookNow: 'Book Now',
    
    // Tours
    allTours: 'All Tours',
    popularTours: 'Popular Tours',
    viewDetails: 'View Details',
    from: 'From',
    duration: 'Duration',
    
    // Categories
    paragliding: 'Paragliding',
    adventure: 'Adventure',
    safari: 'Safari',
    waterSports: 'Water Sports',
    nature: 'Nature',
    boatTours: 'Boat Tours',
    
    // Booking
    adults: 'Adults',
    children: 'Children',
    selectDate: 'Select Date',
    selectTime: 'Select Time',
    totalAmount: 'Total Amount',
    confirmBooking: 'Confirm Booking',
    
    // Admin
    dashboard: 'Dashboard',
    bookings: 'Bookings',
    tourManagement: 'Tour Management',
    addTour: 'Add Tour',
    editTour: 'Edit Tour',
    deleteTour: 'Delete Tour',
    saveTour: 'Save Tour',
    cancel: 'Cancel',
    
    // Status
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    active: 'Active',
    inactive: 'Inactive',
    
    // Common
    name: 'Name',
    description: 'Description',
    price: 'Price',
    category: 'Category',
    actions: 'Actions',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Chat
    chatWithUs: 'Chat with us',
    typeMessage: 'Type a message...',
    send: 'Send',
  },
  tr: {
    // Navigation
    home: 'Ana Sayfa',
    tours: 'Turlar',
    about: 'Hakkımızda',
    contact: 'İletişim',
    admin: 'Yönetici',
    
    // Hero
    heroTitle: 'Ölüdeniz\'de Yamaç Paraşütü Heyecanını Yaşayın',
    heroSubtitle: 'Türkiye\'nin büyüleyici turkuaz suları ve dağları üzerinde süzülün',
    bookNow: 'Hemen Rezervasyon',
    
    // Tours
    allTours: 'Tüm Turlar',
    popularTours: 'Popüler Turlar',
    viewDetails: 'Detayları Gör',
    from: 'Başlangıç',
    duration: 'Süre',
    
    // Categories
    paragliding: 'Yamaç Paraşütü',
    adventure: 'Macera',
    safari: 'Safari',
    waterSports: 'Su Sporları',
    nature: 'Doğa',
    boatTours: 'Tekne Turları',
    
    // Booking
    adults: 'Yetişkin',
    children: 'Çocuk',
    selectDate: 'Tarih Seçin',
    selectTime: 'Saat Seçin',
    totalAmount: 'Toplam Tutar',
    confirmBooking: 'Rezervasyonu Onayla',
    
    // Admin
    dashboard: 'Kontrol Paneli',
    bookings: 'Rezervasyonlar',
    tourManagement: 'Tur Yönetimi',
    addTour: 'Tur Ekle',
    editTour: 'Turu Düzenle',
    deleteTour: 'Turu Sil',
    saveTour: 'Turu Kaydet',
    cancel: 'İptal',
    
    // Status
    pending: 'Beklemede',
    confirmed: 'Onaylandı',
    completed: 'Tamamlandı',
    cancelled: 'İptal Edildi',
    active: 'Aktif',
    inactive: 'Pasif',
    
    // Common
    name: 'İsim',
    description: 'Açıklama',
    price: 'Fiyat',
    category: 'Kategori',
    actions: 'İşlemler',
    search: 'Ara',
    filter: 'Filtrele',
    export: 'Dışa Aktar',
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',
    
    // Chat
    chatWithUs: 'Bizimle Sohbet Edin',
    typeMessage: 'Mesaj yazın...',
    send: 'Gönder',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });
  
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
