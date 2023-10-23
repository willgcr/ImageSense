import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LanguageContext } from "/src/lang";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const App = () => {
	const [lang, setLang] = useState (localStorage.getItem ('language') || 'en');
	return (
		<LanguageContext.Provider value={{ lang, setLang }}>
			<BrowserRouter basename="/imagesense">
				<div className="flex flex-col h-screen w-screen items-center justify-center">
					<Navbar/>
					<Routes>
						<Route path="*" element={<NotFound/>}/>
						<Route path="/" element={<Home/>}/>
					</Routes>
					<Footer/>
				</div>
			</BrowserRouter>
		</LanguageContext.Provider>
	);
}

export default App;