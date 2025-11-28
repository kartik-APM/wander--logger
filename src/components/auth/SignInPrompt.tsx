import { LogIn, Cloud, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';

interface SignInPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: 'save' | 'share' | 'sync';
}

export const SignInPrompt: React.FC<SignInPromptProps> = ({
  open,
  onOpenChange,
  reason = 'save',
}) => {
  const { signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    await signInWithGoogle();
    onOpenChange(false);
  };

  const reasons = {
    save: {
      title: 'Sign in to Save Your Trip',
      description: 'Your trip is currently saved locally. Sign in to save it to the cloud and access it from any device.',
    },
    share: {
      title: 'Sign in to Share',
      description: 'Sign in with Google to share this trip with friends and collaborate together.',
    },
    sync: {
      title: 'Sign in to Sync',
      description: 'Keep your trips synced across all your devices and never lose your plans.',
    },
  };

  const { title, description } = reasons[reason];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Cloud className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-xs text-muted-foreground">Cloud Save</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground">Collaborate</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-xs text-muted-foreground">Secure</p>
            </div>
          </div>

          <Button onClick={handleSignIn} className="w-full h-12" size="lg">
            <LogIn className="h-5 w-5 mr-2" />
            Sign in with Google
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your local trip data will be automatically synced after signing in
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
