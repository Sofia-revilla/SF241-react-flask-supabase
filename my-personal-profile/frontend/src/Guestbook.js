import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Ensure this matches your Vercel Environment Variable
const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

export default function Guestbook() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [loading, setLoading] = useState(true);

  // Fetch Logic
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/guestbook`);
      setEntries(res.data);
    } catch (err) {
      console.error("Server is likely waking up...", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEntries(); }, []);

  // Create Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/guestbook`, form);
    setForm({ name: '', message: '' });
    fetchEntries();
  };

  // Delete Logic
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/guestbook/${id}`);
    fetchEntries();
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>Personal Guestbook</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input 
          placeholder="Name" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
        />
        <textarea 
          placeholder="Message" 
          value={form.message} 
          onChange={e => setForm({...form, message: e.target.value})} 
          style={{ display: 'block', width: '100%', marginBottom: '10px' }}
        />
        <button type="submit">Post to Guestbook</button>
      </form>

      {loading ? (
        <p>☕ Waking up the server... please wait 30 seconds.</p>
      ) : (
        entries.map(entry => (
          <div key={entry.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
            <strong>{entry.name}</strong>: {entry.message}
            <br />
            <button onClick={() => handleDelete(entry.id)} style={{ color: 'red', marginTop: '5px' }}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}