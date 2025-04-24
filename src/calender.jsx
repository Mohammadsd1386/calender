import React, { useState, useEffect, useRef } from "react";
import { format, getDaysInMonth, getMonth, getYear, parse, startOfMonth, getDay } from "date-fns-jalali";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import styled from "styled-components";
import { motion } from "framer-motion";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'IranSans';
    src: url('../src/assets/IRANSansXFaNum-Medium.ttf');
  }
  
  body {
    font-family: IranSans;
  }
`;

const themes = {
  default: {
    background: "#ffffff",
    text: "#333333",
    selected: "#0B35E0",
    selectedText: "#ffffff",
    hoverRange: "#d1e7dd",
    inRange: "#e2e8f0",
    holiday: "rgba(255, 0, 0, 0.2)",
    holidayText: "#d32f2f",
    hover: "#e2e8f0",
    hoverText: "#333333",
    border: "1px solid #cccccc",
  },
  galactic: {
    background: "linear-gradient(135deg, #1e1e2f 0%, #2e2e4f 100%)",
    text: "#d0d0ff",
    selected: "#ff00ff",
    selectedText: "#ffffff",
    hoverRange: "#3b3b6d",
    inRange: "#4a4a8f",
    holiday: "rgba(255, 68, 68, 0.3)",
    holidayText: "#ff6666",
    hover: "#3b3b6d",
    hoverText: "#e0e0ff",
    border: "1px solid #4444aa",
  },
  elegant: {
    background: "#f9f9f9",
    text: "#555555",
    selected: "#6200ea",
    selectedText: "#ffffff",
    hoverRange: "#ede7f6",
    inRange: "#e8eaf6",
    holiday: "rgba(216, 27, 96, 0.2)",
    holidayText: "#d81b60",
    hover: "#e0e0e0",
    hoverText: "#555555",
    border: "1px solid #e0e0e0",
  },
  red: {
    background: "#ffebee",
    text: "#c62828",
    selected: "#d32f2f",
    selectedText: "#ffffff",
    hoverRange: "#ffcdd2",
    inRange: "#ef9a9a",
    holiday: "rgba(183, 28, 28, 0.3)",
    holidayText: "#b71c1c",
    hover: "#ef5350",
    hoverText: "#ffffff",
    border: "1px solid #ef5350",
  },
  green: {
    background: "#e8f5e9",
    text: "#2e7d32",
    selected: "#388e3c",
    selectedText: "#ffffff",
    hoverRange: "#c8e6c9",
    inRange: "#a5d6a7",
    holiday: "rgba(211, 47, 47, 0.2)",
    holidayText: "#d32f2f",
    hover: "#81c784",
    hoverText: "#ffffff",
    border: "1px solid #66bb6a",
  },
};

const CalendarContainer = styled(motion.div)`
  position: absolute;
  max-width: ${(props) => (props.responsive ? "100%" : "18rem")};
  width: 100%;
  margin: 0;
  padding: 0.75rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: ${(props) =>
    props.darkMode ? "#2d2d2d" : props.theme.background};
  color: ${(props) => (props.darkMode ? "#fff" : props.theme.text)};
  z-index: 100;
  left: 0;
`;

const YearMonthSelector = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  cursor: pointer;
`;

const SelectorButton = styled.button`
  font-size: 1.2rem;
  padding: 0.3rem;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: ${(props) => (props.darkMode ? "#fff" : props.theme.text)};
  &:hover {
    background-color: ${(props) => (props.darkMode ? "#444" : props.theme.hover)};
    color: ${(props) => (props.darkMode ? "#fff" : props.theme.hoverText)};
  }
`;

const MonthYearText = styled.span`
  font-size: 1rem;
  font-weight: bold;
  margin: 0 -1rem;
  color: ${(props) => (props.darkMode ? "#fff" : props.theme.text)};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.3rem;
  text-align: center;
  font-size: 0.75rem;
`;

const DayCell = styled.div`
  position: relative;
  padding: 0.5rem;
  margin-top: 3px;
  cursor: pointer;
  border-radius: 0.25rem;
  background-color: ${(props) =>
    props.isHoliday && props.showHolidays
      ? props.theme.holiday
      : props.isHoverRange
      ? props.theme.hoverRange
      : props.isInRange
      ? props.theme.inRange
      : props.selected
      ? props.theme.selected
      : "transparent"};
  color: ${(props) => {
    if (props.isHoliday && props.showHolidays) return props.theme.holidayText;
    if (props.selected) return props.theme.selectedText;
    if (props.isHoverRange || props.isInRange) return "#000";
    if (props.darkMode) return "#fff";
    return props.theme.text;
  }};

  &:hover {
    background-color: ${(props) =>
      props.selected
        ? props.theme.selected
        : props.isHoliday && props.showHolidays
        ? props.theme.holiday
        : props.darkMode
        ? "#444"
        : props.theme.hover};
    color: ${(props) =>
      props.selected
        ? props.theme.selectedText
        : props.isHoliday && props.showHolidays
        ? props.theme.holidayText
        : props.darkMode
        ? "#fff"
        : props.theme.hoverText};
  }

  &:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = styled.div`
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: -2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 0.3rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 10;
  transition: opacity 0.2s ease-in-out;
`;

const YearSelector = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 150px;
  width: 80%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
`;

const YearOption = styled.div`
  padding: 0.5rem;
  cursor: pointer;
  text-align: center;
  width: 100%;
  background-color: ${(props) => (props.darkMode ? "#333" : "#fff")};
  &:hover {
    background-color: ${(props) => (props.darkMode ? "#444" : "#f0f0f0")};
  }
`;

const MonthSelector = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 150px;
  width: 80%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
`;

const MonthOption = styled.div`
  padding: 0.5rem;
  cursor: pointer;
  text-align: center;
  width: 100%;
  background-color: ${(props) => (props.darkMode ? "#333" : "#fff")};
  &:hover {
    background-color: ${(props) => (props.darkMode ? "#444" : "#f0f0f0")};
  }
`;

const CalendarInput = styled.input`
  padding: 0.4rem;
  border: ${(props) => (props.darkMode ? "1px solid #333" : props.theme.border)};
  border-radius: 0.4rem;
  background-color: ${(props) => (props.darkMode ? "#2d2d2d" : "#fff")};
  color: ${(props) => (props.darkMode ? "#fff" : props.theme.text)};
  cursor: pointer;
  width: 100%;
  text-align: center;
  font-size: 0.875rem;

  &:focus {
    outline: none;
  }
`;

const holidays = [
  { date: "1-1", reason: "نوروز" },
  { date: "1-2", reason: "نوروز" },
  { date: "1-3", reason: "نوروز" },
  { date: "1-4", reason: "نوروز" },
  { date: "1-8", reason: "روز جهانی قدس" },
  { date: "1-11", reason: "عید سعید فطر" },
  { date: "1-12", reason: "روز جمهوری اسلامی" },
  { date: "1-13", reason: "روز طبیعت (سیزده‌به‌در)" },
  { date: "2-4", reason: "شهادت امام جعفر" },
  { date: "3-14", reason: "رحلت امام خمینی" },
  { date: "3-15", reason: "قیام ۱۵ خرداد" },
  { date: "3-16", reason: "عید سعید فطر" },
  { date: "3-24", reason: "عید سعید غدیر" },
  { date: "4-14", reason: "تاسوعا حسینی" },
  { date: "4-15", reason: "عاشورا حسینی" },
  { date: "5-23", reason: "اربعین" },
  { date: "5-31", reason: "رحلت رسول اکرم" },
  { date: "6-2", reason: "شهادت امام رضا" },
  { date: "6-19", reason: "ولادت حضرت رسول" },
  { date: "8-3", reason: "شهادت حضرت فاطمه" },
  { date: "9-13", reason: "ولادت حضرت علی" },
  { date: "9-27", reason: "مبعث رسول اکرم" },
  { date: "10-15", reason: "ولادت حضرت مهدی" },
  { date: "11-22", reason: "پیروزی انقلاب اسلامی" },
  { date: "12-20", reason: "شهادت امام علی" },
  { date: "12-29", reason: "روز ملی شدن صنعت نفت" },
];

const PersianCalendar = ({
  darkMode = false,
  value = null,
  onChange = () => {},
  responsive = true,
  animate = false,
  inputStyle = {},
  mode = "single",
  showHolidays = false,
  theme = "default",
}) => {
  const gregorianDate = new Date();
  const persianDate = format(gregorianDate, "yyyy/MM/dd");
  const dayOfMonth = persianDate.split("/")[2];

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    value || format(new Date(), "d MMMM yyyy")
  );
  const [viewingYear, setViewingYear] = useState(getYear(new Date()));
  const [viewingMonth, setViewingMonth] = useState(getMonth(new Date()));
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [selectedDay, setSelectedDay] = useState(Number(dayOfMonth));
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({
    top: "100%",
    bottom: "auto",
    left: 0,
  });

  const datePicker = useRef(null);
  const calendarRef = useRef(null);

  const isLeapYear = (year) => {
    const cycle = (year - 1379) % 33;
    return [1, 5, 9, 13, 17, 21, 25, 29].includes(cycle);
  };

  const daysInMonth = (month, year) => {
    if (month < 6) return 31; 
    if (month < 11) return 30; 
    return isLeapYear(year) ? 30 : 29; 
  };

  const getFirstDayOfMonth = (month, year) => {
    const date = parse(`${year}-${month + 1}-01`, "yyyy-MM-dd", new Date());
    const dayOfWeek = getDay(date);
    return (dayOfWeek + 1) % 7;
  };

  const isDateInRange = (day) => {
    if (!startDate || !endDate) return false;

    const currentDate = parse(
      `${viewingYear}-${viewingMonth + 1}-${day}`,
      "yyyy-MM-dd",
      new Date()
    );
    const start = parse(startDate, "yyyy-MM-dd", new Date());
    const end = parse(endDate, "yyyy-MM-dd", new Date());

    return currentDate >= start && currentDate <= end;
  };

  const isDateInHoverRange = (day) => {
    if (!startDate || !hoverDate || endDate) return false;

    const currentDate = parse(
      `${viewingYear}-${viewingMonth + 1}-${day}`,
      "yyyy-MM-dd",
      new Date()
    );
    const start = parse(startDate, "yyyy-MM-dd", new Date());
    const hover = parse(hoverDate, "yyyy-MM-dd", new Date());

    const minDate = start < hover ? start : hover;
    const maxDate = start < hover ? hover : start;

    return currentDate >= minDate && currentDate <= maxDate;
  };

  const isHoliday = (day) => {
    const dateString = `${viewingMonth + 1}-${day}`;
    return holidays.find((holiday) => holiday.date === dateString);
  };

  const handleDateClick = (day) => {
    const dateString = `${viewingYear}-${viewingMonth + 1}-${day}`;
    const gregorianDate = parse(dateString, "yyyy-MM-dd", new Date());
    const formattedDate = gregorianDate.toISOString();

    if (mode === "single") {
      setSelectedDay(day);
      setSelectedDate(`${day} ${months[viewingMonth]} ${viewingYear}`);
      onChange(formattedDate);
      setIsCalendarVisible(false);
    } else if (mode === "range") {
      if (!startDate || (startDate && endDate)) {
        setStartDate(dateString);
        setEndDate(null);
        setSelectedDate(`${day} ${months[viewingMonth]} ${viewingYear}`);
      } else if (startDate && !endDate) {
        const start = parse(startDate, "yyyy-MM-dd", new Date());
        const current = parse(dateString, "yyyy-MM-dd", new Date());

        if (current < start) {
          setStartDate(dateString);
          setEndDate(startDate);
          onChange({
            start: formattedDate,
            end: parse(startDate, "yyyy-MM-dd", new Date()).toISOString(),
          });
        } else {
          setEndDate(dateString);
          onChange({
            start: parse(startDate, "yyyy-MM-dd", new Date()).toISOString(),
            end: formattedDate,
          });
        }
        setIsCalendarVisible(false);
      }
    }
  };

  const handleMouseEnter = (day) => {
    if (mode === "range" && startDate && !endDate) {
      setHoverDate(`${viewingYear}-${viewingMonth + 1}-${day}`);
    }
  };

  const handleMouseLeave = () => {
    setHoverDate(null);
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

  const checkPosition = () => {
    if (datePicker.current) {
      const rect = datePicker.current.getBoundingClientRect();
      const screenHeight = window.innerHeight;
      const screenWidth = window.innerWidth;

      let position = { top: "100%", bottom: "auto", left: 0 };
      if (rect.bottom + 250 > screenHeight) {
        position.top = "auto";
        position.bottom = "100%";
      }

      if (rect.left < 0) {
        position.left = -rect.left;
      } else if (rect.right > screenWidth) {
        position.left = screenWidth - rect.right;
      }

      setCalendarPosition(position);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePicker.current &&
        calendarRef.current &&
        !datePicker.current.contains(event.target) &&
        !calendarRef.current.contains(event.target)
      ) {
        setIsCalendarVisible(false);
      }
    };

    if (isCalendarVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarVisible]);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
    }
  }, [value]);

  const months = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  const selectedTheme = themes[theme] || themes.default;

  const firstDayOfMonth = getFirstDayOfMonth(viewingMonth, viewingYear);
  const daysInCurrentMonth = daysInMonth(viewingMonth, viewingYear);

  return (
    <div dir="rtl" style={{ position: "relative" }}>
      <GlobalStyle />
      <CalendarInput
        ref={datePicker}
        value={
          mode === "range" && startDate && endDate
            ? `${startDate} - ${endDate}`
            : selectedDate
        }
        style={inputStyle}
        darkMode={darkMode}
        theme={selectedTheme}
        onClick={() => {
          setIsCalendarVisible(true);
          checkPosition();
        }}
        readOnly
      />

      {isCalendarVisible && (
        <CalendarContainer
          ref={calendarRef}
          responsive={responsive}
          darkMode={darkMode}
          theme={selectedTheme}
          id="calendar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: animate ? 0.3 : 0 }}
          style={{
            top: calendarPosition.top,
            bottom: calendarPosition.bottom,
            left: calendarPosition.left,
          }}
        >
          {showYearSelector && (
            <YearSelector>
              {years.map((year) => (
                <YearOption
                  key={year}
                  darkMode={darkMode}
                  onClick={() => {
                    setViewingYear(year);
                    setShowYearSelector(false);
                  }}
                >
                  {year}
                </YearOption>
              ))}
            </YearSelector>
          )}

          {showMonthSelector && (
            <MonthSelector>
              {months.map((month, index) => (
                <MonthOption
                  key={month}
                  darkMode={darkMode}
                  onClick={() => {
                    setViewingMonth(index);
                    setShowMonthSelector(false);
                  }}
                >
                  {month}
                </MonthOption>
              ))}
            </MonthSelector>
          )}

          <YearMonthSelector>
            <SelectorButton
              darkMode={darkMode}
              theme={selectedTheme}
              onClick={() => changeMonth("prev")}
            >
              <MdArrowForwardIos />
            </SelectorButton>

            <MonthYearText
              darkMode={darkMode}
              theme={selectedTheme}
              onClick={() => setShowYearSelector(true)}
            >
              {viewingYear}
            </MonthYearText>
            <MonthYearText
              darkMode={darkMode}
              theme={selectedTheme}
              onClick={() => setShowMonthSelector(true)}
            >
              {months[viewingMonth]}
            </MonthYearText>

            <SelectorButton
              darkMode={darkMode}
              theme={selectedTheme}
              onClick={() => changeMonth("next")}
            >
              <MdArrowBackIosNew />
            </SelectorButton>
          </YearMonthSelector>

          <Grid>
            {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </Grid>

          <Grid>
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <DayCell key={`empty-${index}`} style={{ visibility: "hidden" }} />
            ))}

            {Array.from({ length: daysInCurrentMonth }).map((_, index) => {
              const day = index + 1;
              const isSelected =
                mode === "single"
                  ? day === selectedDay
                  : (startDate &&
                      parse(startDate, "yyyy-MM-dd", new Date()).getDate() ===
                        day &&
                      parse(startDate, "yyyy-MM-dd", new Date()).getMonth() ===
                        viewingMonth &&
                      parse(
                        startDate,
                        "yyyy-MM-dd",
                        new Date()
                      ).getFullYear() === viewingYear) ||
                    (endDate &&
                      parse(endDate, "yyyy-MM-dd", new Date()).getDate() ===
                        day &&
                      parse(endDate, "yyyy-MM-dd", new Date()).getMonth() ===
                        viewingMonth &&
                      parse(endDate, "yyyy-MM-dd", new Date()).getFullYear() ===
                        viewingYear);
              const isInRange = mode === "range" && isDateInRange(day);
              const isHoverRange = mode === "range" && isDateInHoverRange(day);
              const holiday = isHoliday(day);

              return (
                <DayCell
                  darkMode={darkMode}
                  theme={selectedTheme}
                  key={day}
                  selected={isSelected}
                  isInRange={isInRange}
                  isHoverRange={isHoverRange}
                  isHoliday={!!holiday}
                  showHolidays={showHolidays}
                  onClick={() => handleDateClick(day)}
                  onMouseEnter={() => handleMouseEnter(day)}
                  onMouseLeave={handleMouseLeave}
                >
                  {holiday && showHolidays && (
                    <Tooltip className="tooltip">{holiday.reason}</Tooltip>
                  )}
                  {day}
                </DayCell>
              );
            })}
          </Grid>
        </CalendarContainer>
      )}
    </div>
  );
};

export default PersianCalendar;