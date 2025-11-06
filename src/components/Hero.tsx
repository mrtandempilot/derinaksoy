import { useLanguage } from '../contexts/LanguageContext';

export function Hero() {
  const { t } = useLanguage();

  const scrollToTours = () => {
    const toursSection = document.getElementById('tours');
    toursSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-600">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          {t('heroTitle')}
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-8 drop-shadow-md">
          {t('heroSubtitle')}
        </p>
        <button
          onClick={scrollToTours}
          className="px-8 py-4 bg-accent text-white text-lg font-semibold rounded-lg hover:bg-orange-600 transform hover:scale-105 transition-all duration-200 shadow-xl"
        >
          {t('bookNow')}
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  );
}
