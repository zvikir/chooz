"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { X, Filter } from "lucide-react";

interface FilterSidebarProps {
  onFiltersChange?: (filters: { selectedTags: string[] }) => void;
}

interface Tag {
  name: string;
  slug: string;
}

const FilterSidebar = ({ onFiltersChange }: FilterSidebarProps) => {
  const [ageRange, setAgeRange] = useState([22, 35]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
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

  const relationshipTypes = [
    "Serious relationship", "Casual dating", "Friendship", "Marriage"
  ];

  const toggleTag = (tagSlug: string) => {
    const newSelectedTags = selectedTags.includes(tagSlug)
      ? selectedTags.filter(t => t !== tagSlug)
      : [...selectedTags, tagSlug];
    
    setSelectedTags(newSelectedTags);
    
    // Notify parent component
    if (onFiltersChange) {
      onFiltersChange({ selectedTags: newSelectedTags });
    }
  };

  const clearAllFilters = () => {
    setAgeRange([18, 50]);
    setSelectedTags([]);
    setLocation("");
    
    // Notify parent component
    if (onFiltersChange) {
      onFiltersChange({ selectedTags: [] });
    }
  };

  return (
    <div className="w-80 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
          <X className="w-4 h-4 mr-1" />
          Clear all
        </Button>
      </div>

      {/* Age Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Age Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={ageRange}
              onValueChange={setAgeRange}
              max={65}
              min={18}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{ageRange[0]} years</span>
              <span>{ageRange[1]} years</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Location</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter city or zip code"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Relationship Type */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Looking for</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {relationshipTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox id={type} />
              <Label htmlFor={type} className="text-sm">{type}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Interests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600 mx-auto mb-2"></div>
              <p className="text-xs text-muted-foreground">Loading interests...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.slug}
                    variant={selectedTags.includes(tag.slug) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-romance hover:text-white transition-smooth"
                    onClick={() => toggleTag(tag.slug)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Selected:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedTags.map((tagSlug) => {
                      const tag = tags.find(t => t.slug === tagSlug);
                      return (
                        <Badge key={tagSlug} variant="secondary" className="text-xs">
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Apply Filters */}
      <Button className="w-full bg-romance hover:bg-romance/90 text-white">
        <Filter className="w-4 h-4 mr-2" />
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;