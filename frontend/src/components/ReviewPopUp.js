import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { reviewAPI } from "../services/api";
import toast from "react-hot-toast";
function ReviewPopUp({ id, setId }) {
  const [review, setReview] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      setReview(null); // Reset review while loading new one
      try {
        const res = await reviewAPI.getReviewById(id);
        console.log(res.data);
        setReview(res.data);
      } catch (error) {
        const message = error.error || "An error occurred";
        toast.error(message);
        setId(0); // Close popup on error
      }
    };
    if (id) {
      fetchReview();
    }
  }, [id]);

  const approveReview = () => {
    alert("Review approved");
    setId(0);
  };
  const rejectReview = () => {
    let reason = prompt("Please provide a reason for rejection:");
    alert(`Review rejected. Reason:\n${reason}`);
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
    alert(`Review forwarded to ${to}`);
    setId(0);
  };

  // If still loading
  if (!review) {
    return (
      <div className="popup-overlay">
        <div className="popup" onClick={(e) => e.stopPropagation()}>
          <h2>Review ID: {id}</h2>
          <p>loading...</p>
          <button onClick={() => setId(0)} className="popup-close">
            Close
          </button>{" "}
        </div>
      </div>
    );
  }
  return (
    <div className="popup-overlay">
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setId(0)} className="popup-close">
          <X size={22} strokeWidth={3} />
        </button>
        <h2>Review #{id}</h2>
        <h3>Elevator #{review.assetId}</h3>
        <h3>{new Date(review.reviewDate).toLocaleDateString("en-GB")}</h3>
        <h3>Details</h3>
        <div>{review.summary}</div>
        <h3>Deficiencies</h3>
        {/* <div>{review.deficiencies}</div> */}
        <h3>Previous reviews</h3>
        {/* Change to another review */}
        {review.asset.reviews.map((item, index) => (
          <div onClick={() => setId(item.reviewId)} key={index}>
            {index + 1}. {item.reviewId} - {new Date(item.reviewDate).toLocaleDateString("en-GB")}
          </div>
        ))}
        <div className="popup-actions">
          <button onClick={approveReview}>Approve</button>
          <button onClick={rejectReview}>Reject</button>
          <button onClick={createReport}>Create report</button>
          <button onClick={addNotes}>Add notes</button>
          <button onClick={forward}>Forward</button>
        </div>
      </div>
    </div>
  );
}

export default ReviewPopUp;
