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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Users,
  CheckCircle,
  Clock,
  BarChart3,
  MapPin,
} from "lucide-react";
import { createClient } from "../../../supabase/client";

interface AdminDashboardProps {
  user: any;
  userRole: any;
}

export default function AdminDashboard({
  user,
  userRole,
}: AdminDashboardProps) {
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    completedTasks: 0,
    activeWorkers: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch complaints for this admin's locality
      const { data: complaintsData } = await supabase
        .from("complaints")
        .select("*, users(full_name, email)")
        .eq("locality", userRole.locality)
        .eq("city", userRole.city)
        .order("created_at", { ascending: false });

      // Fetch workers in this locality
      const { data: workersData } = await supabase
        .from("worker_status")
        .select("*, users(full_name, email)")
        .eq("locality", userRole.locality)
        .eq("city", userRole.city);

      // Fetch tasks
      const { data: tasksData } = await supabase
        .from("tasks")
        .select("*, complaints(title, address), users(full_name)")
        .eq("admin_id", user.id)
        .order("created_at", { ascending: false });

      setComplaints(complaintsData || []);
      setWorkers(workersData || []);
      setTasks(tasksData || []);

      // Calculate stats
      const totalComplaints = complaintsData?.length || 0;
      const pendingComplaints =
        complaintsData?.filter((c) => c.status === "submitted").length || 0;
      const completedTasks =
        tasksData?.filter((t) => t.status === "completed").length || 0;
      const activeWorkers =
        workersData?.filter((w) => w.status === "available").length || 0;

      setStats({
        totalComplaints,
        pendingComplaints,
        completedTasks,
        activeWorkers,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const assignTask = async (complaintId: string, workerId: string) => {
    try {
      const complaint = complaints.find((c: any) => c.id === complaintId);
      if (!complaint) return;

      // Create task
      const { error: taskError } = await supabase.from("tasks").insert({
        complaint_id: complaintId,
        admin_id: user.id,
        worker_id: workerId,
        title: `Cleanup: ${complaint.title}`,
        description: complaint.description,
      });

      if (taskError) throw taskError;

      // Update complaint status
      await supabase
        .from("complaints")
        .update({ status: "assigned" })
        .eq("id", complaintId);

      // Update worker status
      await supabase
        .from("worker_status")
        .update({ status: "busy" })
        .eq("worker_id", workerId);

      fetchData();
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Error assigning task. Please try again.");
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

  const getWorkerStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-red-100 text-red-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Managing {userRole.locality}, {userRole.city}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Complaints
                  </p>
                  <p className="text-2xl font-bold">{stats.totalComplaints}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">
                    {stats.pendingComplaints}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{stats.completedTasks}</p>
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
                    Active Workers
                  </p>
                  <p className="text-2xl font-bold">{stats.activeWorkers}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="complaints" className="space-y-6">
          <TabsList>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="workers">Workers</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="complaints">
            <Card>
              <CardHeader>
                <CardTitle>Complaint Management</CardTitle>
                <CardDescription>
                  Review and assign cleanup tasks to available workers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complaints.map((complaint: any) => (
                    <div key={complaint.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{complaint.title}</h3>
                            <Badge className={getStatusColor(complaint.status)}>
                              {complaint.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {complaint.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {complaint.address ||
                                  `${complaint.latitude}, ${complaint.longitude}`}
                              </span>
                            </div>
                            <span>
                              By:{" "}
                              {complaint.users?.full_name ||
                                complaint.users?.email}
                            </span>
                            <span>
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
                            className="w-24 h-24 object-cover rounded-md ml-4"
                          />
                        )}
                      </div>

                      {complaint.status === "submitted" && (
                        <div className="flex items-center gap-2">
                          <Select
                            onValueChange={(workerId) =>
                              assignTask(complaint.id, workerId)
                            }
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Assign to worker" />
                            </SelectTrigger>
                            <SelectContent>
                              {workers
                                .filter((w: any) => w.status === "available")
                                .map((worker: any) => (
                                  <SelectItem
                                    key={worker.worker_id}
                                    value={worker.worker_id}
                                  >
                                    {worker.users?.full_name ||
                                      worker.users?.email}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workers">
            <Card>
              <CardHeader>
                <CardTitle>Worker Management</CardTitle>
                <CardDescription>
                  Monitor worker availability and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workers.map((worker: any) => (
                    <div
                      key={worker.worker_id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {worker.users?.full_name || worker.users?.email}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {worker.users?.email}
                          </p>
                        </div>
                        <Badge className={getWorkerStatusColor(worker.status)}>
                          {worker.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>
                  Track assigned tasks and their progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task: any) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{task.title}</h3>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Worker: {task.users?.full_name}</span>
                            <span>
                              Assigned:{" "}
                              {new Date(task.assigned_at).toLocaleDateString()}
                            </span>
                            {task.completed_at && (
                              <span>
                                Completed:{" "}
                                {new Date(
                                  task.completed_at,
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Performance metrics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Advanced analytics coming soon!
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Track resolution rates, worker performance, and area
                    cleanliness metrics
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
