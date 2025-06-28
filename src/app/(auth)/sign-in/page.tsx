"use client";

import React, { useState, useEffect } from "react";
import { signInAction, adminSignInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { UserCircle, Shield, Recycle, Mail, Lock, MapPin } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const [message, setMessage] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState("user");
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const searchParams = useSearchParams();

  // Handle search params on client side
  useEffect(() => {
    const messageParam = searchParams.get("message");
    const errorParam = searchParams.get("error");
    const successParam = searchParams.get("success");

    if (errorParam) {
      setMessage({ error: errorParam });
    } else if (successParam) {
      setMessage({ success: successParam });
    } else if (messageParam) {
      setMessage({ message: messageParam });
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-blue-50 relative overflow-hidden">
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
                <div className="text-white text-6xl">🇮🇳</div>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                स्वच्छ भारत के लिए एक कदम और
              </h2>
              <p className="text-xl text-gray-700 font-medium">
                Niramay के साथ जुड़ें!
              </p>
              <p className="text-lg text-gray-600">
                One more step toward a Clean India – Join Niramay!
              </p>

              {/* Features */}
              <div className="space-y-4 mt-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📸</span>
                  </div>
                  <span>Report waste with AI-powered detection</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🏆</span>
                  </div>
                  <span>Earn eco-points for your contributions</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🌍</span>
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
                <span className="text-2xl">🇮🇳</span>
              </div>
              <p className="text-xl text-gray-700 font-medium mb-2">
                स्वच्छ भारत, स्वस्थ भविष्य
              </p>
              <p className="text-lg text-gray-600">
                Transforming Waste into a Cleaner India
              </p>
            </div>

            {/* Authentication Card */}
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  लॉग इन करें – Welcome Back!
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Sign in to continue making India cleaner
                </CardDescription>

                {/* Location Detection */}
                {location && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">
                        🔍 आपके क्षेत्र से लॉगिन कर रहे हैं
                      </span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      {location.address || `${location.lat}, ${location.lng}`}
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                    <TabsTrigger
                      value="user"
                      className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    >
                      <UserCircle className="w-4 h-4" />
                      👤 Citizen
                    </TabsTrigger>
                    <TabsTrigger
                      value="admin"
                      className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                    >
                      <Shield className="w-4 h-4" />
                      🛡️ Admin/Worker
                    </TabsTrigger>
                  </TabsList>

                  {/* Citizen Login */}
                  <TabsContent value="user" className="space-y-5">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        👤 Citizen Login
                      </div>
                    </div>

                    <form className="space-y-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="user-email"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4 text-green-600" />
                          Email
                        </Label>
                        <div className="relative">
                          <Input
                            id="user-email"
                            name="email"
                            type="email"
                            placeholder="your.email@gmail.com"
                            required
                            className="h-12 pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-gray-50/50"
                          />
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label
                            htmlFor="user-password"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                          >
                            <Lock className="w-4 h-4 text-green-600" />
                            Password
                          </Label>
                          <Link
                            className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition-all"
                            href="/forgot-password"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Input
                            id="user-password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            className="h-12 pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-gray-50/50"
                          />
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      <SubmitButton
                        className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                        pendingText="लॉग इन हो रहे हैं..."
                        formAction={signInAction}
                      >
                        Login / लॉग इन करें
                      </SubmitButton>
                    </form>

                    <div className="text-center pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        New to Niramay?{" "}
                        <Link
                          className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-all"
                          href="/sign-up"
                        >
                          Create Account
                        </Link>
                      </p>
                    </div>
                  </TabsContent>

                  {/* Admin/Worker Login */}
                  <TabsContent value="admin" className="space-y-5">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        🛡️ Admin Login / 👷 Worker Login
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-orange-800">
                        <strong>Admin/Worker Access:</strong> Use credentials
                        provided by your municipal authority.
                      </p>
                    </div>

                    <form className="space-y-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="admin-email"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4 text-orange-600" />
                          Official Email
                        </Label>
                        <div className="relative">
                          <Input
                            id="admin-email"
                            name="email"
                            type="email"
                            placeholder="admin@municipality.gov.in"
                            required
                            className="h-12 pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500 bg-gray-50/50"
                          />
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="admin-password"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <Lock className="w-4 h-4 text-orange-600" />
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="admin-password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            className="h-12 pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500 bg-gray-50/50"
                          />
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      <SubmitButton
                        className="w-full h-12 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                        pendingText="लॉग इन हो रहे हैं..."
                        formAction={adminSignInAction}
                      >
                        Login / लॉग इन करें
                      </SubmitButton>
                    </form>
                  </TabsContent>
                </Tabs>

                {message && <FormMessage message={message} />}
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                🇮🇳 NIRAMAY | स्वच्छ भारत – टेक्नोलॉजी के साथ
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Made with ❤️ in India | Hackathon Edition 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
