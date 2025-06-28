import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Camera,
  MapPin,
  Award,
  Heart,
} from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-orange-50 to-green-50 min-h-screen">
      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-green-200 rounded-full opacity-30" />
      <div className="absolute bottom-32 right-20 w-60 h-60 bg-orange-200 rounded-full opacity-20" />
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-blue-200 rounded-full opacity-40" />

      <div className="relative pt-32 pb-20 flex items-center min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-200">
                🌿 ♻️ Transforming Waste into a Cleaner India with AI
              </span>
            </div>

            {/* Hindi Text */}
            <div className="mb-8">
              <h1 className="text-6xl sm:text-8xl font-bold mb-4">
                <span className="text-orange-600">स्वच्छ</span>{" "}
                <span className="text-gray-900">भारत</span>
                <span className="text-gray-900">,</span>
                <br />
                <span className="text-green-600">स्वस्थ</span>{" "}
                <span className="text-gray-900">भविष्य</span>
              </h1>
              <p className="text-2xl font-semibold text-gray-700 mb-8">
                Clean India, Healthy Future
              </p>
            </div>

            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Empowering Indian citizens, municipal workers, and technology to
              build sustainable cities. Join the digital revolution in waste
              management supporting the Swachh Bharat Mission.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-8 py-4 text-white bg-green-600 rounded-full hover:bg-green-700 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                📸 Report Waste
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex items-center px-8 py-4 text-orange-600 bg-white border-2 border-orange-600 rounded-full hover:bg-orange-50 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                📘 Learn How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
