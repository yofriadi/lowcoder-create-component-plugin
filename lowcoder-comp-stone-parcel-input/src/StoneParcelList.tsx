import { useState } from "react";

import styles from "./styles.module.css";

function StoneParcelsList() {
  const [formValues, setFormValues] = useState([
    { parcel: "", pieces: 0, carat: 0 },
  ]);

  let handleChange = (i: number, e: React.ChangeEvent<any>) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;

    if (
      i == newFormValues.length - 1 &&
      (newFormValues[i]["parcel"] ||
        newFormValues[i]["pieces"] ||
        newFormValues[i]["carat"])
    ) {
      newFormValues = [...newFormValues, { parcel: "", pieces: 0, carat: 0 }];
    }

    if (
      i != newFormValues.length - 1 &&
      !(
        newFormValues[i]["parcel"] ||
        newFormValues[i]["pieces"] ||
        newFormValues[i]["carat"]
      )
    ) {
      newFormValues.splice(i, 1);
    }

    setFormValues(newFormValues);
  };

  let handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    formValues.pop();
    alert(JSON.stringify(formValues));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h3>Parcel</h3>
        <h3>Pieces</h3>
        <h3>Carat</h3>
      </div>
      {formValues.map((element, index) => (
        <div className="styles.field" key={index}>
          <input
            type="text"
            name="parcel"
            value={element.parcel || ""}
            onChange={(e) => handleChange(index, e)}
          />
          <input
            type="number"
            min="0"
            name="pieces"
            value={Number(element.pieces).toString() || 0}
            onChange={(e) => handleChange(index, e)}
          />
          <input
            type="number"
            min="0"
            step="0.0001"
            name="carat"
            value={Number(element.carat).toString() || 0}
            onChange={(e) => handleChange(index, e)}
          />
        </div>
      ))}
      <div className="button-section">
        <button className="button submit" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}

export default StoneParcelsList;
