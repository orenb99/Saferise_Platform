import React from "react";

function DynamicUpdateField({ editing, inputType, value, onChange }) {
  if (editing) {
    if (inputType === "textarea")
      return (
        <textarea
          defaultValue={value}
          onBlur={(e) => onChange(e.target.value)}
          rows={6}
          cols={70}
        />
      );
    return (
      <input
        type={inputType}
        defaultValue={value}
        onChange={(e) => {
          let val = e.target.value;
          if (inputType === "number") {
            val = Number(val);
          }
          onChange(val);
        }}
      />
    );
  }
  return <span>{inputType === "date" ? new Date(value).toLocaleDateString("en-GB") : value}</span>;
}

export default DynamicUpdateField;
