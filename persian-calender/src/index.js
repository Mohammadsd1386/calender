import React, { useState, useEffect, useRef } from "react";
import { format, getDaysInMonth, getMonth, getYear, parse } from "date-fns-jalali";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import styled from "styled-components";
import { motion } from "framer-motion";

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'IranSans';
    src: url('../dist/IRANSansXFaNum-Medium-Bwk4ZRX1.ttf') 
  };
  
  body {
    font-family: IranSans;
  }
`;

const CalendarContainer = styled(motion.div)`
  position: relative;
  max-width: ${(props) => (props.responsive ? "100%" : "23rem")};
  margin: 2rem auto;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: ${(props) => (props.darkMode ? "#2d2d2d" : "#fff")};
  color: ${(props) => (props.darkMode ? "#fff" : "#333")};
  z-index: 100; 
`;

const YearMonthSelector = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const SelectorButton = styled.button`
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  &:hover {
    background-color: ${(props) => (props.darkMode ? "#444" : "#ddd")};
  }
`;

const MonthYearText = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0 -1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
`;

const DayCell = styled.div`
  padding: 0.75rem;
  margin-top: 5px;
  cursor: pointer;
  border-radius: 0.375rem;
  background-color: ${(props) =>
    props.selected ? "#0B35E0" : "transparent"};
  color: ${(props) => {
    if (props.selected) {
      return "#fff";
    }
    if (props.darkMode) {
      return "#fff";
    }
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
  margin-top: 1rem;
  font-weight: bold;
  color: #3182ce;
`;

const YearSelector = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 200px;
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
  padding: 0.75rem;
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
  height: 200px;
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
  padding: 0.75rem;
  cursor: pointer;
  text-align: center;
  width: 100%;
  background-color: ${(props) => (props.darkMode ? "#333" : "#fff")};
  &:hover {
    background-color: ${(props) => (props.darkMode ? "#444" : "#f0f0f0")};
  }
`;

const CalendarInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${(props) => (props.darkMode ? "#333" : "#ccc")};
  border-radius: 0.5rem;
  background-color: ${(props) => (props.darkMode ? "#2d2d2d" : "#fff")};
  color: ${(props) => (props.darkMode ? "#fff" : "#000")};
  cursor: pointer;
  width: 100%;
  text-align: center;

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
  inputStyle = '',
}) => {
  const gregorianDate = new Date();
  const persianDate = format(gregorianDate, "yyyy/MM/dd");
  const dayOfMonth = persianDate.split("/")[2];

  const [selectedDate, setSelectedDate] = useState(
    value || format(new Date(), "d MMMM yyyy")
  );
  const [viewingYear, setViewingYear] = useState(getYear(new Date()));
  const [viewingMonth, setViewingMonth] = useState(getMonth(new Date()));
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [selectedDay, setSelectedDay] = useState(Number(dayOfMonth));
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState("bottom");

  const months = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
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
    setIsCalendarVisible(false); 
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

  const datePicker = useRef()

  const checkPosition = () => {
    const calendar = datePicker.current;
    const rect = calendar.getBoundingClientRect();
    const screenHeight = window.innerHeight;
    
    if (rect.bottom > screenHeight) {
      setCalendarPosition("top");
    } else {
      setCalendarPosition("bottom");
    }
  };

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
    }
  }, [value]);

  return (
    <div>
      <GlobalStyle /> 
      <CalendarInput
        ref={datePicker}
        value={selectedDate}
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
          responsive={responsive}
          darkMode={darkMode}
          id="calendar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: animate ? 0.3 : 0 }}
          style={{ top: calendarPosition === "top" ? "auto" : "100%", bottom: calendarPosition === "top" ? "100%" : "auto" }}
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
                const isSelected = day === selectedDay;
                return (
                  <DayCell
                    darkMode={darkMode}
                    key={day}
                    selected={isSelected}
                    onClick={() => handleDateClick(day)}
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
