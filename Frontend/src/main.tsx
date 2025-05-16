import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import AddSongForm from "./components/AddSongForm";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AddSongForm />
  </StrictMode>
);
