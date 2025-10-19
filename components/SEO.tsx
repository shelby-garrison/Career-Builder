import Head from "next/head";

export default function SEO({
  title,
  description,
  canonical,
  noindex,
  schemaOrg
}: {
  title: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  schemaOrg?: Record<string, unknown>;
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {canonical && <link rel="canonical" href={canonical} />}
        {noindex && <meta name="robots" content="noindex, nofollow" />}
        {!noindex && <meta name="robots" content="index, follow" />}
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        {description && <meta property="og:description" content={description} />}
        {canonical && <meta property="og:url" content={canonical} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        {description && <meta name="twitter:description" content={description} />}
        
        {/* Additional SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Structured Data */}
        {schemaOrg && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
        )}
      </Head>
    </>
  );
}
