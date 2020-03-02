import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

const Modal = ({ isShowing, hide, content }) => {
  return(
    isShowing
    ? ReactDOM.createPortal(
      <React.Fragment>
        <div className="Modal-overlay" onClick={hide}>
          <div className="Modal">
            <div className="Modal-container">
              {content}
              <div>
                <button className="close-button" onClick={hide}>
                  ZATVORI
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>,
      document.body
    ) : null
  );
};

export default Modal;