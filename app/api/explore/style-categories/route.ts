import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from("style_categories").select(`
    name,
    style_tags(
      name,
      slug,
      shoot_style_tags!inner(shoot_id)
    )
  `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formatted = (data || [])
    .map((cat: any) => ({
      name: cat.name,
      subStyles: (cat.style_tags || [])
        .filter(
          (tag: any) => tag.shoot_style_tags && tag.shoot_style_tags.length > 0,
        )
        .map((tag: any) => ({ name: tag.name, slug: tag.slug }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name)),
    }))
    .filter((cat: any) => cat.subStyles.length > 0)
    .sort((a: any, b: any) => a.name.localeCompare(b.name));

  return NextResponse.json(formatted);
}
