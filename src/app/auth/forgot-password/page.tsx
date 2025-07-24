"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coffee, Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { forgetPassword } from '@/lib/auth-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const result = await forgetPassword({
        email,
        redirectTo: '/auth/reset-password',
      });

      if (result.error) {
        setError(result.error.message || 'Failed to send reset email');
      } else {
        setIsSuccess(true);
        setMessage('Password reset email sent! Check your inbox and follow the instructions to reset your password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Forgot password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex items-center justify-center p-6">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#70C7BA]/10 via-[#49EACB]/10 to-[#70C7BA]/10 animate-pulse"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#70C7BA]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#49EACB]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to signin */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="text-white/80 hover:text-[#70C7BA] hover:bg-[#70C7BA]/10 rounded-full">
            <Link href="/auth/signin" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </Button>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Coffee className="h-10 w-10 text-[#70C7BA]" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#49EACB] to-[#70C7BA] rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#70C7BA] to-[#49EACB] bg-clip-text text-transparent">
                kas.coffee
              </span>
            </div>
            
            <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your email to receive password reset instructions
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success Message */}
            {isSuccess && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">{message}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {!isSuccess && (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 rounded-xl h-12 focus:border-[#70C7BA] focus:ring-[#70C7BA]"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#49EACB] hover:to-[#70C7BA] text-white font-semibold rounded-xl h-12 shadow-lg hover:shadow-[#70C7BA]/25 transition-all duration-300"
                  disabled={isLoading || !email}
                >
                  {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
                </Button>
              </form>
            )}

            {/* Info */}
            <div className="bg-[#70C7BA]/10 border border-[#70C7BA]/30 rounded-xl p-4">
              <h4 className="text-[#70C7BA] font-semibold text-sm mb-2">What happens next?</h4>
              <p className="text-gray-400 text-xs mb-2">
                We'll send you a secure link to reset your password. The link will expire in 1 hour for security.
              </p>
              <p className="text-gray-400 text-xs">
                Don't see the email? Check your spam folder or try again with a different email address.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 