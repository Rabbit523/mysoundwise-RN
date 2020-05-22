import { createAction } from 'redux-actions'

// Action Types

export const REQUEST_LIKES = 'soundwise/like/REQUEST_LIKES'

export const RECEIVE_LIKES = 'soundwise/like/RECEIVE_LIKES'

export const REMOVE_LIKES = 'soundwise/like/REMOVE_LIKES'

export const REQUEST_LIKE_EPISODE = 'soundwise/like/REQUEST_LIKE_EPISODE'

export const RECEIVE_LIKE_EPISODE = 'soundwise/like/RECEIVE_LIKE_EPISODE'

export const REQUEST_UNLIKE_EPISODE = 'soundwise/like/REQUEST_UNLIKE_EPISODE'

export const RECEIVE_UNLIKE_EPISODE = 'soundwise/like/RECEIVE_UNLIKE_EPISODE'

export const REQUEST_LIKE_MESSAGE = 'soundwise/like/REQUEST_LIKE_MESSAGE'

export const RECEIVE_LIKE_MESSAGE = 'soundwise/like/RECEIVE_LIKE_MESSAGE'

export const REQUEST_UNLIKE_MESSAGE = 'soundwise/like/REQUEST_UNLIKE_MESSAGE'

export const RECEIVE_UNLIKE_MESSAGE = 'soundwise/like/RECEIVE_UNLIKE_MESSAGE'

export const LIKE_COMMENT = 'soundwise/like/LIKE_COMMENT'

export const UNLIKE_COMMENT = 'soundwise/like/UNLIKE_COMMENT'

// Action Creators

export const requestLikes = createAction(REQUEST_LIKES)

export const receiveLikes = createAction(RECEIVE_LIKES)

export const removeLikes = createAction(REMOVE_LIKES)

export const requestLikeEpisode = createAction(REQUEST_LIKE_EPISODE)

export const receiveLikeEpisode = createAction(RECEIVE_LIKE_EPISODE)

export const requestUnlikeEpisode = createAction(REQUEST_UNLIKE_EPISODE)

export const receiveUnlikeEpisode = createAction(RECEIVE_UNLIKE_EPISODE)

export const requestLikeMessage = createAction(REQUEST_LIKE_MESSAGE)

export const receiveLikeMessage = createAction(RECEIVE_LIKE_MESSAGE)

export const requestUnlikeMessage = createAction(REQUEST_UNLIKE_MESSAGE)

export const receiveUnlikeMessage = createAction(RECEIVE_UNLIKE_MESSAGE)

export const likeComment = createAction(LIKE_COMMENT)

export const unlikeComment = createAction(UNLIKE_COMMENT)
