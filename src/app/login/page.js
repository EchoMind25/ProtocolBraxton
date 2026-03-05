'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        setError('Check your email for the confirmation link.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="text-center mb-10">
          <h1 className="font-display text-2xl tracking-[0.3em] text-cream uppercase">
            Protocol <span className="text-gold">Braxton</span>
          </h1>
          <div className="mt-2 inline-block font-mono text-[10px] tracking-[3px] text-gold border border-gold-dim/50 px-3 py-1 uppercase">
            PPL×2 // Championship Standard
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] tracking-[2px] text-cream-dim uppercase mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              placeholder="warrior@protocol.com"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-[2px] text-cream-dim uppercase mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className={`text-sm ${error.includes('Check your email') ? 'text-legs' : 'text-red-400'}`}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-display text-sm tracking-[4px] uppercase py-3 bg-gold/10 border border-gold-dim text-gold hover:bg-gold/20 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : isSignUp ? 'Create Account' : 'Enter'}
          </button>

          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="w-full text-center font-mono text-[10px] tracking-[2px] text-iron hover:text-cream-dim transition-colors uppercase py-2"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'New? Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
