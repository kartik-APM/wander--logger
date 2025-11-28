import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getInvitation, acceptInvitation, getTrip } from '@/lib/firestore';
import { Invitation, Trip } from '@/types/trip';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export const InvitationPage: React.FC = () => {
  const { invitationId } = useParams<{ invitationId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadInvitationData();
  }, [invitationId, currentUser]);

  const loadInvitationData = async () => {
    if (!invitationId) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    // If user is not logged in, prompt them to login first
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      const invitationData = await getInvitation(invitationId);
      
      if (!invitationData) {
        setError('Invitation not found. This invitation may have been deleted or never existed.');
        setLoading(false);
        return;
      }

      // Check if invitation is expired
      const now = new Date();
      const expiresAt = invitationData.expiresAt.toDate();
      
      if (now > expiresAt) {
        setError('This invitation has expired');
        setLoading(false);
        return;
      }

      // Check if invitation is already accepted or declined
      if (invitationData.status !== 'pending') {
        setError(`This invitation has already been ${invitationData.status}`);
        setLoading(false);
        return;
      }

      setInvitation(invitationData);

      // Load trip details (may fail if user is not a participant yet)
      try {
        const tripData = await getTrip(invitationData.tripId);
        if (tripData) {
          setTrip(tripData);
        }
      } catch (tripErr) {
        // It's OK if we can't load trip details yet - user isn't a participant
        console.log('Cannot load trip details yet - user not a participant');
      }

      setLoading(false);
    } catch (err: any) {
      console.error('Failed to load invitation:', err);
      // Provide more detailed error message
      const errorMsg = err?.message || 'Failed to load invitation details';
      setError(`Failed to load invitation: ${errorMsg}`);
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!currentUser) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/invite/${invitationId}`);
      return;
    }

    if (!invitationId) return;

    setAccepting(true);
    setError('');

    try {
      await acceptInvitation(invitationId, currentUser.uid);
      setSuccess(true);
      
      // Redirect to trip after 2 seconds
      setTimeout(() => {
        if (invitation) {
          navigate(`/trip/${invitation.tripId}`);
        }
      }, 2000);
    } catch (err) {
      console.error('Failed to accept invitation:', err);
      setError('Failed to accept invitation. Please try again.');
      setAccepting(false);
    }
  };

  // Not logged in - prompt to login
  if (!currentUser && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <AlertCircle className="h-6 w-6" />
                <CardTitle>Sign In Required</CardTitle>
              </div>
              <CardDescription>
                You need to sign in to accept this trip invitation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate(`/login?redirect=/invite/${invitationId}`)} 
                className="w-full"
              >
                Sign In to Continue
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard')} 
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading invitation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive mb-2">
                <XCircle className="h-6 w-6" />
                <CardTitle>Invalid Invitation</CardTitle>
              </div>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle className="h-6 w-6" />
                <CardTitle>Invitation Accepted!</CardTitle>
              </div>
              <CardDescription>
                You have successfully joined the trip. Redirecting...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center p-4 py-12">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-2xl">You're Invited!</CardTitle>
            <CardDescription>
              You've been invited to collaborate on a trip
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!trip && invitation && (
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">
                    Accept the invitation to view trip details
                  </p>
                </div>
              </div>
            )}
            
            {trip && (
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(trip.startDate), 'MMM d, yyyy')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {trip.participants.length} {trip.participants.length === 1 ? 'participant' : 'participants'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {invitation && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  This invitation expires on {format(invitation.expiresAt.toDate(), 'MMM d, yyyy \'at\' h:mm a')}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleAcceptInvitation}
                disabled={accepting}
                className="flex-1"
              >
                {accepting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  'Accept Invitation'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                disabled={accepting}
              >
                Decline
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
