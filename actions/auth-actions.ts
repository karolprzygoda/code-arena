"use server";

import { authSchema, TAuthSchema } from "@/schemas/schema";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

export async function signIn(formData: TAuthSchema) {
  const supabase = await createClient();

  const data = {
    email: formData.email,
    password: formData.password,
  };

  const validatedAuthData = authSchema.safeParse(data);

  if (!validatedAuthData.success) {
    return { error: validatedAuthData.error.errors[0].message };
  }

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(formData: TAuthSchema) {
  const supabase = await createClient();

  const data = {
    email: formData.email,
    password: formData.password,
  };

  const validatedAuthData = authSchema.safeParse(data);

  if (!validatedAuthData.success) {
    return { error: validatedAuthData.error.errors[0].message };
  }

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInWithGithub() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  });

  if (error) {
    return { errorMessage: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return { errorMessage: error.message };
  }
  if (data.url) {
    redirect(data.url);
  }
}

export async function authorizeUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Authentication error:", error.message);
    return {
      user: null,
      error: "Authentication failed. Please log in and try again.",
    };
  }

  if (!user) {
    console.error("No user found.");
    return {
      user: null,
      error: "You are not authenticated. Please log in to proceed.",
    };
  }

  const isAdmin = await prismadb.userRoles.findFirst({
    where: {
      userid: user.id,
      role: "ADMIN",
    },
  });

  if (!isAdmin) {
    return {
      user: null,
      error:
        "Unauthenticated. You do not have permission to perform this action.",
    };
  }

  return { user, error: null };
}
