// app/upload-banners/page.tsx
'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';

export default function UploadBanners() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const { isAdmin, showToast } = useApp();
  const router = useRouter();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type and size
        if (!file.type.startsWith('image/')) {
          showToast(`Skipped ${file.name}: Not an image file`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          showToast(`Skipped ${file.name}: File too large (max 10MB)`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const blob = await response.json();
          newUrls.push(blob.url);
          console.log(`✅ Uploaded: ${file.name} → ${blob.url}`);
        } else {
          const error = await response.json();
          console.error(`❌ Failed: ${file.name} - ${error.error}`);
          showToast(`Failed to upload ${file.name}`);
        }
      }

      if (newUrls.length > 0) {
        setUploadedUrls(prev => [...prev, ...newUrls]);
        showToast(`Successfully uploaded ${newUrls.length} images`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Upload failed');
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const copyToClipboard = () => {
    const urlsText = uploadedUrls.join('\n');
    navigator.clipboard.writeText(urlsText);
    showToast('URLs copied to clipboard!');
  };

  const goToBannerSettings = () => {
    router.push('/admin?tab=backgrounds');
  };

  if (!isAdmin) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: 'white',
        background: 'rgba(255,255,255,0.1)',
        margin: '20px',
        borderRadius: '12px'
      }}>
        <h2>🔒 Admin Access Required</h2>
        <p>You need administrator privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '30px', 
      maxWidth: '800px', 
      margin: '0 auto',
      color: 'white'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#3B82F6' }}>
          🎨 Upload Background Images
        </h1>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          margin: '0 0 30px 0',
          fontSize: '1.1rem'
        }}>
          Upload banner images to Vercel Blob storage for optimal performance
        </p>

        {/* Upload Section */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '25px',
          border: '2px dashed rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <label style={{
            display: 'inline-block',
            background: uploading ? '#6B7280' : '#3B82F6',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '8px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '1.1rem',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}>
            {uploading ? '📤 Uploading...' : '📁 Select Banner Images'}
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.6)', 
            margin: '15px 0 0 0',
            fontSize: '0.9rem'
          }}>
            Supports JPG, PNG, WebP • Max 10MB per file
          </p>
        </div>

        {/* Results Section */}
        {uploadedUrls.length > 0 && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            marginBottom: '20px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <h3 style={{ margin: 0, color: '#22C55E' }}>
                ✅ Upload Successful ({uploadedUrls.length} images)
              </h3>
              <button 
                onClick={copyToClipboard}
                style={{
                  background: '#8B5CF6',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
              >
                📋 Copy URLs
              </button>
            </div>
            
            <div style={{ 
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              padding: '15px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              <pre style={{ 
                margin: 0, 
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.9)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                {JSON.stringify(uploadedUrls, null, 2)}
              </pre>
            </div>
            
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              margin: '15px 0 0 0',
              fontSize: '0.9rem'
            }}>
              Replace the bannerImages array in DecadesBanner.tsx with these URLs
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ 
          display: 'flex', 
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => window.open('/admin', '_self')}
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#3B82F6',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            ⚡ Back to Admin Panel
          </button>
          
          <button 
            onClick={() => window.open('/components/DecadesBanner.tsx', '_blank')}
            style={{
              background: 'rgba(139, 92, 246, 0.2)',
              color: '#8B5CF6',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            📝 Edit DecadesBanner.tsx
          </button>
        </div>
      </div>
    </div>
  );
}