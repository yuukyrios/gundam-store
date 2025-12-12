import { Button } from "@/components/ui/button";

interface UserCardProps {
  user: { id: number; username: string; email: string };
  onEdit: (user: any) => void;
  onDelete: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  return (
    <div className="p-4 bg-card rounded-xl shadow hover:shadow-lg transition">
      <h3 className="font-semibold text-lg">{user.username}</h3>
      <p className="text-muted-foreground">{user.email}</p>

      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(user.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
