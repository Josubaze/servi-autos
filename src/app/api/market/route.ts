import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  // Verificar que el parámetro 'q' esté presente y sea una cadena
  if (!q || typeof q !== "string") {
    return NextResponse.json({ error: "Se requiere un parámetro de consulta 'q'." }, { status: 400 });
  }

  try {
    // Ajustar la consulta para que use guiones bajos en lugar de espacios
    const formattedQuery = q.replace(/\s+/g, "_");
    const searchUrl = `https://listado.mercadolibre.com.ve/${formattedQuery}#D[A:${formattedQuery}]`;

    // Scraping con Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(searchUrl, { waitUntil: "domcontentloaded" });

    // Extraer productos
    const products = await page.evaluate(() => {
      const items: any[] = [];
      const productElements = document.querySelectorAll(".ui-search-result__wrapper");

      productElements.forEach((el) => {
        const title = el.querySelector(".poly-component__title")?.textContent || "Sin título";
        
        // Obtener el precio base
        const price = el.querySelector(".poly-price__current .andes-money-amount__fraction")?.textContent || "0";
        
        // Obtener los decimales si existen
        const cents = el.querySelector(".andes-money-amount__cents")?.textContent || "00";

        // Sumar los decimales al precio
        const fullPrice = parseFloat(price.replace(",", ".")) + parseFloat(`0.${cents}`);

        // Formatear el precio final
        const formattedPrice = fullPrice.toFixed(2);

        // Obtener calificación
        const rating = el.querySelector(".poly-reviews__rating")?.textContent || "Sin calificación";

        // Obtener información de envío
        const shipping = el.querySelector(".poly-component__shipping")?.textContent || "Envío no especificado";

        const currency = "$"; // Cambia según corresponda
        const link = el.querySelector(".poly-component__title-wrapper a")?.getAttribute("href") || "#";

        items.push({ title, price: formattedPrice, currency, rating, shipping, permalink: link });
      });

      return items;
    });

    await browser.close();

    // Responder con los productos obtenidos
    return NextResponse.json({ results: products });
  } catch (error: any) {
    // En caso de error, devolver un mensaje
    return NextResponse.json({ error: `Error durante el scraping: ${error.message}` }, { status: 500 });
  }
}
