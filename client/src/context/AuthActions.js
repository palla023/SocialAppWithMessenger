export const LoginStart = (userCredentials) => ({
    type: "LOGIN_START",
})

export const LoginSuccess = (user) => ({
    type: "LOGIN_SUCCESS",
    payload: user
});

export const LoginFailure = (error) => ({
    type: "LOGIN_FAILURE",
    payload: error
})
export const Logout=()=>({
    type:"LOGOUT",
})

export const Follow = (userId, currentUserId) => ({
    type: "FOLLOW",
    payload: { userId, currentUserId }
});

export const UnFollow = (userId, currentUserId) => ({
    type: "UNFOLLOW",
    payload: { userId, currentUserId }
});
