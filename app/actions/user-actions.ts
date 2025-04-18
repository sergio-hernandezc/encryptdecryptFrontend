"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Create a Supabase client with admin privileges for server-side operations
// These environment variables must be set in your deployment environment
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  {
    auth: {
      persistSession: false,
    },
  },
)

export async function deleteUserAccount(userId: string) {
  if (!userId) {
    return { success: false, error: "User ID is required" }
  }

  try {
    // Get the user's session to validate the request
    const cookieStore = cookies()
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        auth: {
          persistSession: false,
        },
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    const {
      data: { session },
    } = await supabaseClient.auth.getSession()

    // Security check: ensure the user is deleting their own account
    if (!session || session.user.id !== userId) {
      return { success: false, error: "Unauthorized deletion attempt" }
    }

    // Delete the user using admin privileges
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) {
      console.error("Error deleting user:", error)
      return { success: false, error: error.message }
    }

    // You could add additional cleanup here, such as deleting user data from other tables

    return { success: true }
  } catch (error) {
    console.error("Error in deleteUserAccount:", error)
    return { success: false, error: "Failed to delete account" }
  }
}
