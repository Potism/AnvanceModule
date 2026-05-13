"use client"

import { Header } from "@/components/header"
import { ClientForm } from "@/components/client-form/client-form"
import {
  Video,
  Camera,
  Globe,
  Clapperboard,
  Youtube,
  Sparkles,
  Instagram,
  Megaphone,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Decorative gradient mesh — modern 2026 dark aesthetic */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-foreground/[0.06] blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full bg-foreground/[0.04] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-foreground/[0.03] blur-3xl" />
        {/* Faint grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 xl:gap-12">
          {/* Left Column — Hero */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8 lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                <Sparkles className="h-3.5 w-3.5 text-foreground" />
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  {t("home.badge")}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold text-foreground leading-[1.05] tracking-tight text-balance">
                {t("home.title")}
              </h1>

              <p className="text-sm sm:text-base lg:text-sm xl:text-base 2xl:text-lg text-muted-foreground leading-relaxed">
                {t("home.subtitle")}
              </p>
            </div>

            {/* Services */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {t("home.services")}
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <ServiceCard
                  icon={Video}
                  title={t("service.cinematicVideo")}
                  description={t("service.cinematicVideoDesc")}
                />
                <ServiceCard
                  icon={Clapperboard}
                  title={t("service.reels")}
                  description={t("service.reelsDesc")}
                />
                <ServiceCard
                  icon={Youtube}
                  title={t("service.youtube")}
                  description={t("service.youtubeDesc")}
                />
                <ServiceCard
                  icon={Camera}
                  title={t("service.photography")}
                  description={t("service.photographyDesc")}
                />
                <ServiceCard
                  icon={Instagram}
                  title={t("service.socialMedia")}
                  description={t("service.socialMediaDesc")}
                />
                <ServiceCard
                  icon={Megaphone}
                  title={t("service.digitalMarketing")}
                  description={t("service.digitalMarketingDesc")}
                />
                <ServiceCard
                  icon={Globe}
                  title={t("service.webDev")}
                  description={t("service.webDevDesc")}
                  className="col-span-2"
                />
              </div>
            </div>

            {/* Testimonial */}
            <div className="hidden lg:block relative p-5 xl:p-6 rounded-2xl bg-card border border-border overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_8px_24px_-8px_rgba(0,0,0,0.5)]">
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-foreground/[0.06] blur-2xl pointer-events-none" />
              <div className="relative flex items-start gap-3 xl:gap-4">
                <div className="w-10 h-10 xl:w-11 xl:h-11 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0 ring-1 ring-foreground/20">
                  <span className="text-base xl:text-lg font-semibold">A</span>
                </div>
                <div>
                  <p className="text-sm xl:text-[15px] text-foreground/90 italic leading-relaxed">
                    &ldquo;{t("home.testimonial")}&rdquo;
                  </p>
                  <p className="mt-2 xl:mt-3 text-xs xl:text-sm text-muted-foreground">
                    {t("home.testimonialAuthor")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Form */}
          <div className="lg:col-span-3">
            <ClientForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8 lg:mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            &copy; {new Date().getFullYear()} Anvance Production. {t("home.footer.rights")}
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="#"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("home.footer.privacy")}
            </a>
            <a
              href="#"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("home.footer.terms")}
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ServiceCard({
  icon: Icon,
  title,
  description,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  className?: string
}) {
  return (
    <div
      className={`group relative p-3 sm:p-4 rounded-xl bg-card border border-border hover:border-foreground/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_8px_24px_-12px_rgba(0,0,0,0.6)] ${className}`}
    >
      <div className="p-1.5 sm:p-2 w-fit rounded-md sm:rounded-lg bg-foreground text-background mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <h3 className="text-xs sm:text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 leading-snug">
        {description}
      </p>
    </div>
  )
}
