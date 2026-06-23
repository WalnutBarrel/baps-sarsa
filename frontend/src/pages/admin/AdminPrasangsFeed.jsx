import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { BookOpen, Pen, X, Plus, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminPrasangsFeed = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await api.get('/prasangs/feed');
      setFeed(res.data);
    } catch (err) {
      console.error('Failed to fetch prasang feed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/prasangs', { title, description });
      Swal.fire({ icon: 'success', title: 'Submitted', text: 'Prasang added! You can review and approve it from the Approve Prasangs page.', confirmButtonColor: '#0b3f88' });
      setTitle('');
      setDescription('');
      setShowModal(false);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to submit prasang.', confirmButtonColor: '#0b3f88' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Prasang?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0b3f88',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/prasangs/${id}`);
        setFeed(feed.filter(p => p.id !== id));
        Swal.fire({ icon: 'success', title: 'Deleted', text: 'Prasang has been removed.', timer: 1500, showConfirmButton: false });
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete prasang.', confirmButtonColor: '#0b3f88' });
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="text-saffron" size={28} />
          <h1 className="text-2xl font-heading font-bold text-blue">Approved Prasangs Feed</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#f37021] text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#d9621a] transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={20} /> Add Prasang
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-text-secondary bg-card rounded-xl shadow-sm border border-blue/10">Loading feed...</div>
        ) : feed.length === 0 ? (
          <div className="p-8 text-center text-text-secondary bg-card rounded-xl shadow-sm border border-blue/10">
            No approved prasangs yet. Go to 'Approve Prasangs' to review pending submissions!
          </div>
        ) : (
          feed.map(p => (
            <div key={p.id} className="bg-card p-6 rounded-xl shadow-sm border border-blue/5 hover:shadow-md transition-shadow relative group">
              <div className="flex justify-between items-start mb-3 pr-8">
                <h3 className="text-xl font-heading font-bold text-blue">{p.title}</h3>
              </div>
              <button 
                onClick={() => handleDelete(p.id)}
                className="absolute top-6 right-6 text-red opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red/10 p-2 rounded-full cursor-pointer"
                title="Delete Prasang"
              >
                <Trash2 size={18} />
              </button>
              <p className="text-text-primary whitespace-pre-wrap mb-4 text-base leading-relaxed">{p.description}</p>
              <div className="flex items-center gap-2 text-sm text-text-secondary border-t border-blue/5 pt-4">
                <span className="font-medium text-blue/80">Submitted by: {p.users?.full_name} [{p.users?.mobile}]</span>
                <span>•</span>
                <span>{new Date(p.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-blue/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="p-8">
              <div className="flex items-center gap-2 border-b border-gray-300 pb-3 mb-6">
                <Pen className="text-[#f37021]" size={20} />
                <h2 className="text-xl font-bold text-[#0b3f88]">Add New Prasang</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#0b3f88] mb-2">PRASANG TITLE *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f37021]/50 text-gray-800"
                    placeholder="e.g. Mahant Swami Maharaj Sarsa Smruti"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#0b3f88] mb-2">PRASANG DESCRIPTION *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f37021]/50 h-32 resize-none text-gray-800"
                    placeholder="Write full inspirational incident summary..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#f37021] text-white py-3 rounded-xl font-bold hover:bg-[#d9621a] transition-colors disabled:opacity-70 cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Submit for Admin Review'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPrasangsFeed;
