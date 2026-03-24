import { MetadataRoute } from "next";
import { fetchActivities } from "@/features/activity/api/activity.api";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://vienkhongni.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/introduction/other-monasteries`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/introduction/past-and-present`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/introduction/scenery-of-vien-khong`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/activity`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/course`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/library/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/library/calligraphy`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/library/poem`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/library/question`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/rule`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const response = await fetchActivities({
    sort: "updatedAt:desc",
    pagination: {
      page: 1,
      pageSize: 15,
    },
    fields: ["slug", "documentId", "updatedAt"],
  });

  const activityEntries: MetadataRoute.Sitemap = Array.isArray(response.data)
    ? response.data.map((item) => ({
        url: `${baseUrl}/activity/${item.slug}-${item.documentId}`,
        lastModified: new Date(item.updatedAt as string),
        changeFrequency: "weekly",
        priority: 0.6,
      }))
    : [];

  return [...staticRoutes, ...activityEntries];
}
