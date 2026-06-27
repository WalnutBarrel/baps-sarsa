export const formatTime = (dateString) => {
  if (!dateString) return '-';
  
  try {
    // If it's an ISO timestamp (like created_at), parse it directly
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    }
    
    // Fallback if someone passes a raw string that isn't a date
    return dateString;
  } catch (error) {
    return dateString;
  }
};
