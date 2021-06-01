import { useState } from "react";
import ResList from "../dashboard/ResList";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import formatPhoneNumber from "../utils/phoneNumberFormatter";

export default function Search() {
  const [error, setError] = useState(null);
  const [searchData, setSearchData] = useState({ mobile_number: "" });
  const [searchRes, setSearchRes] = useState([]);
  const [hideThisLine, setHideThisLine] = useState(true);

  let phoneNumberFormatter = ({ target }) => {
    const formattedInputValue = formatPhoneNumber(target.value);
    setSearchData({
      ...searchData,
      mobile_number: formattedInputValue,
    });
  };

  let handleFind = (event) => {
    event.preventDefault();
    const { mobile_number } = searchData;

    listReservations({ mobile_number })
      .then(setSearchRes)
      .then(() => setHideThisLine(false))
      .catch(setError);
  };

  return (
    <div>
      <h2>Search</h2>
      <ErrorAlert error={error} />

      <form onSubmit={handleFind}>
        <label className="form-label" htmlFor="mobile_number">
          Mobile number:&nbsp;
        </label>
        <input
          type="tel"
          onChange={phoneNumberFormatter}
          name="mobile_number"
          id="mobile_number"
          value={searchData.mobile_number}
          placeholder="Enter a customer's phone number"
          maxLength={12}
          required={true}
        />{" "}
        &nbsp;
        <button className="btn btn-primary btn-sm mb-1" type="submit">
          Find
        </button>
      </form>

      <div className="row row-col-1 row-col-xl-2" hidden={hideThisLine}>
        {searchRes.length !== 0 ? (
          <ResList reservations={searchRes} />
        ) : (
          <p>No reservations found</p>
        )}
      </div>
    </div>
  );
}
