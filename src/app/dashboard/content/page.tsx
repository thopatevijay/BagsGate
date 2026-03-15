"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentForm } from "@/components/content/content-form";
import { formatRelativeTime } from "@/lib/utils/format";

interface ContentItem {
  id: string;
  title: string;
  body: string;
  contentType: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  gate: { id: string; name: string; token: { symbol: string } } | null;
}

interface Gate {
  id: string;
  name: string;
  token: { symbol: string };
}

export default function ContentPage() {
  const { getAccessToken } = usePrivy();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [gates, setGates] = useState<Gate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };

      const [contentRes, gatesRes] = await Promise.all([
        fetch("/api/content", { headers }),
        fetch("/api/gates", { headers }),
      ]);

      if (contentRes.ok) {
        const data = await contentRes.json();
        setContents(data.contents);
      }
      if (gatesRes.ok) {
        const data = await gatesRes.json();
        setGates(data.gates);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleDelete(id: string) {
    const accessToken = await getAccessToken();
    const res = await fetch(`/api/content/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.ok) fetchData();
  }

  if (showForm || editingContent) {
    return (
      <div>
        <Button
          variant="ghost"
          onClick={() => {
            setShowForm(false);
            setEditingContent(null);
          }}
          className="mb-4"
        >
          ← Back to Content
        </Button>
        <ContentForm
          gates={gates}
          initialData={
            editingContent
              ? {
                  id: editingContent.id,
                  title: editingContent.title,
                  body: editingContent.body,
                  contentType: editingContent.contentType,
                  gateId: editingContent.gate?.id || null,
                  mediaUrl: null,
                  previewText: null,
                }
              : undefined
          }
          onSuccess={() => {
            setShowForm(false);
            setEditingContent(null);
            fetchData();
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Content</h1>
        <Button onClick={() => setShowForm(true)}>Create Content</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : contents.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              No content yet. Create your first post to start gating.
            </p>
            <Button onClick={() => setShowForm(true)}>Create First Post</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {contents.map((item) => (
            <Card key={item.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{item.title}</h3>
                      <Badge variant={item.isPublished ? "default" : "secondary"}>
                        {item.isPublished ? "Published" : "Draft"}
                      </Badge>
                      {item.gate && (
                        <Badge variant="outline">
                          🔒 {item.gate.name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.contentType} · {formatRelativeTime(item.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingContent(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
