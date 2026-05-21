import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://20.198.9.12:5000';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API}/api/items`);
      setItems(res.data);
    } catch (err) {
      setStatus('Error fetching items');
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const addItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/items`, { name, description });
      setName('');
      setDescription('');
      setStatus('Item added!');
      fetchItems();
    } catch (err) {
      setStatus('Error adding item');
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API}/api/items/${id}`);
      setStatus('Item deleted');
      fetchItems();
    } catch (err) {
      setStatus('Error deleting item');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ color: '#333' }}>DevOps Lab — Item Manager</h1>
      <p style={{ color: '#666' }}>3-Tier App: React + Node.js + MongoDB</p>

      <form onSubmit={addItem} style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Add Item</h3>
        <input
          value={name} onChange={e => setName(e.target.value)}
          placeholder="Item name" required
          style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
        />
        <input
          value={description} onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
        />
        <button type="submit" style={{ background: '#007bff', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add Item
        </button>
        {status && <span style={{ marginLeft: '15px', color: 'green' }}>{status}</span>}
      </form>

      <h3>Items ({items.length})</h3>
      {items.length === 0 && <p style={{ color: '#999' }}>No items yet. Add one above.</p>}
      {items.map(item => (
        <div key={item._id} style={{ background: '#fff', border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{item.name}</strong>
            {item.description && <p style={{ margin: '4px 0 0', color: '#666' }}>{item.description}</p>}
          </div>
          <button onClick={() => deleteItem(item._id)} style={{ background: '#dc3545', color: '#fff', padding: '6px 14px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
