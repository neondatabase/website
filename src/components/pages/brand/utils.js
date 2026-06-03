export const handleDownload = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const handleDownloads = (files) => {
  files.forEach(({ url, filename }) => {
    handleDownload(url, filename);
  });
};
