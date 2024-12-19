# persian-calender

> The Persian Calendar Package is a powerful and easy-to-use React component for displaying and selecting dates based on the Iranian  calendar system. This package allows seamless integration of the Persian calendar in your React applications with features like month/year navigation, date selection, and dark mode support. این پکیج تقویم فارسی یک کامپوننت قدرتمند و آسان برای استفاده در React است که به شما این امکان را می‌دهد تا تاریخ‌ها را براساس تقویم ایرانی  نمایش داده و انتخاب کنید. این پکیج به‌راحتی در برنامه‌های React شما یکپارچه می‌شود و ویژگی‌هایی مانند ناوبری ماه/سال، انتخاب تاریخ و پشتیبانی از حالت شب را فراهم می‌آورد.

[![NPM](https://img.shields.io/npm/v/persian-calender.svg)](https://www.npmjs.com/package/persian-calender) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save persian-calender
```

## Usage

```jsx
import React from 'react';
import  PersianCalendar  from 'persian-calender';
import 'persian-calender/dist/index.css' // add font

const App = () => {
  return (
    <PersianCalendar
      darkMode={false} //default false
      responsive={false} //default true
      onChange={(date) => console.log(date)} 
      animate={true} //default false 
      inputStyle={{ width: '100px', height: '50px' }} //default no style
      />
  );
};

export default App;

```

## License

MIT © [Mohammadsd](https://github.com/Mohammadsd)
