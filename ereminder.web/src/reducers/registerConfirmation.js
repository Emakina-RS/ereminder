export const registrationStates = {
    IS_SUBMITTING: "IS_SUBMITTING",
    IS_CONFIRMED: "IS_CONFIRMED",
    IS_SUBMITTING_FAILURE: "IS_SUBMITTING_FAILURE"
};

const initialState = {
    loading: true,
    message: 'Obrada zahteva...'
};

const registerConfirmation = (state = initialState, action) => {

    let clientMessage,
        loading = false;

    switch (action.type) {
        case registrationStates.IS_CONFIRMED:
            clientMessage = "Profil je uspešno potvrđen! Sada se možete ulogovati na sajt.";
            break;
        case registrationStates.IS_SUBMITTING_FAILURE:
            clientMessage = "Greška, profil nije uspešno potvrđen! Molimo Vas pokušajte kasnije.";
            break;
        default:
            clientMessage = 'Obrada zahteva...';
            loading = true;
    }

    return {
        ...state,
        loading: loading,
        message: clientMessage
    };
};

export default registerConfirmation;