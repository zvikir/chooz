"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MapPin, MessageCircle, ArrowLeft, Calendar, User, Mail } from "lucide-react";

interface UserProfilePageProps {
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

const UserProfilePage = ({ user }: UserProfilePageProps) => {
  const router = useRouter();
  const displayName = user.display_name || user.username;
  
  const handleBack = () => {
    router.back();
  };
  
  const handleConnect = () => {
    // TODO: Implement connect functionality
    console.log('Connect with', user.username);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={user.photo_url}
                  alt={`${displayName}'s profile`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* User Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold">{displayName}</h1>
                    <span className="text-xl font-medium opacity-90 bg-white/20 px-4 py-2 rounded-full">{user.age}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-6 space-y-6">
                {/* Bio Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">About</h3>
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {user.bio || `Hi! I'm ${displayName} and I'm looking for meaningful connections.`}
                  </p>
                </div>

                {/* Interests Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Interests</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Activity Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Activity</h3>
                  </div>
                  <div className="text-muted-foreground space-y-1">
                    <p>• Active recently</p>
                    <p>• Looking for meaningful connections</p>
                    <p>• Open to new friendships</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button 
                    onClick={handleConnect}
                    className="w-full bg-romance hover:bg-romance/90 text-white text-lg py-6"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Connect
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-lg py-6"
                    onClick={() => console.log('Message', user.username)}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profile Views</span>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Connections</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response Rate</span>
                    <span className="font-medium">95%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
