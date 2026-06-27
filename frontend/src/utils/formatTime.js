export const formatTime = (timeStr) => {
  if (!timeStr) return '-';
  
  // If it already contains AM or PM (from our new backend logic), return it as is
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    return timeStr;
  }

  try {
    // Parse the 24-hour format string like "16:51:52"
    const [hours, minutes, seconds] = timeStr.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    
    const paddedH = h.toString().padStart(2, '0');
    
    if (seconds) {
      return `${paddedH}:${minutes}:${seconds} ${ampm}`;
    }
    return `${paddedH}:${minutes} ${ampm}`;
  } catch (error) {
    // Fallback just in case
    return timeStr;
  }
};
