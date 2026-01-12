
import React, { useState, useEffect } from 'react';
import { getContent, saveContent, formatImageName } from '../services/cmsService';

interface TextProps {
  id: string;
  defaultText: string;
  className?: string;
  multiline?: boolean;
}

export const EditableText: React.FC<TextProps> = ({ id, defaultText, className, multiline }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(getContent(id, defaultText));
  const [editMode, setEditMode] = useState(localStorage.getItem('petcovered_edit_mode') === 'true');

  useEffect(() => {
    const checkMode = () => setEditMode(localStorage.getItem('petcovered_edit_mode') === 'true');
    window.addEventListener('cms_mode_change', checkMode);
    return () => window.removeEventListener('cms_mode_change', checkMode);
  }, []);

  const handleBlur = () => {
    setIsEditing(false);
    saveContent(id, val);
  };

  if (!editMode) return <span className={className}>{val}</span>;

  return isEditing ? (
    multiline ? (
      <textarea
        className={`w-full bg-primary/10 border-2 border-primary rounded p-2 outline-none ${className}`}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={handleBlur}
        autoFocus
      />
    ) : (
      <input
        className={`bg-primary/10 border-b-2 border-primary outline-none ${className}`}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={handleBlur}
        autoFocus
      />
    )
  ) : (
    <span 
      className={`cursor-edit hover:bg-primary/5 border-b border-dashed border-primary/30 transition-colors ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {val}
    </span>
  );
};

interface ImageProps {
  id: string;
  defaultSrc: string;
  className?: string;
}

export const EditableImage: React.FC<ImageProps> = ({ id, defaultSrc, className }) => {
  const [src, setSrc] = useState(getContent(id, defaultSrc));
  const [editMode, setEditMode] = useState(localStorage.getItem('petcovered_edit_mode') === 'true');

  useEffect(() => {
    const checkMode = () => setEditMode(localStorage.getItem('petcovered_edit_mode') === 'true');
    window.addEventListener('cms_mode_change', checkMode);
    return () => window.removeEventListener('cms_mode_change', checkMode);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        saveContent(id, base64);
        setSrc(base64);
        console.log(`Development Note: Image ${formatImageName(file.name)} uploaded. In production, move this file to /src/assets/`);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <img src={src} alt="CMS Content" className="w-full h-full object-cover" />
      {editMode && (
        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
          <label className="bg-white text-primary px-4 py-2 rounded-full font-black text-xs cursor-pointer shadow-xl">
            REPLACE IMAGE
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
          </label>
        </div>
      )}
    </div>
  );
};
