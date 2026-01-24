const calculateProratedFee = (baseAmount, joinDate) => {
  const join = new Date(joinDate);
  const daysInMonth = new Date(join.getFullYear(), join.getMonth() + 1, 0).getDate();
  const daysRemaining = daysInMonth - join.getDate() + 1;
  return Math.round((baseAmount / daysInMonth) * daysRemaining);
};

const isPaymentDue = (lastPaymentDate) => {
  const now = new Date();
  const lastPayment = new Date(lastPaymentDate);
  const daysDiff = Math.floor((now - lastPayment) / (1000 * 60 * 60 * 24));
  return daysDiff > 30;
};

const formatPhoneNumber = (phone) => {
  
  const cleaned = phone.replace(/\D/g, '');
  

  if (cleaned.length === 10) {
    return `+91-${cleaned}`;
  }
  return phone;
};

module.exports = {
  calculateProratedFee,
  isPaymentDue,
  formatPhoneNumber
};



import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';

const ManageTimeSlots = () => {
  const [libraries, setLibraries] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({
    libraryId: '',
    label: '',
    endTime: '',
    monthlyFee: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
   
      const libRes = await fetch('http://localhost:5000/api/libraries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const libData = await libRes.json();
      setLibraries(libData.data || []);

      const slotRes = await fetch('http://localhost:5000/api/timeslots', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const slotData = await slotRes.json();
      setTimeSlots(slotData.data || []);
    } catch (error) {
      alert('Error loading data: ' + error.message);
    }
  };

  const handleCreate = async () => {
    if (!newSlot.libraryId || !newSlot.label || !newSlot.endTime || !newSlot.monthlyFee) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:5000/api/timeslots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          libraryId: newSlot.libraryId,
          facilityType: 'Non-AC',
          label: newSlot.label,
          endTime: newSlot.endTime,
          monthlyFee: parseInt(newSlot.monthlyFee)
        })
      });

      if (res.ok) {
        alert('✅ Time slot created successfully!');
        setNewSlot({ libraryId: '', label: '', endTime: '', monthlyFee: '' });
        fetchData();
      } else {
        alert('❌ Failed to create time slot');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this time slot?')) return;

    try {
      const token = localStorage.getItem('authToken');
      await fetch(`http://localhost:5000/api/timeslots/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('✅ Deleted successfully!');
      fetchData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Clock className="w-8 h-8 text-indigo-600" />
          Manage Time Slots
        </h1>

   
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="w-6 h-6 text-green-600" />
            Add New Time Slot
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Library *</label>
              <select
                value={newSlot.libraryId}
                onChange={(e) => setNewSlot({ ...newSlot, libraryId: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              >
                <option value="">Select library</option>
                {libraries.map(lib => (
                  <option key={lib._id} value={lib._id}>
                    {lib.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Label *</label>
              <input
                type="text"
                value={newSlot.label}
                onChange={(e) => setNewSlot({ ...newSlot, label: e.target.value })}
                placeholder="e.g., Till 6 PM"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">End Time *</label>
              <input
                type="time"
                value={newSlot.endTime}
                onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Monthly Fee (₹) *</label>
              <input
                type="number"
                value={newSlot.monthlyFee}
                onChange={(e) => setNewSlot({ ...newSlot, monthlyFee: e.target.value })}
                placeholder="e.g., 800"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Time Slot'}
          </button>
        </div>

        {/* Existing Time Slots */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Existing Time Slots</h2>

          {timeSlots.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No time slots found</p>
          ) : (
            <div className="space-y-4">
              {timeSlots.map(slot => {
                const lib = libraries.find(l => l._id === (slot.libraryId?._id || slot.libraryId));
                return (
                  <div key={slot._id} className="border-2 border-gray-200 rounded-lg p-4 flex justify-between items-center hover:border-indigo-300 transition">
                    <div>
                      <h3 className="font-bold text-lg">{slot.label}</h3>
                      <p className="text-gray-600 text-sm">
                        Library: {lib?.name || 'Unknown'}
                      </p>
                      <p className="text-gray-600 text-sm">
                        End Time: {slot.endTime} | Fee: ₹{slot.monthlyFee}/month
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(slot._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold mb-2">💡 Quick Tips:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Time slots are only for Non-AC facilities</li>
            <li>• Example: "Till 6 PM" with end time 18:00</li>
            <li>• Make sure library has "hasTimeBased" enabled</li>
            <li>• After creating, refresh the student page to see changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageTimeSlots;