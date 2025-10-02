'use client'

import Link from "next/link";
import Image from "next/image";
import { Clock, Star, MapPin, Phone, Mail, Flame, Users, Zap, Award } from "lucide-react";
import { useState, useEffect } from "react";

// Typing animation component
function TypingText({ text, speed = 50, delay = 0, onComplete }: { 
  text: string; 
  speed?: number; 
  delay?: number;
  onComplete?: () => void;
}) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (delay > 0) {
      const delayTimeout = setTimeout(() => {
        setStarted(true);
      }, delay);
      return () => clearTimeout(delayTimeout);
    } else {
      setStarted(true);
    }
  }, [delay]);

  useEffect(() => {
    if (started && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (started && currentIndex === text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, started, onComplete]);

  return (
    <span>
      {displayText}
      {started && currentIndex < text.length && (
        <span className="typing-cursor">|</span>
      )}
    </span>
  );
}

interface MenuItem {
  id: string;
  name: string;
  nameTr: string;
  description?: string;
  descriptionTr?: string;
  price: number;
  image?: string;
  category: {
    id: string;
    name: string;
    nameTr: string;
  };
}

export default function Home() {
  const [showSecondParagraph, setShowSecondParagraph] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [featuredMenuItems, setFeaturedMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await fetch('/api/menu-items/featured');
        if (response.ok) {
          const featuredItems = await response.json();
          setFeaturedMenuItems(featuredItems);
        }
      } catch (error) {
        console.error('Error fetching featured menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 relative overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-600/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-500/10 rounded-full blur-lg animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-yellow-500/10 rounded-full blur-md animate-pulse animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-8xl font-bold mb-6 pizza-title">
                PIZZA HOT
              </h1>
              <div className="flex items-center justify-center gap-4 mb-6">
                <Flame className="h-8 w-8 text-red-500 animate-bounce" />
                <span className="text-2xl md:text-4xl font-bold text-orange-400">
                  Pizzanın En Sıcak Hali!
                </span>
                <Flame className="h-8 w-8 text-red-500 animate-bounce" />
              </div>
            </div>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Her gün taptaze hamurumuz, kaliteli malzemelerimiz ve ateş gibi servisimizle pizzanın tadını zirveye çıkarıyoruz.

            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link 
                href="/menu" 
                className="group relative bg-gradient-to-r from-red-600 to-orange-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-red-500 hover:to-orange-500 transition-all duration-300 shadow-2xl glow-effect transform hover:scale-105"
              >
                <Flame className="inline-block w-5 h-5 mr-2" />
                Pizza Menümüz
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              <a 
                href="tel:+905309337444" 
                className="group bg-transparent border-2 border-orange-500 text-orange-400 px-10 py-4 rounded-xl font-bold text-lg hover:bg-orange-500 hover:text-black transition-all duration-300 shadow-xl transform hover:scale-105"
              >
                <Phone className="inline-block w-5 h-5 mr-2" />
                Sipariş Ver
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="glass-effect p-8 rounded-2xl text-center border border-red-900/30 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 glow-effect">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-orange-400 mb-2">20-35 dk</div>
                <div className="text-base text-gray-300">Teslimat süresi mesafeye göre</div>
              </div>
              <div className="glass-effect p-8 rounded-2xl text-center border border-red-900/30 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105">
                <div className="bg-gradient-to-br from-red-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 glow-effect">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-orange-400 mb-2">4.9</div>
                <div className="text-base text-gray-300">Müşteri Puanı</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 pizza-title">
            Neden Pizza Hot?
          </h2>
          
          {/* Pizza Showcase */}
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            <div className="space-y-8">
              <div className="glass-effect p-8 rounded-2xl border border-red-900/30 hover:border-orange-500/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-r from-red-600 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center glow-effect">
                    <Flame className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-orange-400">Ateş Gibi Sıcak</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Her Lokmada Sıcaklık ve Lezzet
Taptaze açılan hamurlarımız ve bol malzemelerimizle hazırlanan pizzalar, fırından çıkar çıkmaz sıcacık bir şekilde sofranıza ulaşıyor. 🍕🔥

                </p>
              </div>
              
              <div className="glass-effect p-8 rounded-2xl border border-red-900/30 hover:border-orange-500/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-r from-orange-600 to-yellow-500 w-16 h-16 rounded-full flex items-center justify-center glow-effect">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-orange-400">Baharatlı Özel Soslar</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Sırrımız Soslarımızda
Pizza Hot’un özel tarif sosları, baharatların eşsiz uyumuyla pizzalarımıza bambaşka bir karakter katıyor. 🌶✨

                </p>
              </div>
              
              <div className="glass-effect p-8 rounded-2xl border border-red-900/30 hover:border-orange-500/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-r from-red-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center glow-effect">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-orange-400">Ateşli Teslimat</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Hızlı ve Güvenilir Teslimat
Siparişiniz, tazeliğini koruyarak en kısa sürede kapınıza ulaştırılır. Soğumadan, tam kıvamında pizza keyfi! 🚴‍♂💨

                </p>
              </div>
            </div>
            
            {/* Featured Pizza Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-3xl blur-xl"></div>
              <div className="relative glass-effect rounded-3xl p-8 border border-red-900/30">
                <Image
                  src="/signature-piza.jpg"
                  alt="imza pizza"
                  width={500}
                  height={500}
                  className="rounded-2xl shadow-2xl w-full glow-effect"
                  priority={false}
                  loading="lazy"
                />
                <div className="mt-6 text-center">
                  <h4 className="text-2xl font-bold text-orange-400 mb-2">🔥 Pizza Hot’un İmza Lezzeti</h4>
                  <p className="text-gray-300">Baharatlı sosu, özel peynir karışımı ve bol malzemesiyle “Pizza Hot” damaklarda iz bırakıyor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Items Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-red-950/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 pizza-title">
             Öne Çıkan Lezzetler
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-effect rounded-2xl border border-red-900/30 p-6 animate-pulse">
                  <div className="bg-gray-700 h-48 rounded-xl mb-4"></div>
                  <div className="bg-gray-700 h-6 rounded mb-2"></div>
                  <div className="bg-gray-700 h-4 rounded mb-2"></div>
                  <div className="bg-gray-700 h-6 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {featuredMenuItems.map((item) => (
                <div key={item.id} className="glass-effect rounded-2xl overflow-hidden border border-red-900/30 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105">
                  <div className="relative h-48 bg-gray-800">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.nameTr || item.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                        priority={false}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/50 to-orange-900/50">
                        <span className="text-6xl">🍕</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-orange-400 mb-2">
                      🔥 {item.nameTr || item.name}
                    </h3>
                    <p className="text-gray-300 mb-3 text-sm">
                      {item.descriptionTr || item.description || "Lezzetli pizza"}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-orange-400">
                        ₺{item.price.toFixed(2)}
                      </span>
                      <Link
                        href="/menu"
                        className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:from-red-500 hover:to-orange-500 transition-all duration-300"
                      >
                        Sipariş Ver
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link 
              href="/menu" 
              className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-red-500 hover:to-orange-500 transition-all duration-300 glow-effect transform hover:scale-105"
            >
              <Flame className="mr-2 h-5 w-5" />
              Tüm Menüyü Görüntüle →
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/50 to-black"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold pizza-title mb-8 min-h-[80px]">
                <TypingText 
                  text="Hikayemiz"
                  speed={80}
                  onComplete={() => setShowTitle(true)}
                />
              </h2>
              <div className="glass-effect p-8 rounded-2xl border border-red-900/30">
                <div className="text-gray-300 text-lg leading-relaxed mb-6 min-h-[120px]">
                  {showTitle && (
                    <TypingText 
                      text="2025 yılında Malatya’da kurulan Pizza Hot, taze hamur ve bol malzemeyle hazırladığı pizzalarıyla misafirlerine lezzetli bir deneyim sunmayı hedefliyor.
Her gün özenle yoğrulan hamurlarımız, hijyenik mutfağımızda usta şeflerimizin emeğiyle pişirilir. Bizim için önemli olan, her lokmada sıcaklığı ve samimiyeti hissettirmek. 🍕✨
"
                      speed={15}
                      delay={300}
                      onComplete={() => setShowSecondParagraph(true)}
                    />
                  )}
                </div>
                
                <Link 
                  href="/menu" 
                  className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:from-red-500 hover:to-orange-500 transition-all duration-300 glow-effect transform hover:scale-105"
                >
                  <Flame className="mr-2 h-5 w-5" />
                 Pizza Menümüzü Keşfedin
                </Link>
              </div>
            </div>
            
            <div className="glass-effect p-8 rounded-2xl border border-red-900/30">
              <h3 className="text-3xl font-bold mb-8 text-orange-400">İletişim & Sipariş</h3>
              <div className="space-y-6">
                <div className="flex items-center p-4 bg-red-900/20 rounded-xl">
                  <MapPin className="h-6 w-6 mr-4 text-orange-400 flex-shrink-0" />
                  <span className="text-gray-300 text-lg">Tecde, Hayrettin Abacı Sokak No: 26, 44000 Yeşilyurt / Malatya</span>
                </div>
                <div className="flex items-center p-4 bg-red-900/20 rounded-xl">
                  <Phone className="h-6 w-6 mr-4 text-orange-400 flex-shrink-0" />
                  <span className="text-gray-300 text-lg">+90 530 933 7444</span>
                </div>
                <div className="flex items-center p-4 bg-red-900/20 rounded-xl">
                  <Mail className="h-6 w-6 mr-4 text-orange-400 flex-shrink-0" />
                  <span className="text-gray-300 text-lg">pizzahotturkiye@gmail.com</span>
                </div>
                <div className="flex items-center p-4 bg-red-900/20 rounded-xl">
                  <Clock className="h-6 w-6 mr-4 text-orange-400 flex-shrink-0" />
                  <span className="text-gray-300 text-lg">Her Gün: 10:00 – 23:30</span>
                </div>
                <div className="flex items-center p-4 bg-red-900/20 rounded-xl">
                  <Users className="h-6 w-6 mr-4 text-orange-400 flex-shrink-0" />
                  <span className="text-gray-300 text-lg">Minimum Sipariş: 200 TL (Ücretsiz Teslimat)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
