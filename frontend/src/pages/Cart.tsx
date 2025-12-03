import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/product';
import { productsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [isAuthenticated, navigate]);

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));

    toast({
      title: "Removed from cart",
      description: "Item removed successfully",
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      await Promise.all(cart.map(product => productsAPI.delete(product.id)));

      setCart([]);
      localStorage.removeItem('cart');

      toast({
        title: "Purchase successful!",
        description: `${cart.length} item(s) purchased successfully`,
      });

      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete purchase",
        variant: "destructive",
      });
    }
  };

  // SAFE: price will never crash
  const total = cart.reduce((sum, product) => sum + Number(product.price || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={cart.length} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-hero bg-clip-text text-transparent">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg mb-4">
              Your cart is empty
            </p>
            <Button onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((product, index) => {
                const price = Number(product.price || 0);
                const image = product.link || product.image_url || "/placeholder.svg";
                const grade = product.grade?.toUpperCase() || "N/A";

                return (
                  <Card key={`${product.id}-${index}`} className="bg-gradient-card border-border">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={image}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Grade: {grade}
                          </p>
                          <p className="text-xl font-bold text-primary">
                            ${price.toFixed(2)}
                          </p>
                        </div>

                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeFromCart(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-gradient-card border-border sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold">Order Summary</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{cart.length}</span>
                    </div>

                    <div className="flex justify-between text-xl font-bold pt-2 border-t border-border">
                      <span>Total:</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Checkout
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Note: Products will be removed from inventory after purchase
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
