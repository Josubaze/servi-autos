// src/utils/typeGuards.ts


// Función de guardia de tipo para verificar si es un `Product` completo
export function isProduct(productRef: ProductReference): productRef is { product: Product; } {
  return (productRef as { product: Product }).product !== undefined;
}

// Función de guardia de tipo para verificar si es un `productId`
export function isProductIdReference(productRef: ProductReference): productRef is { productId: string; } {
  return (productRef as { productId: string }).productId !== undefined;
}
