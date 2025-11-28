import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCreateInvitation } from '@/hooks/useTripData';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Loader2 } from 'lucide-react';

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
}

export const InviteDialog: React.FC<InviteDialogProps> = ({
  open,
  onOpenChange,
  tripId,
}) => {
  const { currentUser } = useAuth();
  const createInvitation = useCreateInvitation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to send invitations');
      return;
    }

    try {
      await createInvitation.mutateAsync({
        tripId,
        invitedEmail: email.trim().toLowerCase(),
        invitedBy: currentUser.uid,
      });
      
      setSuccess(true);
      setEmail('');
      
      // Close dialog after 1.5 seconds
      setTimeout(() => {
        setSuccess(false);
        onOpenChange(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to send invitation:', err);
      setError('Failed to send invitation. Please try again.');
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Friend to Trip</DialogTitle>
          <DialogDescription>
            Send an invitation to collaborate on this trip. The invitation will be valid for 24 hours.
          </DialogDescription>
        </DialogHeader>
        
        {success ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-green-600">Invitation Sent!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your friend will receive an invitation email
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Friend's Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                disabled={createInvitation.isPending}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createInvitation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createInvitation.isPending}
              >
                {createInvitation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Invitation'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
