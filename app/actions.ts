"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import getEvent from "@/utils/supabase/getEvent";

export const AnonSignInAction = async (formData: FormData) => {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const ticket_type = formData.get("ticket_type")?.toString();
  const event_id = formData.get("event")?.toString();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      data: {
        name: name,
        email: email,
        ticket_type: ticket_type,
        event_id: event_id,
      },
    },
  });

  if (error) {
    return "Error Authenticating!";
  }

  const user = data?.user;

  if (user) {
    const { error: inset_attendee_error } = await supabase
      .from("attendees")
      .insert({
        email: user.user_metadata.email,
        ticket_type: user.user_metadata.ticket_type,
        name: user.user_metadata.name,
      });
    if (inset_attendee_error) {
      console.log("Error inserting attendee!", inset_attendee_error);
      return "Error inserting attendee!";
    }
  }

  if (event_id) {
    const event = await getEvent(event_id);
    if (!event) {
      return "Event not found!";
    }
    if (!data.user?.id) {
      return "User not found!";
    }
    const result = await supabase
      .from("event_attendees")
      .insert({ event_id, attendee_id: data.user.id });

    if (result.error) {
      return "Error registering!";
    }
  }
  createAttendeeReadyForNextRound();
  return redirect("/protected/waiting-room");
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
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
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
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
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const modifyAttendeeReadyForNextRound = async (isReady: boolean) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }
  const { data, error } = await supabase
    .from("round_participation")
    .update({
      is_ready: isReady,
    })
    .eq("attendee_id", user.id);

  if (error) {
    console.log("Error updating round participation", error);
  }
};

export const createAttendeeReadyForNextRound = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }
  const { data, error } = await supabase
    .from("round_participation")
    .insert({
      attendee_id: user.id,
      event_id: user.user_metadata.event_id,
      is_ready: false,
    })
    .select("*")
    .single();
  return data;
};

export const setWillShareContactInfo = async (
  willShareValue: boolean,
  match_id: number
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }
  const { data, error } = await supabase
    .from("event_round_matches")
    .update({
      willShare: willShareValue,
    })
    .eq("id", match_id);

  if (error) {
    console.log("Error updating attendee", error);
  }
};
