import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, GradeType } from '@/types/product';
import { productsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import ProductForm from '@/components/ProductForm';
import FloatingAddButton from '@/components/FloatingAddButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [cart, setCart] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProducts();
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (selectedGrade === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.grade.toLowerCase() === selectedGrade));
    }
  }, [selectedGrade, products]);

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = (product: Product) => {
    const newCart = [...cart, product];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  const handleCreateProduct = async (data: Omit<Product, 'id'>) => {
    try {
      await productsAPI.create(data);
      setIsAddDialogOpen(false);
      fetchProducts();
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async (data: Omit<Product, 'id'>) => {
    if (!editingProduct) return;
    try {
      await productsAPI.update(editingProduct.id, data);
      setIsEditDialogOpen(false);
      setEditingProduct(undefined);
      fetchProducts();
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsAPI.delete(id);
      fetchProducts();
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={cart.length} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Gundam Paradise
          </h1>
          <p className="text-muted-foreground text-lg">
            Build your ultimate Gundam collection
          </p>
        </div>

        <div className="mb-6">
          <Tabs value={selectedGrade} onValueChange={setSelectedGrade}>
            <TabsList className="bg-card">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="hg">HG</TabsTrigger>
              <TabsTrigger value="mg">MG</TabsTrigger>
              <TabsTrigger value="sd">SD</TabsTrigger>
              <TabsTrigger value="pg">PG</TabsTrigger>
              <TabsTrigger value="rg">RG</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onEdit={openEditDialog}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No products found. Add some Gundams to get started!
            </p>
          </div>
        )}
      </main>

      <FloatingAddButton onClick={() => setIsAddDialogOpen(true)} />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleCreateProduct}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSubmit={handleEditProduct}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingProduct(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
