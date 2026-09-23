import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store.js'

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else if (savedTheme === "light") {
  document.documentElement.classList.remove("dark");
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDark) {
    document.documentElement.classList.add("dark");
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)