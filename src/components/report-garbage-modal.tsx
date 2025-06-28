"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, MapPin, Upload, X, CheckCircle, Heart } from "lucide-react";
import { createClient } from "../../supabase/client";

interface ReportGarbageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  userRole: any;
}

export default function ReportGarbageModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  userRole,
}: ReportGarbageModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          // Reverse geocoding to get address (simplified)
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
          alert(
            "Unable to get your location. Please enable location services.",
          );
        },
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraMode(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "garbage-photo.jpg", {
                type: "image/jpeg",
              });
              setPhoto(file);
              setPhotoPreview(canvas.toDataURL());
              stopCamera();
            }
          },
          "image/jpeg",
          0.8,
        );
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setCameraMode(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const fileName = `garbage-reports/${userId}/${Date.now()}-${file.name}`;

    // First, ensure the bucket exists or create it
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(
      (bucket) => bucket.name === "garbage-photos",
    );

    if (!bucketExists) {
      const { error: bucketError } = await supabase.storage.createBucket(
        "garbage-photos",
        {
          public: true,
          allowedMimeTypes: ["image/*"],
          fileSizeLimit: 5242880, // 5MB
        },
      );

      if (bucketError) {
        console.error("Error creating bucket:", bucketError);
        // Continue anyway, bucket might exist but not be listed
      }
    }

    const { data, error } = await supabase.storage
      .from("garbage-photos")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      throw new Error(`Failed to upload photo: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("garbage-photos").getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async () => {
    if (!title || !photo || !location) {
      alert(
        "Please fill in all required fields and capture a photo with location.",
      );
      return;
    }

    setLoading(true);
    try {
      // Upload photo
      const photoUrl = await uploadPhoto(photo);

      // Create complaint
      const { error } = await supabase.from("complaints").insert({
        user_id: userId,
        title,
        description,
        photo_url: photoUrl,
        latitude: location.lat,
        longitude: location.lng,
        address: location.address,
        priority,
        locality: userRole.locality,
        city: userRole.city,
        status: "submitted",
      });

      if (error) throw error;

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setPhoto(null);
      setPhotoPreview(null);
      setLocation(null);

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Error submitting report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-green-50 to-orange-50">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gradient-indian flex items-center justify-center gap-2">
            <Camera className="w-6 h-6 text-green-600" />
            Report Garbage
          </DialogTitle>
          <DialogDescription className="text-gray-700 text-base">
            Help keep your city clean by reporting garbage issues • स्वच्छ भारत
            में योगदान दें
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photo Capture Section */}
          <div className="space-y-4">
            <Label>Photo Evidence *</Label>

            {!photoPreview && !cameraMode && (
              <div className="flex gap-2">
                <Button onClick={startCamera} variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {cameraMode && (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <div className="flex gap-2">
                  <Button onClick={capturePhoto}>
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {photoPreview && (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Captured garbage"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  onClick={() => {
                    setPhoto(null);
                    setPhotoPreview(null);
                  }}
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Location Section */}
          <div className="space-y-2">
            <Label>Location *</Label>
            <div className="flex items-center gap-2">
              <Button
                onClick={getCurrentLocation}
                variant="outline"
                size="sm"
                disabled={!!location}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {location ? "Location Captured" : "Get Current Location"}
              </Button>
              {location && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {location.address || `${location.lat}, ${location.lng}`}
                </span>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Garbage pile near bus stop"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide additional details about the garbage issue"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-6">
            <Button
              onClick={handleSubmit}
              disabled={loading || !title || !photo || !location}
              className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="h-12 px-6"
            >
              Cancel
            </Button>
          </div>

          {/* Motivational Footer */}
          <div className="text-center pt-4 border-t border-gray-200 mt-4">
            <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="font-medium text-green-700">
                Every report makes India cleaner!
              </span>
              • हर रिपोर्ट भारत को स्वच्छ बनाती है
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
