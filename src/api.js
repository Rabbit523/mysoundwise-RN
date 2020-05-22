const BASE_URL = 'https://mysoundwise.com/api/' //Prod
// const BASE_URL = 'http://35.198.125.193:3000/api/' // Stage
// const BASE_URL = 'http://192.168.1.43:3000/api/' // Local
// const BASE_URL = 'http://162.243.196.88:8080/api/' //PreProd

// export const TEST_BASE_URL = 'https://soundwise-testbase.firebaseio.com/' // Test firebase
export const TEST_BASE_URL = undefined // Prod firebase

export default {
  USER: `${BASE_URL}user`,
  LIKE: `${BASE_URL}like`,
  LIKE_BY_ID: likeId => `${BASE_URL}likes/${likeId}`,
  LIKES: `${BASE_URL}likes`,
  GET_LISTENS_COUNT: `${BASE_URL}listeningSessions/count`,
  GET_LIKES_COUNT: `${BASE_URL}likes/count`,
  GET_COMMENTS_COUNT: `${BASE_URL}comments/count`,
  DELETE_EMAIL: `${BASE_URL}delete_emails`,
  ADD_EMAIL: `${BASE_URL}add_emails`,
  LISTENERS: `${BASE_URL}listeners`,
  LISTENER_BY_ID: listenerId => `${BASE_URL}listeners/${listenerId}`,
  GET_SOUNDCASTS: `${BASE_URL}soundcasts`,
  LISTENING_SESSION: `${BASE_URL}listeningSessions`,
  UNSUBSCRIBE: `${BASE_URL}unsubscribe`,
  SUBSCRIBE: `${BASE_URL}subscribe`,
  ADD_MAILCHIMP: `${BASE_URL}mail_manage_addsubscriber`,
  UPLOAD_AVATAR: `${BASE_URL}upload`,
  PUBLISHERS: `${BASE_URL}publishers`,
  UPDATES: `${BASE_URL}updates`,
  COMMENTS: `${BASE_URL}comments`,
  COMMENT_BY_ID: commentId => `${BASE_URL}comments/${commentId}`,
  MESSAGES: `${BASE_URL}announcements`,
  MESSAGE_BY_ID: messageId => `${BASE_URL}announcements/${messageId}`,
  COMPLETE_SING_UP: `${BASE_URL}complete_sign_up`,
}
