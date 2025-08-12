const contactDetails = [
  {
    title: "Adresse",
    content: ["Culinary Gade 123", "Madkvarteret, By 12345"],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    title: "Telefon",
    content: ["(555) 123-4567"],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
  },
  {
    title: "E-mail",
    content: ["hello@vesuvius.com", "reservation@vesuvius.com"],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Åbningstider",
    content: ["Man: Lukket", "Tir-Lør: 12:00-21:00", "Søn: 12:15-20:15"],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Kontakt os</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Vi vil meget gerne høre fra dig! Uanset om du har spørgsmål til vores menu, ønsker at reservere bord eller har brug for catering til dit arrangement, står vores team klar til at hjælpe.
        </p>
      </div>

      <div className="space-y-6">
        {contactDetails.map((detail, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600 flex-shrink-0">
              {detail.icon}
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

      {/* Sociale medier */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Følg os</h3>
        <div className="flex space-x-4">
          {[
            { name: "Facebook", href: "#" },
            { name: "Instagram", href: "#" },
            { name: "Twitter", href: "#" },
          ].map((social) => (
            <a
              key={social.name}
              href={social.href}
              className="bg-orange-100 hover:bg-orange-200 text-orange-600 p-3 rounded-full transition-colors"
              aria-label={`Følg os på ${social.name}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* Akut kontakt */}
      <div className="bg-orange-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Brug for akut hjælp?
        </h3>
        <p className="text-gray-600 mb-3">
          Ved hastesager eller reservation samme dag, ring venligst direkte til os.
        </p>
        <a
          href="tel:+15551234567"
          className="inline-flex items-center space-x-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span>(555) 123-4567</span>
        </a>
      </div>
    </div>
  );
}
