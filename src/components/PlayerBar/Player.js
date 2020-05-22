import React from 'react'
import Video from 'react-native-video'
import R from 'ramda'
import MusicControl from 'react-native-music-control'

class Player extends React.PureComponent {
  duration = 0
  lastUpdated = 0
  needReplay = false

  render() {
    const { trackUrl, isPaused, speedRate } = this.props
    return (
      !R.isEmpty(trackUrl) && (
        <Video
          style={{ position: 'absolute', opacity: 0 }}
          source={{
            uri: trackUrl,
          }}
          ref={ref => {
            this.player = ref
          }}
          volume={1.0}
          muted={false}
          rate={speedRate}
          paused={isPaused}
          onEnd={this._onEnd}
          onLoad={this._onLoad}
          onSeek={this._onSeek}
          playInBackground={true}
          playWhenInactive={true}
          onBuffer={this._onBuffer}
          ignoreSilentSwitch={'ignore'}
          onProgress={this._onProgress}
          onLoadStart={this._onLoadStart}
        />
      )
    )
  }

  _onBuffer = ({ isBuffering }) => {
    const { isPaused } = this.props
    if (isBuffering) {
      MusicControl.updatePlayback({
        state: MusicControl.STATE_BUFFERING,
      })
    } else if (isPaused) {
      MusicControl.updatePlayback({
        state: MusicControl.STATE_PAUSED,
        elapsedTime: this.currentTime || 0,
      })
    } else {
      MusicControl.updatePlayback({
        state: MusicControl.STATE_PLAYING,
        elapsedTime: this.currentTime,
      })
    }
  }

  _onEnd = () => {
    const { setCurrentTime, changeTrack, trackId } = this.props
    if (this.needReplay) {
      this.player.seek(0)
      this.needReplay = false
      console.log('_onEnd: needReplay --> false')
      return
    }
    console.log('_onEnd: playPosition will be set its duration')
    setCurrentTime({ playPosition: this.duration, trackId })
    changeTrack(true)
  }

  _onLoad = ({ duration, currentTime }) => {
    this.currentTime = 0
    this.needReplay = false
    if (
      this.props.currentTrackPosition &&
      this.props.currentTrackPosition.playPosition
    ) {
      this.currentTime = this.props.currentTrackPosition.playPosition
    }

    const { trackId, fetchTrack, setDuration, setCurrentTime } = this.props
    this._isNewTrack = true
    fetchTrack(true)
    this.duration = duration || 0
    setDuration({ duration: this.duration, trackId })

    // console.log(`_onLoad: currentTime = ${currentTime}, this.currentTime = ${this.currentTime}, duration = ${duration}`)
    if (
      currentTime < this.currentTime &&
      this.currentTime < Math.floor(this.duration)
    ) {
      console.log('_onLoad: seeking ', this.currentTime)
      this.player.seek(this.currentTime)
      return
    }
    if (Math.floor(this.currentTime) >= Math.floor(this.duration)) {
      console.log('_onLoad: needReplay --> true')
      this.needReplay = true
      this.currentTime = 0
      this.player.seek(0)
      return
    }
    this.updateCurrentTime &&
      setCurrentTime({ playPosition: currentTime || 0, trackId })
  }

  _onProgress = ({ currentTime }) => {
    // console.log(`_onProgress: needReplay=${this.needReplay} currentTime=${currentTime}, this.duration=${this.duration}`)
    if (
      this.needReplay &&
      Math.floor(currentTime) < Math.floor(this.duration)
    ) {
      this.needReplay = false
      console.log('_onProgress: needReplay --> false')
    }
    this.currentTime = currentTime
    const { trackId, fetchTrack, isFetching, setCurrentTime } = this.props
    if (isFetching && this._isNewTrack === true) {
      fetchTrack(false)
      this._isNewTrack = false
    }
    const now = Date.now()
    if (now - this.lastUpdated >= 900) {
      setCurrentTime({ playPosition: currentTime || 0, trackId })
      this.lastUpdated = now
    }
  }

  _onSeek = ({ seekTime: elapsedTime }) => {
    // console.log(`_onSeek: elapsedTime = ${elapsedTime}, this.duration = ${this.duration}`)
    if (this.needReplay) {
      elapsedTime = 0
    }
    this.updateCurrentTime = true
    const { trackId, setCurrentTime, seekTime } = this.props
    MusicControl.updatePlayback({
      elapsedTime,
    })
    setCurrentTime({ playPosition: elapsedTime || 0, trackId })
    seekTime(-1)
  }

  _onLoadStart = () => {
    this.currentTime = 0
    this.props.fetchTrack(true)
  }

  _setupMusicControls = () => {
    // MusicControl.enableBackgroundMode(true)
    // enable interruptions on iOS
    MusicControl.handleAudioInterruptions(true)
    // Basic Controls
    MusicControl.enableControl('play', true)
    MusicControl.enableControl('pause', true)
    MusicControl.enableControl('nextTrack', true)
    MusicControl.enableControl('previousTrack', true)

    MusicControl.enableControl('closeNotification', true, { when: 'paused' })

    MusicControl.on('pause', () => {
      this.props.requestPauseTrack(true)
    })
    MusicControl.on('play', () => {
      this.props.requestContinueTrack()
    })
    MusicControl.on('nextTrack', () => {
      console.log('zzzz: this.props.isFetching = ', this.props.isFetching)
      console.log('zzzz: this.props.isPaused = ', this.props.isPaused)
      if (!this.props.isFetching) this.props.changeTrack(true)
    })
    MusicControl.on('previousTrack', () => {
      if (!this.props.isFetching) this.props.changeTrack(false)
    })
  }

  componentDidUpdate() {
    if (this.props.playerSeekTime >= 0 && this.player) {
      this.player.seek(this.props.playerSeekTime)
      this.updateCurrentTime = false
    }
  }

  componentDidMount() {
    this._setupMusicControls()
    if (this.props.playerSeekTime >= 0 && this.player) {
      this.player.seek(this.props.playerSeekTime)
      this.updateCurrentTime = false
    }
  }

  componentWillUnmount() {
    MusicControl.stopControl()
  }
}

export default Player
