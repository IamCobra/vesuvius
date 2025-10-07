import Link from "next/link";
import {
  RESTAURANT_INFO,
  OPENING_HOURS,
  QUICK_LINKS,
} from "@/app/constants/restaurant";
import {
  LocationIcon,
  PhoneIcon,
  EmailIcon,
  socialIcon as SocialIcon,
} from "./icons";

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
                <LocationIcon className="w-5 h-5 mt-1" />
                <div>
                  <p>{RESTAURANT_INFO.address.street}</p>
                  <p>{RESTAURANT_INFO.address.city}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <PhoneIcon />
                <p>{RESTAURANT_INFO.contact.phone}</p>
              </div>

              <div className="flex items-center space-x-3">
                <EmailIcon />
                <p>{RESTAURANT_INFO.contact.email}</p>
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
              {OPENING_HOURS.map(({ day, hours }) => (
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
              {QUICK_LINKS.map(({ name, href }) => (
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
              {Object.entries(RESTAURANT_INFO.social).map(
                ([platform, href]) => (
                  <SocialIcon key={platform} platform={platform} href={href} />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
