import Footer from "@/app/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Your Food Background */}
      <section className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/food-background.jpg')`, // Replace 'food-background.jpg' with your actual filename
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Velkommen til <span className="text-orange-400">Vesuvius</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Oplev de fineste smagsoplevelser med vores omhyggeligt tilberedte
            retter lavet af friske, lokale ingredienser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/menu"
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
            >
              Se Vores Menu
            </a>
            <a
              href="/order"
              className="w-full sm:w-auto bg-white hover:bg-gray-100 text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-white transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
            >
              Bestil Nu
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section - Pure Tailwind */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12 lg:mb-16">
            Hvorfor Vælge Vesuvius?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="bg-orange-100 group-hover:bg-orange-200 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                <svg
                  className="w-8 h-8 lg:w-10 lg:h-10 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
                Friske Ingredienser
              </h3>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                Vi bruger kun de friskeste lokale ingredienser til hver ret for
                at sikre den bedste smag og kvalitet.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="bg-orange-100 group-hover:bg-orange-200 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                <svg
                  className="w-8 h-8 lg:w-10 lg:h-10 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
                Hurtig Levering
              </h3>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                Pålidelig og hurtig levering direkte til din dør, så du kan nyde
                vores delikate retter hjemme.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="bg-orange-100 group-hover:bg-orange-200 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                <svg
                  className="w-8 h-8 lg:w-10 lg:h-10 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
                Lavet Med Kærlighed
              </h3>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                Hver ret tilberedes med omhu og passion af vores erfarne kokke
                for en uforglemmelig smagsoplevelse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Pure Tailwind */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                Vores Historie
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Hos Vesuvius tror vi på at skabe uforglemmelige kulinariske
                oplevelser gennem autentiske italienske retter tilberedt med
                passion og de fineste ingredienser.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Vores køkken kombinerer traditionelle italienske teknikker med
                moderne innovation for at bringe jer de mest autentiske
                smagsoplevelser direkte fra Italien til Odense.
              </p>
              <a
                href="/contact"
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Kontakt Os
              </a>
            </div>
            <div className="relative">
              <div className="bg-orange-100 w-full h-64 sm:h-80 lg:h-96 rounded-lg flex items-center justify-center">
                <div className="text-center text-orange-600">
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
