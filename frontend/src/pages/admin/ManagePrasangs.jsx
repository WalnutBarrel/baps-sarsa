import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Check, X, MessageSquare } from 'lucide-react';
import Swal from 'sweetalert2';

const ManagePrasangs = () => {
  const [prasangs, setPrasangs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminNote, setAdminNote] = useState({});

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get('/prasangs/pending');
      setPrasangs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    try {
      await api.put(`/prasangs/${id}/review`, { 
        status, 
        admin_note: adminNote[id] || '' 
      });
      setPrasangs(prasangs.filter(p => p.id !== id));
      Swal.fire({
        icon: 'success',
        title: status === 'approved' ? 'Approved!' : 'Rejected!',
        text: `Prasang has been ${status}.`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to review prasang.',
        confirmButtonColor: '#0b3f88'
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-blue">Review Prasangs</h1>

      <div className="bg-card rounded-xl shadow-sm border border-blue/10 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-secondary">Loading pending prasangs...</div>
        ) : prasangs.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">No pending prasangs to review. Great job!</div>
        ) : (
          <div className="divide-y divide-blue/10">
            {prasangs.map(p => (
              <div key={p.id} className="p-6 hover:bg-surface/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-blue">{p.title}</h3>
                    <p className="text-sm text-text-secondary">Submitted by: <span className="font-medium text-text-primary">{p.users?.full_name}</span> [{p.users?.mobile}] on {new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleReview(p.id, 'approved')}
                      className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition-colors"
                      title="Approve"
                    >
                      <Check size={20} />
                    </button>
                    <button 
                      onClick={() => handleReview(p.id, 'rejected')}
                      className="bg-red/10 text-red p-2 rounded-lg hover:bg-red/20 transition-colors"
                      title="Reject"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-surface p-4 rounded-lg border border-blue/5 mb-4 text-text-primary whitespace-pre-wrap">
                  {p.description}
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="text-text-secondary mt-2" size={20} />
                  <textarea
                    value={adminNote[p.id] || ''}
                    onChange={(e) => setAdminNote({ ...adminNote, [p.id]: e.target.value })}
                    placeholder="Optional note to user (e.g. why it was rejected)..."
                    className="flex-1 bg-surface px-4 py-2 border border-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm h-12 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePrasangs;
