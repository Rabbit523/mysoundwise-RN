import R from 'ramda'
import { connect } from 'react-redux'
import {
  requestIdentification,
  requestAuthentification,
  requestSignup,
  resetIdentification,
  resetAuthentification,
} from '../actions'
import {
  getIsIdentificated,
  getIsFetchingEmailForm,
  getIsAuthentificated,
} from '../selectors'
import { LoginForm } from '../components'

const mapStateToProps = R.applySpec({
  isIdentificated: getIsIdentificated,
  isAuthentificated: getIsAuthentificated,
  isFetching: getIsFetchingEmailForm,
})

const mapDispatchToProps = {
  requestIdentification,
  requestAuthentification,
  requestSignup,
  resetIdentification,
  resetAuthentification,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
