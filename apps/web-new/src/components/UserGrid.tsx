"use client";

import { useState, useEffect } from "react";
import UserCard from "./UserCard";

interface UserGridProps {
  searchQuery?: string;
  selectedTags?: string[];
  ageRange?: number[];
  location?: string;
}

interface User {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  gender: string;
  photo_url: string;
  tags: string[];
  age: number;
  location: string;
}

const UserGrid = ({ searchQuery, selectedTags = [], ageRange = [18, 65], location = "" }: UserGridProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        
            const params = new URLSearchParams();
            if (searchQuery) {
              params.append('q', searchQuery);
            }
            if (selectedTags.length > 0) {
              params.append('tags', selectedTags.join(','));
            }
            if (ageRange && ageRange.length === 2) {
              params.append('minAge', ageRange[0].toString());
              params.append('maxAge', ageRange[1].toString());
            }
            if (location) {
              params.append('location', location);
            }
        
        const response = await fetch(`/api/users?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [searchQuery, selectedTags, ageRange, location]);

  if (loading) {
    return (
      <div className="w-full max-w-2xl md:max-w-7xl mx-auto px-0 md:px-6 py-8 overflow-x-hidden">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading people...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl md:max-w-7xl mx-auto px-0 md:px-6 py-8 overflow-x-hidden">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl md:max-w-7xl mx-auto px-0 md:px-6 py-8 overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">
            {searchQuery ? `Search Results` : 'Discover People'}
          </h2>
          <p className="text-muted-foreground">
            {users.length} {users.length === 1 ? 'person' : 'people'} 
            {searchQuery ? ` found for "${searchQuery}"` : ' available'}
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Sort by:</span>
          <select className="border rounded px-3 py-1 bg-background">
            <option>Recently Active</option>
            <option>Newest Members</option>
            <option>Distance</option>
            <option>Age</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {users.length === 0 && (searchQuery || selectedTags.length > 0) && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-xl font-semibold mb-2">No matches found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters to find more people
          </p>
        </div>
      )}
    </div>
  );
};

export default UserGrid;