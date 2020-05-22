import R from 'ramda'
import { connect } from 'react-redux'
import {
  getMutatedSelectedSoundcast,
  getSortedEpisodesDesc,
} from '../selectors'
import { openSoundcastChannel, closeSoundcastChannel } from '../actions'
import { EpisodesScreen } from '../screens'

const mapStateToProps = R.applySpec({
  selectedSoundcast: getMutatedSelectedSoundcast,
  episodes: getSortedEpisodesDesc,
})

const mapDispatchToProps = {
  openSoundcastChannel,
  closeSoundcastChannel,
}

export default connect(mapStateToProps, mapDispatchToProps)(EpisodesScreen)
