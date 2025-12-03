import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingAddButtonProps {
  onClick: () => void;
}

const FloatingAddButton = ({ onClick }: FloatingAddButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-glow hover:shadow-accent transition-all duration-300 hover:scale-110"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default FloatingAddButton;
