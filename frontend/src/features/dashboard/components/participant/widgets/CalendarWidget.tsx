"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from "lucide-react";

interface CalendarWidgetProps {
  highlightDates?: string[]; // Array of YYYY-MM-DD
  assessmentCompletedDates?: string[];
}

export function CalendarWidget({
  highlightDates = [],
  assessmentCompletedDates = [],
}: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Days in month calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  // Convert to Monday-first (0 = Mo, 6 = Su)
  const startingDay = (firstDayOfMonth + 6) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const currentDay = today.getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Build 35 or 42 grid cells
  const calendarCells = [];

  // Previous month trailing days
  for (let i = startingDay - 1; i >= 0; i--) {
    calendarCells.push({
      day: prevMonthTotalDays - i,
      isCurrentMonth: false,
      isToday: false,
      dateString: `${year}-${String(month).padStart(2, "0")}-${String(prevMonthTotalDays - i).padStart(2, "0")}`,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const isToday = isCurrentMonth && d === currentDay;
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      isToday,
      dateString,
    });
  }

  // Next month leading days to complete grid
  const remainingCells = (7 - (calendarCells.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: false,
      isToday: false,
      dateString: `${year}-${String(month + 2).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
    });
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all duration-200 select-none">
      {/* 1. Header: Title + Month/Year + Navigation Buttons */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
              Calendar
            </h3>
            <span className="text-xs font-semibold text-[#728B88] dark:text-[#7D9491]">
              {monthNames[month]} {year}
            </span>
          </div>
        </div>

        {/* Prev / Next Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-xl hover:bg-[#F4F8F7] dark:hover:bg-white/10 text-[#526866] dark:text-[#9FB3B0] transition-colors cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-xl hover:bg-[#F4F8F7] dark:hover:bg-white/10 text-[#526866] dark:text-[#9FB3B0] transition-colors cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Days of the Week Headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {daysOfWeek.map((day) => (
          <span
            key={day}
            className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] py-1"
          >
            {day}
          </span>
        ))}
      </div>

      {/* 3. Day Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarCells.map((cell, idx) => {
          const isHighlighted = highlightDates.includes(cell.dateString);
          const hasAssessment = assessmentCompletedDates.includes(cell.dateString);

          return (
            <div
              key={idx}
              className={`h-8 flex flex-col items-center justify-center rounded-xl text-xs transition-all relative ${
                cell.isToday
                  ? "bg-[#00BFA5] text-[#172B2A] font-black shadow-sm shadow-[#00BFA5]/30 scale-105"
                  : cell.isCurrentMonth
                  ? "text-[#172B2A] dark:text-[#F7FAF9] font-medium hover:bg-[#F4F8F7] dark:hover:bg-white/10 cursor-pointer"
                  : "text-[#B3C4C1] dark:text-[#4A5D5A] font-normal"
              }`}
            >
              <span>{cell.day}</span>
              {/* Event / Milestone indicator dot */}
              {cell.isCurrentMonth && (hasAssessment || isHighlighted) && !cell.isToday && (
                <span className="w-1 h-1 rounded-full bg-[#00B8D4] absolute bottom-1" />
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Active Milestone Footer */}
      <div className="mt-4 pt-3 border-t border-[#E3ECEA] dark:border-white/10 flex items-center justify-between text-[11px]">
        <span className="text-[#728B88] dark:text-[#7D9491] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00BFA5]" />
          Today's Date
        </span>
        <span className="font-bold text-[#008F83] dark:text-[#00BFA5]">
          Academic Cycle 2025–26
        </span>
      </div>
    </div>
  );
}
