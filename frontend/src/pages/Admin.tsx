import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";
import { productsAPI } from "@/services/api";
import { usersAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ProductForm from "@/components/ProductForm";
import UserCard from "@/components/UserCard";
import UserForm from "@/components/UserForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"products" | "users">("products");

  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [editingUser, setEditingUser] = useState<any | undefined>();

  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");

    fetchProducts();
    fetchUsers();
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch {
      toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      setUsers(data);
    } catch {
      toast({ title: "Error", description: "Failed to load users", variant: "destructive" });
    }
  };

  const handleCreateProduct = async (data: Omit<Product, "id">) => {
    try {
      await productsAPI.create(data);
      fetchProducts();
      setIsAddDialogOpen(false);
      toast({ title: "Product added" });
    } catch {
      toast({ title: "Error", description: "Failed to create product", variant: "destructive" });
    }
  };

  const handleEditProduct = async (data: Omit<Product, "id">) => {
    try {
      await productsAPI.update(editingProduct!.id, data);
      fetchProducts();
      setIsEditDialogOpen(false);
      toast({ title: "Product updated" });
    } catch {
      toast({ title: "Error", description: "Failed to update product", variant: "destructive" });
    }
  };

  const handleEditUser = async (data: { username: string; email: string }) => {
    try {
      await usersAPI.update(editingUser.id, data);
      fetchUsers();
      setIsEditDialogOpen(false);
      toast({ title: "User updated" });
    } catch {
      toast({ title: "Error", description: "Failed to update user", variant: "destructive" });
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Delete this user?")) return;

    try {
      await usersAPI.delete(id);
      fetchUsers();
      toast({ title: "User deleted" });
    } catch {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === "products" ? "default" : "outline"}
            onClick={() => setActiveTab("products")}
          >
            Products
          </Button>

          <Button
            variant={activeTab === "users" ? "default" : "outline"}
            onClick={() => setActiveTab("users")}
          >
            Users
          </Button>
        </div>

        {activeTab === "products" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Manage Products</h1>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={(p) => { setEditingProduct(p); setIsEditDialogOpen(true); }}
                  onDelete={async (id) => {
                    await productsAPI.delete(id);
                    fetchProducts();
                  }}
                  showActions
                />
              ))}
            </div>
          </>
        )}

        {activeTab === "users" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={(u) => { setEditingUser(u); setIsEditDialogOpen(true); }}
                  onDelete={handleDeleteUser}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Dialog shared for Products & Users */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeTab === "products" ? "Edit Product" : "Edit User"}
            </DialogTitle>
          </DialogHeader>

          {activeTab === "products" ? (
            <ProductForm
              product={editingProduct}
              onSubmit={handleEditProduct}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          ) : (
            <UserForm
              user={editingUser}
              onSubmit={handleEditUser}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>

          <ProductForm
            onSubmit={handleCreateProduct}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
