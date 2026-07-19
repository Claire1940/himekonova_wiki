"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Copy,
  ExternalLink,
  Flame,
  Gift,
  Hammer,
  Lightbulb,
  Scroll,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

// Reusable module header with icon + linked title + intro
function ModuleHeader({
  icon: Icon,
  linkData,
  title,
  intro,
  locale,
}: {
  icon: React.ComponentType<{ className?: string }>;
  linkData: { url: string; title: string } | null | undefined;
  title: string;
  intro: string;
  locale: string;
}) {
  return (
    <div className="text-center mb-10 md:mb-14 scroll-reveal">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-xl bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)]">
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
        </div>
        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
          <LinkedTitle linkData={linkData} locale={locale}>
            {title}
          </LinkedTitle>
        </h2>
      </div>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
        {intro}
      </p>
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.himekonova.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Himeko Nova Wiki",
        description:
          "Complete Himeko Nova Wiki covering character builds, skills, weapons, lore, team compositions, and upgrade materials for the Honkai Impact 3rd Valkyrie Himeko.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Himeko Nova Wiki - Honkai Impact 3rd Character Guide",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Himeko Nova Wiki",
        alternateName: "Himeko Nova",
        url: siteUrl,
        description:
          "Complete Himeko Nova Wiki resource hub for character builds, skills, weapons, lore, and team guides for Honkai Impact 3rd",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Himeko Nova Wiki - Honkai Impact 3rd Character Guide",
        },
        sameAs: [
          "https://honkaiimpact3.hoyoverse.com/",
          "https://www.hoyolab.com",
          "https://www.reddit.com/r/houkai3rd/",
          "https://www.youtube.com/@HonkaiImpact3rd",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Honkai Impact 3rd",
        gamePlatform: ["PC", "Steam", "iOS", "Android"],
        applicationCategory: "Game",
        genre: ["Action", "RPG", "Anime"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/1671200/Honkai_Impact_3rd/",
        },
      },
      {
        "@type": "VideoObject",
        name: "Vermilion Knight: Eclipse Gameplay - Honkai Impact 3rd",
        description:
          "Official Honkai Impact 3rd gameplay showcase featuring Himeko's Vermilion Knight: Eclipse battlesuit.",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/Jz1YWK59ubU",
        url: "https://www.youtube.com/watch?v=Jz1YWK59ubU",
      },
    ],
  };

  // Accordion + copy states
  const [loreExpanded, setLoreExpanded] = useState<number | null>(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // Clipboard unavailable - silently ignore
    }
  };

  // Tools Grid section IDs (must map 1:1 to t.tools.cards order)
  const sectionIds = [
    "character-guide",
    "skills-guide",
    "build-guide",
    "tier-list",
    "beginner-guide",
    "story-and-lore",
    "release-and-updates",
    "codes-and-rewards",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <a
                href="https://honkaiimpact3.hoyoverse.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://store.steampowered.com/app/1671200/Honkai_Impact_3rd/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 区域之后 (max-w-5xl 上限，避免挤压广告) */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="Jz1YWK59ubU"
              title="Vermilion Knight: Eclipse Gameplay - Honkai Impact 3rd"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards (位于视频区之后、Latest Updates 之前) */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                bg-[hsl(var(--nav-theme)/0.1)]
                                flex items-center justify-center
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section (保留模板自带最新文章模块) */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Himeko Nova Character Guide (card-list) */}
      <section id="character-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Users}
            linkData={moduleLinkMap["himekoNovaCharacterGuide"]}
            title={t.modules.himekoNovaCharacterGuide.title}
            intro={t.modules.himekoNovaCharacterGuide.intro}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.modules.himekoNovaCharacterGuide.cards.map((card: any, index: number) => (
              <div
                key={index}
                className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] font-medium">
                    {card.value}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">
                  <LinkedTitle
                    linkData={moduleLinkMap[`himekoNovaCharacterGuide::cards::${index}`]}
                    locale={locale}
                  >
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Himeko Nova Skills Guide (card-list) */}
      <section id="skills-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Flame}
            linkData={moduleLinkMap["himekoNovaSkillsGuide"]}
            title={t.modules.himekoNovaSkillsGuide.title}
            intro={t.modules.himekoNovaSkillsGuide.intro}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.modules.himekoNovaSkillsGuide.cards.map((card: any, index: number) => (
              <div
                key={index}
                className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] font-medium">
                    {card.value}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">
                  <LinkedTitle
                    linkData={moduleLinkMap[`himekoNovaSkillsGuide::cards::${index}`]}
                    locale={locale}
                  >
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Himeko Nova Build Guide (step-by-step) */}
      <section id="build-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Hammer}
            linkData={moduleLinkMap["himekoNovaBuildGuide"]}
            title={t.modules.himekoNovaBuildGuide.title}
            intro={t.modules.himekoNovaBuildGuide.intro}
            locale={locale}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.himekoNovaBuildGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    <LinkedTitle
                      linkData={moduleLinkMap[`himekoNovaBuildGuide::steps::${index}`]}
                      locale={locale}
                    >
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Lightbulb className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.himekoNovaBuildGuide.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 4: Himeko Nova Tier List (tier-grid) */}
      <section id="tier-list" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Trophy}
            linkData={moduleLinkMap["himekoNovaTierList"]}
            title={t.modules.himekoNovaTierList.title}
            intro={t.modules.himekoNovaTierList.intro}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.modules.himekoNovaTierList.tiers.map((tier: any, index: number) => (
              <div
                key={index}
                className="relative p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className="flex items-center justify-center mb-3">
                  <Trophy className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
                </div>
                <h3 className="font-bold text-lg mb-1">
                  <LinkedTitle
                    linkData={moduleLinkMap[`himekoNovaTierList::tiers::${index}`]}
                    locale={locale}
                  >
                    {tier.tier}
                  </LinkedTitle>
                </h3>
                <p className="text-sm font-semibold text-[hsl(var(--nav-theme-light))] mb-2">
                  {tier.rank}
                </p>
                <p className="text-muted-foreground text-sm">{tier.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Himeko Nova Beginner Guide (step-by-step) */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={BookOpen}
            linkData={moduleLinkMap["himekoNovaBeginnerGuide"]}
            title={t.modules.himekoNovaBeginnerGuide.title}
            intro={t.modules.himekoNovaBeginnerGuide.intro}
            locale={locale}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.himekoNovaBeginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    <LinkedTitle
                      linkData={moduleLinkMap[`himekoNovaBeginnerGuide::steps::${index}`]}
                      locale={locale}
                    >
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.himekoNovaBeginnerGuide.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 6: Himeko Nova Story and Lore (accordion) */}
      <section id="story-and-lore" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Scroll}
            linkData={moduleLinkMap["himekoNovaStoryAndLore"]}
            title={t.modules.himekoNovaStoryAndLore.title}
            intro={t.modules.himekoNovaStoryAndLore.intro}
            locale={locale}
          />
          <div className="scroll-reveal space-y-3">
            {t.modules.himekoNovaStoryAndLore.items.map((item: any, index: number) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden bg-white/5"
              >
                <button
                  onClick={() => setLoreExpanded(loreExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Scroll className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                    <span className="font-semibold">{item.title}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform duration-300 ${loreExpanded === index ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${loreExpanded === index ? "max-h-96" : "max-h-0"}`}
                >
                  <p className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Himeko Nova Release and Updates (table) */}
      <section id="release-and-updates" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Clock}
            linkData={moduleLinkMap["himekoNovaReleaseAndUpdates"]}
            title={t.modules.himekoNovaReleaseAndUpdates.title}
            intro={t.modules.himekoNovaReleaseAndUpdates.intro}
            locale={locale}
          />
          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border bg-white/5">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-[hsl(var(--nav-theme)/0.08)]">
                  <th className="p-4 text-sm font-semibold text-[hsl(var(--nav-theme-light))]">Update</th>
                  <th className="p-4 text-sm font-semibold text-[hsl(var(--nav-theme-light))] w-1/3">Date</th>
                  <th className="p-4 text-sm font-semibold text-[hsl(var(--nav-theme-light))]">Details</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.himekoNovaReleaseAndUpdates.entries.map((entry: any, index: number) => (
                  <tr
                    key={index}
                    className={`border-b border-border last:border-b-0 hover:bg-white/5 transition-colors ${index % 2 === 1 ? "bg-white/[0.02]" : ""}`}
                  >
                    <td className="p-4 align-top">
                      <span className="inline-flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                        <LinkedTitle
                          linkData={moduleLinkMap[`himekoNovaReleaseAndUpdates::entries::${index}`]}
                          locale={locale}
                        >
                          <span className="font-semibold">{entry.version}</span>
                        </LinkedTitle>
                      </span>
                    </td>
                    <td className="p-4 align-top text-sm text-muted-foreground whitespace-nowrap">
                      {entry.date}
                    </td>
                    <td className="p-4 align-top text-sm text-muted-foreground">
                      {entry.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Module 8: Himeko Nova Codes and Rewards (code-cards) */}
      <section id="codes-and-rewards" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Gift}
            linkData={moduleLinkMap["himekoNovaCodesAndRewards"]}
            title={t.modules.himekoNovaCodesAndRewards.title}
            intro={t.modules.himekoNovaCodesAndRewards.intro}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.himekoNovaCodesAndRewards.rewards.map((reward: any, index: number) => {
              const code = reward.code;
              const label = code || reward.rewardType;
              return (
                <div
                  key={index}
                  className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] font-medium">
                      {reward.status}
                    </span>
                    {code && (
                      <button
                        onClick={() => handleCopyCode(code)}
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition-colors"
                        aria-label={`Copy code ${code}`}
                      >
                        {copiedCode === code ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {copiedCode === code ? "Copied" : "Copy"}
                      </button>
                    )}
                  </div>
                  {code ? (
                    <div className="mb-2 inline-block font-mono text-lg font-bold tracking-wider px-3 py-1.5 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-dashed border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]">
                      {code}
                    </div>
                  ) : (
                    <h3 className="mb-2 font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                      {reward.rewardType}
                    </h3>
                  )}
                  <p className="font-semibold text-sm mb-1">{reward.reward}</p>
                  <p className="text-muted-foreground text-sm">{reward.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.hoyolab.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/houkai3rd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@HonkaiImpact3rd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://honkaiimpact3.hoyoverse.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
