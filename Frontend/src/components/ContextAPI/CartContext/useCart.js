
import { useContext } from 'react';
import { CartContext } from './CartContext';

export const useCart = () => {
  const cartContext = useContext(CartContext);
  if (!cartContext) throw new Error('useCart must be used inside CartProvider');
  return cartContext;
};