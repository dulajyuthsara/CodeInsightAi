import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import ReviewView from "../components/ReviewView.jsx";
import HistoryView from "../components/HistoryView.jsx";

export default function DashboardPage() {
  const [activeView, setActiveView] = useState("review");
  const [selectedReview, setSelectedReview] = useState(null);

  const openReview = (review) => {
    setSelectedReview(review);
    setActiveView("review");
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {activeView === "review" && (
          <ReviewView prefill={selectedReview} onClear={() => setSelectedReview(null)} />
        )}
        {activeView === "history" && (
          <HistoryView onOpen={openReview} />
        )}
      </div>
    </div>
  );
}
