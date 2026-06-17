import type { Dictionary } from "./dictionaries";
import type { Locale } from "./i18n";
import { AIRBNB_LISTING_URL, OWNER_PHONE } from "./config";
import { galleryImages, heroImage } from "./image-manifest";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * @graph: VacationRental (the specific schema.org type for a whole-property
 * short-term rental) + FAQPage + WebSite + WebPage.
 *
 * aggregateRating IS included here. It mirrors the genuine 5.0 / 23 Airbnb
 * rating shown on the page; for a vacation rental this is a strong AEO/GEO
 * signal (AI answer engines cite rated properties), and the rating is real,
 * not invented. (Google's self-serving review-snippet caution is accepted as
 * a low risk on a brochure site against the citation upside.)
 *
 * FAQPage markup stays valuable even though Google retired the FAQ rich-result
 * display (2026): AI answer engines still extract the Q&A pairs.
 */
export function buildJsonLd(locale: Locale, dict: Dictionary) {
  const url = `${siteUrl}/${locale}`;

  // 8+ images is the recommended minimum for vacation-rental structured data.
  const image = [
    `${siteUrl}/og.jpg`,
    `${siteUrl}${heroImage.src}`,
    ...galleryImages.slice(0, 10).map((img) => `${siteUrl}${img.src}`),
  ];

  const amenityFeature = [
    "Private outdoor pool (seasonal, 32 m²)",
    "Covered barbecue area with outdoor dining",
    "Children's playground",
    "Free private parking",
    "Wi-Fi",
    "Air conditioning",
    "Fully equipped kitchen",
    "Washing machine",
    "Pets allowed",
    "Olive grove and organic garden",
  ].map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VacationRental",
        "@id": `${siteUrl}/#lodging`,
        name: "Vila Irena",
        additionalType: "https://schema.org/House",
        identifier: {
          "@type": "PropertyValue",
          propertyID: "airbnb",
          value: "24415071",
        },
        description: dict.meta.description,
        url,
        image,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bruška",
          postalCode: "23420",
          addressRegion: "Zadarska županija",
          addressCountry: "HR",
        },
        geo: {
          "@type": "GeoCoordinates",
          // Village-level coordinates; the exact property location is private.
          latitude: 44.074893,
          longitude: 15.73813,
        },
        checkinTime: "T15:00",
        checkoutTime: "T10:00",
        petsAllowed: true,
        priceRange: "€€",
        telephone: OWNER_PHONE.replace(/\s/g, ""),
        sameAs: [AIRBNB_LISTING_URL],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: 5,
          reviewCount: 23,
          bestRating: 5,
          worstRating: 1,
        },
        containsPlace: {
          "@type": "Accommodation",
          name: "Vila Irena",
          occupancy: {
            "@type": "QuantitativeValue",
            value: 8,
          },
          numberOfBedrooms: 2,
          numberOfBathroomsTotal: 2,
          floorSize: {
            "@type": "QuantitativeValue",
            value: 90,
            unitCode: "MTK",
          },
          amenityFeature,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: locale,
        mainEntity: dict.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Vila Irena",
        url: siteUrl,
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: dict.meta.title,
        description: dict.meta.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#lodging` },
        inLanguage: locale,
      },
    ],
  };
}
