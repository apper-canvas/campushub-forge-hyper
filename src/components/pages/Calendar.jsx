import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, addMonths, subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { calendarService } from "@/services/api/calendarService";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("month");

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await calendarService.getAll();
      setEvents(data);
    } catch (err) {
      console.error("Error loading calendar events:", err);
      setError("Failed to load calendar events. Please try again.");
      toast.error("Failed to load calendar events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(parseISO(event.date), date));
  };

  const getEventTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "exam":
        return "error";
      case "assignment":
        return "warning";
      case "deadline":
        return "warning";
      case "holiday":
        return "success";
      case "event":
        return "primary";
      default:
        return "info";
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "exam":
        return "ClipboardCheck";
      case "assignment":
        return "FileText";
      case "deadline":
        return "Clock";
      case "holiday":
        return "Calendar";
      case "event":
        return "Star";
      default:
        return "Bell";
    }
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadEvents} />;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Academic Calendar</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with important academic dates and events
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant={viewMode === "month" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("month")}
          >
            Month
          </Button>
          <Button 
            variant={viewMode === "list" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            List
          </Button>
        </div>
      </div>

      {viewMode === "month" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
                    <span>{format(currentMonth, "MMMM yyyy")}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    >
                      <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    >
                      <ApperIcon name="ChevronRight" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {/* Day Headers */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="text-center font-semibold text-gray-700 py-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar Days */}
                  {daysInMonth.map(date => {
                    const dayEvents = getEventsForDate(date);
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, new Date());
                    
                    return (
                      <div
                        key={date.toISOString()}
                        className={`
                          min-h-24 p-2 border rounded-lg cursor-pointer transition-all duration-200
                          ${isSelected ? "bg-primary text-white border-primary" : "bg-white border-gray-200 hover:border-gray-300"}
                          ${isToday && !isSelected ? "bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20" : ""}
                        `}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className={`text-sm font-medium mb-1 ${isSelected ? "text-white" : isToday ? "text-primary font-bold" : "text-gray-900"}`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map(event => (
                            <div
                              key={event.Id}
                              className={`text-xs px-1 py-0.5 rounded truncate ${
                                isSelected 
                                  ? "bg-white/20 text-white" 
                                  : `bg-${getEventTypeColor(event.type)}/10 text-${getEventTypeColor(event.type)}`
                              }`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className={`text-xs ${isSelected ? "text-white" : "text-gray-500"}`}>
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Events */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {format(selectedDate, "EEEE, MMMM dd")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateEvents.length === 0 ? (
                    <p className="text-gray-500 text-sm">No events scheduled</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateEvents.map(event => (
                        <div key={event.Id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`p-2 rounded-lg bg-${getEventTypeColor(event.type)}/10`}>
                            <ApperIcon 
                              name={getEventTypeIcon(event.type)}
                              className={`w-4 h-4 text-${getEventTypeColor(event.type)}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{event.time}</p>
                            {event.location && (
                              <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                            )}
                            <Badge variant={getEventTypeColor(event.type)} size="sm" className="mt-2">
                              {event.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Clock" className="w-5 h-5 text-accent" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length === 0 ? (
                  <p className="text-gray-500 text-sm">No upcoming events</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map(event => (
                      <div key={event.Id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-lg bg-${getEventTypeColor(event.type)}/10`}>
                          <ApperIcon 
                            name={getEventTypeIcon(event.type)}
                            className={`w-4 h-4 text-${getEventTypeColor(event.type)}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{event.title}</h4>
                          <p className="text-xs text-gray-600">
                            {format(new Date(event.date), "MMM dd")} • {event.time}
                          </p>
                        </div>
                        <Badge variant={getEventTypeColor(event.type)} size="sm">
                          {event.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="List" className="w-5 h-5 text-primary" />
                  <span>All Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <Empty
                    title="No events scheduled"
                    message="No academic events are currently scheduled."
                    icon="Calendar"
                  />
                ) : (
                  <div className="space-y-4">
                    {events
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map(event => (
                        <div key={event.Id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className={`p-3 rounded-lg bg-${getEventTypeColor(event.type)}/10 flex-shrink-0`}>
                            <ApperIcon 
                              name={getEventTypeIcon(event.type)}
                              className={`w-5 h-5 text-${getEventTypeColor(event.type)}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">{event.title}</h3>
                              <Badge variant={getEventTypeColor(event.type)}>
                                {event.type}
                              </Badge>
                            </div>
                            {event.description && (
                              <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <ApperIcon name="Calendar" className="w-4 h-4" />
                                <span>{format(new Date(event.date), "EEEE, MMMM dd, yyyy")}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ApperIcon name="Clock" className="w-4 h-4" />
                                <span>{event.time}</span>
                              </div>
                              {event.location && (
                                <div className="flex items-center space-x-1">
                                  <ApperIcon name="MapPin" className="w-4 h-4" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Event Types Legend */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Info" className="w-5 h-5 text-info" />
                  <span>Event Types</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: "exam", label: "Examinations", description: "Tests and quizzes" },
                    { type: "assignment", label: "Assignments", description: "Due dates and submissions" },
                    { type: "deadline", label: "Deadlines", description: "Important deadlines" },
                    { type: "holiday", label: "Holidays", description: "College holidays" },
                    { type: "event", label: "Events", description: "Special events and activities" }
                  ].map(item => (
                    <div key={item.type} className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-${getEventTypeColor(item.type)}/10`}>
                        <ApperIcon 
                          name={getEventTypeIcon(item.type)}
                          className={`w-4 h-4 text-${getEventTypeColor(item.type)}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;