import { createAction } from 'redux-actions'

// Action Types

export const REQUEST_EPISODE_COMMENTS =
  'soundwise/comment/REQUEST_EPISODE_COMMENTS'

export const RECEIVE_EPISODE_COMMENTS =
  'soundwise/comment/RECEIVE_EPISODE_COMMENTS'

export const REQUEST_MESSAGE_COMMENTS =
  'soundwise/comment/REQUEST_MESSAGE_COMMENTS'

export const RECEIVE_MESSAGE_COMMENTS =
  'soundwise/comment/RECEIVE_MESSAGE_COMMENTS'

export const COMMENT_EPISODE = 'soundwise/comment/COMMENT_EPISODE'

export const COMMENT_MESSAGE = 'soundwise/comment/COMMENT_MESSAGE'

export const UNCOMMENT_EPISODE = 'soundwise/comment/UNCOMMENT_EPISODE'

export const UNCOMMENT_MESSAGE = 'soundwise/comment/UNCOMMENT_MESSAGE'

export const UPDATE_COMMENT = 'soundwise/comment/UPDATE_COMMENT'

export const LOCAL_COMMENT_EPISODE = 'soundwise/comment/LOCAL_COMMENT_EPISODE'

export const LOCAL_UNCOMMENT_EPISODE =
  'soundwise/comment/LOCAL_UNCOMMENT_EPISODE'

export const EDIT_COMMENT = 'soundwise/comment/EDIT_COMMENT'

export const REQUEST_REFRESH_MESSAGE_COMMENTS =
  'soundwise/message/REQUEST_REFRESH_MESSAGE_COMMENTS'

export const RECEIVE_REFRESH_MESSAGE_COMMENTS =
  'soundwise/message/RECEIVE_REFRESH_MESSAGE_COMMENTS'

// Action Creators

export const requestEpisodeComments = createAction(REQUEST_EPISODE_COMMENTS)

export const receiveEpisodeComments = createAction(RECEIVE_EPISODE_COMMENTS)

export const requestMessageComments = createAction(REQUEST_MESSAGE_COMMENTS)

export const receiveMessageComments = createAction(RECEIVE_MESSAGE_COMMENTS)

export const commentEpisode = createAction(COMMENT_EPISODE)

export const commentMessage = createAction(COMMENT_MESSAGE)

export const updateComment = createAction(UPDATE_COMMENT)

export const uncommentEpisode = createAction(UNCOMMENT_EPISODE)

export const uncommentMessage = createAction(UNCOMMENT_MESSAGE)

export const localCommentEpisode = createAction(LOCAL_COMMENT_EPISODE)

export const localUncommentEpisode = createAction(LOCAL_UNCOMMENT_EPISODE)

export const editComment = createAction(EDIT_COMMENT)

export const requestRefreshMessageComments = createAction(
  REQUEST_REFRESH_MESSAGE_COMMENTS,
)

export const receiveRefreshMessageComments = createAction(
  RECEIVE_REFRESH_MESSAGE_COMMENTS,
)
