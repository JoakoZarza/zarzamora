export type Platform = "web" | "android";
export type Status = "estable" | "beta" | "desarrollo";
export type MediaKind = "image" | "video" | "youtube";

export type Media = {
  id: string;
  app_id: string;
  kind: MediaKind;
  url: string;
  poster_url: string | null;
  caption: string | null;
  position: number;
};

export type App = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  category: string;
  platform: Platform;
  status: Status;
  version: string;
  released_on: string | null;
  language: string;
  size_label: string;
  web_url: string;
  apk_url: string;
  repo_url: string;
  icon_url: string;
  color: string;
  is_pwa: boolean;
  works_offline: boolean;
  whats_new: string[];
  build_tools: string[];
  build_time: string;
  build_quote: string;
  privacy: string[];
  featured: boolean;
  published: boolean;
  position: number;
  media: Media[];
};

export type SiteSettings = {
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_text: string;
  about_photo_url: string;
  tools: string[];
  contact_email: string;
  github_url: string;
  footer_text: string;
};
