# persian-calender

> this pkg to Easy

[![NPM](https://img.shields.io/npm/v/persian-calender.svg)](https://www.npmjs.com/package/persian-calender) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save persian-calender
```

## Usage

```jsx
import React from 'react';
import { PersianCalendar } from 'persian-calender';

const App = () => {
  return (
    <PersianCalendar
      darkMode={false}
      responsive={false} 
      onChange={(date) => console.log(date)} 
      animate={true}
      inputStyle={{ width: '100px', height: '50px' }}
      />
  );
};

export default App;

```

## License

MIT © [Mohammadsd](https://github.com/Mohammadsd)

### توضیحات:
1. **پراپس‌ها**: در اینجا، توضیحات کامل برای هر پراپس آورده شده است. برای هر پراپس، نوع داده، توضیحات و مقدار پیش‌فرض ذکر شده است.
   
2. **مثال استفاده**: بخش استفاده شامل یک نمونه کامل از استفاده از کامپوننت است که با پراپس‌های `value`، `darkMode`، `responsive` و `onChange` مقداردهی شده است.

3. **فارسی‌سازی**: توضیح داده شده که کامپوننت تاریخ‌ها را به طور پیش‌فرض به صورت شمسی نمایش می‌دهد.

4. **آیکون‌ها و شبیه‌سازی‌ها**: قسمت‌های شبیه‌سازی شده برای نصب و استفاده در دو زبان به راحتی قابل فهم است.

امیدوارم این نسخه کامل برای شما مفید باشد. اگر سوال دیگری دارید یا نیاز به اصلاحات بیشتر دارید، خوشحال می‌شوم کمک کنم.
