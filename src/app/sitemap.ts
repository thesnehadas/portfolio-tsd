import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.thesnehadas.com",
      lastModified: new Date(),
    },
    {
      url: "https://www.thesnehadas.com/blog",
      lastModified: new Date(),
    },
    {
      url: "https://www.thesnehadas.com/blog/the-timeline",
      lastModified: new Date(),
    },
  ];
}