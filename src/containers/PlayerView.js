import R from 'ramda'
import { connect } from 'react-redux'
import { getIsPlayerShown } from '../selectors'
import { PlayerView } from '../components'
import { PLAYER_STORE_KEY } from '../constants'

const mapStateToProps = R.applySpec({
  isPlayerShown: getIsPlayerShown,
})

export default connect(mapStateToProps, undefined, undefined, {
  storeKey: PLAYER_STORE_KEY,
})(PlayerView)
