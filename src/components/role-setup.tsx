"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";
import { UserCircle, Shield, Wrench } from "lucide-react";

interface RoleSetupProps {
  userId: string;
}

export default function RoleSetup({ userId }: RoleSetupProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleRoleSetup = async () => {
    if (!selectedRole || !locality || !city) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: selectedRole,
        locality,
        city,
      });

      if (error) throw error;

      // Initialize eco_points for citizens
      if (selectedRole === "citizen") {
        await supabase.from("eco_points").insert({
          user_id: userId,
          points: 0,
          total_earned: 0,
          total_redeemed: 0,
        });
      }

      // Initialize worker_status for workers
      if (selectedRole === "worker") {
        await supabase.from("worker_status").insert({
          worker_id: userId,
          status: "available",
          locality,
          city,
        });
      }

      router.refresh();
    } catch (error) {
      console.error("Error setting up role:", error);
      alert("Error setting up role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      value: "citizen",
      title: "Citizen",
      description: "Report garbage, track complaints, and earn eco-points",
      icon: <UserCircle className="w-8 h-8" />,
    },
    {
      value: "admin",
      title: "Municipal Admin",
      description: "Manage complaints, assign tasks, and monitor workers",
      icon: <Shield className="w-8 h-8" />,
    },
    {
      value: "worker",
      title: "Field Worker",
      description: "Receive tasks, update status, and complete cleanup work",
      icon: <Wrench className="w-8 h-8" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Niramay</h1>
          <p className="text-gray-600">
            Choose your role to get started with the platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => (
            <Card
              key={role.value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedRole === role.value
                  ? "ring-2 ring-green-500 bg-green-50"
                  : ""
              }`}
              onClick={() => setSelectedRole(role.value)}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 text-green-600">
                  {role.icon}
                </div>
                <CardTitle>{role.title}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {selectedRole && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>
                Please provide your location details to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Enter your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="locality">Locality/Ward</Label>
                <Input
                  id="locality"
                  placeholder="Enter your locality or ward"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                />
              </div>
              <Button
                onClick={handleRoleSetup}
                disabled={loading || !locality || !city}
                className="w-full"
              >
                {loading ? "Setting up..." : "Complete Setup"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
