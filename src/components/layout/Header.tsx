import { MapPin, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { doSignOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Wander Logger</h1>
        </div>
        
        {currentUser && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{currentUser.displayName}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            </div>
            <Avatar>
              <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName} />
              <AvatarFallback>
                {currentUser.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
