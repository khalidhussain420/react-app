// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
// import reportWebVitals from "./reportWebVitals";
// import { ThemeProvider } from "./context/ThemeContext";
// import "./styles/global.css";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <ThemeProvider>
//       <App />
//     </ThemeProvider>
//   </React.StrictMode>,
//   document.getElementById("root")
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Import styles
import "./index.css"; // General styles
// import "./styles/global.css"; // Global theme-specific styles

// Import context providers
import { ThemeProvider } from "./context/ThemeContext";

const rootElement = document.getElementById("root");

// Ensure the root element exists before rendering
if (!rootElement) {
  console.error(
    "Root element not found. Ensure your index.html has a div with id 'root'."
  );
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// Measure performance
reportWebVitals(console.log); // Pass console.log to view performance metrics in the console
