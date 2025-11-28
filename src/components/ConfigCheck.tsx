import { AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ConfigCheck: React.FC = () => {
  const missingVars: string[] = [];
  
  if (!import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === 'your_api_key_here') {
    missingVars.push('VITE_FIREBASE_API_KEY');
  }
  if (!import.meta.env.VITE_FIREBASE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID === 'your_project_id') {
    missingVars.push('VITE_FIREBASE_PROJECT_ID');
  }
  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here') {
    missingVars.push('VITE_GOOGLE_MAPS_API_KEY');
  }

  if (missingVars.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <Card className="w-full max-w-2xl border-orange-200">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-8 w-8 text-orange-600" />
            <CardTitle className="text-2xl text-orange-900">Configuration Required</CardTitle>
          </div>
          <CardDescription className="text-base">
            Please configure your environment variables to use Wander Logger
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-semibold text-orange-900 mb-2">Missing Configuration:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-orange-800">
              {missingVars.map((varName) => (
                <li key={varName}>{varName}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Setup Guide:</h3>
            
            <div className="space-y-3">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm">1</span>
                  Create Firebase Project
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Go to Firebase Console and create a new project
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://console.firebase.google.com/', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Firebase Console
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm">2</span>
                  Enable Services
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-8">
                  <li>• Enable Authentication → Google sign-in</li>
                  <li>• Enable Cloud Firestore</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm">3</span>
                  Get Google Maps API Key
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Enable Maps JavaScript API, Places API, and Directions API
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Google Cloud Console
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm">4</span>
                  Update .env File
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Edit the <code className="bg-muted px-1 py-0.5 rounded">.env</code> file in the project root with your credentials
                </p>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto mt-2">
{`VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key`}
                </pre>
              </div>

              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <h4 className="font-medium mb-2 text-blue-900">After updating .env:</h4>
                <p className="text-sm text-blue-800">
                  Restart the development server with <code className="bg-blue-100 px-1 py-0.5 rounded">npm run dev</code>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              📚 For detailed setup instructions, see the <code className="bg-muted px-1 py-0.5 rounded">README.md</code> file
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
