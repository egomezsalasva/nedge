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
  } = await supabase.auth.getUser();

  // Find the profile for this user
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user?.id)
    .single();

  // Check if bookmark exists
  const { data: existingBookmark } = await supabase
    .from("profile_bookmarks")
    .select("id")
    .eq("profile_id", profile?.id)
    .eq("shoot_id", shoot_id)
    .single();

  return NextResponse.json({ isBookmarked: !!existingBookmark });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { shoot_id } = await request.json();

  // Find the profile for this user (no error handling)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user?.id)
    .single();

  // Check if bookmark exists
  const { data: existingBookmark } = await supabase
    .from("profile_bookmarks")
    .select("id")
    .eq("profile_id", profile?.id)
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
      .insert({ profile_id: profile?.id, shoot_id });

    return NextResponse.json({ action: "inserted" });
  }
}
