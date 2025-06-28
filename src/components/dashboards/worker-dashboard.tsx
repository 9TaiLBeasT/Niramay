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
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Clock,
  MapPin,
  AlertCircle,
  Play,
  Square,
} from "lucide-react";
import { createClient } from "../../../supabase/client";

interface WorkerDashboardProps {
  user: any;
  userRole: any;
}

export default function WorkerDashboard({
  user,
  userRole,
}: WorkerDashboardProps) {
  const [tasks, setTasks] = useState([]);
  const [workerStatus, setWorkerStatus] = useState({ status: "available" });
  const [stats, setStats] = useState({
    assignedTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [completionNotes, setCompletionNotes] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch worker tasks
      const { data: tasksData } = await supabase
        .from("tasks")
        .select(
          "*, complaints(title, description, photo_url, address, latitude, longitude), users(full_name)",
        )
        .eq("worker_id", user.id)
        .order("assigned_at", { ascending: false });

      // Fetch worker status
      const { data: statusData } = await supabase
        .from("worker_status")
        .select("*")
        .eq("worker_id", user.id)
        .single();

      setTasks(tasksData || []);
      setWorkerStatus(statusData || { status: "available" });

      // Calculate stats
      const assignedTasks =
        tasksData?.filter((t) => t.status === "assigned").length || 0;
      const completedTasks =
        tasksData?.filter((t) => t.status === "completed").length || 0;
      const inProgressTasks =
        tasksData?.filter((t) => t.status === "in_progress").length || 0;

      setStats({ assignedTasks, completedTasks, inProgressTasks });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (
    taskId: string,
    status: string,
    notes?: string,
  ) => {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === "in_progress") {
        updateData.started_at = new Date().toISOString();
      } else if (status === "completed") {
        updateData.completed_at = new Date().toISOString();
        if (notes) updateData.notes = notes;
      }

      const { error } = await supabase
        .from("tasks")
        .update(updateData)
        .eq("id", taskId);

      if (error) throw error;

      // Update complaint status
      if (status === "completed") {
        const task = tasks.find((t: any) => t.id === taskId);
        if (task) {
          await supabase
            .from("complaints")
            .update({ status: "completed" })
            .eq("id", task.complaint_id);

          // Award points to the user who reported the complaint
          const pointsToAward = 10; // Base points for completed cleanup

          // Add points transaction
          await supabase.from("point_transactions").insert({
            user_id: task.complaints.user_id,
            task_id: taskId,
            complaint_id: task.complaint_id,
            type: "earned",
            points: pointsToAward,
            description: "Cleanup completed",
          });

          // Update user's eco points
          const { data: currentPoints } = await supabase
            .from("eco_points")
            .select("*")
            .eq("user_id", task.complaints.user_id)
            .single();

          if (currentPoints) {
            await supabase
              .from("eco_points")
              .update({
                points: currentPoints.points + pointsToAward,
                total_earned: currentPoints.total_earned + pointsToAward,
              })
              .eq("user_id", task.complaints.user_id);
          }
        }

        // Update worker status to available
        await supabase
          .from("worker_status")
          .update({ status: "available", current_task_id: null })
          .eq("worker_id", user.id);
      } else if (status === "in_progress") {
        // Update worker status to busy
        await supabase
          .from("worker_status")
          .update({ status: "busy", current_task_id: taskId })
          .eq("worker_id", user.id);
      }

      setCompletionNotes("");
      fetchData();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error updating task. Please try again.");
    }
  };

  const toggleWorkerStatus = async () => {
    const newStatus =
      workerStatus.status === "available" ? "offline" : "available";

    try {
      const { error } = await supabase
        .from("worker_status")
        .update({ status: newStatus })
        .eq("worker_id", user.id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
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
          <p>Loading worker dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Worker Dashboard</h1>
              <p className="text-gray-600">
                {userRole.locality}, {userRole.city}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={getWorkerStatusColor(workerStatus.status)}>
                {workerStatus.status}
              </Badge>
              <Button
                variant={
                  workerStatus.status === "available"
                    ? "destructive"
                    : "default"
                }
                onClick={toggleWorkerStatus}
              >
                {workerStatus.status === "available" ? (
                  <>
                    <Square className="w-4 h-4 mr-2" /> Go Offline
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" /> Go Online
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Assigned Tasks
                  </p>
                  <p className="text-2xl font-bold">{stats.assignedTasks}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold">{stats.inProgressTasks}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
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
        </div>

        {/* Main Content */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active Tasks</TabsTrigger>
            <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Tasks</CardTitle>
                <CardDescription>
                  Tasks assigned to you that need attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {tasks
                    .filter((task: any) => task.status !== "completed")
                    .map((task: any) => (
                      <div key={task.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{task.title}</h3>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {task.complaints?.address ||
                                  `${task.complaints?.latitude}, ${task.complaints?.longitude}`}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Assigned:{" "}
                              {new Date(task.assigned_at).toLocaleString()}
                            </p>
                          </div>
                          {task.complaints?.photo_url && (
                            <img
                              src={task.complaints.photo_url}
                              alt="Garbage to clean"
                              className="w-32 h-32 object-cover rounded-md ml-4"
                            />
                          )}
                        </div>

                        <div className="flex flex-col gap-3">
                          {task.status === "assigned" && (
                            <Button
                              onClick={() =>
                                updateTaskStatus(task.id, "in_progress")
                              }
                              className="w-fit"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Start Task
                            </Button>
                          )}

                          {task.status === "in_progress" && (
                            <div className="space-y-3">
                              <Textarea
                                placeholder="Add completion notes (optional)"
                                value={completionNotes}
                                onChange={(e) =>
                                  setCompletionNotes(e.target.value)
                                }
                              />
                              <Button
                                onClick={() =>
                                  updateTaskStatus(
                                    task.id,
                                    "completed",
                                    completionNotes,
                                  )
                                }
                                className="w-fit bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Completed
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                  {tasks.filter((task: any) => task.status !== "completed")
                    .length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No active tasks</p>
                      <p className="text-sm text-gray-500 mt-2">
                        You're all caught up! New tasks will appear here when
                        assigned.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Tasks</CardTitle>
                <CardDescription>Your task completion history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks
                    .filter((task: any) => task.status === "completed")
                    .map((task: any) => (
                      <div key={task.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{task.title}</h3>
                              <Badge className={getStatusColor(task.status)}>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>
                                Completed:{" "}
                                {new Date(task.completed_at).toLocaleString()}
                              </span>
                              {task.notes && <span>Notes: {task.notes}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {tasks.filter((task: any) => task.status === "completed")
                    .length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No completed tasks yet</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Completed tasks will appear here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
