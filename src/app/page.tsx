import Footer from "@/app/components/footer";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Your Food Background */}
      {/* make hero slightly shorter than full viewport so the sticky header doesn't push the bottom off-screen */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center bg-burgundy-primary">
        {/* Background Image */}
        <Image
          src="/heroimg.jpg"
          alt="Vesuvius Restaurant Background"
          fill
          style={{ objectFit: "cover" }}
          priority
          className="absolute inset-0"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

        {/* Content Overlay */}
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Velkommen til{" "}
            <span className="text-burgundy-primary">Vesuvius</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Oplev de fineste smagsoplevelser med vores omhyggeligt tilberedte
            retter lavet af friske, lokale ingredienser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/menu"
              className="w-full sm:w-auto bg-burgundy-primary hover:bg-burgundy-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
            >
              Se Vores Menu
            </a>
            <a
              href="/reservation"
              className="w-full sm:w-auto bg-white hover:bg-gray-100 text-burgundy-primary px-8 py-4 rounded-lg font-semibold text-lg border-2 border-white transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
            >
              Reserver nu
            </a>
          </div>
        </div>
      </section>

      {/* About Section - Pure Tailwind */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-burgundy-light">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-burgundy-primary mb-6">
                Vores Historie
              </h2>
              <p className="text-lg text-burgundy-dark leading-relaxed mb-6">
                Hos Vesuvius tror vi på at skabe uforglemmelige kulinariske
                oplevelser gennem autentiske italienske retter tilberedt med
                passion og de fineste ingredienser.
              </p>
              <p className="text-lg text-burgundy-dark leading-relaxed mb-8">
                Vores køkken kombinerer traditionelle italienske teknikker med
                moderne innovation for at bringe jer de mest autentiske
                smagsoplevelser direkte fra Italien til Odense.
              </p>
              <a
                href="/contact"
                className="inline-block bg-burgundy-primary hover:bg-burgundy-dark text-burgundy-light px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Kontakt Os
              </a>
            </div>
            <div className="relative">
              <div className="bg-white border-2 border-burgundy-primary w-full h-64 sm:h-80 lg:h-96 rounded-lg flex items-center justify-center">
                <div className="text-center text-burgundy-primary">
                  <svg
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <p className="text-lg font-medium">Restaurant Billede</p>
                  <p className="text-sm">Kommer Snart</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
