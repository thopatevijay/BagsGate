import { put, del } from "@vercel/blob";

export async function uploadFile(
  file: File,
  folder: string = "content"
): Promise<string> {
  const filename = `${folder}/${Date.now()}-${file.name}`;

  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return blob.url;
}

export async function uploadFromBuffer(
  buffer: Buffer,
  filename: string,
  contentType: string,
  folder: string = "content"
): Promise<string> {
  const path = `${folder}/${Date.now()}-${filename}`;

  const blob = await put(path, buffer, {
    access: "public",
    contentType,
    addRandomSuffix: true,
  });

  return blob.url;
}

export async function deleteFile(url: string): Promise<void> {
  await del(url);
}
