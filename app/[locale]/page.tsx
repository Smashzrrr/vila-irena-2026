import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { buildJsonLd } from "@/lib/jsonld";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { QuickFacts } from "@/components/sections/QuickFacts";
import { About } from "@/components/sections/About";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Amenities } from "@/components/sections/Amenities";
import { Reviews } from "@/components/sections/Reviews";
import { Location } from "@/components/sections/Location";
import { BookingSection } from "@/components/booking/BookingSection";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(locale, dict)) }}
      />
      <Header nav={dict.nav} locale={locale} />
      <main>
        <Hero hero={dict.hero} />
        <QuickFacts facts={dict.facts} />
        <About about={dict.about} galleryAlt={dict.gallery.alt} />
        <GalleryGrid gallery={dict.gallery} />
        <Amenities amenities={dict.amenities} galleryAlt={dict.gallery.alt} />
        <Reviews reviews={dict.reviews} />
        <Location location={dict.location} galleryAlt={dict.gallery.alt} />
        <BookingSection
          booking={dict.booking}
          form={dict.form}
          success={dict.success}
          locale={locale}
        />
        <Faq faq={dict.faq} />
      </main>
      <Footer footer={dict.footer} nav={dict.nav} locale={locale} />
    </>
  );
}
