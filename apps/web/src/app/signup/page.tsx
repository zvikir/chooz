"use client";

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Heart } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [tags, setTags] = useState<Array<{ name: string; slug: string }>>([])
  const [selected, setSelected] = useState<string[]>([])
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [birthdate, setBirthdate] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/tags').then(r => r.json()).then(setTags).catch(() => setTags([]))
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, display_name: displayName, password, tag_slugs: selected, gender, birthdate, location })
    })
    setLoading(false)
    if (res.ok) {
      router.push('/login')
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Signup failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Join Catalove
            </CardTitle>
            <CardDescription className="text-gray-600">
              Create your account and start your journey to find love
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Gender Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <div className="flex gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    required
                    className="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">Male</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    required
                    className="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">Female</span>
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="h-12"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username *
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="h-12"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium text-gray-700">
                Display Name (optional)
              </label>
              <Input
                id="displayName"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="h-12"
                placeholder="How should others see you?"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password *
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="h-12"
                placeholder="Create a secure password"
              />
            </div>

            {/* Birthdate and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="birthdate" className="text-sm font-medium text-gray-700">
                  Birthdate *
                </label>
                <Input
                  id="birthdate"
                  type="date"
                  value={birthdate}
                  onChange={e => setBirthdate(e.target.value)}
                  required
                  className="h-12"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Location *
                </label>
                <Input
                  id="location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  required
                  className="h-12"
                  placeholder="e.g., New York, NY"
                />
              </div>
            </div>

            {/* Tags Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Pick at least 2 interests *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-lg p-4">
                {tags.map(tag => (
                  <label key={tag.slug} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <Checkbox
                      checked={selected.includes(tag.slug)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelected(prev => [...prev, tag.slug])
                        } else {
                          setSelected(prev => prev.filter(s => s !== tag.slug))
                        }
                      }}
                      className="text-pink-600"
                    />
                    <span className="text-sm text-gray-700">{tag.name}</span>
                  </label>
                ))}
              </div>
              {selected.length > 0 && (
                <p className="text-xs text-gray-500">
                  Selected: {selected.length} interest{selected.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading || selected.length < 2 || !birthdate || !location}
              className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold shadow-lg disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
