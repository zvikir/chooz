"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import UserCard from "./UserCard";
import { toast } from "@/components/ui/use-toast";

interface UserGridProps {
  searchQuery?: string;
  selectedTags?: string[];
  ageRange?: number[];
  location?: string;
  tab?: 'unreacted' | 'liked' | 'likers' | 'matches';
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

const UserGrid = ({ searchQuery, selectedTags = [], ageRange = [18, 65], location = "", tab = 'unreacted' }: UserGridProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paramsKey = useMemo(() => {
    return JSON.stringify({ tab, searchQuery: searchQuery || '', selectedTags, ageRange, location: location || '' })
  }, [tab, searchQuery, selectedTags, ageRange, location])
  const lastKeyRef = useRef<string | null>(null)

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (tab === 'unreacted') {
          if (searchQuery) params.append('q', searchQuery);
          if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
          if (ageRange && ageRange.length === 2) {
            params.append('minAge', ageRange[0].toString());
            params.append('maxAge', ageRange[1].toString());
          }
          if (location) params.append('location', location);
          const response = await fetch(`/api/users?${params.toString()}`, { cache: 'no-store', credentials: 'include', signal: controller.signal });
          if (!response.ok) throw new Error('Failed to fetch users');
          const data = await response.json();
          if (!isMounted) return;
          setUsers(data);
        } else {
          params.append('tab', tab);
          const response = await fetch(`/api/likes?${params.toString()}`, { cache: 'no-store', credentials: 'include', signal: controller.signal });
          if (!response.ok) throw new Error('Failed to fetch users');
          const data = await response.json();
          if (!isMounted) return;
          setUsers(data);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        if (!isMounted) return;
        setLoading(false);
        setInitialized(true);
      }
    }

    const prevKey = lastKeyRef.current
    const changed = prevKey !== paramsKey
    if (!initialized || changed) {
      fetchUsers();
      lastKeyRef.current = paramsKey
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [paramsKey, initialized]);

  if (!initialized || loading) {
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
          <h2 className="text-2xl font-semibold">Discover People</h2>
          <p className="text-muted-foreground">
            {users.length} {users.length === 1 ? 'person' : 'people'} available
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

      {users.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-xl font-semibold mb-2">
            {tab === 'unreacted' && 'No people to discover'}
            {tab === 'liked' && 'No liked users yet'}
            {tab === 'likers' && 'No one liked you yet'}
            {tab === 'matches' && 'No matches yet'}
          </h3>
          <p className="text-muted-foreground">
            {tab === 'unreacted' ? 'Try adjusting your search or filters' : 'Start discovering to see more here'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onReact={(userId, result) => {
                // Optimistic updates across tabs
                setUsers((prev) => prev.filter((u) => u.id !== userId));
                if (result.matched && tab !== 'matches') {
                  toast({
                    title: "It's a match!",
                    description: "You both liked each other. Start a conversation.",
                  });
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserGrid;