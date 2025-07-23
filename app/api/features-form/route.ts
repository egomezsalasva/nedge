import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@/utils/supabase/server";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();

  const detailsRaw = formData.get("details") as string;
  const tagsRaw = formData.get("tags") as string;
  const garmentsRaw = formData.get("garments") as string;
  const details = detailsRaw ? JSON.parse(detailsRaw) : {};
  const tags: string[] = tagsRaw ? JSON.parse(tagsRaw) : [];
  const garments: { type: string; name: string; brand: string }[] = garmentsRaw
    ? JSON.parse(garmentsRaw)
    : [];

  const files = formData.getAll("files") as File[];
  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type,
    })),
  );

  const garmentsText = garments.length
    ? garments
        .map(
          (g) => `Type: ${g.type}\nName: ${g.name}\nBrand: ${g.brand}\n-----`,
        )
        .join("\n")
    : "None";

  // Format the email body
  const text = `
    New Feature Submission From ${details.stylistName || ""}

    Stylist Name: ${details.stylistName || ""}
    Shoot Name: ${details.shootName || ""}
    City: ${details.city || ""}

    Tags: ${tags.join(", ")}

    Garments:
    ${garmentsText}

  `;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: "nedgestyle@gmail.com",
      subject: `New Feature Submission: ${details.stylistName || "No Stylist Name"}`,
      text,
      attachments,
    });

    const supabase = await createClient();
    const referer = request.headers.get("referer");
    let slug: string | undefined = undefined;
    if (referer) {
      const url = new URL(referer);
      const parts = url.pathname.split("/");
      slug = parts[parts.length - 1];
    }
    if (slug) {
      await supabase
        .from("shoot_submissions")
        .update({ submitted: true })
        .eq("slug", slug);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
