import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);
  const garment_id = searchParams.get("garment_id");
  if (!garment_id) {
    return NextResponse.json({ error: "Missing garment_id" }, { status: 400 });
  }

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

  const { data } = await supabase
    .from("profile_garments")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("garment_id", garment_id);

  return NextResponse.json({ isSaved: !!(data && data.length > 0) });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const { garment_id, source_pathname } = await request.json();
  if (!garment_id) {
    return NextResponse.json({ error: "Missing garment_id" }, { status: 400 });
  }

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

  const { data: existingGarment } = await supabase
    .from("profile_garments")
    .select("id")
    .eq("profile_id", profile.id)
    .eq("garment_id", garment_id)
    .single();
  if (existingGarment) {
    await supabase
      .from("profile_garments")
      .delete()
      .eq("id", existingGarment.id);
    return NextResponse.json({ action: "deleted" });
  } else {
    await supabase.from("profile_garments").insert({
      profile_id: profile.id,
      garment_id,
      source_pathname,
    });
    return NextResponse.json({ action: "inserted" });
  }
}
