import Link from "next/link"
import Image from "next/image"
import { Pizza, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Flame } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900 to-red-950/30"></div>
      
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Main Brand Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold pizza-title mb-4">
            PIZZA HOT
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Her gün taptaze hamurumuz, kaliteli malzemelerimiz ve ateş gibi servisimizle pizzanın tadını zirveye çıkarıyoruz.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
          
          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-orange-400 mb-6 flex items-center justify-center md:justify-start">
              <Flame className="h-6 w-6 mr-3" />
              Hızlı Erişim
            </h3>
            <div className="space-y-4">
              <Link 
                href="/" 
                className="block text-gray-300 hover:text-orange-400 transition-all duration-300 text-xl py-2 px-4 rounded-lg hover:bg-red-900/20 group"
              >
                <span className="flex items-center justify-center md:justify-start">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3 group-hover:bg-orange-400 transition-colors"></span>
                  Ana Sayfa
                </span>
              </Link>
              <Link 
                href="/menu" 
                className="block text-gray-300 hover:text-orange-400 transition-all duration-300 text-xl py-2 px-4 rounded-lg hover:bg-red-900/20 group"
              >
                <span className="flex items-center justify-center md:justify-start">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3 group-hover:bg-orange-400 transition-colors"></span>
                  Pizza Menümüz
                </span>
              </Link>
            </div>
          </div>

          {/* Social Media & CTA */}
          <div className="text-center md:text-right">
            <h3 className="text-2xl font-bold text-orange-400 mb-6">
              Bizi Takip Edin
            </h3>
            <div className="flex justify-center md:justify-end space-x-4 mb-6">
              <a 
                href="#" 
                className="bg-gradient-to-r from-red-600 to-orange-600 p-4 rounded-full text-white hover:from-red-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-110 glow-effect"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                className="bg-gradient-to-r from-red-600 to-orange-600 p-4 rounded-full text-white hover:from-red-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-110 glow-effect"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                className="bg-gradient-to-r from-red-600 to-orange-600 p-4 rounded-full text-white hover:from-red-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-110 glow-effect"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
            <Link 
              href="/menu" 
              className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-red-500 hover:to-orange-500 transition-all duration-300 glow-effect transform hover:scale-105"
            >
              <Flame className="mr-2 h-5 w-5" />
              Sipariş Ver
            </Link>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-red-900/30 my-8"></div>

      </div>

      {/* Bottom Bar */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-lg flex items-center">
              © 2025 
              <span className="mx-2 text-xl font-bold pizza-title">Pizza Hot</span>
              Tüm hakları saklıdır. 🔥
            </p>
            <div className="flex space-x-6">
              <Link 
                href="#" 
                className="text-gray-400 hover:text-orange-400 transition-colors text-base hover:underline"
              >
                Gizlilik Politikası
              </Link>
              <Link 
                href="#" 
                className="text-gray-400 hover:text-orange-400 transition-colors text-base hover:underline"
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
