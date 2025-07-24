import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@/utils/supabase/server";
export const runtime = "nodejs";

type GarmentType = {
  type: string;
  name: string;
  brand: string;
};

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch (err) {
    console.error("Failed to parse JSON body:", err);
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const { details, tags, garments, imagePaths } = body;

  if (
    !details ||
    !tags ||
    !garments ||
    !imagePaths ||
    !Array.isArray(imagePaths)
  ) {
    console.error("Missing or invalid fields", {
      details,
      tags,
      garments,
      imagePaths,
    });
    return NextResponse.json(
      { success: false, error: "Missing or invalid required fields" },
      { status: 400 },
    );
  }

  // --- Generate signed URLs for images ---
  let imagesText = "No images uploaded.";
  if (imagePaths && imagePaths.length > 0) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const bucket = "featuresform";
    imagesText = imagePaths
      .map(
        (path) => `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`,
      )
      .join("\n");
  }

  const garmentsText = garments.length
    ? garments
        .map(
          (garment: GarmentType) =>
            `Type: ${garment.type}\n Name: ${garment.name}\n Brand: ${garment.brand}\n ------------------------------`,
        )
        .join("\n")
    : "None";

  const text = `
      New Feature Submission From ${details.stylistName || ""}

      Stylist Name: ${details.stylistName || ""}
      Shoot Name: ${details.shootName || ""}
      City: ${details.city || ""}

      Tags: ${tags.join(", ")}

      Garments:
      ${garmentsText}

      Images:
      ${imagesText}
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
    console.error("Error in features-form POST:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Unknown error" },
      { status: 500 },
    );
  }
}
