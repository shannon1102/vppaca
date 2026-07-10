import type { MetadataRoute } from "next";
import { repo } from "@/lib/data/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [products, categories, articles] = await Promise.all([
    repo.listProducts({ publishedOnly: true }),
    repo.listCategories(),
    repo.listArticles({ publishedOnly: true }),
  ]);

  return [
    { url: base, changeFrequency: "daily", priority: 1, lastModified: new Date() },
    {
      url: `${base}/san-pham`,
      changeFrequency: "daily",
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: `${base}/bai-viet-suc-khoe`,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: articles[0] ? new Date(articles[0].updated_at) : new Date(),
    },
    { url: `${base}/gioi-thieu`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/lien-he`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/chinh-sach`, changeFrequency: "yearly", priority: 0.3 },
    ...categories.map((c) => ({
      url: `${base}/danh-muc/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${base}/san-pham/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...articles.map((a) => ({
      url: `${base}/bai-viet-suc-khoe/${a.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      lastModified: new Date(a.updated_at),
    })),
  ];
}
