"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
// Hero image will be served from public directory

interface SearchHeaderProps {
  onFiltersChange?: (filters: { searchQuery: string, selectedTags: string[], ageRange: number[], location: string }) => void;
  selectedTags?: string[];
  searchQuery?: string;
}

const SearchHeader = ({ onFiltersChange, selectedTags = [], searchQuery: initialSearchQuery = "" }: SearchHeaderProps) => {
  const { logout } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [tags, setTags] = useState<{name: string, slug: string}[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Simple state management - no pending/applied complexity
  const [currentSearchQuery, setCurrentSearchQuery] = useState(initialSearchQuery);
  const [currentAgeRange, setCurrentAgeRange] = useState<number[]>([22, 35]);
  const [currentLocation, setCurrentLocation] = useState("");
  const [currentSelectedTags, setCurrentSelectedTags] = useState<string[]>(selectedTags);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Don't hide navbar when filters are open
      if (showFilters) {
        setIsVisible(true);
        return;
      }
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, showFilters]);

  useEffect(() => {
    async function fetchTags() {
      try {
        setLoading(true);
        const response = await fetch('/api/tags');
        if (response.ok) {
          const data = await response.json();
          setTags(data);
        }
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, []);

  const toggleTag = (tagSlug: string) => {
    setCurrentSelectedTags(prevTags => {
      return prevTags.includes(tagSlug)
        ? prevTags.filter(t => t !== tagSlug)
        : [...prevTags, tagSlug];
    });
  };

  const handleAgeRangeChange = (newAgeRange: number[]) => {
    setCurrentAgeRange(newAgeRange);
  };

  const handleLocationChange = (newLocation: string) => {
    setCurrentLocation(newLocation);
  };

  const handleSearchQueryChange = (newSearchQuery: string) => {
    setCurrentSearchQuery(newSearchQuery);
  };

  const applyFilters = () => {
    if (onFiltersChange) {
      onFiltersChange({ 
        searchQuery: currentSearchQuery,
        selectedTags: currentSelectedTags, 
        ageRange: currentAgeRange, 
        location: currentLocation 
      });
    }
    
    // Close the filters dropdown after applying
    setShowFilters(false);
  };

  const clearAllFilters = () => {
    const defaultAgeRange = [18, 50];
    setCurrentSearchQuery("");
    setCurrentAgeRange(defaultAgeRange);
    setCurrentLocation("");
    setCurrentSelectedTags([]);
    
    if (onFiltersChange) {
      onFiltersChange({ 
        searchQuery: "",
        selectedTags: [], 
        ageRange: defaultAgeRange, 
        location: "" 
      });
    }
    
    // Close the filters dropdown after clearing
    setShowFilters(false);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      {/* Navbar */}
      <div className="bg-white border-b shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Left side - Logo as home link (same size as old button) */}
            <button
              onClick={() => window.location.href = '/'}
              className="h-8 w-24 flex items-center justify-center"
              aria-label="Go to home"
            >
              <img src="/logo-catalov.png" alt="Catalove" className="h-8" />
            </button>
            
            {/* Center - Filters Button */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleFilters}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            {/* Right side - Sign Out button */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Dropdown */}
      {showFilters && (
        <div className="bg-white border-b shadow-lg h-screen md:max-h-[80vh] md:h-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="max-w-7xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Search */}
              <Card className="md:col-span-1">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Search</h4>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search by name, location, or interests..."
                      value={currentSearchQuery}
                      onChange={(e) => handleSearchQueryChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Age Range */}
              <Card className="md:col-span-1">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Age Range</h4>
                  <div className="space-y-3">
                    <Slider
                      value={currentAgeRange}
                      onValueChange={handleAgeRangeChange}
                      max={65}
                      min={18}
                      step={1}
                      className="w-full"
                      defaultValue={[18, 65]}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{currentAgeRange[0]} years</span>
                      <span>{currentAgeRange[1]} years</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="md:col-span-1">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Location</h4>
                  <Input
                    placeholder="Enter city or zip code"
                    value={currentLocation}
                    onChange={(e) => handleLocationChange(e.target.value)}
                  />
                </CardContent>
              </Card>

              {/* Interests - Full width on mobile */}
              <Card className="md:col-span-2 lg:col-span-1">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Interests</h4>
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600 mx-auto mb-2"></div>
                      <p className="text-xs text-muted-foreground">Loading interests...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2 max-h-32 md:max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {tags.map((tag) => {
                          const isSelected = currentSelectedTags.includes(tag.slug);
                          return (
                            <button
                              key={tag.slug}
                              type="button"
                              className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                                isSelected 
                                  ? "bg-pink-500 text-white border-pink-500" 
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-pink-100"
                              }`}
                              onClick={() => toggleTag(tag.slug)}
                            >
                              {tag.name}
                            </button>
                          );
                        })}
                      </div>
                      {currentSelectedTags.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Selected:</p>
                          <div className="flex flex-wrap gap-1">
                            {currentSelectedTags.map((tagSlug) => {
                              const tag = tags.find(t => t.slug === tagSlug);
                              return (
                                <Badge key={tagSlug} variant="secondary" className="text-xs min-h-[28px] flex items-center">
                                  {tag?.name || tagSlug}
                                  <X 
                                    className="w-3 h-3 ml-1 cursor-pointer" 
                                    onClick={() => toggleTag(tagSlug)}
                                  />
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Additional Filter Options - Example */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
              {/* Verification Status */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Verification</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Verified only</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Recently active</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Relationship Type */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Looking for</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Serious relationship</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Casual dating</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Friendship</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Distance */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Distance</h4>
                  <div className="space-y-3">
                    <Slider
                      value={[25]}
                      max={100}
                      min={1}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>1 km</span>
                      <span>25 km</span>
                      <span>100 km</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Apply Button */}
            <div className="flex justify-end gap-3 pt-6 border-t mt-6 sticky bottom-0 bg-white z-10 py-4 -mx-4 md:-mx-6 px-4 md:px-6">
              <Button 
                variant="outline" 
                onClick={clearAllFilters}
                className="px-6 flex-1 md:flex-none"
              >
                Clear All
              </Button>
              <Button 
                onClick={applyFilters}
                className="px-6 bg-romance hover:bg-romance/90 text-white flex-1 md:flex-none"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHeader;