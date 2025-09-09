"use client";

import { useState } from "react";
import SearchHeader from "./SearchHeader";
import HeroSection from "./HeroSection";
import UserGrid from "./UserGrid";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const DatingMarketplace = () => {
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<number[]>([18, 65]);
  const [location, setLocation] = useState("");

  const handleFilterChange = (filters: { searchQuery: string, selectedTags: string[], ageRange: number[], location: string }) => {
    setSearchQuery(filters.searchQuery);
    setSelectedTags(filters.selectedTags);
    setAgeRange(filters.ageRange);
    setLocation(filters.location);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login/signup prompt for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600">
                <Heart className="w-16 h-16 text-white fill-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Find Your Perfect Match
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover meaningful connections with people who share your interests and values
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={() => window.location.href = '/login'}
              className="w-full max-w-xs h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-lg shadow-lg"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => window.location.href = '/signup'}
              variant="outline"
              className="w-full max-w-xs h-14 border-2 border-pink-300 text-pink-600 hover:bg-pink-50 font-semibold text-lg"
            >
              Create Account
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-8">
            Join thousands of people finding love on LoveConnect
          </p>
        </div>
      </div>
    );
  }

  // Show the main app for authenticated users
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SearchHeader 
        onFiltersChange={handleFilterChange}
        selectedTags={selectedTags}
        searchQuery={searchQuery}
      />
      
      {/* Spacer for fixed header */}
      <div className="h-20" />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content */}
          <div className="w-full">
            <UserGrid searchQuery={searchQuery} selectedTags={selectedTags} ageRange={ageRange} location={location} />
          </div>
    </div>
  );
};

export default DatingMarketplace;