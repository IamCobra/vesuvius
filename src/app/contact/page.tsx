import ContactForm from "@/app/contact/contactForm";
import ContactInfo from "@/app/contact/Contactinfo";
import Footer from "@/app/components/footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contact Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="lg:order-1">
              <ContactInfo />
            </div>

            {/* Contact Form */}
            <div className="lg:order-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Send os en besked
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Find Os
          </h2>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            {/* Placeholder for map - you can integrate Google Maps or similar */}
            <div className="text-center text-gray-600">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
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
              <p className="text-lg font-medium">Interaktivt Kort</p>
              <p className="text-sm">Vejnavn 12, 5000 Odense C</p>
              <p className="text-sm text-gray-500 mt-2">
                Kort integration kommer snart
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
