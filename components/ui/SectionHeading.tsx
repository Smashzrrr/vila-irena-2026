export function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : undefined}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-olive">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.1] text-ink md:text-5xl">
        {title}
      </h2>
    </div>
  );
}
