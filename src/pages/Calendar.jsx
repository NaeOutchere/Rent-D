import React, { useState, useEffect } from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
    type: "meeting",
    attendees: [],
    location: "",
    color: "#3B82F6",
  });

  const teamMembers = [
    { id: 1, name: "John Doe", role: "CEO", color: "#EF4444" },
    { id: 2, name: "Jane Smith", role: "CTO", color: "#10B981" },
    { id: 3, name: "Mike Johnson", role: "Developer", color: "#8B5CF6" },
    { id: 4, name: "Sarah Wilson", role: "Designer", color: "#F59E0B" },
    { id: 5, name: "David Brown", role: "Admin", color: "#06B6D4" },
  ];

  const eventTypes = [
    { value: "meeting", label: "Meeting", color: "#3B82F6" },
    { value: "development", label: "Development", color: "#10B981" },
    { value: "design", label: "Design", color: "#8B5CF6" },
    { value: "planning", label: "Planning", color: "#F59E0B" },
    { value: "review", label: "Review", color: "#EF4444" },
    { value: "deployment", label: "Deployment", color: "#06B6D4" },
    { value: "maintenance", label: "Maintenance", color: "#64748B" },
  ];

  // Date helper functions
  const formatDate = (date, format = "default") => {
    const d = new Date(date);
    switch (format) {
      case "month-year":
        return d.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      case "day-short":
        return d.toLocaleDateString("en-US", { weekday: "short" });
      case "day-full":
        return d.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      case "time":
        return d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      case "date-time":
        return d.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      default:
        return d.getDate().toString();
    }
  };

  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isSameMonth = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth()
    );
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const addMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  };

  const subMonths = (date, months) => {
    return addMonths(date, -months);
  };

  const startOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const endOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const startOfWeek = (date) => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() - day;
    return new Date(result.setDate(diff));
  };

  const endOfWeek = (date) => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() + (6 - day);
    return new Date(result.setDate(diff));
  };

  // Sample events
  useEffect(() => {
    const today = new Date();
    const sampleEvents = [
      {
        id: 1,
        title: "Team Standup",
        description: "Daily team standup meeting",
        start: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          10,
          0
        ),
        end: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          10,
          30
        ),
        type: "meeting",
        attendees: [1, 2, 3, 4],
        location: "Conference Room A",
        color: "#3B82F6",
      },
      {
        id: 2,
        title: "Product Review",
        description: "Monthly product review with stakeholders",
        start: addDays(today, 2),
        end: addDays(today, 2),
        type: "review",
        attendees: [1, 2],
        location: "Board Room",
        color: "#EF4444",
      },
      {
        id: 3,
        title: "Feature Development",
        description: "Work on new payment integration feature",
        start: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          13,
          0
        ),
        end: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          17,
          0
        ),
        type: "development",
        attendees: [3],
        location: "Dev Area",
        color: "#10B981",
      },
    ];
    setEvents(sampleEvents);
  }, []);

  const getEventsForDate = (date) => {
    return events.filter((event) => isSameDay(event.start, date));
  };

  const handleDayDoubleClick = (date) => {
    const startDateTime = new Date(date);
    startDateTime.setHours(9, 0, 0, 0); // Set to 9:00 AM by default

    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(10, 0, 0, 0); // Set to 10:00 AM by default

    setNewEvent({
      title: "",
      description: "",
      start: startDateTime,
      end: endDateTime,
      type: "meeting",
      attendees: [],
      location: "",
      color: "#3B82F6",
    });
    setShowEventModal(true);
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Rent'D Calendar
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Team scheduling and meetings
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-600"
            >
              <span className="text-lg">←</span>
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-3 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-600"
            >
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-inner">
            {["month", "week", "day"].map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  view === viewType
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg shadow-gray-200 dark:shadow-gray-900"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
                }`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setNewEvent({
                title: "",
                description: "",
                start: new Date(),
                end: new Date(new Date().setHours(new Date().getHours() + 1)),
                type: "meeting",
                attendees: [],
                location: "",
                color: "#3B82F6",
              });
              setShowEventModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:scale-105 shadow-lg shadow-green-500/25 flex items-center space-x-2 font-semibold"
          >
            <span className="text-lg">+</span>
            <span>New Event</span>
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={i}
          className="text-center py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
        >
          {formatDate(addDays(startDate, i), "day-short")}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 rounded-t-xl overflow-hidden">
        {days}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const dayEvents = getEventsForDate(cloneDay);

        days.push(
          <div
            key={day.toString()}
            className={`min-h-[140px] p-3 border border-gray-100 dark:border-gray-800 transition-all duration-200 cursor-pointer group ${
              !isSameMonth(day, monthStart)
                ? "bg-gray-50/50 dark:bg-gray-900/50 text-gray-400"
                : isToday(day)
                ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800"
                : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            } ${
              isSameDay(day, selectedDate)
                ? "ring-2 ring-blue-500 ring-opacity-50"
                : ""
            }`}
            onClick={() => setSelectedDate(cloneDay)}
            onDoubleClick={() => handleDayDoubleClick(cloneDay)}
          >
            <div className="flex justify-between items-start mb-2">
              <span
                className={`text-sm font-semibold ${
                  isToday(day)
                    ? "bg-blue-500 text-white px-2 py-1 rounded-full text-xs"
                    : !isSameMonth(day, monthStart)
                    ? "text-gray-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {formatDate(day)}
              </span>
              {dayEvents.length > 0 && (
                <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                  {dayEvents.length}
                </span>
              )}
            </div>

            <div className="space-y-1 max-h-24 overflow-y-auto">
              {dayEvents.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  className="text-xs p-2 rounded-lg text-white truncate cursor-pointer hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-sm border-l-4"
                  style={{
                    backgroundColor: event.color,
                    borderLeftColor: `${event.color}99`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                  }}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="opacity-90 text-xs mt-0.5">
                    {formatDate(event.start, "time")}
                  </div>
                </div>
              ))}
              {dayEvents.length > 4 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center bg-gray-100 dark:bg-gray-700 py-1 rounded">
                  +{dayEvents.length - 4} more
                </div>
              )}
            </div>

            {/* Add event hint on hover */}
            {isSameMonth(day, monthStart) && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2">
                <div className="text-xs text-blue-500 dark:text-blue-400 text-center border border-dashed border-blue-300 dark:border-blue-600 rounded-lg py-1 bg-blue-50/50 dark:bg-blue-900/20">
                  Double-click to add event
                </div>
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return (
      <div className="grid-rows-auto rounded-b-xl overflow-hidden">{rows}</div>
    );
  };

  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      const dayEvents = getEventsForDate(day);

      days.push(
        <div
          key={i}
          className="flex-1 min-h-[700px] border-r border-gray-200 dark:border-gray-700 last:border-r-0 bg-white dark:bg-gray-800"
        >
          <div
            className={`p-4 text-center border-b border-gray-200 dark:border-gray-700 ${
              isToday(day)
                ? "bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800"
                : "bg-gray-50 dark:bg-gray-900"
            }`}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {formatDate(day, "day-short")}
            </div>
            <div
              className={`text-xl font-bold mt-1 ${
                isToday(day)
                  ? "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 w-10 h-10 rounded-full flex items-center justify-center mx-auto"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {formatDate(day)}
            </div>
          </div>

          <div className="p-3 space-y-3">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-xl text-white text-sm cursor-pointer hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg border-l-4"
                style={{
                  backgroundColor: event.color,
                  borderLeftColor: `${event.color}99`,
                }}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="font-bold text-sm mb-1">{event.title}</div>
                <div className="text-xs opacity-90 mb-1">
                  {formatDate(event.start, "time")} -{" "}
                  {formatDate(event.end, "time")}
                </div>
                <div className="text-xs opacity-80">{event.location}</div>
                {event.attendees.length > 0 && (
                  <div className="flex items-center mt-2 space-x-1">
                    {event.attendees.slice(0, 3).map((attendeeId) => {
                      const member = teamMembers.find(
                        (m) => m.id === attendeeId
                      );
                      return member ? (
                        <div
                          key={member.id}
                          className="w-6 h-6 rounded-full text-xs flex items-center justify-center text-white border-2 border-white"
                          style={{ backgroundColor: member.color }}
                          title={member.name}
                        >
                          {member.name.charAt(0)}
                        </div>
                      ) : null;
                    })}
                    {event.attendees.length > 3 && (
                      <div className="text-xs opacity-80 ml-1">
                        +{event.attendees.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {days}
      </div>
    );
  };

  const renderDayView = () => {
    const hours = [];
    const dayEvents = getEventsForDate(currentDate);

    for (let i = 0; i < 24; i++) {
      const hourEvents = dayEvents.filter(
        (event) => new Date(event.start).getHours() === i
      );

      hours.push(
        <div
          key={i}
          className="flex border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="w-24 py-6 pr-4 text-right text-sm text-gray-500 dark:text-gray-400 font-medium">
            {i === 0
              ? "12 AM"
              : i < 12
              ? `${i} AM`
              : i === 12
              ? "12 PM"
              : `${i - 12} PM`}
          </div>
          <div className="flex-1 py-6 relative min-h-[100px] border-l border-gray-200 dark:border-gray-700">
            {hourEvents.map((event) => {
              const startMinutes = new Date(event.start).getMinutes();
              const duration =
                (new Date(event.end).getTime() -
                  new Date(event.start).getTime()) /
                (1000 * 60 * 60);

              return (
                <div
                  key={event.id}
                  className="absolute left-2 right-2 p-4 rounded-xl text-white cursor-pointer hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg border-l-4"
                  style={{
                    backgroundColor: event.color,
                    borderLeftColor: `${event.color}99`,
                    top: `${(startMinutes / 60) * 100}px`,
                    height: `${Math.max(duration * 100, 60)}px`,
                  }}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="font-bold text-sm">{event.title}</div>
                  <div className="text-xs opacity-90 mt-1">
                    {formatDate(event.start, "time")} -{" "}
                    {formatDate(event.end, "time")}
                  </div>
                  <div className="text-xs opacity-80 mt-1">
                    {event.location}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 text-center bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatDate(currentDate, "day-full")}
          </h3>
        </div>
        <div className="max-h-[700px] overflow-y-auto">{hours}</div>
      </div>
    );
  };

  const renderEventModal = () => {
    if (!showEventModal) return null;

    const formatForInput = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedEvent ? "Edit Event" : "Create New Event"}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg transition-all duration-200"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="Enter event description"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formatForInput(newEvent.start)}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        start: new Date(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formatForInput(newEvent.end)}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        end: new Date(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Event Type
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => {
                    const type = eventTypes.find(
                      (t) => t.value === e.target.value
                    );
                    setNewEvent({
                      ...newEvent,
                      type: e.target.value,
                      color: type.color,
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                >
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Attendees
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {teamMembers.map((member) => (
                    <label
                      key={member.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={newEvent.attendees.includes(member.id)}
                        onChange={(e) => {
                          const attendees = e.target.checked
                            ? [...newEvent.attendees, member.id]
                            : newEvent.attendees.filter(
                                (id) => id !== member.id
                              );
                          setNewEvent({ ...newEvent, attendees });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transform scale-125"
                      />
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: member.color }}
                        >
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {member.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {member.role}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Location
                </label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="Enter location"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowEventModal(false)}
                className="px-8 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedEvent) {
                    setEvents(
                      events.map((e) =>
                        e.id === selectedEvent.id ? newEvent : e
                      )
                    );
                  } else {
                    setEvents([...events, { ...newEvent, id: Date.now() }]);
                  }
                  setShowEventModal(false);
                  setSelectedEvent(null);
                }}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25 font-semibold"
              >
                {selectedEvent ? "Update Event" : "Create Event"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEventDetailModal = () => {
    if (!selectedEvent) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
          <div
            className="h-4 rounded-t-2xl"
            style={{ backgroundColor: selectedEvent.color }}
          ></div>
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedEvent.title}
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">
                    🕒
                  </span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Time:
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(selectedEvent.start, "day-full")} •{" "}
                    {formatDate(selectedEvent.start, "time")} -{" "}
                    {formatDate(selectedEvent.end, "time")}
                  </p>
                </div>
              </div>

              {selectedEvent.description && (
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mt-0.5">
                    <span className="text-green-600 dark:text-green-400 text-sm">
                      📝
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Description:
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>
              )}

              {selectedEvent.location && (
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mt-0.5">
                    <span className="text-purple-600 dark:text-purple-400 text-sm">
                      📍
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Location:
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedEvent.location}
                    </p>
                  </div>
                </div>
              )}

              {selectedEvent.attendees.length > 0 && (
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mt-0.5">
                    <span className="text-orange-600 dark:text-orange-400 text-sm">
                      👥
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Attendees:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedEvent.attendees.map((attendeeId) => {
                        const member = teamMembers.find(
                          (m) => m.id === attendeeId
                        );
                        return member ? (
                          <span
                            key={member.id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                            style={{ backgroundColor: member.color }}
                          >
                            {member.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setEvents(events.filter((e) => e.id !== selectedEvent.id));
                  setSelectedEvent(null);
                }}
                className="px-6 py-3 text-red-600 bg-red-100 dark:bg-red-900/20 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-all duration-200 hover:scale-105 font-semibold"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setNewEvent(selectedEvent);
                  setShowEventModal(true);
                  setSelectedEvent(null);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25 font-semibold"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/20 min-h-screen">
      {renderHeader()}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Today's Events",
            count: events.filter((e) => isSameDay(e.start, new Date())).length,
            color: "from-blue-500 to-blue-600",
          },
          {
            label: "This Month",
            count: events.filter((e) => isSameMonth(e.start, currentDate))
              .length,
            color: "from-green-500 to-green-600",
          },
          {
            label: "Total Meetings",
            count: events.filter((e) => e.type === "meeting").length,
            color: "from-purple-500 to-purple-600",
          },
          {
            label: "Team Members",
            count: teamMembers.length,
            color: "from-orange-500 to-orange-600",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div
              className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
            >
              {stat.count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar View */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {view === "month" && (
          <>
            {renderDays()}
            {renderCells()}
          </>
        )}

        {view === "week" && renderWeekView()}

        {view === "day" && renderDayView()}
      </div>

      {renderEventModal()}
      {renderEventDetailModal()}

      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-6 items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Event Types:
        </span>
        {eventTypes.map((type) => (
          <div
            key={type.value}
            className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-xl"
          >
            <div
              className="w-4 h-4 rounded-full shadow-sm"
              style={{ backgroundColor: type.color }}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {type.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
