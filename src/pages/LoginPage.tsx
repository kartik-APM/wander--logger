import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { doSignInWithGoogle } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const LoginPage: React.FC = () => {
  const { userLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (userLoggedIn && !loading) {
      navigate('/dashboard');
    }
  }, [userLoggedIn, loading, navigate]);

  const handleGoogleSignIn = async () => {
    if (isSigningIn) return;
    
    setIsSigningIn(true);
    try {
      await doSignInWithGoogle();
      // User will be redirected by the useEffect above
    } catch (error: any) {
      console.error('Sign in error:', error);
      alert(error.message || 'Failed to sign in with Google');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-white p-4 rounded-full">
              <MapPin className="h-12 w-12" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Wander Logger</CardTitle>
          <CardDescription className="text-base">
            Plan your perfect trip with collaborative itineraries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              Sign in to create and manage your travel plans
            </p>
            <Button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn || loading}
              className="w-full flex items-center justify-center gap-3 h-12"
              size="lg"
            >
              {isSigningIn ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold text-primary">Plan</div>
                <div className="text-muted-foreground text-xs">Your trips</div>
              </div>
              <div>
                <div className="font-semibold text-primary">Collaborate</div>
                <div className="text-muted-foreground text-xs">With friends</div>
              </div>
              <div>
                <div className="font-semibold text-primary">Explore</div>
                <div className="text-muted-foreground text-xs">New places</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
