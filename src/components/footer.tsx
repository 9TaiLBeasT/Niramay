import Link from "next/link";
import { Twitter, Linkedin, Github, Recycle, Heart, Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Recycle className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">Niramay</span>
            </div>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              AI-powered waste management platform making Indian cities cleaner,
              one report at a time.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span className="text-green-400 font-medium">
                Made in India with love
              </span>
            </div>
          </div>

          {/* Platform Column */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Citizen Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Admin Portal
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Worker App
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg">Solutions</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Waste Reporting
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Task Management
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Eco Rewards
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  City Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  API Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  About Niramay
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Swachh Bharat Section */}
        <div className="bg-gradient-to-r from-green-600/20 to-orange-600/20 rounded-2xl p-6 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Globe className="w-10 h-10 text-blue-400" />
              <div>
                <p className="text-lg font-semibold text-white">
                  Supporting Swachh Bharat Abhiyan
                </p>
                <p className="text-sm text-green-200">
                  Digital India • Clean India • Smart Cities Mission
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm max-w-2xl mx-auto">
              Niramay is proud to contribute to India's vision of clean and
              sustainable cities through technology-driven citizen participation
              and efficient waste management.
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center gap-4 text-gray-300 mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <Recycle className="w-5 h-5 text-green-400" />
              <span className="text-sm">
                © {currentYear} Niramay. Making cities cleaner, one report at a
                time.
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Globe className="w-4 h-4 text-orange-400" />
              <span>Serving 100+ Indian Cities</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-xs text-gray-400">
              <span>Follow us:</span>
            </div>
            <a
              href="#"
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Hackathon Credit */}
        <div className="text-center mt-8 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <Recycle className="w-3 h-3" />
            Built for hackathons and civic innovation • Empowering digital
            transformation in Indian cities
          </p>
        </div>
      </div>
    </footer>
  );
}
