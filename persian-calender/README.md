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
import PersianCalendar from 'persian-calender';
import 'persian-calender/dist/index.css'; // Import the font and styles

const App = () => {
  return (
    <PersianCalendar
      darkMode={false} // Enable dark mode
      responsive={true} // Make it responsive
      onChange={(date) => console.log(date)} // Handle date selection
      animate={true} // Enable animations
      inputStyle={{ width: '100px', height: '50px' }} // Custom input styles
      mode="single" // "single" or "range" mode
    />
  );
};

export default App;
```
### تم ها

<img src="./dist/1.png" />
<img src="./dist/2.png" />
<img src="./dist/3.png" />
<img src="./dist/4.png" />
<img src="./dist/5.png" />
<img src="./dist/6.png" />

### جدول پراپس


<table>
  <thead>
    <tr>
      <th>Prop</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>darkMode</code></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
      <td>Enables dark mode for the calendar.</td>
    </tr>
    <tr>
    <tr>
      <td><code>showHolidays</code></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
      <td>show iranian holidays.</td>
    </tr>
    <tr>
      <td><code>theme</code></td>
      <td><code>string</code></td>
      <td><code>default</code></td>
      <td>default | green | red | elegant | galactic</td>
    </tr>
    
    <tr>
      <td><code>value</code></td>
      <td><code>string</code></td>
      <td><code>null</code></td>
      <td>Initial value of the selected date.</td>
    </tr>
    <tr>
      <td><code>onChange</code></td>
      <td><code>function</code></td>
      <td><code>() => {}</code></td>
      <td>Callback function triggered when a date is selected.</td>
    </tr>
    <tr>
      <td><code>responsive</code></td>
      <td><code>boolean</code></td>
      <td><code>true</code></td>
      <td>Makes the calendar responsive to screen size.</td>
    </tr>
    <tr>
      <td><code>animate</code></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
      <td>Enables fade-in/out animations for the calendar popup.</td>
    </tr>
    <tr>
      <td><code>inputStyle</code></td>
      <td><code>object</code></td>
      <td><code>{}</code></td>
      <td>Custom styles for the input field.</td>
    </tr>
    <tr>
      <td><code>mode</code></td>
      <td><code>string</code></td>
      <td><code>'single'</code></td>
      <td>Selection mode: <code>'single'</code> for single date, <code>'range'</code> for date range.</td>
    </tr>
  </tbody>
</table>
## License

MIT © [Mohammadsd](https://github.com/Mohammadsd1386)

---
