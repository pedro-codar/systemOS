import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const contentType = "image/png";

export default async function Icon() {
  const iconPath = join(process.cwd(), "src", "app", "favicon.png");
  const iconBuffer = await readFile(iconPath);

  return new Response(iconBuffer, {
    headers: {
      "Content-Type": contentType,
    },
  });
}
