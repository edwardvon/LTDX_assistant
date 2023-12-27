import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import icon from './assets/icon.png';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <img
        src={icon}
        style={{ width: 64, position: 'fixed', bottom: 0, right: 0, opacity: 0.6 }}
      />
    </div>
  );
}

export default App;
