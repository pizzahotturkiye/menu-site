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

export default function Home() {
  const [showSecondParagraph, setShowSecondParagraph] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

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
        {/* Background Pizza Images */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 float-effect">
            <Image 
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop&auto=format&q=80"
              alt="Pizza Background"
              width={200}
              height={200}
              className="rounded-full opacity-30"
              priority={false}
              loading="lazy"
            />
          </div>
          <div className="absolute top-20 right-20 float-effect" style={{animationDelay: '1s'}}>
            <Image 
              src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=150&h=150&fit=crop&auto=format&q=80"
              alt="Pizza Background"
              width={150}
              height={150}
              className="rounded-full opacity-30"
              priority={false}
              loading="lazy"
            />
          </div>
          <div className="absolute bottom-20 left-1/4 float-effect" style={{animationDelay: '2s'}}>
            <Image 
              src="https://images.unsplash.com/photo-1555072956-7758afb4d2b8?w=180&h=180&fit=crop&auto=format&q=80"
              alt="Pizza Background"
              width={180}
              height={180}
              className="rounded-full opacity-30"
              priority={false}
              loading="lazy"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-8xl font-bold mb-6 pizza-title">
                PIZZA HOT
              </h1>
              <div className="flex items-center justify-center gap-4 mb-6">
                <Flame className="h-8 w-8 text-red-500 animate-bounce" />
                <span className="text-2xl md:text-4xl font-bold text-orange-400">
                  Malatya'nın En Ateşli Pizzacısı
                </span>
                <Flame className="h-8 w-8 text-red-500 animate-bounce" />
              </div>
            </div>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              🔥 Ateş gibi sıcak ve baharatlı pizzalarımızla Malatya'da acılı pizza deneyimini 
              zirvede yaşatıyoruz. Her ısırıkta adrenalin! 🌶️
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
                href="tel:+904224445742" 
                className="group bg-transparent border-2 border-orange-500 text-orange-400 px-10 py-4 rounded-xl font-bold text-lg hover:bg-orange-500 hover:text-black transition-all duration-300 shadow-xl transform hover:scale-105"
              >
                <Phone className="inline-block w-5 h-5 mr-2" />
                Sipariş Ver
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="glass-effect p-6 rounded-xl text-center">
                <Flame className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-400">500°C</div>
                <div className="text-sm text-gray-400">Fırın Sıcaklığı</div>
              </div>
              <div className="glass-effect p-6 rounded-xl text-center">
                <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-400">25 dk</div>
                <div className="text-sm text-gray-400">Teslimat Süresi</div>
              </div>
              <div className="glass-effect p-6 rounded-xl text-center">
                <Award className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-400">50+</div>
                <div className="text-sm text-gray-400">Acı Seviye</div>
              </div>
              <div className="glass-effect p-6 rounded-xl text-center">
                <Star className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-400">4.9</div>
                <div className="text-sm text-gray-400">Müşteri Puanı</div>
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
                  500°C'yi bulan alevli fırınımızda pişirilen pizzalarımız, 
                  sıcaklığı ve acısıyla damağınızda unutulmaz iz bırakıyor. 🔥
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
                  Kendi ürettiğimiz özel acı soslar, Türk baharatları ve 
                  dünya biberleriyle hazırlanan eşsiz lezzet karışımları. 🌶️
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
                  İstanbul'un her yerine 25 dakika içinde ateş gibi sıcak pizza teslimatı. 
                  Soğuk gelirse yenisini bedava getiriyoruz! ⚡
                </p>
              </div>
            </div>
            
            {/* Featured Pizza Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-3xl blur-xl"></div>
              <div className="relative glass-effect rounded-3xl p-8 border border-red-900/30">
                <Image
                  src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&h=500&fit=crop&auto=format&q=80"
                  alt="Özel Acılı Pizza"
                  width={500}
                  height={500}
                  className="rounded-2xl shadow-2xl w-full glow-effect"
                  priority={false}
                  loading="lazy"
                />
                <div className="mt-6 text-center">
                  <h4 className="text-2xl font-bold text-orange-400 mb-2">🔥 Signature Spicy Supreme</h4>
                  <p className="text-gray-300">En acılı pizza deneyimimiz</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-red-950/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 pizza-title">
            🍕 Pizza Galerimiz
          </h2>
          
          {/* Pizza Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div className="glass-effect rounded-2xl overflow-hidden border border-red-900/30 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105">
              <Image
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80"
                alt="Margherita Pizza"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
                priority={false}
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-orange-400 mb-2">🔥 Ateşli Margherita</h3>
                <p className="text-gray-300">Klasik ama acılı versiyonu</p>
              </div>
            </div>
            
            <div className="glass-effect rounded-2xl overflow-hidden border border-red-900/30 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105">
              <Image
                src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop&auto=format&q=80"
                alt="Pepperoni Pizza"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
                priority={false}
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-orange-400 mb-2">🌶️ Volcano Pepperoni</h3>
                <p className="text-gray-300">Yanardağ gibi sıcak!</p>
              </div>
            </div>
            
            <div className="glass-effect rounded-2xl overflow-hidden border border-red-900/30 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105">
              <Image
                src="https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop&auto=format&q=80"
                alt="Supreme Pizza"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
                priority={false}
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-orange-400 mb-2">🔥 Death Wish Supreme</h3>
                <p className="text-gray-300">Cesur olanlar için!</p>
              </div>
            </div>
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
                      text="2019 yılında Malatya'da kurulan Pizza Hot, acılı pizza tutkunlarının buluşma noktası olma misyonuyla yola çıktı. Malatya'nın ünlü acı biberlerini dünya mutfağından baharatlarla harmanlayarak adrenalin dolu bir pizza deneyimi yaratıyoruz. 🌶️"
                      speed={15}
                      delay={300}
                      onComplete={() => setShowSecondParagraph(true)}
                    />
                  )}
                </div>
                <div className="text-gray-300 text-lg leading-relaxed mb-8 min-h-[100px]">
                  {showSecondParagraph && (
                    <TypingText 
                      text="Her pizzamız, özel acı soslarımız, yüksek ısıda pişirilen hamurlarımız ve ateşli baharatlara dayanıklı usta şeflerimizin el emeğiyle hazırlanır. Amacımız, her ısırıkta adrenalini zirvede yaşatmaktır. 👨‍🍳"
                      speed={12}
                      delay={200}
                    />
                  )}
                </div>
                <Link 
                  href="/menu" 
                  className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:from-red-500 hover:to-orange-500 transition-all duration-300 glow-effect transform hover:scale-105"
                >
                  <Flame className="mr-2 h-5 w-5" />
                  Pizza Menümüzü Keşfedin →
                </Link>
              </div>
            </div>
            
            <div className="glass-effect p-8 rounded-2xl border border-red-900/30">
              <h3 className="text-3xl font-bold mb-8 text-orange-400">🔥 İletişim & Sipariş</h3>
              <div className="space-y-6">
                <div className="flex items-center p-4 bg-red-900/20 rounded-xl">
                  <MapPin className="h-6 w-6 mr-4 text-orange-400 flex-shrink-0" />
                  <span className="text-gray-300 text-lg">Battalgazi, Turgut Özal Bulvarı No: 123, Malatya</span>
                </div>
                <div className="flex items-center p-4 bg-red-900/20 rounded-xl">
                  <Phone className="h-6 w-6 mr-4 text-orange-400 flex-shrink-0" />
                  <span className="text-gray-300 text-lg">+90 (422) 444 SPICY</span>
                </div>
                <div className="flex items-center p-4 bg-red-900/20 rounded-xl">
                  <Mail className="h-6 w-6 mr-4 text-orange-400 flex-shrink-0" />
                  <span className="text-gray-300 text-lg">siparis@pizzahot.com</span>
                </div>
                <div className="flex items-center p-4 bg-red-900/20 rounded-xl">
                  <Clock className="h-6 w-6 mr-4 text-orange-400 flex-shrink-0" />
                  <span className="text-gray-300 text-lg">Her Gün: 11:00 - 24:00</span>
                </div>
                <div className="flex items-center p-4 bg-red-900/20 rounded-xl">
                  <Users className="h-6 w-6 mr-4 text-orange-400 flex-shrink-0" />
                  <span className="text-gray-300 text-lg">Minimum Sipariş: ₺50 (Ücretsiz Teslimat)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
