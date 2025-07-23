import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AccessCodePage from "./AccessCodePage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: submission, error } = await supabase
    .from("shoot_submissions")
    .select("*")
    .eq("slug", id)
    .single();

  if (!submission || error) {
    notFound();
  }

  return <AccessCodePage submission={submission} />;
}
