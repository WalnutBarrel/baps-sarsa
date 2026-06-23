import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Swal from 'sweetalert2';
import { BookOpen, Send, Clock, CheckCircle } from 'lucide-react';

const PrasangWorkspace = () => {
  const [feed, setFeed] = useState([]);
  const [myPrasangs, setMyPrasangs] = useState([]);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'my'
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'feed') {
        const res = await api.get('/prasangs/feed');
        setFeed(res.data);
      } else {
        const res = await api.get('/prasangs/my');
        setMyPrasangs(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch prasangs', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    try {
      await api.post('/prasangs', { title, description });
      setTitle('');
      setDescription('');
      Swal.fire({
        icon: 'success',
        title: 'Prasang Submitted',
        text: 'Prasang submitted successfully! Awaiting admin review.',
        confirmButtonColor: '#0b3f88',
      });
      setActiveTab('my');
      fetchData();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to submit prasang',
        confirmButtonColor: '#0b3f88',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-heading font-bold text-blue">Prasang Workspace</h1>

      <div className="flex bg-surface rounded-lg p-1 border border-blue/10 w-full max-w-sm">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex justify-center items-center gap-2 ${activeTab === 'feed' ? 'bg-white shadow-sm text-saffron' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <BookOpen size={16} /> Inspiration Feed
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex justify-center items-center gap-2 ${activeTab === 'my' ? 'bg-white shadow-sm text-saffron' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <Send size={16} /> My Submissions
        </button>
      </div>

      {activeTab === 'feed' ? (
        <div className="space-y-4">
          {feed.length === 0 ? (
            <p className="text-text-secondary p-8 bg-card rounded-xl text-center shadow-sm">No approved prasangs yet. Be the first to share!</p>
          ) : (
            feed.map(p => (
              <div key={p.id} className="bg-card p-6 rounded-xl shadow-sm border border-blue/5">
                <h3 className="text-xl font-heading font-bold text-blue mb-2">{p.title}</h3>
                <p className="text-text-primary whitespace-pre-wrap mb-4">{p.description}</p>
                <div className="flex items-center gap-2 text-sm text-text-secondary border-t border-blue/5 pt-4">
                  <span className="font-medium">By: {p.users?.full_name}</span>
                  <span>•</span>
                  <span>{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-xl shadow-sm border border-gold/40 h-fit">
            <h2 className="text-lg font-heading font-semibold text-gold mb-4">Submit a Prasang</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron/50"
                  placeholder="E.g., A lesson in humility"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron/50 h-32 resize-none"
                  placeholder="Share your inspiring incident..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-saffron text-white py-2 rounded-lg font-medium hover:bg-[#d9621a] transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {loading ? 'Submitting...' : <><Send size={18} /> Submit for Review</>}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-heading font-semibold text-blue mb-2">My History</h2>
            {myPrasangs.length === 0 ? (
              <p className="text-text-secondary text-sm">You haven't submitted any prasangs yet.</p>
            ) : (
              myPrasangs.map(p => (
                <div key={p.id} className="bg-surface p-4 rounded-xl border border-blue/10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading font-semibold text-text-primary">{p.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase flex items-center gap-1 ${
                      p.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      p.status === 'rejected' ? 'bg-red/10 text-red' : 
                      'bg-blue/10 text-blue'
                    }`}>
                      {p.status === 'approved' && <CheckCircle size={12} />}
                      {p.status === 'pending' && <Clock size={12} />}
                      {p.status}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary line-clamp-2 mb-2">{p.description}</p>
                  {p.admin_note && (
                    <div className="bg-red/5 p-2 rounded text-xs text-red mt-2 border border-red/10">
                      <strong>Admin Note:</strong> {p.admin_note}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrasangWorkspace;
