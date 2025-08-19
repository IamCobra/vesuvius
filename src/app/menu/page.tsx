import Link from "next/link";
import Footer from "@/app/components/footer";
import { prisma } from "@/app/lib/prisma";

// Server Component - fetcher data direkte
async function getMenuData() {
  const categories = await prisma.category.findMany({
    include: {
      menuItems: {
        include: {
          variants: true,
        },
        where: {
          available: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories;
}

export default async function Menu() {
  const categories = await getMenuData();

  // Opret "All" kategori med alle menu items
  const allMenuItems = categories.flatMap((cat) => cat.menuItems);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-burgundy-primary mb-4">
              Vores Menu
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Oplev autentiske italienske smagsoplevelser tilberedt med de
              fineste ingredienser
            </p>
          </div>

          {/* Category Sections */}
          {categories.map((category) => (
            <section key={category.id} className="mb-16">
              <h2 className="text-3xl font-bold text-burgundy-primary mb-8 text-center">
                {category.name}
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Variants hvis de findes */}
                        {item.variants.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">
                              Varianter:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {item.variants.map((variant) => (
                                <span
                                  key={variant.id}
                                  className="px-2 py-1 text-xs bg-burgundy-light text-burgundy-primary rounded"
                                >
                                  {variant.name}{" "}
                                  {variant.priceChange > 0 &&
                                    `(+${variant.priceChange} kr)`}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-right ml-4">
                        <span className="text-2xl font-bold text-burgundy-primary">
                          {item.price} kr
                        </span>
                        <Link
                          href="/order"
                          className="block mt-4 bg-burgundy-primary text-white px-4 py-2 rounded-lg hover:bg-burgundy-dark transition-colors text-center text-sm font-medium"
                        >
                          Tilføj
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* CTA Section */}
          <div className="text-center mt-16 p-8 bg-burgundy-primary rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-4">
              Klar til at bestille?
            </h3>
            <p className="text-burgundy-light mb-6">
              Vælg dine yndlingsretter og afgiv din bestilling
            </p>
            <Link
              href="/order"
              className="inline-block bg-white text-burgundy-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Bestil Nu
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
