
export const saveContent = (key: string, value: any) => {
  if (typeof window === 'undefined') return;

  const content = JSON.parse(localStorage.getItem('petcovered_cms_content') || '{}');
  content[key] = value;
  localStorage.setItem('petcovered_cms_content', JSON.stringify(content));
  window.dispatchEvent(new Event('cms_update'));
};

export const getContent = (key: string, defaultValue: string): string => {
  if (typeof window === 'undefined') return defaultValue;

  const content = JSON.parse(localStorage.getItem('petcovered_cms_content') || '{}');
  return content[key] || defaultValue;
};

export const formatImageName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-');
};

export const exportProjectContent = () => {
  if (typeof window === 'undefined') return;

  const content = localStorage.getItem('petcovered_cms_content') || '{}';
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'site-content-export.json';
  a.click();
};
