import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface Product {
  title: string;
  price: string;
  currency: string;
  shipping: string;
  permalink: string;
  rating: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || typeof q !== "string") {
    return NextResponse.json(
      { error: "Se requiere un parámetro de consulta 'q'." },
      { status: 400 }
    );
  }

  try {
    const formattedQuery = q.replace(/\s+/g, "_");
    const searchUrl = `https://listado.mercadolibre.com.ve/${formattedQuery}#D[A:${formattedQuery}]`;

    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const products: Product[] = $(".ui-search-result__wrapper")
      .map((_, el): Product => {
        const title =
          $(el).find(".poly-component__title").text().trim() || "Sin título";

        // Obtener el precio base
        const price =
          $(el)
            .find(".poly-price__current .andes-money-amount__fraction")
            .text()
            .trim() || "0";

        // Obtener los decimales si existen
        const cents =
          $(el).find(".andes-money-amount__cents").text().trim() || "00";

        // Sumar los decimales al precio
        const fullPrice =
          parseFloat(price.replace(",", ".")) + parseFloat(`0.${cents}`);

        // Formatear el precio final
        const formattedPrice = fullPrice.toFixed(2);

        // Obtener el tipo de moneda (última aparición)
        const currency =
          $(el)
            .find(".andes-money-amount__currency-symbol")
            .last()
            .text()
            .trim() || "";

        // Obtener calificación
        const rating =
          $(el).find(".poly-reviews__rating").text().trim() ||
          "Sin calificación";

        // Obtener información de envío
        const shipping =
          $(el).find(".poly-component__shipping").text().trim() ||
          "No especificado";

        // Obtener el enlace
        const permalink =
          $(el).find(".poly-component__title-wrapper a").attr("href") || "#";

        return { title, currency, price: formattedPrice, shipping, permalink, rating };
      })
      .get();

    if (products.length === 0) {
      return NextResponse.json(
        { message: "No se encontraron productos para la búsqueda realizada." },
        { status: 404 }
      );
    }

    return NextResponse.json({ results: products });
  } catch (error) {
    return NextResponse.json(
      { error: `Error durante el scraping: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

