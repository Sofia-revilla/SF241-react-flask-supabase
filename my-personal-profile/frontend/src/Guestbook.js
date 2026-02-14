import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://your-backend-on-render.com/guestbook";

export default function Guestbook() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });

  const fetchEntries = async () => {
    const res = await axios.get(API_URL);
    setEntries(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(API_URL, form);
    setForm({ name: '', message: '' });
    fetchEntries();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchEntries();
  };

  useEffect(() => { fetchEntries(); }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <textarea placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
        <button type="submit">Post to Guestbook</button>
      </form>

      {entries.map(entry => (
        <div key={entry.id}>
          <strong>{entry.name}</strong>: {entry.message}
          <button onClick={() => handleDelete(entry.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}