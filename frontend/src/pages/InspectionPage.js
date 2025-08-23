import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import InspectionPopUp from "../components/InspectionPopUp";
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

  const onSubmit = (data) => {
    // setInspections(data);
  };

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
    const statuses = ["ok", "minor deficiency", "major deficiency", "shutdown"];
    return statuses.map((value, index) => (
      <div className="checkbox">
        <input
          id={value}
          value={index}
          type="checkbox"
          className={"form-input"}
          {...register("status")}
        />
        <label htmlFor={value} className="form-label">
          {capitalize(value)}
        </label>
      </div>
    ));
  };
  // Map the data
  const mapInspections = () => {
    return inspections.map((item) => (
      <tr className={`inspection-entity type${item.type}`}>
        {Object.values(item).map((value) => (
          <td>{value}</td>
        ))}
        <td
          onClick={() => {
            setOpenInspectionId(item.id);
          }}
        >
          open
        </td>
      </tr>
    ));
  };
  return (
    <div className="main-container">
      <Header logout={logout} />
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
                  {...register("from-date")}
                />
              </div>
              <div className="form-group">
                <label htmlFor="to-date" className="form-label">
                  to
                </label>
                <input id="to-date" type="date" className={`form-input`} {...register("to-date")} />
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
              <div className="form-label">Status</div>
              <div className="form-row">{showStatuses()}</div>
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
