const AuthReducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false,
            }
        case "LOGIN_SUCCESS":
            return {
                user: payload,
                isFetching: false,
                error: false,
            }
        case "LOGIN_ERROR":
            return {
                user: null,
                isFetching: false,
                error: payload
            }
        case "FOLLOW":
            return {
                ...state,
                user: {
                    ...state.user,
                    followings: [...state.user.followings, action.payload.userId], // Add target user ID to current user's followings
                },
                targetUser: {
                    ...state.targetUser,
                    followers: [...state.targetUser.followers, action.payload.currentUserId], // Add current user ID to target user's followers
                }
            };
        case "UNFOLLOW":
            return {
                ...state,
                user: {
                    ...state.user,
                    followings: state.user.followings.filter(id => id !== action.payload.userId), // Remove target user ID from current user's followings
                },
                targetUser: {
                    ...state.targetUser,
                    followers: state.targetUser.followers.filter(id => id !== action.payload.currentUserId), // Remove current user ID from target user's followers
                }
            };

        case 'LOGOUT':
            // Set user to null in local storage
            localStorage.setItem('user', null);
            
            return {
                ...state, 
                user: null, // Set the user to null in the state after logout
                isFetching: false,
                error: false
            };

        default:
            return state
    }

}
export default AuthReducer;