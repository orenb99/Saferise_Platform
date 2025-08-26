import React, { useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { reviewAPI } from "../services/api";
import toast from "react-hot-toast";
import ReviewPopUp from "../components/ReviewPopUp";
function ReviewPage() {
  // The ID of the open review popup
  const [openReviewId, setOpenReviewId] = useState(0);
  // Data to show
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const { inspector } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Search for reviews
  const searchQuery = async (query) => {
    setLoading(true);
    try {
      const res = await reviewAPI.searchReviews(query);
      console.log(res.data);
      setReviews(res.data);
    } catch (error) {
      const message = error.error || "An error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async (query) => {
    await searchQuery(query);
  };
  useEffect(() => {
    // Initial load of reviews
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
  const mapReviews = () => {
    return reviews.map((review) => (
      <tr
        onClick={() => {
          setOpenReviewId(review.reviewId);
        }}
      >
        <td>{review.reviewId}</td>
        <td>{review.assetId}</td>
        <td>{review.asset.site.addressId}</td>
        <td>{new Date(review.reviewDate).toLocaleDateString("en-GB")}</td>
        <td>
          {review.reviewer.reviewerId}: {review.reviewer.fullName}
        </td>
        <td>{review.reviewerDecision}</td>
      </tr>
    ));
  };
  return (
    <div className="main-container">
      {/* Floating button "+" to add reports */}
      <div className="review-container">
        <div className="form-container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input
                id="query"
                type="text"
                className={`form-input`}
                placeholder="Search for an review"
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
            <button type="submit" className="submit-button" disabled={loading}>
              Search
            </button>
          </form>
        </div>
        <div className="results-container">
          <table>
            <thead>
              <tr>
                <th>Review ID</th>
                <th>Asset ID</th>
                <th>Address ID</th>
                <th>Review Date</th>
                <th>Reviewer</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>{mapReviews()}</tbody>
          </table>
        </div>
      </div>
      {openReviewId ? <ReviewPopUp setId={setOpenReviewId} id={openReviewId} /> : ""}
    </div>
  );
}

export default ReviewPage;
