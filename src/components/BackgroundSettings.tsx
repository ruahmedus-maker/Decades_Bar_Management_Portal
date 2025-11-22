'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

export default function BackgroundSettings() {
  const { backgroundImages, uploadBackgroundImage, deleteBackgroundImage, showToast } = useApp();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await uploadBackgroundImage(file);
      showToast('Background image uploaded successfully!');
    } catch (error) {
      showToast('Failed to upload image');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (imageUrl: string) => {
    if (!confirm('Delete this background image?')) return;
    
    try {
      await deleteBackgroundImage(imageUrl);
      showToast('Background image deleted');
    } catch (error) {
      showToast('Failed to delete image');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      padding: '15px',
      borderRadius: '10px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h4 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '1rem' }}>
        🎨 Background Settings
      </h4>
      
      <label style={{
        display: 'block',
        background: '#3B82F6',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: uploading ? 'not-allowed' : 'pointer',
        opacity: uploading ? 0.6 : 1,
        fontSize: '0.9rem',
        textAlign: 'center',
        marginBottom: '10px'
      }}>
        {uploading ? 'Uploading...' : '📁 Upload Background'}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </label>

      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {backgroundImages.map((image, index) => (
          <div key={image} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            marginBottom: '5px'
          }}>
            <img 
              src={image} 
              alt={`Background ${index + 1}`}
              style={{
                width: '40px',
                height: '30px',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
            <span style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '0.8rem',
              flex: 1
            }}>
              Image {index + 1}
            </span>
            <button
              onClick={() => handleDelete(image)}
              style={{
                background: 'rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.7rem'
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}