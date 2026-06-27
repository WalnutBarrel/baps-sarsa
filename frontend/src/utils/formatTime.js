export const formatTime = (timeStr) => {
  if (!timeStr) return '-';
  
  // If it already contains AM or PM (from our new backend logic), return it as is
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    return timeStr;
  }

  try {
    // Old records are stored in UTC format like "16:51:52"
    // We need to add 5 hours and 30 minutes to convert UTC to IST
    const [hoursStr, minutesStr, secondsStr] = timeStr.split(':');
    let h = parseInt(hoursStr, 10);
    let m = parseInt(minutesStr, 10);
    let s = secondsStr ? parseInt(secondsStr, 10) : 0;
    
    // Add 5 hours and 30 minutes (IST offset)
    m += 30;
    if (m >= 60) {
      m -= 60;
      h += 1;
    }
    h += 5;
    
    // Wrap around 24 hours
    if (h >= 24) {
      h -= 24;
    }
    
    // Format to 12-hour AM/PM
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    
    const paddedH = h.toString().padStart(2, '0');
    const paddedM = m.toString().padStart(2, '0');
    
    if (secondsStr) {
      const paddedS = s.toString().padStart(2, '0');
      return `${paddedH}:${paddedM}:${paddedS} ${ampm}`;
    }
    return `${paddedH}:${paddedM} ${ampm}`;
  } catch (error) {
    // Fallback just in case
    return timeStr;
  }
};
