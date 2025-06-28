"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Award, Package, Truck } from "lucide-react";
import { createClient } from "../../supabase/client";

interface EcoStoreProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userPoints: number;
  onPointsUpdate: () => void;
}

export default function EcoStore({
  isOpen,
  onClose,
  userId,
  userPoints,
  onPointsUpdate,
}: EcoStoreProps) {
  const [items, setItems] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRedeemForm, setShowRedeemForm] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      // Fetch store items
      const { data: itemsData } = await supabase
        .from("eco_store_items")
        .select("*")
        .eq("is_active", true)
        .order("points_cost", { ascending: true });

      // Fetch user redemptions
      const { data: redemptionsData } = await supabase
        .from("redemptions")
        .select("*, eco_store_items(name, image_url)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setItems(itemsData || []);
      setRedemptions(redemptionsData || []);
    } catch (error) {
      console.error("Error fetching store data:", error);
    }
  };

  const handleRedeem = (item: any) => {
    if (userPoints < item.points_cost) {
      alert("Insufficient points for this item.");
      return;
    }
    setSelectedItem(item);
    setShowRedeemForm(true);
  };

  const confirmRedemption = async () => {
    if (!selectedItem || !deliveryAddress) {
      alert("Please provide a delivery address.");
      return;
    }

    setLoading(true);
    try {
      // Create redemption record
      const { error: redemptionError } = await supabase
        .from("redemptions")
        .insert({
          user_id: userId,
          item_id: selectedItem.id,
          points_used: selectedItem.points_cost,
          delivery_address: deliveryAddress,
          notes,
          status: "pending",
        });

      if (redemptionError) throw redemptionError;

      // Create points transaction
      await supabase.from("point_transactions").insert({
        user_id: userId,
        type: "redeemed",
        points: selectedItem.points_cost,
        description: `Redeemed: ${selectedItem.name}`,
      });

      // Update user's eco points
      const { data: currentPoints } = await supabase
        .from("eco_points")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (currentPoints) {
        await supabase
          .from("eco_points")
          .update({
            points: currentPoints.points - selectedItem.points_cost,
            total_redeemed:
              currentPoints.total_redeemed + selectedItem.points_cost,
          })
          .eq("user_id", userId);
      }

      // Update item stock
      if (selectedItem.stock_quantity > 0) {
        await supabase
          .from("eco_store_items")
          .update({ stock_quantity: selectedItem.stock_quantity - 1 })
          .eq("id", selectedItem.id);
      }

      // Reset form
      setSelectedItem(null);
      setDeliveryAddress("");
      setNotes("");
      setShowRedeemForm(false);

      fetchData();
      onPointsUpdate();

      alert("Redemption successful! Your item will be delivered soon.");
    } catch (error) {
      console.error("Error processing redemption:", error);
      alert("Error processing redemption. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="w-4 h-4" />;
      case "approved":
        return <Package className="w-4 h-4" />;
      case "delivered":
        return <Truck className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Eco Store
          </DialogTitle>
          <DialogDescription>
            Redeem your eco-points for sustainable products
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Award className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">
              Available Points: {userPoints}
            </span>
          </div>
        </div>

        <Tabs defaultValue="store" className="space-y-6">
          <TabsList>
            <TabsTrigger value="store">Store Items</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="store">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item: any) => (
                <Card key={item.id} className="relative">
                  <CardHeader className="pb-2">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-md mb-2"
                      />
                    )}
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-yellow-600" />
                        <span className="font-semibold">
                          {item.points_cost} points
                        </span>
                      </div>
                      {item.stock_quantity > 0 ? (
                        <Badge variant="outline">
                          {item.stock_quantity} in stock
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Out of stock</Badge>
                      )}
                    </div>

                    <Button
                      onClick={() => handleRedeem(item)}
                      disabled={
                        userPoints < item.points_cost ||
                        item.stock_quantity === 0
                      }
                      className="w-full"
                      size="sm"
                    >
                      {userPoints < item.points_cost
                        ? "Insufficient Points"
                        : "Redeem"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-4">
              {redemptions.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start redeeming items to see your orders here
                  </p>
                </div>
              ) : (
                redemptions.map((redemption: any) => (
                  <Card key={redemption.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">
                              {redemption.eco_store_items?.name}
                            </h3>
                            <Badge
                              className={getStatusColor(redemption.status)}
                            >
                              <div className="flex items-center gap-1">
                                {getStatusIcon(redemption.status)}
                                {redemption.status}
                              </div>
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Points Used: {redemption.points_used}</p>
                            <p>
                              Delivery Address: {redemption.delivery_address}
                            </p>
                            {redemption.notes && (
                              <p>Notes: {redemption.notes}</p>
                            )}
                            <p>
                              Ordered:{" "}
                              {new Date(
                                redemption.created_at,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {redemption.eco_store_items?.image_url && (
                          <img
                            src={redemption.eco_store_items.image_url}
                            alt={redemption.eco_store_items.name}
                            className="w-16 h-16 object-cover rounded-md ml-4"
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Redemption Form Modal */}
        {showRedeemForm && selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Redeem {selectedItem.name}
              </h3>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Points Required:</p>
                  <p className="font-semibold">
                    {selectedItem.points_cost} points
                  </p>
                </div>

                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={confirmRedemption}
                    disabled={loading || !deliveryAddress}
                    className="flex-1"
                  >
                    {loading ? "Processing..." : "Confirm Redemption"}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowRedeemForm(false);
                      setSelectedItem(null);
                      setDeliveryAddress("");
                      setNotes("");
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
