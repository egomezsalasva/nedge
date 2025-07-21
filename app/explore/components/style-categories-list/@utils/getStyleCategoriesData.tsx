import { createClient } from "@/utils/supabase/client";

export type StyleCategoryType = {
  name: string;
  subStyles: { name: string; slug: string }[];
};

export async function getStyleCategoriesData(): Promise<StyleCategoryType[]> {
  const supabase = createClient();

  const { data: publicShoots, error: shootsError } = await supabase
    .from("shoots")
    .select("id, preview_slug")
    .is("preview_slug", null);

  if (shootsError) {
    throw new Error(shootsError.message);
  }
  const publicShootIds = new Set(
    (publicShoots || []).map((s: { id: number }) => s.id),
  );

  const { data, error } = await supabase.from("style_categories").select(`
    name,
    style_tags(
      name,
      slug,
      shoot_style_tags!inner(shoot_id)
    )
  `);

  if (error) {
    throw new Error(error.message);
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
              tag.shoot_style_tags &&
              tag.shoot_style_tags.some((sst: { shoot_id: string }) =>
                publicShootIds.has(Number(sst.shoot_id)),
              ),
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

  return formatted;
}
