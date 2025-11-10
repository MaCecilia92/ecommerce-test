// Tipos para los productos de la API
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Servicio para obtener todos los productos
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const products: Product[] = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Servicio para obtener un producto por ID
export const getProductById = async (id: string | number): Promise<Product> => {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const product: Product = await response.json();
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};