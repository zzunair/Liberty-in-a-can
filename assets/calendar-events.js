let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function hasEvent(year, month, day) {
  const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return window.eventDates.includes(dateString);
}

function generateCalendar(month, year) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDay = firstDay.getDay();
  const monthLength = lastDay.getDate();
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  document.getElementById('currentMonthYear').textContent = `${monthNames[month]} ${year}`;
  
  const calendarDays = document.getElementById('calendar-days');
  calendarDays.innerHTML = '';
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDay; i++) {
    calendarDays.innerHTML += '<div></div>';
  }
  
  // Add the days of the month
  const today = new Date();
  for (let day = 1; day <= monthLength; day++) {
    const isToday = day === today.getDate() && 
                    month === today.getMonth() && 
                    year === today.getFullYear();
    
    const hasEventClass = hasEvent(year, month, day) ? ' has-event' : '';
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    calendarDays.innerHTML += `
      <div class="calendar-day${isToday ? ' today' : ''}${hasEventClass}${!hasEventClass ? ' disabled' : ''}" 
        ${hasEventClass ? `onclick="selectDate('${dateString}')"` : ''}
      >
        ${day}
        ${hasEventClass ? '<span class="event-indicator"></span>' : ''}
      </div>
    `;
  }
}

function previousMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar(currentMonth, currentYear);
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar(currentMonth, currentYear);
}

function selectDate(dateString) {
  const clearDateBtn = document.querySelector('.clear-date-btn');
  const showMoreBtn = document.querySelector('.show-more-events');
  
  // Show all events if no date is selected (null)
  if (dateString === null) {
    document.querySelectorAll('.event-item').forEach((event, index) => {
      if (index < 3) {
        event.style.display = 'flex';
      } else {
        event.classList.add('hidden-event');
        event.style.display = 'none';
      }
    });
    
    // Show the show more button and reset its text
    if (showMoreBtn) {
      showMoreBtn.style.display = 'block';
      showMoreBtn.textContent = 'Show all events';
    }
    return;
  }

  // Hide show more button when date is selected
  if (showMoreBtn) {
    showMoreBtn.style.display = 'none';
  }

  // Show/hide events based on date
  document.querySelectorAll('.event-item').forEach(event => {
    const eventDate = event.getAttribute('data-date');
    event.style.display = eventDate === dateString ? 'flex' : 'none';
    if (eventDate === dateString) {
      event.classList.remove('hidden-event');
    }
  });

  // Update active state of calendar days
  document.querySelectorAll('.calendar-day').forEach(day => {
    day.classList.remove('active');
  });
  document.querySelector(`.calendar-day.has-event[onclick*="${dateString}"]`)?.classList.add('active');
  
  // Show clear date button
  clearDateBtn.style.display = 'block';
  clearDateBtn.style.opacity = '1';
}

function openEventPopup(eventId) {
  console.log('Opening popup for event ID:', eventId); // Debug log
  
  const popup = document.getElementById('event-popup');
  const overlay = document.getElementById('popup-overlay');
  const eventDetails = document.querySelector(`[data-event-id="${eventId}"]`);
  
  console.log('Found event details:', eventDetails); // Debug log
  
  if (eventDetails) {
    // Get and log all data attributes
    console.log('Event data:', {
      id: eventDetails.getAttribute('data-event-id'),
      title: eventDetails.getAttribute('data-title'),
      image: eventDetails.getAttribute('data-image'),
      description: eventDetails.getAttribute('data-description'),
      date: eventDetails.getAttribute('data-date'),
      startTime: eventDetails.getAttribute('data-start-time'),
      endTime: eventDetails.getAttribute('data-end-time')
    });
    
    document.getElementById('popup-image').src = eventDetails.getAttribute('data-image');
    document.getElementById('popup-title').textContent = eventDetails.getAttribute('data-title');
    
    try {
      // Get the event dates
      const eventDate = eventDetails.getAttribute('data-date');
      const startDateTime = new Date(eventDetails.getAttribute('data-start-full'));
      const endDateTime = new Date(eventDetails.getAttribute('data-end-full'));
      
      // Format date for display
      const formattedDate = startDateTime.toLocaleDateString('en-US', { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short'
      });
      
      // Get formatted times
      const startTime = eventDetails.getAttribute('data-start-time');
      const endTime = eventDetails.getAttribute('data-end-time');
      
      // Format time for display
      const formattedTime = `${startTime} - ${endTime}`;
      
      // Update the display
      document.getElementById('popup-date').textContent = formattedDate;
      document.getElementById('popup-time').textContent = formattedTime;
      
      // Store event details for Google Calendar
      const eventData = {
        title: eventDetails.getAttribute('data-title'),
        description: eventDetails.getAttribute('data-description'),
        location: eventDetails.getAttribute('data-location'),
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString()
      };
      
      const calendarBtn = popup.querySelector('.add-to-calendar-btn');
      calendarBtn.setAttribute('data-event-details', JSON.stringify(eventData));
      
    } catch (error) {
      console.error('Error processing event dates:', error);
    }
    
    // Process description
    try {
      let richTextContent = eventDetails.getAttribute('data-description');
      richTextContent = richTextContent
        .replace(/=>/g, ':')
        .replace(/nil/g, 'null')
        .replace(/\\/g, '')
        .replace(/^"/, '')
        .replace(/"$/, '');
      
      const parsedContent = JSON.parse(richTextContent);
      const descriptionHtml = parseRichText(parsedContent);
      document.getElementById('popup-description').innerHTML = descriptionHtml;
    } catch (error) {
      console.error('Error parsing rich text:', error);
      const rawText = eventDetails.getAttribute('data-description')
        .replace(/^"/, '')
        .replace(/"$/, '')
        .replace(/\\"/g, '"');
      document.getElementById('popup-description').innerHTML = rawText;
    }
    
    document.getElementById('popup-location').textContent = eventDetails.getAttribute('data-location');
  }
  
  popup.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeEventPopup() {
  const popup = document.getElementById('event-popup');
  const overlay = document.getElementById('popup-overlay');
  
  popup.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function clearDate() {
  const clearDateBtn = document.querySelector('.clear-date-btn');
  const showMoreBtn = document.querySelector('.show-more-events');
  
  // Show only first 3 events
  document.querySelectorAll('.event-item').forEach((event, index) => {
    if (index < 3) {
      event.style.display = 'flex';
      event.classList.remove('hidden-event');
    } else {
      event.style.display = 'none';
      event.classList.add('hidden-event');
    }
  });
  
  // Show and reset show more button
  if (showMoreBtn) {
    showMoreBtn.style.display = 'block';
    showMoreBtn.textContent = 'Show all events';
  }

  // Remove active state from calendar days
  document.querySelectorAll('.calendar-day').forEach(day => {
    day.classList.remove('active');
  });

  // Fade out clear date button
  clearDateBtn.style.opacity = '0';
  setTimeout(() => {
    clearDateBtn.style.display = 'none';
  }, 500);
}

// Function to parse rich text JSON into HTML
function parseRichText(content) {
  try {
    if (typeof content === 'string') {
      // If content is already a string, return it directly
      return content;
    }
    
    if (!content || !content.children) return '';
    
    return content.children.map(block => {
      if (!block) return '';
      
      switch (block.type) {
        case 'paragraph':
          return `<p>${parseRichTextChildren(block.children)}</p>`;
        case 'heading':
          return `<h${block.level}>${parseRichTextChildren(block.children)}</h${block.level}>`;
        case 'list':
          const listType = block.listType === 'ordered' ? 'ol' : 'ul';
          return `<${listType}>${block.children.map(item => `<li>${parseRichTextChildren(item.children)}</li>`).join('')}</${listType}>`;
        default:
          return parseRichTextChildren(block.children);
      }
    }).join('');
  } catch (error) {
    console.error('Error in parseRichText:', error);
    return '';
  }
}

function parseRichTextChildren(children) {
  try {
    if (!children) return '';
    if (typeof children === 'string') return children;
    
    return children.map(child => {
      if (typeof child === 'string') return child;
      if (!child) return '';
      
      let text = child.value || '';
      
      if (child.bold) text = `<strong>${text}</strong>`;
      if (child.italic) text = `<em>${text}</em>`;
      if (child.underline) text = `<u>${text}</u>`;
      
      return text;
    }).join('');
  } catch (error) {
    console.error('Error in parseRichTextChildren:', error);
    return '';
  }
}

function addToGoogleCalendar(button) {
  try {
    const eventDetails = JSON.parse(button.getAttribute('data-event-details'));
    
    // Parse the description if it's in rich text format
    let description = eventDetails.description;
    try {
      if (description.includes('"type"')) {
        const richTextObj = JSON.parse(
          description.replace(/=>/g, ':').replace(/nil/g, 'null')
        );
        description = convertRichTextToPlainText(richTextObj);
      }
    } catch (e) {
      console.error('Error parsing description:', e);
    }

    // Create Google Calendar URL
    const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const params = new URLSearchParams({
      text: eventDetails.title || '',
      details: description || '',
      location: eventDetails.location || '',
      dates: `${eventDetails.start.replace(/[-:]/g, '')}/${eventDetails.end.replace(/[-:]/g, '')}`
    });

    // Open Google Calendar in new tab
    window.open(`${baseUrl}&${params.toString()}`, '_blank');
  } catch (error) {
    console.error('Error adding to Google Calendar:', error);
  }
}

function convertRichTextToPlainText(richText) {
  if (!richText || !richText.children) return '';

  return richText.children.map(block => {
    if (block.type === 'paragraph') {
      return block.children.map(child => {
        if (child.type === 'text') {
          return child.value;
        }
        return '';
      }).join('') + '\n\n';
    }
    return '';
  }).join('').trim();
}

// Helper function to strip HTML from description
function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// Generate calendar on page load
generateCalendar(currentMonth, currentYear);

// Add this new function
function toggleEvents() {
  const button = document.querySelector('.show-more-events');
  const allEvents = document.querySelectorAll('.event-item');
  const isShowingAll = button.textContent === 'Show less';

  allEvents.forEach((event, index) => {
    if (index >= 3) {  // Only affect events after the first 3
      if (isShowingAll) {
        // Hiding events (Show Less clicked)
        event.style.display = 'none';
        event.classList.add('hidden-event');
      } else {
        // Showing events (Show all events clicked)
        event.style.display = 'flex';
        event.classList.remove('hidden-event');
      }
    }
  });

  button.textContent = isShowingAll ? 'Show all events' : 'Show less';
}

// Add this to your existing code after the calendar generation
document.addEventListener('DOMContentLoaded', function() {
  const showMoreButton = document.querySelector('.show-more-events');
  if (showMoreButton) {
    showMoreButton.addEventListener('click', toggleEvents);
  }
});