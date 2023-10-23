import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import "./tailwind.css";
import App from "./App";
import "./App.css";

const root = createRoot (document.getElementById('root'));

root.render (
	<React.StrictMode>
		<App/>
	</React.StrictMode>
);