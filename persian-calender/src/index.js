import React, { useState, useEffect } from "react";
import { format, getDaysInMonth, getMonth, getYear, parse } from "date-fns-jalali";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import '../src/style.css'
const PersianCalendar = ({
  darkMode = false, 
  value = null, 
  onChange = () => {}, 
  responsive = true, 
}) => {
  const [selectedDate, setSelectedDate] = useState(value);
  const [viewingYear, setViewingYear] = useState(getYear(new Date())); 
  const [viewingMonth, setViewingMonth] = useState(getMonth(new Date())); 
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const months = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
  ];

  const daysInMonth = (month, year) => {
    const date = parse(`${year}-${month + 1}-01`, "yyyy-MM-dd", new Date());
    return getDaysInMonth(date);
  };

  const handleDateClick = (day) => {
    setSelectedDay(day); 
    const dateString = `${day} ${months[viewingMonth]} ${viewingYear}`;
    setSelectedDate(dateString);

    const gregorianDate = parse(
      `${viewingYear}-${viewingMonth + 1}-${day}`, 
      "yyyy-MM-dd", 
      new Date()
    );
    
    onChange(gregorianDate.toISOString());  
  };

  const years = Array.from({ length: 100 }, (_, i) => viewingYear - 50 + i);

  const changeMonth = (direction) => {
    if (direction === "next") {
      if (viewingMonth === 11) {
        setViewingMonth(0);
        setViewingYear(viewingYear + 1);
      } else {
        setViewingMonth(viewingMonth + 1);
      }
    } else if (direction === "prev") {
      if (viewingMonth === 0) {
        setViewingMonth(11);
        setViewingYear(viewingYear - 1);
      } else {
        setViewingMonth(viewingMonth - 1);
      }
    }
  };

  useEffect(() => {
    if (value) {
      setSelectedDate(value); 
    }
  }, [value]);

  return (
    <div className={`relative ${responsive ? "max-w-full" : "max-w-xs"} mx-auto mt-10 p-4 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      {showYearSelector && (
        <div className="absolute top-0 left-0 right-0 h-full flex justify-center items-center z-10">
          <div className="h-60 w-4/5 overflow-y-auto bg-white border rounded-lg shadow-lg">
            <div className="flex flex-col items-center justify-center">
              {years.map((year) => (
                <div
                  key={year}
                  className="px-4 py-2 w-full cursor-pointer hover:bg-indigo-100 text-center"
                  onClick={() => {
                    setViewingYear(year);
                    setShowYearSelector(false);
                  }}
                >
                  {year}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showMonthSelector && (
        <div className="absolute top-0 left-0 right-0 h-full flex justify-center items-center z-10">
          <div className="h-60 w-4/5 overflow-y-auto bg-white border rounded-lg shadow-lg">
            <div className="flex flex-col items-center justify-center">
              {months.map((month, index) => (
                <div
                  key={month}
                  className="px-4 py-2 w-full cursor-pointer hover:bg-indigo-100 text-center"
                  onClick={() => {
                    setViewingMonth(index);
                    setShowMonthSelector(false);
                  }}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4 cursor-pointer">
        <button
          className="text-xl p-2 hover:bg-gray-200 rounded-full"
          onClick={() => changeMonth("prev")}
        >
          <MdArrowBackIosNew />
        </button>

        <span
          className="text-lg font-semibold mr-[-55px]"
          onClick={() => setShowYearSelector(true)}
        >
          {viewingYear}
        </span>
        <span
          className="text-lg font-semibold"
          onClick={() => setShowMonthSelector(true)}
        >
          {months[viewingMonth]} 
        </span>

        <button
          className="text-xl p-2 hover:bg-gray-200 rounded-full"
          onClick={() => changeMonth("next")}
        >
          <MdArrowForwardIos />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4 text-center text-sm font-semibold">
        {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((day) => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: daysInMonth(viewingMonth, viewingYear) }).map((_, index) => {
          const day = index + 1;
          const isSelected = day === selectedDay;
          return (
            <div
              key={day}
              className={`text-center py-2 cursor-pointer rounded-lg ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-indigo-200'}`}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-4 text-center text-blue-700 font-semibold">
          تاریخ : {selectedDate}
        </div>
      )}
    </div>
  );
};

export default PersianCalendar;
