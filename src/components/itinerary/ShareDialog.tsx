import { useState, useEffect } from 'react';
import { Share2, Copy, Check, Link, FileDown, Globe, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { enablePublicSharing, disablePublicSharing } from '@/lib/firestore';
import { Trip } from '@/types/trip';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onOpenChange,
  trip,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPubliclyShared, setIsPubliclyShared] = useState(trip.isPubliclyShared || false);

  useEffect(() => {
    if (trip.shareToken && trip.isPubliclyShared) {
      const url = `${window.location.origin}/shared/${trip.shareToken}`;
      setShareUrl(url);
      setIsPubliclyShared(true);
    } else {
      setShareUrl(null);
      setIsPubliclyShared(false);
    }
  }, [trip.shareToken, trip.isPubliclyShared]);

  const handleEnableSharing = async () => {
    setIsLoading(true);
    try {
      const token = await enablePublicSharing(trip.id);
      const url = `${window.location.origin}/shared/${token}`;
      setShareUrl(url);
      setIsPubliclyShared(true);
    } catch (error) {
      console.error('Failed to enable sharing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableSharing = async () => {
    setIsLoading(true);
    try {
      await disablePublicSharing(trip.id);
      setShareUrl(null);
      setIsPubliclyShared(false);
    } catch (error) {
      console.error('Failed to disable sharing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownloadPdf = () => {
    if (!shareUrl) return;
    // Open the shared page in a new tab where user can download PDF
    window.open(shareUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Itinerary
          </DialogTitle>
          <DialogDescription>
            Share your trip itinerary with anyone. They can view it without logging in.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isPubliclyShared ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Private Itinerary</h3>
              <p className="text-sm text-gray-500 mb-4">
                Enable public sharing to generate a link that anyone can use to view this itinerary.
              </p>
              <Button
                onClick={handleEnableSharing}
                disabled={isLoading}
                className="gap-2"
              >
                <Globe className="h-4 w-4" />
                {isLoading ? 'Enabling...' : 'Enable Public Sharing'}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Globe className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  Public sharing is enabled
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Share Link
                </label>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl || ''}
                    readOnly
                    className="flex-1 text-sm bg-gray-50"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Link className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
                
                <Button
                  onClick={handleDownloadPdf}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  Open & Download PDF
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={handleDisableSharing}
                  variant="ghost"
                  size="sm"
                  disabled={isLoading}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {isLoading ? 'Disabling...' : 'Disable Public Sharing'}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Disabling will make the share link stop working
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
