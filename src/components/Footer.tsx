import Link from "next/link"
import Image from "next/image"
import { Pizza, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Flame } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900 to-red-950/30"></div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="Pizza Hot Logo" 
                className="h-12 w-auto mr-3 glow-effect"
                height={48}
                width={60}
              />
              <span className="text-2xl font-bold pizza-title">Pizza Hot</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              🔥 İstanbul'un en ateşli pizzacısı. Ateş gibi sıcak baharatlar ve 
              özel acı soslarla hazırlanan eşsiz pizzalarımızı keşfedin. 🌶️
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="glass-effect p-3 rounded-full text-gray-300 hover:text-orange-400 transition-all duration-300 border border-red-900/30 hover:border-orange-500/50"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="glass-effect p-3 rounded-full text-gray-300 hover:text-orange-400 transition-all duration-300 border border-red-900/30 hover:border-orange-500/50"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="glass-effect p-3 rounded-full text-gray-300 hover:text-orange-400 transition-all duration-300 border border-red-900/30 hover:border-orange-500/50"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-orange-400 flex items-center">
              <Flame className="h-5 w-5 mr-2" />
              Hızlı Linkler
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 text-lg flex items-center group"
                >
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3 group-hover:bg-orange-400 transition-colors"></span>
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link 
                  href="/menu" 
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 text-lg flex items-center group"
                >
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3 group-hover:bg-orange-400 transition-colors"></span>
                  Menümüz
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin" 
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 text-lg flex items-center group"
                >
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3 group-hover:bg-orange-400 transition-colors"></span>
                  Yönetim
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-orange-400 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              İletişim
            </h3>
            <div className="space-y-4">
              <div className="glass-effect p-4 rounded-xl border border-red-900/30">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">
                    Battalgazi, Turgut Özal Bulvarı No: 123, Malatya
                  </span>
                </div>
              </div>
              <div className="glass-effect p-4 rounded-xl border border-red-900/30">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
                  <a 
                    href="tel:+904224445742" 
                    className="text-gray-300 hover:text-orange-400 transition-colors"
                  >
                    +90 (422) 444 SPICY
                  </a>
                </div>
              </div>
              <div className="glass-effect p-4 rounded-xl border border-red-900/30">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
                  <a 
                    href="mailto:siparis@pizzahot.com" 
                    className="text-gray-300 hover:text-orange-400 transition-colors"
                  >
                    siparis@pizzahot.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-orange-400 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Çalışma Saatleri
            </h3>
            <div className="glass-effect p-6 rounded-xl border border-red-900/30">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-medium">Pazartesi - Pazar</span>
                  <span className="text-orange-400 font-bold">11:00 - 24:00</span>
                </div>
                <div className="border-t border-red-900/30 pt-4">
                  <div className="text-gray-300 space-y-2">
                    <div className="flex justify-between">
                      <span>Minimum Sipariş:</span>
                      <span className="text-yellow-400 font-bold">₺50</span>
                    </div>
                    <div className="text-center">
                      <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                        🚚 Ücretsiz Teslimat
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-red-900/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-lg flex items-center">
              © 2024 
              <span className="mx-2 text-2xl pizza-title">Pizza Hot</span>
              Tüm hakları saklıdır. 🔥
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <Link 
                href="#" 
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                Gizlilik Politikası
              </Link>
              <Link 
                href="#" 
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                Kullanım Şartları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
