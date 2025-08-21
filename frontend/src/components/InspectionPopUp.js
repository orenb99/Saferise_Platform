import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

function InspectionPopUp({ id, setId }) {
  const [inspection, setInspection] = useState({
    elevatorId: 3021354,
    details: "details",
    deficiencies: "deficiencies",
    previous: [10120, 2450, 7503, 12034, 12035],
  });

  const approveInspection = () => {
    alert("Inspection approved");
    setId(0);
  };
  const rejectInspection = () => {
    let reason = prompt("Please provide a reason for rejection:");
    alert(`Inspection rejected. Reason:\n${reason}`);
    setId(0);
  };
  const createReport = () => {};
  const addNotes = () => {
    let notes = prompt("Please add your notes:");
    alert(`Notes added:\n${notes}`);
    setId(0);
  };
  const forward = () => {
    let to = prompt("Enter name");
    alert(`Inspection forwarded to ${to}`);
    setId(0);
  };

  // If still loading
  if (!inspection) {
    <div className="popup-overlay">
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h2>Inspection ID: {id}</h2>
        <p>loading...</p>
        <button onClick={() => setId(0)} className="popup-close">
          Close
        </button>{" "}
      </div>
    </div>;
  }
  return (
    <div className="popup-overlay">
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setId(0)} className="popup-close">
          <X size={22} strokeWidth={3} />
        </button>
        <h2>Inspection #{id}</h2>
        <h3>Elevator #{inspection.elevatorId}</h3>
        <h3>Details</h3>
        <div>{inspection.details}</div>
        <h3>Deficiencies</h3>
        <div>{inspection.deficiencies}</div>
        <h3>Previous inspections</h3>
        {/* Change to another inspection */}
        {inspection.previous.map((item, index) => (
          <div onClick={() => setId(item)}>
            {index + 1}. {item}
          </div>
        ))}
        <div className="popup-actions">
          <button onClick={approveInspection}>Approve</button>
          <button onClick={rejectInspection}>Reject</button>
          <button onClick={createReport}>Create report</button>
          <button onClick={addNotes}>Add notes</button>
          <button onClick={forward}>Forward</button>
        </div>
      </div>
    </div>
  );
}

export default InspectionPopUp;
