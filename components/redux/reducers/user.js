import { USER_POSTS_STATE_CHANGE, USER_STATE_CHANGE, USER_FOLOWING_STATE_CHANGE } from "../contants"

const initialState = {
    currentUser: null,
    posts: [],
    following: [],
}

export const user = (state = initialState, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }

        case USER_POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }

        case USER_FOLOWING_STATE_CHANGE:
            return {
                ...state,
                following: action.following
            }
        default:
            return state;
    }

}
