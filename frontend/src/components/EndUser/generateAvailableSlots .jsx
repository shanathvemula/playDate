import { parse, isWithinInterval, format, addMinutes } from "date-fns";

// Generate available slots
const generateAvailableSlots = (maintenanceSchedule) => {
  const slotDuration = 60; // 1-hour slots
  const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const slotsByDay = {};

  allDays.forEach((day) => {
    const dayStart = parse("00:00", "HH:mm", new Date());
    const dayEnd = parse("23:59", "HH:mm", new Date());
    const daySlots = [];

    let currentTime = dayStart;

    while (currentTime <= dayEnd) {
      const nextTime = addMinutes(currentTime, slotDuration);

      // Check if the slot overlaps with maintenance
      const isAvailable = !maintenanceSchedule.some((schedule) => {
        if (schedule.days.includes(day)) {
          const maintenanceStart = parse(schedule.startTime, "HH:mm", new Date());
          const maintenanceEnd = parse(schedule.endTime, "HH:mm", new Date());
          return isWithinInterval(currentTime, {
            start: maintenanceStart,
            end: maintenanceEnd,
          });
        }
        return false;
      });

      if (isAvailable && nextTime <= dayEnd) {
        daySlots.push({
          start: format(currentTime, "HH:mm"),
          end: format(nextTime, "HH:mm"),
        });
      }

      currentTime = nextTime;
    }

    slotsByDay[day] = daySlots;
  });

  return slotsByDay;
};
