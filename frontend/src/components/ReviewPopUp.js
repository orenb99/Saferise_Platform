import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { reviewAPI, publicAPI, orderAPI } from "../services/api";
import toast from "react-hot-toast";
import DynamicUpdateField from "./ReviewPopUpComponents.js/DynamicUpdateField";
import DefectsBlock from "./ReviewPopUpComponents.js/DefectsBlock";
function ReviewPopUp({ id, setId }) {
  const [review, setReview] = useState(null);
  // nested objects in review. helps for updating
  const [instructions, setInstructions] = useState([]);
  const [assemblies, setAssemblies] = useState([]);
  const [defects, setDefects] = useState([]);

  const [isFileOpen, setIsFileOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [changed, setChanged] = useState(false);

  // A method for updating nested fields
  const updateField = (field, value) => {
    let newData = { ...review };
    newData[field] = value;
    setReview(newData);
    setChanged(true);
  };

  const saveChanges = async () => {
    const dataToSend = { ...review, defects, assemblies, instructions };
    // To prevent extra clicks and show loading message
    setReview(null);
    try {
      const response = await reviewAPI.updateReviewById(id, dataToSend);
      setReview(response.data);
      setChanged(false);
    } catch (error) {
      const message = error.error || "An error occurred";
      toast.error(message);
    }
  };

  {
    /* creates an order from the review*/
  }
  const createOrder = async () => {
    // Demo data
    const orderData = {
      orderId: "SO003",
      reviewId: id,
      orderNumber: "003",
      orderContent: "Content",
      dueDate: new Date(new Date().getTime() + 1209600000), // 14 days from now
      orderType: "Disable",
    };
    try {
      await orderAPI.createOrder(orderData);
      toast.success("Order created");
    } catch (error) {
      const message = error.error || "An error occurred";
      toast.error(message);
    }
  };

  useEffect(() => {
    const fetchReview = async () => {
      setReview(null); // Reset review while loading new one
      try {
        const res = await reviewAPI.getReviewById(id);
        setReview(res.data);
        setDefects(res.data.defects);
        setAssemblies(res.data.assemblies);
        setInstructions(res.data.instructions);
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

  // If still loading
  if (!review) {
    return (
      <div className="popup-overlay">
        <div className="popup" onClick={(e) => e.stopPropagation()}>
          <h2>Review ID: {id}</h2>
          <p>loading...</p>
          <button onClick={() => setId(0)} className="popup-close">
            Close
          </button>
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
        <h2>Review #{review.reviewId}</h2>
        <h3>Elevator #{review.assetId}</h3>
        <h3>
          <DynamicUpdateField
            onChange={(val) => updateField("reviewDate", val)}
            inputType={"date"}
            value={review.reviewDate}
            editing={editing}
          />
        </h3>
        <h3>Details</h3>
        <h4>Max Passengers</h4>
        <DynamicUpdateField
          onChange={(val) => updateField("maxPassengers", val)}
          inputType={"number"}
          value={review.maxPassengers}
          editing={editing}
        />
        <h4>Max Weight Allowed</h4>
        <DynamicUpdateField
          onChange={(val) => updateField("maxWeightAllowed", val)}
          inputType={"number"}
          value={review.maxWeightAllowed}
          editing={editing}
        />
        kg
        <h3>Summary</h3>
        <div>
          <DynamicUpdateField
            onChange={(val) => updateField("summary", val)}
            inputType={"textarea"}
            value={review.summary}
            editing={editing}
          />
        </div>
        <DefectsBlock
          defects={defects}
          setDefects={setDefects}
          setChanged={() => setChanged(true)}
          editing={editing}
        />
        <h3>Previous reviews</h3>
        {/* Changes to another review */}
        {review.asset.reviews.map((item, index) => (
          <div onClick={() => setId(item.reviewId)} key={index}>
            {index + 1}. {item.reviewId} - {new Date(item.reviewDate).toLocaleDateString("en-GB")}
          </div>
        ))}
        <div className="popup-actions">
          <button
            onClick={() => {
              setIsFileOpen(!isFileOpen);
            }}
          >
            {isFileOpen ? "Close File" : "Compare"}
          </button>
          <button
            onClick={() => {
              setEditing(!editing);
            }}
          >
            {editing ? "Done" : "Edit"}
          </button>
          {!editing && changed ? <button onClick={saveChanges}>Save Changes</button> : ""}
          <button onClick={createOrder}>Create Order</button>
        </div>
      </div>
      {isFileOpen ? (
        <iframe
          src={publicAPI.fetchReviewPDF(review.originalDocumentPath)}
          width="700px"
          height="100%" // Adjust height as needed
          title="PDF Viewer"
        ></iframe>
      ) : (
        ""
      )}
    </div>
  );
}

export default ReviewPopUp;
