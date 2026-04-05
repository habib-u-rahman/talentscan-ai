import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar   from "./components/Navbar";
import Home     from "./pages/Home";
import Screener from "./pages/Screener";
import Chatbot  from "./pages/Chatbot";
import About    from "./pages/About";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-7xl font-extrabold text-slate-200 mb-3">404</h1>
      <p className="text-slate-500 text-lg mb-6">Page not found.</p>
      <Link to="/"
        className="px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold
          hover:bg-brand-500 transition-colors shadow-md shadow-brand-200">
        Go Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/screener" element={<Screener />} />
        <Route path="/chatbot"  element={<Chatbot />} />
        <Route path="/about"    element={<About />} />
        <Route path="*"         element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
