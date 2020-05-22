import R from 'ramda'
import { connect } from 'react-redux'
import { withTheme } from 'styled-components'
import { facebookConnect } from '../actions'
import { getIsFetchingFacebookConnection } from '../selectors'
import { LoginScreen } from '../screens'

const mapStateToProps = R.applySpec({
  isFetching: getIsFetchingFacebookConnection,
})

const mapDispatchToProps = {
  facebookConnect,
}

export default R.compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTheme,
)(LoginScreen)
