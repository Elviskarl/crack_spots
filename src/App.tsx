import { HashRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Map from "./pages/map/Map";
import About from "./pages/about/About";
import NotFound from "./components/error/NotFound";
import Documentation from "./pages/documentation/Documentation";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="map" element={<Map />} />
          <Route path="about" element={<About />} />
          <Route path="api" element={<Documentation />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
