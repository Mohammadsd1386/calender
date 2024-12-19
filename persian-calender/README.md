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
import  PersianCalendar  from 'persian-calender';

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
