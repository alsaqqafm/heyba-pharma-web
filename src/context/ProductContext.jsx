import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';

const ProductContext = createContext();
const LOCAL_STORAGE_PRODUCTS_KEY = 'heyba_pharma_products_v1';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn("Failed to persist products to localStorage", e);
    }
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  // Admin Actions
  const addProduct = (newProduct) => {
    const id = Date.now();
    const productToAdd = {
      ...newProduct,
      id,
      stockStatus: newProduct.stockStatus || 'available',
      price: Number(newProduct.price) || 0
    };
    setProducts((prev) => [productToAdd, ...prev]);
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updatedFields } : prod))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
  };

  const resetToDefaultProducts = () => {
    setProducts(INITIAL_PRODUCTS);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedProductDetails,
        setSelectedProductDetails,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefaultProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
