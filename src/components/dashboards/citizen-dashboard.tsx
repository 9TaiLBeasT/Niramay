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
        return "bg-blue-100 text-blue-800";
      case "assigned":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in_progress":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Citizen Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Make your city cleaner, one report at a time.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Reports
                  </p>
                  <p className="text-2xl font-bold">{complaints.length}</p>
                </div>
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">
                    {complaints.filter((c) => c.status === "completed").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Eco Points
                  </p>
                  <p className="text-2xl font-bold">{ecoPoints.points}</p>
                </div>
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Earned
                  </p>
                  <p className="text-2xl font-bold">{ecoPoints.total_earned}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            onClick={() => setShowReportModal(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Camera className="w-4 h-4 mr-2" />
            Report Garbage
          </Button>
          <Button variant="outline" onClick={() => setShowEcoStore(true)}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Eco Store ({ecoPoints.points} points)
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="complaints" className="space-y-6">
          <TabsList>
            <TabsTrigger value="complaints">My Reports</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="complaints">
            <Card>
              <CardHeader>
                <CardTitle>Your Garbage Reports</CardTitle>
                <CardDescription>
                  Track the status of your reported issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                {complaints.length === 0 ? (
                  <div className="text-center py-8">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No reports yet</p>
                    <Button onClick={() => setShowReportModal(true)}>
                      Report Your First Issue
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {complaints.map((complaint: any) => (
                      <div key={complaint.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold">{complaint.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {complaint.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {complaint.address ||
                                  `${complaint.latitude}, ${complaint.longitude}`}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getStatusColor(complaint.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(complaint.status)}
                                {complaint.status.replace("_", " ")}
                              </div>
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(
                                complaint.created_at,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {complaint.photo_url && (
                          <img
                            src={complaint.photo_url}
                            alt="Reported garbage"
                            className="w-full h-48 object-cover rounded-md mt-2"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>Community Leaderboard</CardTitle>
                <CardDescription>
                  See how you rank among other citizens in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Leaderboard coming soon!</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Keep reporting issues to climb the ranks
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
