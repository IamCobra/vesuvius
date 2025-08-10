import Link from "next/link";

interface HeroSectionProps {
  title: React.ReactNode;
  subtitle: string;
  showButtons?: boolean;
}
export default function HeroSection({
  title,
  subtitle,
  showButtons = true,
}: HeroSectionProps) {
  return (
    <section className="relative py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          {title}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        {showButtons && (
          <div className="space-x-4">
            <Link
              href="/menu"
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              View Menu
            </Link>
            <Link
              href="/order"
              className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold border-2 border-orange-600 hover:bg-orange-50 transition-colors"
            >
              Order Now
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
