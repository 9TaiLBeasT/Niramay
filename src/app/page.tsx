import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  Camera,
  MapPin,
  Award,
  Users,
  BarChart3,
  Shield,
  Smartphone,
  Recycle,
  Heart,
  Star,
  CheckCircle,
  TrendingUp,
  Globe,
  Zap,
  Target,
} from "lucide-react";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* About Niramay Section */}
      <section className="py-24 bg-gradient-to-r from-green-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 bg-white text-green-800 text-sm font-medium rounded-full shadow-sm">
                🌟 About Niramay
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-8 text-gray-900">
              Building a <span className="text-green-600">Cleaner</span>,{" "}
              <span className="text-orange-600">Greener</span> India
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Niramay is an AI-powered civic platform that lets Indian citizens
              report garbage in real-time and enables local authorities to
              resolve issues efficiently — building cleaner, greener cities
              across our incredible nation.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Community First</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Empowering every Indian citizen to contribute
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">AI-Powered</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Smart technology for efficient solutions
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Results Driven</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Measurable impact on urban cleanliness
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              From <span className="text-green-600">Click</span> to{" "}
              <span className="text-orange-600">Clean</span> in 4 Simple Steps
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Experience the seamless journey from reporting waste to seeing
              your neighborhood transformed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <Camera className="w-10 h-10 text-green-600" />
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-3 text-green-800">
                  1. Citizen Clicks Photo
                </h3>
                <p className="text-gray-600 text-sm">
                  Citizens capture real-time photos of garbage with automatic
                  GPS location tracking
                </p>
              </div>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-3 text-blue-800">
                  2. Admin Receives Report
                </h3>
                <p className="text-gray-600 text-sm">
                  Municipal admins review complaints and assign cleanup tasks to
                  nearest available workers
                </p>
              </div>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <CheckCircle className="w-10 h-10 text-orange-600" />
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-3 text-orange-800">
                  3. Worker Cleans It
                </h3>
                <p className="text-gray-600 text-sm">
                  Field workers receive task notifications and complete the
                  cleanup efficiently
                </p>
              </div>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <Award className="w-10 h-10 text-yellow-600" />
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-3 text-yellow-800">
                  4. Points Redeemed
                </h3>
                <p className="text-gray-600 text-sm">
                  Citizens earn eco-points and redeem them for sustainable
                  products and eco-friendly items
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools for citizens, municipal authorities, and field
              workers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Camera className="w-6 h-6" />,
                title: "Real-time Reporting",
                description: "Live photo capture with GPS tracking",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Analytics Dashboard",
                description: "Track complaint resolution and performance",
              },
              {
                icon: <Smartphone className="w-6 h-6" />,
                title: "Mobile Optimized",
                description: "Works seamlessly on all devices",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Multi-Admin System",
                description: "Dedicated admins for each locality",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-green-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features by Role Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Built for Every Indian
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Tailored experiences for citizens, municipal authorities, and
              field workers in the waste management ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-green-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-800">
                  👤 Citizens
                </h3>
              </div>
              <ul className="space-y-4 text-green-700">
                <li className="flex items-start gap-3">
                  <Camera className="w-5 h-5 mt-0.5 text-green-600" />
                  <div>
                    <span className="font-medium">
                      Report garbage with photos
                    </span>
                    <p className="text-sm text-green-600">
                      Real-time capture with GPS
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 text-green-600" />
                  <div>
                    <span className="font-medium">Track complaint status</span>
                    <p className="text-sm text-green-600">
                      Live updates on progress
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="w-5 h-5 mt-0.5 text-green-600" />
                  <div>
                    <span className="font-medium">
                      Earn and redeem eco-points
                    </span>
                    <p className="text-sm text-green-600">
                      Rewards for civic participation
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-800">
                  🧑‍💼 Municipal Admins
                </h3>
              </div>
              <ul className="space-y-4 text-blue-700">
                <li className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 mt-0.5 text-blue-600" />
                  <div>
                    <span className="font-medium">
                      Manage complaints efficiently
                    </span>
                    <p className="text-sm text-blue-600">
                      Smart dashboard with analytics
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 mt-0.5 text-blue-600" />
                  <div>
                    <span className="font-medium">Assign tasks to workers</span>
                    <p className="text-sm text-blue-600">
                      Optimize resource allocation
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 mt-0.5 text-blue-600" />
                  <div>
                    <span className="font-medium">
                      Monitor performance analytics
                    </span>
                    <p className="text-sm text-blue-600">
                      Data-driven insights
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-orange-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mr-4">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-orange-800">
                  👷 Field Workers
                </h3>
              </div>
              <ul className="space-y-4 text-orange-700">
                <li className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 mt-0.5 text-orange-600" />
                  <div>
                    <span className="font-medium">
                      Receive task notifications
                    </span>
                    <p className="text-sm text-orange-600">
                      Instant mobile alerts
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 text-orange-600" />
                  <div>
                    <span className="font-medium">
                      Navigate to cleanup locations
                    </span>
                    <p className="text-sm text-orange-600">GPS-guided routes</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 text-orange-600" />
                  <div>
                    <span className="font-medium">
                      Update task completion status
                    </span>
                    <p className="text-sm text-orange-600">
                      Real-time progress tracking
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Niramay Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 to-orange-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Niramay?</h2>
            <p className="text-green-100 max-w-3xl mx-auto text-lg">
              Addressing India's waste management challenges with technology and
              community participation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">70%</div>
              <div className="text-green-100 text-sm">
                of Indian waste is not properly collected
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-green-100 text-sm">
                Niramay rewards citizens for civic participation
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">AI</div>
              <div className="text-green-100 text-sm">
                Real-time tracking & optimization
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">🇮🇳</div>
              <div className="text-green-100 text-sm">
                Supporting Swachh Bharat Abhiyan
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">🌟 Our Impact</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>Clean India Vision alignment</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>Community-driven solutions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>Technology-enabled efficiency</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>Sustainable urban development</span>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">🏛️</div>
                <p className="text-lg font-medium">Proudly Supporting</p>
                <p className="text-2xl font-bold text-orange-200">
                  Swachh Bharat Abhiyan
                </p>
                <p className="text-sm text-green-200 mt-2">
                  Digital India Initiative
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              What Indians Are Saying
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Real stories from citizens making a difference in their
              communities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                &quot;I reported garbage from my lane — it was cleaned within 24
                hours. Amazing! This is exactly what our country needed.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">R</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ramesh Kumar</p>
                  <p className="text-gray-600 text-sm">Pune, Maharashtra</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                &quot;As a municipal worker, Niramay has made my job so much
                easier. I know exactly where to go and what needs to be
                done.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">P</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Priya Sharma</p>
                  <p className="text-gray-600 text-sm">Delhi NCR</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                &quot;The eco-points system is brilliant! I've already redeemed
                points for a compost bin. It's rewarding to contribute to a
                cleaner India.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-orange-600 font-bold">A</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Arjun Patel</p>
                  <p className="text-gray-600 text-sm">Ahmedabad, Gujarat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-orange-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Making India Cleaner, Together
            </h2>
            <p className="text-green-100 max-w-2xl mx-auto">
              Join thousands of Indians who are already making a difference
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">25,000+</div>
              <div className="text-green-100">Issues Reported</div>
              <div className="text-xs text-green-200 mt-1">Across India</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-green-100">Indian Cities</div>
              <div className="text-xs text-green-200 mt-1">Connected</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-green-100">Resolution Rate</div>
              <div className="text-xs text-green-200 mt-1">Within 48 hours</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">5L+</div>
              <div className="text-green-100">Eco-Points Earned</div>
              <div className="text-xs text-green-200 mt-1">By citizens</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-400 via-yellow-300 to-green-400 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
              <div className="mb-8">
                <span className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-200">
                  🌿 ♻️ Join the Digital Swachh Bharat Mission
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
                Ready to Transform <span className="text-orange-600">Your</span>{" "}
                City?
              </h2>

              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join lakhs of citizens and hundreds of municipalities already
                using Niramay to create cleaner, healthier communities across
                India. Be part of the change!
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <a
                  href="/sign-up"
                  className="inline-flex items-center px-8 py-4 text-white bg-green-600 rounded-full hover:bg-green-700 transition-all duration-300 text-lg font-medium shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  📸 Report Waste
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center px-8 py-4 text-orange-600 bg-white border-2 border-orange-600 rounded-full hover:bg-orange-50 transition-all duration-300 text-lg font-medium shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  📘 Learn How It Works
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌟</span>
                  <span className="font-medium">Trusted by 5L+ Indians</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏙️</span>
                  <span className="font-medium">150+ Cities</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <span className="font-medium">92% Success Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
