import React, { useEffect, useState } from 'react';

// Formats a parsed date string into the user's local timezone
const LocalTimeFormatter = ({ dateString }: { dateString: string }) => {
  const [localTime, setLocalTime] = useState(dateString); // fallback

  useEffect(() => {
    try {
      // Assuming the admin inputs time in IST (UTC+5:30) for now, or UTC if specified.
      // E.g., [time:06:00PM] [date:2026-06-25]
      // We will parse it and convert it.
      
      const dateObj = new Date(dateString);
      if (!isNaN(dateObj.getTime())) {
        const formatter = new Intl.DateTimeFormat(navigator.language || 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short'
        });
        setLocalTime(formatter.format(dateObj));
      }
    } catch (e) {
      console.error("Failed to parse date", e);
    }
  }, [dateString]);

  return <span style={{ fontWeight: 'bold', color: '#1cc6db', background: 'rgba(28, 198, 219, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{localTime}</span>;
};

export const parseDynamicTime = (text: string) => {
  if (!text) return text;

  // Regex to match [time:HH:MMAM/PM] [date:YYYY-MM-DD] or similar variations
  const timeRegex = /\[time:([\d]{1,2}:[\d]{2}[A-Za-z]{2})\]\s*\[date:([\d]{4}-[\d]{2}-[\d]{2})\]/g;
  
  if (!timeRegex.test(text)) {
    return text;
  }

  const parts = [];
  let lastIndex = 0;
  let match;

  // Reset regex index
  timeRegex.lastIndex = 0;

  while ((match = timeRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const timeStr = match[1]; // e.g. 06:00PM
    const dateStr = match[2]; // e.g. 2026-06-25

    // Parse time
    let hours = parseInt(timeStr.substring(0, 2));
    const mins = timeStr.substring(3, 5);
    const ampm = timeStr.substring(5).toUpperCase();

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    // We assume the input is UTC for calculation purposes
    const isoString = `${dateStr}T${hours.toString().padStart(2, '0')}:${mins}:00.000Z`;

    parts.push(<LocalTimeFormatter key={match.index} dateString={isoString} />);
    lastIndex = timeRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts.map((part, i) => <React.Fragment key={i}>{part}</React.Fragment>)}</>;
};
