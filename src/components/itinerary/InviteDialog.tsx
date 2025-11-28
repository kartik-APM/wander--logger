import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCreateInvitation } from '@/hooks/useTripData';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Copy, Loader2 } from 'lucide-react';

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
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate invitation link when dialog opens
  useEffect(() => {
    if (open && !invitationId && currentUser) {
      generateInvitation();
    }
  }, [open]);

  const generateInvitation = async () => {
    if (!currentUser) {
      setError('You must be logged in to create invitations');
      return;
    }

    setError('');
    
    try {
      const id = await createInvitation.mutateAsync({
        tripId,
        invitedEmail: '', // No email required for shareable links
        invitedBy: currentUser.uid,
      });
      
      setInvitationId(id);
    } catch (err) {
      console.error('Failed to create invitation:', err);
      setError('Failed to create invitation. Please try again.');
    }
  };

  const getInvitationUrl = () => {
    if (!invitationId) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/invite/${invitationId}`;
  };

  const handleCopyLink = async () => {
    const url = getInvitationUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      setError('Failed to copy link. Please copy manually.');
    }
  };

  const handleClose = () => {
    setInvitationId(null);
    setError('');
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Friends to Trip</DialogTitle>
          <DialogDescription>
            Share this link with friends to invite them to collaborate on this trip. The invitation will be valid for 24 hours.
          </DialogDescription>
        </DialogHeader>
        
        {createInvitation.isPending && !invitationId ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Generating invitation link...</p>
          </div>
        ) : error ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-destructive text-center">{error}</p>
            <div className="flex justify-center">
              <Button onClick={generateInvitation} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        ) : invitationId ? (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Invitation Link</label>
              <div className="flex gap-2">
                <Input
                  value={getInvitationUrl()}
                  readOnly
                  className="font-mono text-sm"
                  onClick={(e) => e.currentTarget.select()}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Anyone with this link can join the trip within 24 hours.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
