import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Edit, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
  onAddToCart?: (product: Product) => void;
  showActions?: boolean;
}

const gradeColors: Record<string, string> = {
  hg: 'bg-primary',
  mg: 'bg-accent',
  sd: 'bg-secondary',
  pg: 'bg-gradient-to-r from-primary to-accent',
  rg: 'bg-primary-glow',
};

const gradeNames: Record<string, string> = {
  hg: 'High Grade',
  mg: 'Master Grade',
  sd: 'Super Deformed',
  pg: 'Perfect Grade',
  rg: 'Real Grade',
};

const ProductCard = ({ product, onEdit, onDelete, onAddToCart, showActions = true }: ProductCardProps) => {
  const gradeKey = product.grade?.toLowerCase() || '';
  const productImage = product.link || product.image_url || '/placeholder.svg';
  const price = Number(product.price || 0); // ensures no error

  return (
    <Card className="group overflow-hidden bg-gradient-card border-border hover:border-primary transition-all duration-300 hover:shadow-glow">
      <div className="aspect-square overflow-hidden bg-muted relative">
        <img
          src={productImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <Badge className={`absolute top-2 right-2 ${gradeColors[gradeKey] || ''}`}>
          {product.grade?.toUpperCase()}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1 text-foreground truncate">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          {gradeNames[gradeKey] || product.grade}
        </p>
        <p className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          ${price.toFixed(2)}
        </p>
      </CardContent>

      {showActions && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          {onAddToCart && (
            <Button className="flex-1 gap-2" onClick={() => onAddToCart(product)}>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          )}
          {onEdit && (
            <Button variant="outline" size="icon" onClick={() => onEdit(product)}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="icon" onClick={() => onDelete(product.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;
