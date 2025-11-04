import "./index.css";
import { Routes, Route } from "react-router-dom";
import { FeedbackProvider } from "./store";
import TimelinePage from "./pages/Timeline";
import PostDetailPage from "./pages/PostDetail";

function App() {
  return (
    <FeedbackProvider>
      <Routes>
        <Route path="/" element={<TimelinePage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        {/* Fallback to timeline for any other routes */}
        <Route path="*" element={<TimelinePage />} />
      </Routes>
    </FeedbackProvider>
  );
}

export default App;
