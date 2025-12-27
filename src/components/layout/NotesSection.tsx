import { useState } from 'react';
import { Note } from '@/types/trip';
import { addNote, updateNote, deleteNote } from '@/lib/firestore';
import { useGuestTrips } from '@/hooks/useGuestTrips';
import { MapPin, Plus, Pencil, Trash2, LocateIcon, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NotesSectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  notes?: Note[];
  isGuestMode?: boolean;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ open, onOpenChange, tripId, notes = [], isGuestMode = false }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const { updateTrip: updateGuestTrip, getTrip } = useGuestTrips();

  const openAddDialog = () => {
    setEditingNote(null);
    setTitle('');
    setLink('');
    setDialogOpen(true);
  };

  const openEditDialog = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setLink(note.link);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingNote(null);
    setTitle('');
    setLink('');
  };

  const handleSaveNote = async () => {
    if (!title.trim() || !link.trim()) return;

    try {
      if (editingNote) {
        if (isGuestMode) {
          const trip = getTrip(tripId);
          if (!trip) return;

          const updatedNotes = (trip.notes || []).map((note) =>
            note.id === editingNote.id
              ? {
                  ...note,
                  title: title.trim(),
                  link: link.trim(),
                  updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
                }
              : note
          );

          updateGuestTrip(tripId, {
            ...trip,
            notes: updatedNotes,
          });
        } else {
          await updateNote(tripId, editingNote.id, title.trim(), link.trim());
        }
      } else {
        if (isGuestMode) {
          const trip = getTrip(tripId);
          if (!trip) return;

          const newNote: Note = {
            id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: title.trim(),
            link: link.trim(),
            createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
            updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
          };

          updateGuestTrip(tripId, {
            ...trip,
            notes: [...(trip.notes || []), newNote],
          });
        } else {
          await addNote(tripId, title.trim(), link.trim());
        }
      }

      closeDialog();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      if (isGuestMode) {
        const trip = getTrip(tripId);
        if (!trip) return;

        const filteredNotes = (trip.notes || []).filter((note) => note.id !== noteId);

        updateGuestTrip(tripId, {
          ...trip,
          notes: filteredNotes,
        });
      } else {
        await deleteNote(tripId, noteId);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <>
      {/* Full-screen Notes Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-white">
          {/* Header */}
          <div className="border-b bg-white sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Notes</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={openAddDialog}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Note
                  </button>
                  <button
                    onClick={() => onOpenChange(false)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                    title="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="h-[calc(100vh-73px)] overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{note.title}</h3>
                        <div className="flex items-center gap-1 text-sm">
                          <LocateIcon className="w-4 h-4 text-gray-600" />
                          <a
                            href={note.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                          >
                            {note.link}
                          </a>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <button
                          onClick={() => openEditDialog(note)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit note"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {notes.length === 0 && (
                  <div className="text-center py-20 text-gray-500">
                    <MapPin className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">No notes yet</p>
                    <p className="text-sm mt-2">Add locations you want to visit or skip</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Note Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingNote ? 'Edit Note' : 'Add Note'}
            </DialogTitle>
            <DialogDescription>
              {editingNote
                ? 'Update note details'
                : 'Add a note with a link to a location'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note-title">Title *</Label>
              <Input
                id="note-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Must visit, Maybe visit, Skip"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-link">Link *</Label>
              <Input
                id="note-link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="e.g., https://maps.google.com/..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNote}
              disabled={!title.trim() || !link.trim()}
            >
              {editingNote ? 'Save Changes' : 'Add Note'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
