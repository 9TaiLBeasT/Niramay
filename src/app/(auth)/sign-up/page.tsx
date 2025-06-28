"use client";

import React, { useState, useEffect } from "react";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

import { signUpAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { UrlProvider } from "@/components/url-provider";
import {
  Recycle,
  UserPlus,
  MapPin,
  User,
  Mail,
  Lock,
  CreditCard,
  Camera,
  Award,
  Globe,
  Heart,
  AlertTriangle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function Signup() {
  const [message, setMessage] = useState<Message | null>(null);
  const [aadhaar, setAadhaar] = useState("");
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const searchParams = useSearchParams();

  // Handle search params on client side
  useEffect(() => {
    const messageParam = searchParams.get("message");
    const typeParam = searchParams.get("type");

    if (messageParam && typeParam) {
      setMessage({
        message: messageParam,
        type: typeParam as "success" | "error",
      });
    }
  }, [searchParams]);

  // Get user location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          // Reverse geocoding to get address
          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          )
            .then((response) => response.json())
            .then((data) => {
              setLocation((prev) =>
                prev
                  ? {
                      ...prev,
                      address: data.display_name || `${latitude}, ${longitude}`,
                    }
                  : null,
              );
            })
            .catch(() => {
              setLocation((prev) =>
                prev ? { ...prev, address: `${latitude}, ${longitude}` } : null,
              );
            });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  };

  const formatAadhaar = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    // Limit to 12 digits
    const limited = digits.slice(0, 12);
    // Format as XXXX-XXXX-XXXX
    return limited
      .replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3")
      .replace(/(\d{4})(\d{4})$/, "$1-$2");
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaar(e.target.value);
    setAadhaar(formatted);
  };

  const isValidAadhaar = (aadhaar: string) => {
    const digits = aadhaar.replace(/\D/g, "");
    return digits.length === 12;
  };

  if (message && "message" in message) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-blue-50 relative overflow-hidden animate-fade-in">
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-green-200 rounded-full opacity-20 animate-float" />
        <div
          className="absolute bottom-32 right-20 w-60 h-60 bg-orange-200 rounded-full opacity-15 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-float"
          style={{ animationDelay: "4s" }}
        />

        {/* Indian flag inspired gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 via-white/20 to-green-100/20 pointer-events-none" />

        <div className="relative flex min-h-screen">
          {/* Left Side - Illustration and Info */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-gradient-to-br from-green-600/10 to-orange-600/10">
            <div className="text-center space-y-6">
              {/* Illustration placeholder */}
              <div className="w-80 h-64 bg-gradient-to-br from-green-500 to-orange-500 rounded-2xl flex items-center justify-center mb-8 animate-glow">
                <div className="flex items-center gap-4">
                  <Recycle className="w-16 h-16 text-white" />
                  <div className="text-white text-4xl font-bold">IN</div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
                स्वच्छ भारत के लिए एक कदम और
              </h2>
              <p className="text-xl text-gray-700 font-medium mb-2">
                Niramay के साथ जुड़ें!
              </p>
              <p className="text-lg text-gray-600">
                One more step toward a Clean India – Join Niramay!
              </p>

              {/* Features */}
              <div className="space-y-4 mt-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <span>Report waste with AI-powered detection</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <span>Earn eco-points for your contributions</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <span>Make your city cleaner and greener</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 py-8">
            {/* Mobile Header */}
            <div className="text-center mb-8 lg:hidden">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Recycle className="w-10 h-10 text-green-600" />
                <h1 className="text-4xl font-bold text-gray-900">Niramay</h1>
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">IN</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xl text-gray-700 font-medium">
                  स्वच्छ भारत के लिए एक कदम और
                </p>
                <p className="text-lg text-gray-600">Niramay के साथ जुड़ें!</p>
              </div>
            </div>

            {/* Signup Card */}
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm animate-scale-in">
              <CardHeader className="text-center pb-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <UserPlus className="w-6 h-6 text-green-600" />
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      नया खाता बनाएँ
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 text-base">
                    Register as a Responsible Citizen
                  </CardDescription>
                </div>

                {/* Location Detection */}
                {location && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">
                        आपके क्षेत्र से रजिस्टर कर रहे हैं
                      </span>
                    </div>
                    <p className="text-xs text-green-700 mt-1 truncate">
                      {location.address || `${location.lat}, ${location.lng}`}
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <UrlProvider>
                  <form className="space-y-5">
                    {/* Full Name Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="full_name"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-green-600" />
                        Full Name / पूरा नाम *
                      </Label>
                      <div className="relative">
                        <Input
                          id="full_name"
                          name="full_name"
                          type="text"
                          placeholder="Enter your full name"
                          required
                          className="h-12 pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-gray-50/50"
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Aadhaar Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="aadhaar"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4 text-green-600" />
                        Aadhaar Number / आधार नंबर *
                      </Label>
                      <div className="relative">
                        <Input
                          id="aadhaar"
                          name="aadhaar"
                          type="text"
                          placeholder="XXXX-XXXX-XXXX"
                          value={aadhaar}
                          onChange={handleAadhaarChange}
                          required
                          className={`h-12 pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-gray-50/50 ${
                            aadhaar && !isValidAadhaar(aadhaar)
                              ? "border-red-300 focus:border-red-500"
                              : ""
                          }`}
                        />
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {aadhaar && !isValidAadhaar(aadhaar) && (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <AlertTriangle className="w-3 h-3" />
                          <span>आधार संख्या 12 अंकों की होनी चाहिए</span>
                        </div>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4 text-green-600" />
                        Gmail ID *
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@gmail.com"
                          required
                          className="h-12 pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-gray-50/50"
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4 text-green-600" />
                        Password / पासवर्ड *
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type="password"
                          name="password"
                          placeholder="Create a secure password"
                          minLength={6}
                          required
                          className="h-12 pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-gray-50/50"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500">
                        Minimum 6 characters
                      </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirm_password"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4 text-green-600" />
                        Confirm Password / पासवर्ड पुष्टि करें *
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirm_password"
                          type="password"
                          name="confirm_password"
                          placeholder="Confirm your password"
                          minLength={6}
                          required
                          className="h-12 pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-gray-50/50"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Hidden location fields */}
                    {location && (
                      <>
                        <input
                          type="hidden"
                          name="latitude"
                          value={location.lat}
                        />
                        <input
                          type="hidden"
                          name="longitude"
                          value={location.lng}
                        />
                        <input
                          type="hidden"
                          name="address"
                          value={location.address || ""}
                        />
                      </>
                    )}

                    <SubmitButton
                      formAction={signUpAction}
                      pendingText="खाता बनाया जा रहा है..."
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                      disabled={!isValidAadhaar(aadhaar)}
                    >
                      Register / रजिस्टर करें
                    </SubmitButton>

                    <div className="text-center pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                          className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-all"
                          href="/sign-in"
                        >
                          Login Here
                        </Link>
                      </p>
                    </div>

                    {message && <FormMessage message={message} />}
                  </form>
                </UrlProvider>
              </CardContent>
            </Card>

            {/* Admin Note */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-6 max-w-md">
              <p className="text-sm text-orange-800 text-center">
                <strong>Municipal Admins & Workers:</strong> Please use the
                Admin/Worker login option on the sign-in page with your official
                credentials.
              </p>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">IN</span>
                </div>
                <span>NIRAMAY | स्वच्छ भारत – टेक्नोलॉजी के साथ</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                <span>Made with</span>
                <Heart className="w-3 h-3 text-red-500 fill-current" />
                <span>in India | Hackathon Edition 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
