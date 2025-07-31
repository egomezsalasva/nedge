import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AccessCodePage from "./AccessCodePage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let submission;
  try {
    const supabase = await createClient();
    const { id } = await params;
    const { data, error } = await supabase
      .from("shoot_submissions")
      .select("*")
      .eq("slug", id)
      .single();
    if (!data || error) {
      notFound();
    }
    submission = data;
  } catch {
    notFound();
  }

  return <AccessCodePage submission={submission} />;
}
