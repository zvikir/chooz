"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MapPin, MessageCircle, X, Calendar, User, Mail } from "lucide-react";

interface UserProfileModalProps {
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
}

const UserProfileModal = ({ user }: UserProfileModalProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  
  const displayName = user.display_name || user.username;
  
  const handleClose = () => {
    setIsOpen(false);
    router.back();
  };
  
  const handleConnect = () => {
    // TODO: Implement connect functionality
    console.log('Connect with', user.username);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Hero Image */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={user.photo_url}
              alt={`${displayName}'s profile`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white"
              onClick={handleClose}
            >
              <X className="w-4 h-4" />
            </Button>
            
            {/* User Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{displayName}</h1>
                <span className="text-lg font-medium opacity-90 bg-white/20 px-3 py-1 rounded-full">{user.age}</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Accessible Dialog Title */}
            <DialogHeader className="p-0">
              <DialogTitle className="sr-only">{displayName}'s profile</DialogTitle>
            </DialogHeader>
            {/* Bio Section */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold">About</h3>
                </div>
                <p className="text-muted-foreground">
                  {user.bio || `Hi! I'm ${displayName} and I'm looking for meaningful connections.`}
                </p>
              </CardContent>
            </Card>

            {/* Interests Section */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold">Interests</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Section */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold">Activity</h3>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>• Active recently</p>
                  <p>• Looking for meaningful connections</p>
                  <p>• Open to new friendships</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleConnect}
                className="flex-1 bg-romance hover:bg-romance/90 text-white"
              >
                <Heart className="w-4 h-4 mr-2" />
                Connect
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => console.log('Message', user.username)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
