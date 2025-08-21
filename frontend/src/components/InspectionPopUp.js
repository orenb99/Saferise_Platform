import React, { useEffect, useState } from "react";

function InspectionPopUp({ id, close }) {
  const [inspection, setInspection] = useState({});
  return (
    <div className="popup-overlay">
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h2>Inspection ID: {id}</h2>
        <p>This popup appears when created and disappears when destroyed.</p>
        <button onClick={close}>Close</button>
      </div>
    </div>
  );
}

export default InspectionPopUp;
