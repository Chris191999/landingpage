import React, { useState, useEffect, Suspense } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import KeyFeaturesLightbox from './KeyFeaturesLightbox';
import { Plane, ClipboardCheck, FileText, Package, Shield, Layers, Square, Sparkles, Gift } from 'lucide-react';
import RubiksCube3D from './RubiksCube3D';

declare global {
  interface Window {
    Trustpilot?: any;
  }
}

// Only load heavy backgrounds if not reduced motion
const useShouldAnimate = () => {
  const [shouldAnimate, setShouldAnimate] = useState(true);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldAnimate(!media.matches);
  }, []);
  return shouldAnimate;
};

const keyFeaturesImages = {
  overview: [{ src: '/overview.jpg', alt: 'Overview Screenshot' }],
  allTrades: [{ src: '/all trades.jpg', alt: 'All Trades Screenshot' }],
  addTrades: [{ src: '/add trades.jpg', alt: 'Add Trades Screenshot' }],
  analytics: [
    { src: '/a1.jpg', alt: 'Analytics 1' },
    { src: '/a2.jpg', alt: 'Analytics 2' },
    { src: '/a3.jpg', alt: 'Analytics 3' },
  ],
  aif: [
    { src: '/ata1.jpg', alt: 'AIF 1' },
    { src: '/ata2.jpg', alt: 'AIF 2' },
    { src: '/ata3.jpg', alt: 'AIF 3' },
    { src: '/ata4.jpg', alt: 'AIF 4' },
    { src: '/ata5.jpg', alt: 'AIF 5' },
  ],
  importExport: [{ src: '/importexport.jpg', alt: 'Import Export Screenshot' }],
};

// Rolling text component
const RollingText = () => {
  const texts = [
    "Track Every Trade",
    "Analyze Performance", 
    "Master Your Mind",
    "Build Discipline",
    "Grow Consistently"
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-12 sm:h-16 flex items-center justify-center overflow-hidden">
      <motion.div
        key={currentIndex}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white/90 text-center px-4"
      >
        {texts[currentIndex]}
      </motion.div>
    </div>
  );
};

// Update RollingBrandImages to show brand images in a rolling/scrolling row
const brandImages = [
  { src: '/cursor%20ai.jpg', alt: 'Cursor AI' },
  { src: '/paypal.jpg', alt: 'PayPal' },
  { src: '/razorpay.jpg', alt: 'Razorpay' },
  { src: '/resend.jpg', alt: 'Resend' },
  { src: '/supabase.jpg', alt: 'Supabase' },
];

const RollingBrandImages = () => {
  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-transparent via-white/5 to-transparent py-4 sm:py-6">
      <div className="flex items-center justify-center mb-2 sm:mb-3">
        <span className="text-xs sm:text-sm text-white/60 font-medium tracking-wider uppercase">
          Powered by
        </span>
      </div>
      <div className="relative w-full overflow-hidden flex justify-center">
        <div
          className="inline-flex whitespace-nowrap items-center animate-scroll"
          style={{ minWidth: '100%' }}
        >
          {brandImages.concat(brandImages).map((img, idx) => (
            <img
              key={idx}
              src={img.src}
              alt={img.alt}
              className="h-8 sm:h-10 md:h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 rounded shadow-md bg-white/10 mx-4"
              draggable={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Premium Promotions Banner Component
const PromotionsBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="w-full relative overflow-hidden mb-8 sm:mb-12"
    >
      {/* Glass Morphism Container */}
      <div className="glass-morphism border border-white/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl mx-auto max-w-6xl relative overflow-hidden">
        {/* Sparkle Effects */}
        <div className="absolute top-2 left-4 text-yellow-400 animate-pulse">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="absolute top-3 right-6 text-pink-400 animate-pulse delay-300">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
        <div className="absolute bottom-2 left-8 text-purple-400 animate-pulse delay-700">
          <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        
        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Promotion Text */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
                className="inline-flex items-center gap-2 mb-2"
              >
                <span className="text-xs sm:text-sm font-bold text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded-full border border-yellow-400/30">
                  🔥 LIMITED TIME
                </span>
              </motion.div>
              
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Aura Farming Early Access Sale is Live!
                </span>
              </h3>
              
              <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto lg:mx-0">
                Get <span className="font-bold text-yellow-400">FREE Goated Plans for 2 weeks</span> - 
                Just signup using <span className="font-semibold text-purple-300">"Let him cook"</span> FREE plan
              </p>
            </div>
            
            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Button 
                asChild 
                className="bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 text-white border-none hover:from-yellow-400 hover:via-pink-400 hover:to-purple-500 font-bold text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300"
              >
                <Link to="/auth" className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Claim Now
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Animated Border Glow */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-purple-400/20 animate-pulse-glow pointer-events-none"></div>
      </div>
    </motion.div>
  );
};

export const LandingPage: React.FC = React.memo(() => {
  const shouldAnimate = useShouldAnimate();
  
  // Enhanced particle config for dark theme - optimized for mobile
  const particlesInit = async (main: any) => {
    // await loadFull(main); // Disabled to fix engine.checkVersion error
  };
  
  const particlesOptions = {
    background: { color: { value: 'transparent' } },
    fpsLimit: 30, // Reduced for mobile performance
    particles: {
      color: { 
        value: ['#ffffff', '#e2e8f0', '#cbd5e1']
      },
      links: { 
        enable: true, 
        color: '#ffffff', 
        opacity: 0.05, // Reduced opacity for better mobile performance
        width: 0.3,
        distance: 100
      },
      move: { 
        enable: true, 
        speed: 0.3, // Slower for better mobile performance
        direction: "none" as any,
        random: true,
        straight: false,
        outModes: {
          default: "bounce" as any
        }
      },
      number: { value: window.innerWidth < 768 ? 25 : 40 }, // Fewer particles on mobile
      opacity: { 
        value: 0.15, // Reduced for mobile
        random: true,
        animation: {
          enable: true,
          speed: 0.8,
          minimumValue: 0.03
        }
      },
      shape: { type: 'circle' },
      size: { 
        value: 1.5,
        random: true,
        animation: {
          enable: true,
          speed: 0.8,
          minimumValue: 0.3
        }
      },
    },
    detectRetina: true,
  } as any;

  const scrollToHero2 = () => {
    document.getElementById('hero2')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<{src: string; alt?: string}[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (images: {src: string; alt?: string}[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  // Manually trigger Trustpilot widget load after render
  useEffect(() => {
    const interval = setInterval(() => {
      if ((window as any).Trustpilot && document.getElementById('trustpilot-widget')) {
        (window as any).Trustpilot.loadFromElement(document.getElementById('trustpilot-widget'), true);
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden dark-tech-bg">
      {/* Floating Orbs - Hide on mobile for performance */}
      <div className="hidden md:block fixed inset-0 overflow-hidden -z-5">
        <div className="floating-orb" />
        <div className="floating-orb" />
        <div className="floating-orb" />
      </div>

      {/* Particle Background - Only show on desktop or when user prefers animations */}
      {shouldAnimate && window.innerWidth > 768 && (
        <Particles 
          className="fixed inset-0 -z-10" 
          id="tsparticles" 
          init={particlesInit} 
          options={particlesOptions} 
        />
      )}

      {/* Top Navigation - Responsive */}
      <nav className="fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50 w-auto">
        <div className="glass-morphism border border-white/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl mx-auto max-w-5xl">
          <div className="px-3 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2 sm:py-2">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-medium text-white/70 hidden sm:block">
                  from the productions of
                </div>
                <div className="text-sm sm:text-base md:text-lg font-bold truncate" style={{ color: '#8b2dde' }}>
                  The House Of Traders
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-auto flex-shrink-0">
                <Button 
                  asChild 
                  size="sm"
                  className="button-3d bg-transparent text-white border-white/40 hover:bg-white/10 hover:border-white/60 transition-all duration-300 font-semibold text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                >
                  <Link to="/auth" className="block">Login</Link>
                </Button>
                <Button 
                  asChild 
                  size="sm"
                  className="button-3d bg-gradient-to-r from-purple-600 to-purple-700 text-white border-transparent hover:from-purple-500 hover:to-purple-600 premium-glow font-semibold text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                >
                  <Link to="/auth" className="block">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section 1 - Mobile Optimized */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-6 sm:pt-10">
        {/* Mobile-only notice below header */}
        <div className="block md:hidden w-full text-center text-xs text-yellow-300 bg-black/60 py-2 mb-2 z-50">
          Turn on desktop site on mobile browser for maximum optimisation
        </div>
        
        {/* Guardian Images - hidden on mobile */}
        <img
          src="/tht-trademind%20facing%20right.png"
          alt="Guardian on the left"
          className="absolute bottom-0 left-0 h-[60vh] max-h-[700px] w-auto object-contain hidden md:block z-0"
          style={{
            maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
          }}
        />
        <img
          src="/tht-trademind%20facing%20left.png"
          alt="Guardian on the right"
          className="absolute bottom-0 right-0 h-[60vh] max-h-[700px] w-auto object-contain hidden md:block z-0"
          style={{
            maskImage: 'linear-gradient(to left, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to left, black 70%, transparent 100%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-4xl mx-auto w-full"
        >
          {/* 3D Rubik's Cube - Responsive sizing */}
          <div className="flex justify-center mb-4 sm:mb-8">
            <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] max-w-xs sm:max-w-md md:max-w-lg mx-auto">
              <Suspense fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="text-white text-center text-sm sm:text-base">Loading 3D Cube...</div>
                </div>
              }>
                <RubiksCube3D />
              </Suspense>
            </div>
          </div>

          {/* Title - with removed India's 1st branding from here */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl xl:text-6xl font-black mb-4 sm:mb-6 tracking-tight">
            <span className="text-white/90">Introducing</span>{' '}
            <br className="sm:hidden" />
            <span 
              style={{ 
                color: '#f4dd00',
              }}
            >
              TRADEMIND
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-8 font-medium max-w-2xl mx-auto leading-relaxed px-4">
            The last missing piece in your trading puzzle. 
            <br className="hidden sm:block" />
            <span className="text-white/90">From the Trader To the Trader</span>
          </p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            onClick={scrollToHero2}
            className="button-3d px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-lg animate-pulse-glow bg-gradient-to-r from-purple-600 to-purple-700"
            aria-label="Discover More"
          >
            Discover More
          </motion.button>
        </motion.div>
      </section>

      {/* Rolling Text Section - Mobile Optimized */}
      <section className="relative z-10 py-16 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <RollingText />
          </motion.div>
        </div>
      </section>

      {/* Hero Section 2 - Mobile Optimized with India's 1st branding near Journal */}
      <section id="hero2" className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-6xl mx-auto w-full"
        >
          {/* India's 1st branding - moved here near Journal */}
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-orange-500 font-extrabold mb-2 sm:mb-4">
            India's 1st
          </div>
          
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-4 sm:mb-6" style={{ color: '#f4dd00' }}>
            Journal
          </h2>
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 mb-2 sm:mb-4 font-semibold">
            Trades. Risks. Mind.
          </div>
          <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 mb-8 sm:mb-12 md:mb-16 font-medium">
            Measure it. Master it.
          </div>
          
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 md:mb-12">
            Watch demo video here
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="glass-card p-4 sm:p-6 max-w-4xl mx-auto"
          >
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe 
                className="absolute top-0 left-0 w-full h-full rounded-xl sm:rounded-2xl shadow-2xl"
                src="https://www.youtube.com/embed/UYXa2yBF5ms?si=uv2GewCAxyyfi-ft" 
                title="TRADEMIND Demo" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen 
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Why Choose Section - Mobile Optimized */}
      <section className="relative z-10 py-16 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-12 sm:mb-16 md:mb-20"
            style={{ color: '#8b2dde' }}
          >
            Why Choose TRADEMIND?
          </motion.h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Plane, title: "Fully automated statistics", desc: "Our system runs on powerful servers. Fast and robust." },
              { icon: ClipboardCheck, title: "Unlock data-backed key insights", desc: "For the stats nerds out there." },
              { icon: FileText, title: "Identify your strengths and weaknesses", desc: "Discover the trader behind the trades." },
              { icon: Package, title: "Analyze your trading/investing statistics", desc: "Know what works, Fix what doesn't." },
              { icon: Shield, title: "Understand your trades and yourself", desc: "Advanced analytics to improve your trading performance." },
              { icon: Layers, title: "AIF technology - AI integrated feedback system", desc: "Smart insights powered by artificial intelligence." },
              { icon: Square, title: "Your time spent with us is never wasted", desc: "Import/export zip files and pdfs anytime." }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass-card p-6 sm:p-8 hover:scale-105 transition-all duration-300 group"
              >
                <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 text-white/80 mb-3 sm:mb-4 group-hover:text-white transition-colors duration-300" />
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{feature.title}</h4>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section - Mobile Optimized */}
      <section className="relative z-10 py-16 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-12 sm:mb-16 md:mb-20 golden-text"
          >
            Key Features
          </motion.h3>
          
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {[
              { title: "Overview", desc: "Trading calendar feature to effectively review weekly and monthly performance.", images: keyFeaturesImages.overview },
              { title: "All Trades", desc: "Advanced filtering to filter trades and investments by Strategy name, Economic events, Emotions and Mistake", images: keyFeaturesImages.allTrades },
              { title: "Add Trades", desc: "Write trade notes, upload screenshots and images and view all in one place", images: keyFeaturesImages.addTrades },
              { title: "Analytics", desc: "Complete statistical advantage with Core Metrics, Risk and Reward Metrics, Drawdown and Streak Analysis, System Quality Metrics. Eagleeye view of Cumulative Performance chart and Equity progression", images: keyFeaturesImages.analytics },
              { title: "AIF technology", desc: "AI integrated Feedback assistance system to track your risk, psychology and time based skills and models. TradeMind performance scores to evaluate your Performance.", images: keyFeaturesImages.aif },
              { title: "Import/export", desc: "Disaster proof data security by exporting and importing raw data files. Export full trade records and stats by pdf ensuring your time with us will not be wasted!", images: keyFeaturesImages.importExport }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="glass-card p-6 sm:p-8 hover:scale-[1.02] transition-all duration-500"
              >
                <h4 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">{feature.title}</h4>
                <p className="text-sm sm:text-base md:text-lg text-white/70 mb-4 sm:mb-6 leading-relaxed">{feature.desc}</p>
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
                  {feature.images.map((img, imgIndex) => (
                    <div 
                      key={imgIndex}
                      onClick={() => openLightbox(feature.images, imgIndex)} 
                      className="flex-shrink-0 cursor-zoom-in hover:scale-105 transition-transform duration-300"
                    >
                      <img 
                        src={img.src} 
                        alt={img.alt} 
                        className="w-36 h-24 sm:w-48 sm:h-32 object-cover rounded-lg sm:rounded-xl glass-morphism" 
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Place PromotionsBanner above Pricing Section */}
      <div className="mb-8 sm:mb-12">
        <PromotionsBanner />
      </div>

      {/* Pricing Section - Mobile Optimized */}
      <section className="relative z-10 py-16 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Trustpilot CTA Image */}
          <div className="flex justify-center mb-12 mt-[-64px]">
            <a href="https://www.trustpilot.com/review/trademind.co.in" target="_blank" rel="noopener noreferrer"
              className="transition-transform duration-500 ease-in-out hover:scale-110"
              style={{ display: 'inline-block' }}
            >
              <img 
                src="/trustpilot-cta.png" 
                alt="Trustpilot Reviews" 
                style={{ height: '130px', width: 'auto', boxShadow: '0 4px 32px 0 rgba(0,0,0,0.15)', borderRadius: '12px' }} 
                className="animate-scale-in"
              />
            </a>
          </div>
          <style>{`
            @keyframes scale-in {
              0% { transform: scale(0.7); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-scale-in {
              animation: scale-in 0.7s cubic-bezier(0.22, 1, 0.36, 1);
            }
          `}</style>
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-12 sm:mb-16 md:mb-20 golden-text"
          >
            Choose Your Plan
          </motion.h3>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, duration: 0.8 }}
              className="plan-card plan-card-free p-6 sm:p-8 text-center hover:scale-105 transition-all duration-500 rounded-2xl hover:shadow-2xl hover:shadow-white/20"
            >
              <h4 className="text-xl sm:text-2xl font-bold text-white/90 mb-3 sm:mb-4">Let him cook</h4>
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6">FREE</div>
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <li className="text-white/80 flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg">
                  <span className="text-green-400 text-lg sm:text-xl">✓</span>
                  ALL FEATURES (Cooked/Goated) for FREE!
                </li>
              </ul>
              <Button asChild className="w-full button-3d bg-transparent border-white/40 text-white hover:bg-white/10 font-semibold text-sm sm:text-base">
                <Link to="/auth">Get Started</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="plan-card plan-card-cooked p-6 sm:p-8 text-center transition-all duration-500 rounded-2xl relative"
            >
              <h4 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Cooked</h4>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">Indian users <span className="text-purple-300">₹499/mo</span></div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">International users <span className="text-purple-300">$8/mo</span></div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-left">
                {["Access to Overview", "Access to All Trades", "Access to Add Trades", "Access to Analytics", "Access to Limited cloud storage"].map((feature, i) => (
                  <li key={i} className="text-white/80 flex items-center gap-2 text-sm sm:text-base">
                    <span className="text-purple-400 text-base sm:text-lg">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600 font-semibold border-none text-sm sm:text-base">
                <Link to="/auth">Upgrade</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="plan-card plan-card-goated p-6 sm:p-8 text-center transition-all duration-500 rounded-2xl"
            >
              <h4 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Goated</h4>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">Indian users <span className="text-yellow-400">₹799/mo</span></div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">International users <span className="text-yellow-400">$12/mo</span></div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-left">
                {["All Basic features", "Import/export trades as zip/pdf", "Unlimited cloud storage", "Advanced AI Integrated Feedbacks"].map((feature, i) => (
                  <li key={i} className="text-white/80 flex items-center gap-2 text-sm sm:text-base">
                    <span className="text-yellow-400 text-base sm:text-lg">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-black hover:from-yellow-500 hover:to-yellow-600 font-semibold border-none text-sm sm:text-base">
                <Link to="/auth">Go Goated</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Insert RollingBrandImages here, after pricing section and before quick links */}
      <div className="mb-6 sm:mb-8 max-w-7xl mx-auto">
        <RollingBrandImages />
      </div>

      {/* Footer Navigation Cards - Mobile Optimized */}
      <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-white"
          >
            Quick Links
          </motion.h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {[
              { title: "About Us", desc: "Learn more about our mission and team", href: "/about" },
              { title: "Contact Us", desc: "Get in touch with our support team", href: "/contact" },
              { title: "Pricing", desc: "Choose the plan that fits your needs", href: "/pricing" },
              { title: "Privacy Policy", desc: "How we protect your data", href: "/privacy" },
              { title: "Terms & Conditions", desc: "Our terms of service", href: "/terms" },
              { title: "Refund Policy", desc: "Cancellation and refund information", href: "/refund" }
            ].map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass-card p-4 sm:p-6 hover:scale-105 transition-all duration-300 group cursor-pointer"
              >
                <Link to={link.href} className="block">
                  <h4 className="text-sm sm:text-base md:text-lg font-bold text-white mb-2 sm:mb-3 group-hover:text-purple-300 transition-colors duration-300">
                    {link.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {link.desc}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Footer - Mobile Optimized */}
      <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-6 sm:p-8">
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Contact Us</h4>
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <a 
                href="mailto:Thehouseoftraders69@gmail.com" 
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300 text-sm sm:text-base md:text-lg break-all"
              >
                <span>📧</span> 
                <span className="break-all">Thehouseoftraders69@gmail.com</span>
              </a>
              <a
                href="https://discord.gg/fqQSQnpbB4"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-200 transition-colors duration-300 text-sm sm:text-base md:text-lg font-semibold"
              >
                <img src="/discord-server.png" alt="Discord" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" />
                <span>Join our Discord Community</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <KeyFeaturesLightbox 
        images={lightboxImages} 
        photoIndex={lightboxIndex} 
        isOpen={lightboxOpen} 
        onClose={closeLightbox} 
      />

      {/* Add enhanced animation styles */}
      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-scroll {
            animation: scroll 20s linear infinite;
          }
          
          @keyframes shine {
            0% {
              text-shadow: 0 0 5px #f4dd00, 0 0 10px #f4dd00, 0 0 15px #f4dd00;
            }
            100% {
              text-shadow: 0 0 10px #f4dd00, 0 0 20px #f4dd00, 0 0 25px #f4dd00;
            }
          }
          
          .glass-morphism {
            background: rgba(20, 24, 38, 0.75);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
          }
        `}
      </style>
    </div>
  );
});

export default LandingPage;
