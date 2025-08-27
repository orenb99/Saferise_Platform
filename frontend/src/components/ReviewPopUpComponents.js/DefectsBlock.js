import React from "react";
import DynamicUpdateField from "./DynamicUpdateField";
function DefectsBlock({ defects, setDefects, setChanged, editing }) {
  const updateField = (index, field, value) => {
    if (index >= defects.length || index < 0) {
      return;
    }
    let newData = [...defects];
    newData[index][field] = value;
    setDefects(newData);
    setChanged();
  };
  const addEmpty = () => {};
  const remove = (index) => {};
  if (!defects || defects.length == 0) {
    return "No defects";
  }
  return (
    <div>
      <h3>Defects</h3>
      {defects.map((item, index) => {
        return (
          <div>
            <h4>
              defect #{index + 1}, {item.defectId}
            </h4>
            <DynamicUpdateField
              inputType={"text"}
              value={item.assemblySubject}
              editing={editing}
              onChange={(val) => updateField(index, "assemblySubject", val)}
            />
            <DynamicUpdateField
              inputType={"text"}
              value={item.subjectFinding}
              editing={editing}
              onChange={(val) => updateField(index, "subjectFinding", val)}
            />
            <DynamicUpdateField
              inputType={"textarea"}
              value={item.defectDescription}
              editing={editing}
              onChange={(val) => updateField(index, "defectDescription", val)}
            />
            <DynamicUpdateField
              inputType={"date"}
              value={item.resolvedDate}
              editing={editing}
              onChange={(val) => updateField(index, "resolvedDate", val)}
            />
          </div>
        );
      })}
    </div>
  );
}

export default DefectsBlock;
