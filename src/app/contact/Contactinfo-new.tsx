import { CONTACT_DETAILS, RESTAURANT_INFO } from "@/app/constants/restaurant";
import { ContactIcon } from "@/app/components/icons";

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Kontakt os</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Vi vil meget gerne høre fra dig! Uanset om du har spørgsmål til vores
          menu, ønsker at reservere bord eller har brug for catering til dit
          arrangement, står vores team klar til at hjælpe.
        </p>
      </div>

      <div className="space-y-6">
        {CONTACT_DETAILS.map((detail, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="bg-burgundy-light p-3 rounded-full text-burgundy-primary flex-shrink-0">
              <ContactIcon type={detail.icon} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {detail.title}
              </h3>
              {detail.content.map((line, lineIndex) => (
                <p key={lineIndex} className="text-gray-600">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Social Media */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Følg os</h3>
        <div className="flex space-x-4">
          {Object.entries(RESTAURANT_INFO.social).map(([platform, href]) => (
            <a
              key={platform}
              href={href}
              className="bg-burgundy-light hover:bg-burgundy-primary text-burgundy-primary hover:text-white p-3 rounded-full transition-colors"
              aria-label={`Følg os på ${platform}`}
            >
              <ContactIcon type={platform} className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-burgundy-light p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Brug for akut hjælp?
        </h3>
        <p className="text-gray-600 mb-3">
          Ved hastesager eller reservation samme dag, ring venligst direkte til
          os.
        </p>
        <a
          href={`tel:${RESTAURANT_INFO.contact.phone}`}
          className="inline-flex items-center space-x-2 text-burgundy-primary font-semibold hover:text-burgundy-dark transition-colors"
        >
          <ContactIcon type="phone" className="w-5 h-5" />
          <span>{RESTAURANT_INFO.contact.phone}</span>
        </a>
      </div>
    </div>
  );
}
