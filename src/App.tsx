import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Map from "./pages/map/Map";
import About from "./pages/about/About";
import NotFound from "./components/error/NotFound";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Navbar />}>
      <Route index element={<Home />} />
      <Route path="map" element={<Map />} />
      <Route path="about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  ), { basename: "/crack_spots"}
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
