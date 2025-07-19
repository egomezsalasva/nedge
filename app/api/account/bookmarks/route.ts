import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const shoot_id = searchParams.get("shoot_id");

  if (!shoot_id) {
    return NextResponse.json({ error: "Missing shoot_id" }, { status: 400 });
  }

  // Get the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the profile for this user
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", user.email)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Check if bookmark exists
  const { data: existingBookmark } = await supabase
    .from("profile_bookmarks")
    .select("id")
    .eq("profile_id", profile.id)
    .eq("shoot_id", shoot_id)
    .single();

  return NextResponse.json({ isBookmarked: !!existingBookmark });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { shoot_id } = await request.json();

  if (!shoot_id) {
    return NextResponse.json({ error: "Missing shoot_id" }, { status: 400 });
  }

  // Find the profile for this user (no error handling)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", user.email)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Check if bookmark exists
  const { data: existingBookmark } = await supabase
    .from("profile_bookmarks")
    .select("id")
    .eq("profile_id", profile.id)
    .eq("shoot_id", shoot_id)
    .single();

  if (existingBookmark) {
    await supabase
      .from("profile_bookmarks")
      .delete()
      .eq("id", existingBookmark.id);

    return NextResponse.json({ action: "deleted" });
  } else {
    await supabase
      .from("profile_bookmarks")
      .insert({ profile_id: profile.id, shoot_id });

    return NextResponse.json({ action: "inserted" });
  }
}
