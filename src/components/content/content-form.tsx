"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichEditor } from "./rich-editor";

interface Gate {
  id: string;
  name: string;
  token: { symbol: string };
}

interface ContentFormProps {
  gates: Gate[];
  onSuccess?: () => void;
  initialData?: {
    id: string;
    title: string;
    body: string;
    contentType: string;
    gateId: string | null;
    mediaUrl: string | null;
    previewText: string | null;
  };
}

export function ContentForm({ gates, onSuccess, initialData }: ContentFormProps) {
  const { getAccessToken } = usePrivy();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initialData?.title || "");
  const [body, setBody] = useState(initialData?.body || "");
  const [contentType, setContentType] = useState(
    initialData?.contentType || "POST"
  );
  const [gateId, setGateId] = useState(initialData?.gateId || "");
  const [mediaUrl, setMediaUrl] = useState(initialData?.mediaUrl || "");
  const [previewText, setPreviewText] = useState(
    initialData?.previewText || ""
  );
  const [uploading, setUploading] = useState(false);

  const isEditing = !!initialData;

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const accessToken = await getAccessToken();
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setMediaUrl(data.url);
    } catch {
      setError("Failed to upload file");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(publish: boolean) {
    setLoading(true);
    setError("");

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Not authenticated");

      const url = isEditing ? `/api/content/${initialData.id}` : "/api/content";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title,
          body,
          contentType,
          gateId: gateId || undefined,
          mediaUrl: mediaUrl || undefined,
          previewText: previewText || undefined,
          isPublished: publish,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save content");
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Content" : "Create Content"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your content title"
            required
          />
        </div>

        <div>
          <Label>Content Type</Label>
          <div className="grid grid-cols-5 gap-2 mt-1">
            {(["POST", "IMAGE", "VIDEO", "FILE", "LINK"] as const).map(
              (type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setContentType(type)}
                  className={`py-2 px-3 rounded-md border text-xs transition ${
                    contentType === type
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>

        <div>
          <Label>Body</Label>
          <RichEditor content={body} onChange={setBody} />
        </div>

        {(contentType === "IMAGE" ||
          contentType === "VIDEO" ||
          contentType === "FILE") && (
          <div>
            <Label>Media</Label>
            <div className="flex gap-2">
              <Input
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="URL or upload a file"
                className="flex-1"
              />
              <label className="cursor-pointer inline-flex">
                <span className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition">
                  {uploading ? "Uploading..." : "Upload"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  disabled={uploading}
                  accept="image/*,video/mp4,application/pdf,.zip"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
              </label>
            </div>
            {mediaUrl && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {mediaUrl}
              </p>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="gate">Token Gate (optional)</Label>
          <select
            id="gate"
            value={gateId}
            onChange={(e) => setGateId(e.target.value)}
            className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm"
          >
            <option value="">Public (no gate)</option>
            {gates.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} (${g.token.symbol})
              </option>
            ))}
          </select>
        </div>

        {gateId && (
          <div>
            <Label htmlFor="preview">
              Public Preview Text (visible to non-holders)
            </Label>
            <Textarea
              id="preview"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="A teaser to convince fans to buy your token..."
              rows={2}
              maxLength={500}
            />
          </div>
        )}

        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleSubmit(false)}
            disabled={loading || !title || !body}
            className="flex-1"
          >
            {loading ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            onClick={() => handleSubmit(true)}
            disabled={loading || !title || !body}
            className="flex-1"
          >
            {loading ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
