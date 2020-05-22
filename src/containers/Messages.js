import R from 'ramda'
import { connect } from 'react-redux'
import {
  getMessagesByCurrentSubscription,
  getIsFetchingUserSoundcasts,
  getIsRefreshingMessages,
  getIsFetchingMessages,
  getViewedSubscription,
  getUserSoundcasts,
  getPlaylistId,
} from '../selectors'
import {
  selectMessage,
  refreshMessages,
  requestMessages,
  selectSubscription,
} from '../actions'
import { MessagesScreen } from '../screens'
import { PLAYER_STORE_KEY } from '../constants'

const mapStateToProps = R.applySpec({
  isFetchingSoundcasts: getIsFetchingUserSoundcasts,
  isRefreshingMessages: getIsRefreshingMessages,
  messages: getMessagesByCurrentSubscription,
  isFetchingMessages: getIsFetchingMessages,
  subscription: getViewedSubscription,
  soundcasts: getUserSoundcasts,
})

const mapDispatchToProps = {
  selectMessage,
  refreshMessages,
  requestMessages,
  selectSubscription,
}

export default R.compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  connect(
    R.applySpec({ playlistId: getPlaylistId }),
    undefined,
    undefined,
    {
      storeKey: PLAYER_STORE_KEY,
    },
  ),
)(MessagesScreen)
