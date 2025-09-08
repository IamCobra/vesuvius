import { FEATURES } from "@/app/constants/restaurant";
import { FeatureIcon } from "./icons";

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose Us
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <div key={feature.key} className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FeatureIcon feature={feature.key} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
