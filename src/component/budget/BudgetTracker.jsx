import React from "react";

const BudgetTracker = ({ budgetUsed, payments }) => {
  // Function to get sarcastic messages based on budget usage
  const getSarcasticMessage = (percentage) => {
    if (percentage < 30) return "Still rich! Keep spending!";
    if (percentage < 60) return "Doing okay... but watch out!";
    if (percentage < 90) return "Oof, slow down!";
    return "BROKE MODE ACTIVATED!";
  };

  return (
    <div className=" p-3 rounded">
      <h3 className="text-center mb-3">Budget</h3>

      <div className="row">
        <div className="col-md-12">
          {/* First Row: Budget Usage Bar */}
          <div className="row ">
            <div className="col">
              <div className="progress">
                <div
                  className={`progress-bar ${
                    budgetUsed > 90 ? "bg-danger" : "bg-success"
                  }`}
                  role="progressbar"
                  style={{ width: `${budgetUsed}%` }}
                  aria-valuenow={budgetUsed}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {budgetUsed}% Used
                </div>
              </div>
              {/* Sarcastic Message */}
              <p className="text-center mt-2 text-muted">
                {getSarcasticMessage(budgetUsed)}
              </p>
            </div>
          </div>

          {/* Second Row: Payments List */}
          <div className="row">
            <div className="col">
              <h5 className="mb-2 text-center">Payments Done</h5>
              <ul className="list-group">
                {payments.length > 0 ? (
                  payments.map((payment, index) => (
                    <li key={index} className="list-group-item">
                      {payment}
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-muted">
                    No payments recorded
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
