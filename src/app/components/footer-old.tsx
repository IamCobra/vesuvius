import Link from "next/link";

const socialIcons = [
  {
    name: "Twitter",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

const openingHours = [
  { day: "Mandag", hours: "LUKKET" },
  { day: "Tirsdag", hours: "12:00–13:30, 18:00–21:00" },
  { day: "Onsdag", hours: "12:00–13:30, 18:00–21:00" },
  { day: "Torsdag", hours: "12:00–13:30, 18:00–21:00" },
  { day: "Fredag", hours: "12:00–13:30, 18:00–21:30" },
  { day: "Lørdag", hours: "12:00–13:30, 18:00–21:30" },
  { day: "Søndag", hours: "12:15–13:30, 18:15–20:15" },
];

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Make a Booking", href: "/reservation" },
  { name: "Menu", href: "/menu" },
  { name: "Contact Us", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-burgundy-primary text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Contact Us Section */}
          <div>
            <h3 className="text-2xl font-bold mb-8 italic">Contact Us</h3>
            <div className="space-y-4 text-burgundy-light">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 mt-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p>Vejnavn 12</p>
                  <p>5000 Odense C</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <p>+45 65 12 34 56</p>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <p>hej@vesuvius.dk</p>
              </div>
            </div>
          </div>

          {/* Opening Hours Section */}
          <div>
            <h3 className="text-2xl font-bold mb-8 italic">
              Our Kitchen&apos;s
              <br />
              Opening Times
            </h3>
            <div className="space-y-3 text-burgundy-light">
              {openingHours.map(({ day, hours }) => (
                <div key={day} className="flex justify-between">
                  <span>{day}</span>
                  <span>{hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-2xl font-bold mb-8 italic">Quick Links</h3>
            <div className="space-y-4 mb-8">
              {quickLinks.map(({ name, href }) => (
                <Link
                  key={name}
                  href={href}
                  className="block text-burgundy-light hover:text-white transition-colors underline"
                >
                  {name}
                </Link>
              ))}
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {socialIcons.map(({ name, href, icon }) => (
                <a
                  key={name}
                  href={href}
                  className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                  aria-label={name}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
