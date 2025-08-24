import React, { useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import InspectionPopUp from "../components/InspectionPopUp";
import { reviewAPI } from "../services/api";
import toast from "react-hot-toast";
function InspectionPage() {
  // The ID of the open inspection popup
  const [openInspectionId, setOpenInspectionId] = useState(0);
  // Data to show
  const [inspections, setInspections] = useState([]);
  const { inspector, logout } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Search for inspections
  const searchQuery = async (query) => {
    console.log("Searching with query:", query);
    try {
      const res = await reviewAPI.searchReviews(query);
      setInspections(res.data);
    } catch (error) {
      const message = error.error || "An error occurred";
      toast.error(message);
    }
  };
  const onSubmit = async (query) => {
    await searchQuery(query);
  };
  useEffect(() => {
    // Initial load of inspections
    searchQuery({});
  }, []);

  if (!inspector) {
    return (
      <div className="container">
        <div className="loading">Loading alerts</div>
      </div>
    );
  }
  // Capitalize word
  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // List the location options
  const showLocations = () => {
    const locations = ["north", "center", "south"];
    return locations.map((value) => <option value={value}>{capitalize(value)}</option>);
  };
  // List the status checkboxes
  const showStatuses = () => {
    const statuses = ["Operatable", "Disable"];
    return statuses.map((value, index) => (
      <div className="checkbox" key={"cs" + index}>
        <input id={value} value={value} type="checkbox" {...register("decision")} />
        <label htmlFor={value} className="form-label">
          {value}
        </label>
      </div>
    ));
  };
  const showReasons = () => {
    const reasons = [
      "Routine Check",
      "First Check",
      "Post Fix Check",
      "Post Recall",
      "Elevation",
      "Drastic Change",
    ];
    return reasons.map((value, index) => (
      <div className="checkbox" key={"cr" + index}>
        <input id={value} value={value.replace(/ /g, "")} type="checkbox" {...register("reason")} />
        <label htmlFor={value} className="form-label">
          {value}
        </label>
      </div>
    ));
  };

  // Map the data
  const mapInspections = () => {
    return inspections.map((inspection) => (
      <tr>
        <td
          onClick={() => {
            setOpenInspectionId(inspection.reviewId);
          }}
        >
          {inspection.reviewId}
        </td>
      </tr>
    ));
  };
  return (
    <div className="main-container">
      {/* Floating button "+" to add reports */}
      <div className="inspection-container">
        <div className="form-container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input
                id="query"
                type="text"
                className={`form-input`}
                placeholder="Search for an inspection"
                {...register("query")}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="from-date" className="form-label">
                  From
                </label>
                <input
                  id="from-date"
                  type="date"
                  className={`form-input`}
                  {...register("fromDate")}
                />
              </div>
              <div className="form-group">
                <label htmlFor="to-date" className="form-label">
                  to
                </label>
                <input id="to-date" type="date" className={`form-input`} {...register("toDate")} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Geographical location
              </label>
              <select id="location" className={`form-input`} {...register("location")}>
                {showLocations()}
              </select>
            </div>
            <div className="form-group">
              <div className="form-label">Decision</div>
              <div className="form-row">{showStatuses()}</div>
            </div>
            <div className="form-group">
              <div className="form-label">Reason</div>
              <div className="form-row">{showReasons()}</div>
            </div>
            <button type="submit" className="submit-button">
              Search
            </button>
          </form>
        </div>
        <div className="results-container">
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>name</th>
                <th>type</th>
                <th>date</th>
                <th>inspector</th>
                <th>status</th>
                <th>link</th>
              </tr>
            </thead>
            <tbody>{mapInspections()}</tbody>
          </table>
          {/* {JSON.stringify(inspections)} */}
        </div>
      </div>
      {openInspectionId ? (
        <InspectionPopUp setId={setOpenInspectionId} id={openInspectionId} />
      ) : (
        ""
      )}
    </div>
  );
}

export default InspectionPage;
