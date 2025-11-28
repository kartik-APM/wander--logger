import { useState } from 'react';
import { Cloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInPrompt } from '@/components/auth/SignInPrompt';

export const GuestBanner: React.FC = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Cloud className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                You're planning as a guest
              </p>
              <p className="text-xs opacity-90 hidden sm:block">
                Sign in to save your trips to the cloud and collaborate with friends
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsSignInOpen(true)}
              className="shrink-0"
            >
              Sign In
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDismissed(true)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <SignInPrompt
        open={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        reason="save"
      />
    </>
  );
};
