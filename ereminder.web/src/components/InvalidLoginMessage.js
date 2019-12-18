import React from "react";
import { connect } from "react-redux";
import "./InvalidLoginMessage.css";

const mapStateToProps = state => ({
    isLoginFailed: state.login.isLoginFailed
});

const InvalidLoginMessage = ({ isLoginFailed }) => {
    return (
        <div>
            {isLoginFailed ? (
                <div className="InvalidLoginMessage-content">
                    {<label >Neuspešno logovanje</label>}
                </div>
            ) :
                <div>
                </div>
            }
        </div>
    );
};

export default connect(
    mapStateToProps,
    null
)(InvalidLoginMessage);