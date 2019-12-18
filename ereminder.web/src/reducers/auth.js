const initialState = "";

const token = (state = initialState, action) => {
    switch (action.type) {
        case "GOT_AUTH":
            return action.auth;
        default:
            return state;
    }
};

export default token;