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
    .map(
      (cat: {
        name: string;
        style_tags: {
          name: string;
          slug: string;
          shoot_style_tags: { shoot_id: string }[];
        }[];
      }) => ({
        name: cat.name,
        subStyles: (cat.style_tags || [])
          .filter(
            (tag: { shoot_style_tags: { shoot_id: string }[] }) =>
              tag.shoot_style_tags && tag.shoot_style_tags.length > 0,
          )
          .map((tag: { name: string; slug: string }) => ({
            name: tag.name,
            slug: tag.slug,
          }))
          .sort((a: { name: string }, b: { name: string }) =>
            a.name.localeCompare(b.name),
          ),
      }),
    )
    .filter(
      (cat: { subStyles: { name: string }[] }) => cat.subStyles.length > 0,
    )
    .sort((a: { name: string }, b: { name: string }) =>
      a.name.localeCompare(b.name),
    );

  return NextResponse.json(formatted);
}
