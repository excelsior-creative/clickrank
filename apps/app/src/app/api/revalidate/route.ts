import { revalidateTag, revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, tag, paths } = body;

    // Verify revalidation secret
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    // Revalidate by tag if provided
    if (tag) {
      revalidateTag(tag, "default");
      console.log(`Revalidated tag: ${tag}`);
    }

    // Revalidate specific paths if provided
    if (paths && Array.isArray(paths)) {
      paths.forEach((path) => {
        revalidatePath(path);
        console.log(`Revalidated path: ${path}`);
      });
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}

