
import { CMSContent } from '../types';

const STORAGE_KEY = 'petcovered_cms_content';

export const saveContent = (key: string, value: any) => {
  if (typeof window === 'undefined') return;

  const content = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  content[key] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new Event('cms_update'));
};

export const getContent = (key: string, defaultValue: string): string => {
  if (typeof window === 'undefined') return defaultValue;

  const content = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return content[key] || defaultValue;
};

export const formatImageName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-');
};

/**
 * Exports the current content as a validated JSON bundle
 * for manual commitment to the /src folder.
 */
export const exportProjectContent = () => {
  if (typeof window === 'undefined') return;

  const content = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  // Wrap in a standard structure for the production loader
  const exportData = {
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    content: content
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `petcovered-content-${new Date().getTime()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
