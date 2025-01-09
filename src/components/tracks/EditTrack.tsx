import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useTrack } from '../../context/TrackContext';
import type { Track } from '../../types';

interface EditTrackProps {
  track: Track;
}

export function EditTrack({ track }: EditTrackProps) {
  const { editTrack } = useTrack();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    description: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: track.name,
        startTime: track.startTime,
        endTime: track.endTime,
        description: track.description || ''
      });
    }
  }, [isOpen, track]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editTrack(track.id, formData);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <Pencil className="h-4 w-4 mr-2" />
        Edit Track
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Track">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Track Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Start Time
            </label>
            <input
              type="time"
              required
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              End Time
            </label>
            <input
              type="time"
              required
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </>
  );
} 