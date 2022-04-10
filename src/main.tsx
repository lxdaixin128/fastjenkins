import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'antd/dist/antd.css';
import 'nprogress/nprogress.css';
createRoot(document.getElementById('root')!).render(<App />);
