export const metadata = {
  title: "Om Vesuvius",
  description: "Om Vesuvius restaurant og vores historie.",
};

import Image from "next/image";
import BackButton from "@/app/about/BackButton";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-burgundy-primary">
        Om Vesuvius
      </h1>
      <div className="flex justify-center mb-6">
        <div className="rounded-full overflow-hidden shadow-lg border-4 border-burgundy-light w-40 h-40 bg-white flex items-center justify-center">
          <Image
            src="/aboutimage.avif"
            alt="Restaurant Vesuvius interiør"
            width={160}
            height={160}
            className="object-cover"
            priority
          />
        </div>
      </div>
      <p className="text-lg mb-6 text-center">
        Velkommen til{" "}
        <span className="text-burgundy-primary font-semibold">Vesuvius</span>,
        hvor vi serverer byens bedste pizza!
        <br />
        Vores passion for autentisk italiensk mad og friske råvarer gør os
        unikke. Uanset om du spiser hos os eller bestiller ud, lover vi en
        lækker oplevelse hver gang.
      </p>
      <div className="bg-burgundy-light rounded-lg p-6 shadow text-center">
        <h2 className="text-2xl font-semibold mb-2 text-burgundy-primary">
          Vores historie
        </h2>
        <p>
          Vesuvius er en familiedrevet restaurant dedikeret til at bringe smagen
          af Napoli til dit bord. Vores kokke bruger traditionelle opskrifter og
          lokale råvarer til at lave hver ret med omhu.
        </p>
      </div>

      <BackButton className="mt-6 px-4 py-2 bg-burgundy-primary rounded hover:bg-burgundy-dark" />
    </div>
  );
}
