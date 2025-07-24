import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-kaspa-teal/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-kaspa-green/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/5 border-white/10 shadow-2xl relative z-10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-kaspa-header bg-gradient-to-r from-kaspa-teal to-kaspa-green bg-clip-text text-transparent">
            Reset Password
          </CardTitle>
          <CardDescription className="text-slate-300">
            Enter your email to receive password reset instructions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-kaspa-teal/50 focus:ring-kaspa-teal/20"
              disabled
            />
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-kaspa-teal to-kaspa-green hover:from-kaspa-teal/80 hover:to-kaspa-green/80 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-kaspa-teal/25"
            disabled
          >
            Send Reset Link
          </Button>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-400">
              Password reset functionality coming soon!
            </p>
            <p className="text-sm text-slate-400">
              For now, please contact support if you need help accessing your account.
            </p>
          </div>
          
          <div className="text-center">
            <Link
              href="/auth/signin"
              className="text-sm text-kaspa-teal hover:text-kaspa-green transition-colors"
            >
              ← Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 