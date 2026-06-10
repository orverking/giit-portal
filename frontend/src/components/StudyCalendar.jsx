import { motion } from 'framer-motion';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });
const DnDCalendar = withDragAndDrop(Calendar);

const StudyCalendar = ({ events = [], onMoveEvent }) => {
  const mappedEvents = events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <DnDCalendar
        localizer={localizer}
        events={mappedEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 540 }}
        popup
        onEventDrop={onMoveEvent}
        onEventResize={onMoveEvent}
        draggableAccessor={() => true}
        resizable
        eventPropGetter={(event) => ({
          style: {
            background: event.color || '#8B5CF6',
            color: 'white',
            borderRadius: '16px',
            border: 'none',
            padding: '4px 10px',
          },
        })}
        components={{
          event: ({ event }) => (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="font-medium"
            >
              {event.title}
            </motion.div>
          ),
        }}
      />
    </motion.div>
  );
};

export default StudyCalendar;
