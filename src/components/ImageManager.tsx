'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

interface ImageManagerProps {
  // Remove these props since we're using context
  // currentImages: string[];
  // onImagesUpdate: (images: string[]) => void;
}

export default function ImageManager({ }: ImageManagerProps) {
  const [uploading, setUploading] = useState(false);
  const { 
    backgroundImages, 
    uploadBackgroundImage, 
    deleteBackgroundImage, 
    showToast 
  } = useApp();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Use the context method - this will handle the upload and update state
      await uploadBackgroundImage(file);
      showToast('Background image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload image');
    } finally {
      setUploading(false);
      // Reset file input
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

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...backgroundImages];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    // We need to add a reorder function to context, but for now let's focus on upload
    showToast('Reordering not implemented yet');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.9)',
      padding: '15px',
      borderRadius: '10px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      zIndex: 1000,
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'hidden'
    }}>
      <h4 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '1rem' }}>
        🎨 Background Manager
      </h4>
      
      {/* Upload Section */}
      <div style={{ marginBottom: '15px' }}>
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
          fontWeight: '600'
        }}>
          {uploading ? 'Uploading...' : '📁 Upload Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem', margin: '8px 0 0 0' }}>
          JPG, PNG, WebP • Max 10MB
        </p>
      </div>

      {/* Images List */}
      <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' }}>
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
              onError={(e) => {
                // Fallback if image fails to load
                console.error('Failed to load image:', image);
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
              🗑️
            </button>
          </div>
        ))}
        
        {backgroundImages.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontStyle: 'italic',
            fontSize: '0.8rem'
          }}>
            No background images
          </div>
        )}
      </div>
    </div>
  );
}