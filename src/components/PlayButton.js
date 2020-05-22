import React from 'react'
import R from 'ramda'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Preloader } from '../components'
import { EqualizerIcon, PlayCircleIcon } from '../assets/icons'
import { HITSLOP_10 } from '../constants'
import { bgDownloadEpisode } from '../utils/DownloadTask'

const Touchable = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
  hitSlop: HITSLOP_10,
})``

const PreloaderWrapper = styled.View`
  width: 35px;
  height: 35px;
  background-color: transparent;
`

class PlayButton extends React.PureComponent {
  render() {
    const { isPaused, isFetching, episodeId, trackId, isLoaded } = this.props
    return (
      <Touchable onPress={this._togglePlayer}>
        {trackId === episodeId ? (
          isPaused ? (
            <PlayCircleIcon active />
          ) : isFetching ? (
            <PreloaderWrapper>
              <Preloader
                renderContainer
                containerBackgroundColor="transparent"
              />
            </PreloaderWrapper>
          ) : (
            <EqualizerIcon />
          )
        ) : (
          <PlayCircleIcon active />
        )}
      </Touchable>
    )
  }

  static propTypes = {
    soundcastImageUrl: PropTypes.string.isRequired,
    selectEpisode: PropTypes.func,
    episodeId: PropTypes.string.isRequired,
    soundcastId: PropTypes.string.isRequired,
    publisherId: PropTypes.string.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    url: PropTypes.string,
    episodeLoaded: PropTypes.func,
    updateDownloadTask: PropTypes.func,
    removeDownloadTask: PropTypes.func,
  }

  _selectEpisode = R.once(() => {
    const { selectEpisode, episodeId } = this.props
    selectEpisode && selectEpisode(episodeId)
  })

  _togglePlayer = () => {
    this._selectEpisode()
    const { isPaused, requestPauseTrack, trackId, episodeId } = this.props
    if (isPaused) {
      if (trackId !== episodeId) {
        this._playTrack(true)
      } else {
        this._playTrack(false)
      }
    } else {
      requestPauseTrack()
      if (trackId !== episodeId) {
        this._playTrack(true)
      }
    }
  }

  _playTrack = isNewTrack => {
    const {
      fetchTrack,
      requestPlayTrack,
      soundcastEpisodes,
      soundcastImageUrl: trackImageUrl,
      episodeId,
      soundcastId,
      publisherId,
      isLoaded,
      url,
      episodeLoaded,
      updateDownloadTask,
      removeDownloadTask,
    } = this.props
    if (isNewTrack) {
      fetchTrack(true)
    }
    requestPlayTrack({
      episodeId,
      soundcastId,
      soundcastEpisodes,
      trackImageUrl,
      publisherId,
    })
    if (
      !isLoaded &&
      url &&
      episodeLoaded &&
      updateDownloadTask &&
      removeDownloadTask
    ) {
      bgDownloadEpisode(
        episodeId,
        updateDownloadTask,
        removeDownloadTask,
        episodeLoaded,
        url,
      )
    }
  }
}

export default PlayButton
