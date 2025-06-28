"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,
  MapPin,
  Award,
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle,
  Bell,
  Star,
  Trophy,
  Target,
  Recycle,
  Heart,
  Users,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { createClient } from "../../../supabase/client";
import ReportGarbageModal from "@/components/report-garbage-modal";
import EcoStore from "@/components/eco-store";

interface CitizenDashboardProps {
  user: any;
  userRole: any;
}

export default function CitizenDashboard({
  user,
  userRole,
}: CitizenDashboardProps) {
  const [complaints, setComplaints] = useState([]);
  const [ecoPoints, setEcoPoints] = useState({ points: 0, total_earned: 0 });
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEcoStore, setShowEcoStore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch user complaints
      const { data: complaintsData } = await supabase
        .from("complaints")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Fetch eco points
      const { data: pointsData } = await supabase
        .from("eco_points")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setComplaints(complaintsData || []);
      setEcoPoints(pointsData || { points: 0, total_earned: 0 });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "assigned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_progress":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in_progress":
        return <Clock className="w-4 h-4" />;
      case "assigned":
        return <Users className="w-4 h-4" />;
      case "submitted":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "submitted":
        return "Pending";
      case "assigned":
        return "Assigned";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const getPointsForStatus = (status: string) => {
    return status === "completed" ? "+10 pts" : "0 pts";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-6"></div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-800">
              Loading your dashboard...
            </p>
            <p className="text-sm text-gray-600">
              स्वच्छ भारत के लिए तैयार हो रहे हैं
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-green-50 animate-fade-in">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    नमस्ते, Citizen!
                  </h1>
                  <p className="text-green-100 text-lg">
                    स्वच्छ भारत के लिए नागरिकों की शक्ति
                  </p>
                </div>
              </div>
              <p className="text-white/90 text-lg max-w-2xl">
                Welcome back! Make your city cleaner, one report at a time.
                Together, we're building a sustainable future for India.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{complaints.length}</div>
                <div className="text-sm text-green-100">Reports</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{ecoPoints.points}</div>
                <div className="text-sm text-green-100">Eco Points</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">
                  {complaints.filter((c) => c.status === "completed").length}
                </div>
                <div className="text-sm text-green-100">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 -mt-6 relative z-20">
          <Button
            onClick={() => setShowReportModal(true)}
            className="h-16 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <Camera className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Report Garbage</div>
                <div className="text-xs opacity-90">Click & Clean</div>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-16 bg-white/80 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-orange-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-800">Map View</div>
                <div className="text-xs text-gray-600">See Reports</div>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowEcoStore(true)}
            className="h-16 bg-white/80 backdrop-blur-sm border-2 border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-yellow-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-800">Eco Store</div>
                <div className="text-xs text-gray-600">
                  {ecoPoints.points} points
                </div>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-16 bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-800">Leaderboard</div>
                <div className="text-xs text-gray-600">Your Rank</div>
              </div>
            </div>
          </Button>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">
                    Total Reports
                  </p>
                  <p className="text-3xl font-bold text-blue-900">
                    {complaints.length}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Your Impact</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">
                    Completed
                  </p>
                  <p className="text-3xl font-bold text-green-900">
                    {complaints.filter((c) => c.status === "completed").length}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Success Rate</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700 mb-1">
                    Eco Points
                  </p>
                  <p className="text-3xl font-bold text-yellow-900">
                    {ecoPoints.points}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">Available</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">
                    Total Earned
                  </p>
                  <p className="text-3xl font-bold text-purple-900">
                    {ecoPoints.total_earned}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">Lifetime</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg rounded-xl p-1">
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-semibold"
            >
              My Reports
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white font-semibold"
            >
              Leaderboard
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white font-semibold"
            >
              Updates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Your Garbage Reports
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                    Track Status & Earn Points
                  </span>
                </CardTitle>
                <CardDescription className="text-green-100">
                  Monitor your reported issues and see the impact you're making
                  in your community
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {complaints.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Camera className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No reports yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start making a difference by reporting your first garbage
                      issue!
                    </p>
                    <Button
                      onClick={() => setShowReportModal(true)}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 text-lg"
                    >
                      Report Your First Issue
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {complaints.map((complaint: any) => (
                      <div
                        key={complaint.id}
                        className="border-2 border-gray-100 rounded-xl p-6 hover:border-green-200 hover:shadow-lg transition-all duration-200 bg-white"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold text-gray-800">
                                {complaint.title}
                              </h3>
                              <Badge
                                className={`${getStatusColor(complaint.status)} border font-medium px-3 py-1`}
                              >
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(complaint.status)}
                                  {getStatusText(complaint.status)}
                                </div>
                              </Badge>
                              <span className="text-sm font-semibold text-green-600">
                                {getPointsForStatus(complaint.status)}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3 leading-relaxed">
                              {complaint.description ||
                                "No description provided"}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>
                                  {complaint.address ||
                                    `${complaint.latitude}, ${complaint.longitude}`}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {new Date(
                                    complaint.created_at,
                                  ).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          {complaint.photo_url && (
                            <div className="ml-6">
                              <img
                                src={complaint.photo_url}
                                alt="Reported garbage"
                                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Community Leaderboard
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                    Top Contributors
                  </span>
                </CardTitle>
                <CardDescription className="text-orange-100">
                  See how you rank among other citizens in your area and get
                  inspired!
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-12 h-12 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Leaderboard Coming Soon!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Keep reporting issues to climb the ranks and become a Clean
                    India Champion!
                  </p>
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-orange-800 font-medium">
                      Your Current Stats:
                    </p>
                    <div className="flex justify-between mt-2 text-sm">
                      <span>Reports: {complaints.length}</span>
                      <span>Points: {ecoPoints.points}</span>
                      <span>
                        Completed:{" "}
                        {
                          complaints.filter((c) => c.status === "completed")
                            .length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Recent Updates
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                    Stay Informed
                  </span>
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Get notified about your reports and earn rewards for your
                  contributions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        No notifications yet
                      </h3>
                      <p className="text-gray-600">
                        Notifications about your reports and rewards will appear
                        here
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification: any) => (
                      <div
                        key={notification.id}
                        className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200 animate-scale-in"
                      >
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer with Indian Slogan */}
        <div className="mt-12 text-center py-8 bg-gradient-to-r from-green-600 to-orange-600 rounded-2xl text-white">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-300" />
            <span className="text-lg font-semibold">
              भारत को स्वच्छ बनाना हमारा कर्तव्य है
            </span>
            <Heart className="w-5 h-5 text-red-300" />
          </div>
          <p className="text-green-100 text-sm">
            Built with love in India for Niramay Hackathon • Making cities
            cleaner, one report at a time
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Community Driven
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              Impact Focused
            </span>
            <span className="flex items-center gap-1">
              <Recycle className="w-4 h-4" />
              Eco Friendly
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showReportModal && (
        <ReportGarbageModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onSuccess={fetchData}
          userId={user.id}
          userRole={userRole}
        />
      )}

      {showEcoStore && (
        <EcoStore
          isOpen={showEcoStore}
          onClose={() => setShowEcoStore(false)}
          userId={user.id}
          userPoints={ecoPoints.points}
          onPointsUpdate={fetchData}
        />
      )}
    </div>
  );
}
