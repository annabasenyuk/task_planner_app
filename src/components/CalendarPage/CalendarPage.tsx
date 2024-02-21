import React, { useState } from "react";
import {
  startOfToday,
  startOfMonth,
  eachDayOfInterval,
  endOfMonth,
  format,
  parse,
  getDay,
  add,
  isEqual as isEqualDate,
  isToday,
} from 'date-fns';
import { TaskTracker } from "../TaskTracker/TaskTracker";
import './CalendarPage.scss';
import iconLeft from '../../styles/icons/left-arrow-black.svg';
import iconRight from '../../styles/icons/right-arrow-black.svg';
import cn from "classnames";

export const CalendarPage = () => {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth =
    startOfMonth(parse(currentMonth + '-01', 'MMM-yyyy-dd', new Date()));
  const firstDayOfWeek = getDay(firstDayCurrentMonth);

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const previousMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  };

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  };

  return (
    <div className="container">
      <section className="calendar">
        <div className="calendar__header">
          <h2 className="calendar__header-title">
            {format(firstDayCurrentMonth, 'MMMM yyyy')}
          </h2>
          <div className="calendar__header-icon">
            <button
              type="button"
              onClick={previousMonth}
              className="button"
            >
              <img
                src={iconLeft}
                alt="iconLeft"
                className="button__icon"
              />
            </button>

            <button
              onClick={nextMonth}
              type="button"
              className="button margin"
            >
              <img
                src={iconRight}
                alt="iconRight"
                className="button__icon"
              />
            </button>
          </div>
        </div>
        <div className="calendar__month">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
        <div className="calendar__table">
          {Array(firstDayOfWeek).fill(null).map((_, index) => (
            <div key={`empty-${index}`}>
              {/* Placeholder for empty cells */}
            </div>
          ))}
          {days.map((day) => (
            <button
              type="button"
              key={day.toString()}
              onClick={() => setSelectedDay(day)}
              className={cn(
                isEqualDate(day, selectedDay)
                && isToday(day) && 'bg-orange',
                isEqualDate(day, selectedDay) &&
                !isToday(day) &&
                'bg-green',
                !isEqualDate(day, selectedDay) && 'bg-white',
                (isEqualDate(day, selectedDay) || isToday(day)) &&
                'font',
                'block'
              )}
            >
              <time dateTime={format(day, 'yyyy-MM-dd')}>
                {format(day, 'd')}
              </time>
            </button>
          ))}
        </div>
      </section>
      <section className="information">
        <h2>
          {' '}
          <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
            {format(selectedDay, 'MMM dd, yyy')}
          </time>
        </h2>
        <TaskTracker
          selectedDay={selectedDay}
        />
      </section>
    </div>
  );
};
