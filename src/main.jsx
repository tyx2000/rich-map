import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import TopLayer from "./components/toplayer/toplayer.jsx";
// import SharedProsemirror from "./components/prosemirror/sharedprosemirror.jsx";
import Slatejs from "./components/slatejs/slatejs.jsx";
import Leaflet from "./components/leaflet/leaflet.jsx";
import CollaborativeEditorWrapper from "./components/slatejs/collborativeEditor.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<TopLayer />}>
        {/* <Route index element={<SharedProsemirror />} /> */}
        <Route index element={<Slatejs />} />
        <Route
          path="collaborativeSlatejs"
          element={<CollaborativeEditorWrapper />}
        />

        <Route path="leaflet" element={<Leaflet />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
