import React from "react";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isBetween from "dayjs/plugin/isBetween";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(isToday);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

const CalendarView = ({ savedJobs }) => {
  const events = savedJobs.flatMap((job) => {
    const events = [];
    const companyName = job.companyName || job.companyId?.name || "N/A";

    // 🎯 Randomly pick Red or Blue for each saved job
    const randomColor = Math.random() > 0.5 ? "#4169E1" : "#FF3131";

    if (job.dateSaved) {
      events.push({
        title: `${companyName} Applied`,
        date: dayjs(job.dateSaved).format("YYYY-MM-DD"),
        jobId: job._id,
        type: "applied",
        color: randomColor,
      });
    }

    if (job.applicationDeadline) {
      const deadlineDate = dayjs(job.applicationDeadline, "YYYY-MM-DD");
      events.push({
        title: `${companyName} Deadline`,
        date: deadlineDate.format("YYYY-MM-DD"),
        jobId: job._id,
        type: "deadline",
        color: randomColor,
      });
    }

    return events;
  });

  const generateCalendar = () => {
    const today = dayjs();
    const startOfMonth = today.startOf("month");
    const endOfMonth = today.endOf("month");
    const calendarDays = [];
    let day = startOfMonth.startOf("week");

    while (day.isBefore(endOfMonth.endOf("week"))) {
      calendarDays.push(day.format("YYYY-MM-DD"));
      day = day.add(1, "day");
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {/* Week headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-medium text-sm text-gray-500 ibm-plex-sans-medium"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((date) => {
          const eventsForDay = events.filter((e) => e.date === date);
          const isCurrentMonth = dayjs(date).month() === today.month();
          const isTodayDate = dayjs(date).isToday();

          return (
            <div
              key={date}
              className={`p-2 min-h-[80px] rounded-lg flex flex-col items-start justify-start transition-all
                ${
                  !isCurrentMonth
                    ? "bg-gray-50 text-gray-400"
                    : "bg-white hover:shadow-md"
                }
                ${isTodayDate ? "border-2 border-[#3626A7]" : ""}`}
            >
              <div className="text-sm font-medium mb-1 pixelify-sans-regular">
                {dayjs(date).format("D")}
              </div>

              {eventsForDay.map((event, i) => (
                <div
                  key={i}
                  className="text-xs mb-1 px-2 py-1 rounded-md text-white overflow-hidden whitespace-nowrap overflow-ellipsis dm-sans-medium"
                  style={{ backgroundColor: event.color }}
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="my-8 p-6 rounded-xl bg-white ibm-plex-sans-regular shadow-sm">
     
      {generateCalendar()}
    </div>
  );
};

export default CalendarView;
