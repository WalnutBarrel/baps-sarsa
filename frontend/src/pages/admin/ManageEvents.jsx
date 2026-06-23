import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Trash2, Edit } from 'lucide-react';
import Swal from 'sweetalert2';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', event_date: '', event_time: '', description: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/events/${editId}`, formData);
        Swal.fire({
          title: 'Success!',
          text: 'Event has been updated.',
          icon: 'success',
          confirmButtonColor: '#0b3f88',
          timer: 1500
        });
      } else {
        await api.post('/events', formData);
        Swal.fire({
          title: 'Success!',
          text: 'New event has been created.',
          icon: 'success',
          confirmButtonColor: '#0b3f88',
          timer: 1500
        });
      }
      
      closeModal();
      fetchEvents();
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save event. Please try again.',
        icon: 'error',
        confirmButtonColor: '#0b3f88'
      });
    }
  };

  const handleEdit = (event) => {
    const dateObj = new Date(event.event_date);
    const formattedDate = dateObj.toISOString().split('T')[0];
    
    setFormData({
      title: event.title || '',
      event_date: formattedDate || '',
      event_time: event.event_time || '',
      description: event.description || ''
    });
    setEditId(event.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({ title: '', event_date: '', event_time: '', description: '' });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0b3f88',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/events/${id}`);
        setEvents(events.filter(e => e.id !== id));
        Swal.fire({
          title: 'Deleted!',
          text: 'Event has been deleted.',
          icon: 'success',
          confirmButtonColor: '#0b3f88',
          timer: 1500
        });
        
        if (editId === id) {
          closeModal();
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete event.',
          icon: 'error',
          confirmButtonColor: '#0b3f88'
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-blue">Manage Events</h1>
        <button 
          onClick={() => { setEditId(null); setShowModal(true); }}
          className="bg-saffron text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#d9621a] transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={18} /> Create Event
        </button>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-blue/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface border-b border-blue/10 text-text-secondary text-sm font-semibold uppercase tracking-wider">
              <th className="p-4">Title</th>
              <th className="p-4">Date</th>
              <th className="p-4">Time</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue/5">
            {loading ? (
              <tr><td colSpan="4" className="p-4 text-center text-text-secondary">Loading...</td></tr>
            ) : events.length === 0 ? (
              <tr><td colSpan="4" className="p-4 text-center text-text-secondary">No events found.</td></tr>
            ) : (
              events.map(event => (
                <tr key={event.id} className="hover:bg-surface/50 transition-colors">
                  <td className="p-4 font-medium text-blue">{event.title}</td>
                  <td className="p-4 text-text-secondary">{new Date(event.event_date).toLocaleDateString()}</td>
                  <td className="p-4 text-text-secondary">{event.event_time}</td>
                  <td className="p-4 flex items-center justify-end gap-3">
                    <button onClick={() => handleEdit(event)} className="text-blue hover:text-blue/80 cursor-pointer" title="Edit"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(event.id)} className="text-red hover:text-red/80 cursor-pointer" title="Delete"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-blue/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card w-full max-w-md rounded-xl shadow-xl overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-blue/10 flex justify-between items-center">
              <h2 className="text-xl font-heading font-bold text-blue">
                {editId ? 'Edit Event Details' : 'Create New Event'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-blue/20 rounded-lg focus:ring-2 focus:ring-saffron/50 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Date</label>
                  <input required type="date" value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} className="w-full px-4 py-2 border border-blue/20 rounded-lg focus:ring-2 focus:ring-saffron/50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Time</label>
                  <input required type="time" value={formData.event_time} onChange={e => setFormData({...formData, event_time: e.target.value})} className="w-full px-4 py-2 border border-blue/20 rounded-lg focus:ring-2 focus:ring-saffron/50 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-blue/20 rounded-lg focus:ring-2 focus:ring-saffron/50 h-24 resize-none outline-none" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 text-text-secondary hover:bg-surface rounded-lg font-medium transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 bg-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-blue/90 transition-colors shadow-sm cursor-pointer">
                  {editId ? 'Update Event' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
