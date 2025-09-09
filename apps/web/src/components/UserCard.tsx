import { Heart, MapPin, Briefcase, Calendar, X as XIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserCardProps {
  user: {
    id: string;
    username: string;
    display_name: string | null;
    bio: string | null;
    gender: string;
    photo_url: string;
    tags: string[];
    age: number;
    location: string;
  };
  onReact?: (userId: string, result: { action: 'like' | 'pass'; matched?: boolean }) => void;
}

const UserCard = ({ user, onReact }: UserCardProps) => {
  const router = useRouter();
  const displayName = user.display_name || user.username;
  const [submitting, setSubmitting] = useState<null | 'like' | 'pass'>(null);
  
  const handleCardClick = () => {
    router.push(`/users/${user.username}`);
  };

  const react = async (action: 'like' | 'pass') => {
    try {
      setSubmitting(action);
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ to_user_id: user.id, action })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to react');
      onReact?.(user.id, { action, matched: !!data.matched });
    } catch (e) {
      // ignore for now; could surface toast in parent
    } finally {
      setSubmitting(null);
    }
  };
  
  return (
    <Card 
      className="group overflow-hidden border-0 border-b md:border border-border/20 rounded-none md:rounded-lg shadow-none md:shadow-card hover:bg-muted/50 md:hover:shadow-romance transition-smooth cursor-pointer md:hover:-translate-y-1"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={user.photo_url}
            alt={`${displayName}'s profile`}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        </div>
        
        <button
          className="absolute top-3 right-3 bg-romance/90 backdrop-blur-sm rounded-full p-1.5 hover:bg-romance disabled:opacity-60"
          onClick={(e) => { e.stopPropagation(); react('like'); }}
          disabled={submitting !== null}
          aria-label="Like"
        >
          <Heart className="w-4 h-4 text-white fill-white" />
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{displayName}</h3>
              <span className="text-sm font-medium opacity-90 bg-white/20 px-2 py-1 rounded-full">{user.age}</span>
            </div>
            <div className="flex items-center gap-1 text-sm opacity-90">
              <MapPin className="w-3 h-3" />
              <span>{user.location}</span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <Briefcase className="w-3 h-3" />
          <span>{user.gender === 'male' ? 'Looking for love' : 'Looking for love'}</span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {user.bio || `Hi! I'm ${displayName} and I'm looking for meaningful connections.`}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {user.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {user.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{user.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Active recently</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => { e.stopPropagation(); react('pass'); }}
              disabled={submitting !== null}
            >
              <XIcon className="w-3 h-3 mr-1" /> Pass
            </Button>
            <Button 
              variant="romance" 
              size="sm" 
              className="bg-romance hover:bg-romance/90 text-white"
              onClick={(e) => { e.stopPropagation(); react('like'); }}
              disabled={submitting !== null}
            >
              <Heart className="w-3 h-3 mr-1" /> Like
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;