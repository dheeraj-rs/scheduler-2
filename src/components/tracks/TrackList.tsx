import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTrack } from '../../context/TrackContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { TrackCard } from './TrackCard';

export function TrackList() {
  const { tracks, addTrack } = useTrack();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTrack(formData);
    setIsModalOpen(false);
    setFormData({ name: '', startTime: '', endTime: '', description: '' });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Tracks</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Track
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Track"
      >
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
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Track</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}