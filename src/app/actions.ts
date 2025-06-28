"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const aadhaar = formData.get("aadhaar")?.toString()?.replace(/\D/g, "") || "";
  const latitude = formData.get("latitude")?.toString();
  const longitude = formData.get("longitude")?.toString();
  const address = formData.get("address")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email || !password || !fullName || !aadhaar) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "All fields are required including Aadhaar number",
    );
  }

  // Validate Aadhaar format (12 digits)
  if (aadhaar.length !== 12 || !/^\d{12}$/.test(aadhaar)) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Please enter a valid 12-digit Aadhaar number",
    );
  }

  // Check if Aadhaar already exists
  const { data: existingAadhaar } = await supabase
    .from("users")
    .select("id")
    .eq("aadhaar", aadhaar)
    .single();

  if (existingAadhaar) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "This Aadhaar number is already registered",
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        email: email,
        aadhaar: aadhaar,
        role: "citizen",
      },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      // Create user profile
      const { error: updateError } = await supabase.from("users").insert({
        id: user.id,
        name: fullName,
        full_name: fullName,
        email: email,
        aadhaar: aadhaar,
        user_id: user.id,
        token_identifier: user.id,
        created_at: new Date().toISOString(),
      });

      if (updateError) {
        console.error("Error creating user profile:", updateError);
      }

      // Set user role as citizen
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: user.id,
        role: "citizen",
        city: address?.split(",").pop()?.trim() || "Unknown",
        locality: address?.split(",")[0]?.trim() || "Unknown",
      });

      if (roleError) {
        console.error("Error setting user role:", roleError);
      }

      // Initialize eco points
      const { error: pointsError } = await supabase.from("eco_points").insert({
        user_id: user.id,
        points: 0,
        total_earned: 0,
        total_redeemed: 0,
      });

      if (pointsError) {
        console.error("Error initializing eco points:", pointsError);
      }
    } catch (err) {
      console.error("Error in user setup:", err);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  if (user) {
    // Check if user has a role set up
    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    // If no role exists, this is likely a citizen who needs role setup
    if (!userRole) {
      return redirect("/dashboard");
    }
  }

  return redirect("/dashboard");
};

export const adminSignInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  if (user) {
    // Check if user has admin or worker role
    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (
      !userRole ||
      (userRole.role !== "admin" && userRole.role !== "worker")
    ) {
      await supabase.auth.signOut();
      return encodedRedirect(
        "error",
        "/sign-in",
        "Access denied. This account is not authorized for admin/worker access.",
      );
    }
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
