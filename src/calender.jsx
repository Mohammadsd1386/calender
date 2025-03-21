import React, { useState, useEffect, useRef } from "react";
import { format, getDaysInMonth, getMonth, getYear, parse } from "date-fns-jalali";
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

const CalendarContainer = styled(motion.div)`
  position: absolute;
  max-width: ${(props) => (props.responsive ? "100%" : "18rem")};
  width: 100%; 
  margin: 0; 
  padding: 0.75rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: ${(props) => (props.darkMode ? "#2d2d2d" : "#fff")};
  color: ${(props) => (props.darkMode ? "#fff" : "#333")};
  z-index: 100;
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
  &:hover {
    background-color: ${(props) => (props.darkMode ? "#444" : "#ddd")};
  }
`;

const MonthYearText = styled.span`
  font-size: 1rem;
  font-weight: bold;
  margin: 0 -1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.3rem;
  text-align: center;
  font-size: 0.75rem;
`;

const DayCell = styled.div`
  padding: 0.5rem;
  margin-top: 3px;
  cursor: pointer;
  border-radius: 0.25rem;
  background-color: ${(props) =>
    props.isHoverRange
      ? "#d1e7dd" 
      : props.isInRange
      ? "#e2e8f0" 
      : props.selected
      ? "#0B35E0" 
      : "transparent"};
  color: ${(props) => {
    if (props.selected) return "#fff";
    if (props.isHoverRange || props.isInRange) return "#000";
    if (props.darkMode) return "#fff";
    return "#000";
  }};

  &:hover {
    background-color: ${(props) =>
      props.selected ? "#0B35E0" : props.darkMode ? "#444" : "#e2e8f0"};
    color: ${(props) =>
      props.selected ? "#fff" : props.darkMode ? "#fff" : "#000"};
  }
`;

const DateText = styled.div`
  text-align: center;
  margin-top: 0.75rem;
  font-weight: bold;
  color: #3182ce;
  font-size: 0.875rem;
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
  border: 1px solid ${(props) => (props.darkMode ? "#333" : "#ccc")};
  border-radius: 0.4rem;
  background-color: ${(props) => (props.darkMode ? "#2d2d2d" : "#fff")};
  color: ${(props) => (props.darkMode ? "#fff" : "#000")};
  cursor: pointer;
  width: 100%;
  text-align: center;
  font-size: 0.875rem;

  &:focus {
    outline: none;
  }
`;

const PersianCalendar = ({
  darkMode = false,
  value = null,
  onChange = () => {},
  responsive = true,
  animate = false,
  inputStyle = {},
  mode = 'single',
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
  const [calendarPosition, setCalendarPosition] = useState({ top: "100%", bottom: "auto", left: 0 });

  const datePicker = useRef(null);
  const calendarRef = useRef(null);

  const daysInMonth = (month, year) => {
    const date = parse(`${year}-${month + 1}-01`, "yyyy-MM-dd", new Date());
    return getDaysInMonth(date);
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

  const handleDateClick = (day) => {
    const dateString = `${viewingYear}-${viewingMonth + 1}-${day}`;
    const gregorianDate = parse(dateString, "yyyy-MM-dd", new Date());
    const formattedDate = gregorianDate.toISOString();

    if (mode === 'single') {
      setSelectedDay(day);
      setSelectedDate(`${day} ${months[viewingMonth]} ${viewingYear}`);
      onChange(formattedDate);
      setIsCalendarVisible(false);
    } else if (mode === 'range') {
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
    if (mode === 'range' && startDate && !endDate) {
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
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
  ];

  return (
    <div style={{ position: "relative" }}>
      <GlobalStyle />
      <CalendarInput
        ref={datePicker}
        value={mode === 'range' && startDate && endDate ? `${startDate} - ${endDate}` : selectedDate}
        style={inputStyle}
        darkMode={darkMode}
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
            <SelectorButton darkMode={darkMode} onClick={() => changeMonth("prev")}>
              <MdArrowBackIosNew />
            </SelectorButton>

            <MonthYearText onClick={() => setShowYearSelector(true)}>
              {viewingYear}
            </MonthYearText>
            <MonthYearText onClick={() => setShowMonthSelector(true)}>
              {months[viewingMonth]}
            </MonthYearText>

            <SelectorButton darkMode={darkMode} onClick={() => changeMonth("next")}>
              <MdArrowForwardIos />
            </SelectorButton>
          </YearMonthSelector>

          <Grid>
            {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </Grid>

          <Grid>
            {Array.from({ length: daysInMonth(viewingMonth, viewingYear) }).map(
              (_, index) => {
                const day = index + 1;
                const isSelected =
                  mode === 'single'
                    ? day === selectedDay
                    : (startDate &&
                        parse(startDate, "yyyy-MM-dd", new Date()).getDate() === day &&
                        parse(startDate, "yyyy-MM-dd", new Date()).getMonth() === viewingMonth &&
                        parse(startDate, "yyyy-MM-dd", new Date()).getFullYear() === viewingYear) ||
                      (endDate &&
                        parse(endDate, "yyyy-MM-dd", new Date()).getDate() === day &&
                        parse(endDate, "yyyy-MM-dd", new Date()).getMonth() === viewingMonth &&
                        parse(endDate, "yyyy-MM-dd", new Date()).getFullYear() === viewingYear);
                const isInRange = mode === 'range' && isDateInRange(day);
                const isHoverRange = mode === 'range' && isDateInHoverRange(day);

                return (
                  <DayCell
                    darkMode={darkMode}
                    key={day}
                    selected={isSelected}
                    isInRange={isInRange}
                    isHoverRange={isHoverRange}
                    onClick={() => handleDateClick(day)}
                    onMouseEnter={() => handleMouseEnter(day)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {day}
                  </DayCell>
                );
              }
            )}
          </Grid>
        </CalendarContainer>
      )}
    </div>
  );
};

export default PersianCalendar;