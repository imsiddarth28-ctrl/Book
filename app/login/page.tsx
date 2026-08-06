"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to login');
      }

      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="input-field w-full px-4 py-3 rounded-lg border border-ink/10 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/5 transition-all font-sans"
          required
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm font-sans text-left">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3 bg-ink text-white rounded-lg font-sans font-medium hover:bg-midnight transition-colors disabled:opacity-50"
      >
        {loading ? 'Entering...' : 'Enter'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="card bg-white p-8 sm:p-12 shadow-book rounded-2xl flex flex-col items-center text-center">
          <h1 className="font-serif text-4xl text-ink mb-2">Notebook</h1>
          <p className="font-sans text-ink/70 mb-8">
            Your personal library of handwritten notes
          </p>

          <Suspense fallback={<div className="w-full h-[120px] bg-ink/5 animate-pulse rounded-lg" />}>
            <LoginForm />
          </Suspense>
        </div>
      </motion.div>
    </main>
  );
}
