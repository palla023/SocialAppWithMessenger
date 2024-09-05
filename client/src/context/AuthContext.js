import { createContext, useEffect, useReducer } from "react";
import AuthReducer from './AuthReducer';

const InitialState = {
    // user: {
    //     newUser: {

    //         _id: "6482f690b74731ca9703d8a3",
    //         username: "Jane",
    //         email: "Jane@gmail.com",
    //         profilePicture: "person/1.jpeg",
    //         coverPicture: "16174607888833.jpeg",
    //         followers: [
    //             "6487fde8f8b9bce0a6142f05",
    //             "64d5f45f6e8b011974751e4c"
    //         ],
    //         followings: [
    //             "6487fde8f8b9bce0a6142f05",
    //             "64882206a0c41f8f45567a68"
    //         ],
    //         isAdmin: false,
    //         city: "Chennai",
    //         from: "Sholingallur",
    //         relationship: 1,
    //         desc: "Hey Friends"

    //     }
    // },
    user: JSON.parse(localStorage.getItem("user")|| null ) ,
    targetUser: {
        followers: [],
      },
    isFetching: false,
    error: false
}

export const AuthContext = createContext(InitialState);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, InitialState); //state < - dispatch <- reducer
    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(state.user))
        // console.log(state.user)
      },[state.user])

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}