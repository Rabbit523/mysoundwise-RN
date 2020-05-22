import React from 'react'
import R from 'ramda'
import styled from 'styled-components'
import { Keyboard } from 'react-native'
import { StyledText, TEXT_COLOR, TEXT_SIZE, Preloader } from '../../components'
import PlayerModal from './PlayerModal'
import Player from './Player'
import { ArrowIcon, PauseIcon, PlayIcon } from '../../assets/icons'
import { Bar } from 'react-native-progress'
import {
  ARROW_ICON_DIRECTION,
  TAB_BAR_HEIGHT,
  PLAYER_BAR_HEIGHT,
} from '../../constants'

const Container = styled.View`
  height: ${PLAYER_BAR_HEIGHT}px;
  padding: 5px 10.5px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.color.playerBar};
`

const Progress = styled(Bar).attrs({
  borderWidth: 0,
  color: ({ theme }) => theme.color.mainOrange,
  unfilledColor: 'transparent',
  borderRadius: 0,
  height: 2,
  width: null,
})``

const Touchable = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })`
  padding: 10px;
`

const TitleContainer = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })`
  flex: 1;
`

const PlayButton = ({ isFetching, isPaused, ...rest }) => (
  <Touchable {...rest}>
    {isPaused ? <PlayIcon /> : isFetching ? <Preloader /> : <PauseIcon />}
  </Touchable>
)

const UpButton = props => (
  <Touchable {...props}>
    <ArrowIcon arrowDirection={ARROW_ICON_DIRECTION.UP} />
  </Touchable>
)

const SouncastText = StyledText.extend.attrs({
  size: TEXT_SIZE.S,
  numberOfLines: 1,
})`
  text-align: center;
`

const DateText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXS,
  color: TEXT_COLOR.FONT_GREY,
})`
  text-align: center;
`

const PlayerWrapper = styled.View`
  position: absolute;
  bottom: ${({ isShown, keyboardShown }) =>
    isShown ? (keyboardShown ? 0 : TAB_BAR_HEIGHT) : -TAB_BAR_HEIGHT};
  left: 0;
  right: 0;
`

class PlayerBar extends React.Component {
  state = {
    modalVisible: false,
    keyboardShown: false,
  }

  _showModal = () => this.setState({ modalVisible: true })

  _hideModal = () => this.setState({ modalVisible: false })

  render() {
    const {
      isFetching,
      isPlayerShown,
      isPaused,
      track: { title, subtitle, trackUrl, trackImageUrl, trackId } = {
        trackUrl: '',
      },
      episode: { notes, description, actionstep, isLoaded } = {},
    } = this.props
    const { keyboardShown } = this.state

    const playerProps = {
      trackId,
      trackUrl,
      ...R.pick(
        [
          'seekTime',
          'isPaused',
          'speedRate',
          'isFetching',
          'fetchTrack',
          'setDuration',
          'changeTrack',
          'playerSeekTime',
          'currentTrackPosition',
          'setCurrentTime',
          'requestPauseTrack',
          'requestContinueTrack',
        ],
        this.props,
      ),
    }
    const modalProps = {
      notes,
      title,
      trackId,
      actionstep,
      description,
      trackImageUrl,
      ...R.pick(
        [
          'isPaused',
          'seekTime',
          'playTrack',
          'speedRate',
          'isFetching',
          'pauseTrack',
          'setSpeedRate',
          'requestPauseTrack',
          'currentTrackPosition',
          'requestContinueTrack',
        ],
        this.props,
      ),
    }
    return (
      <PlayerWrapper isShown={isPlayerShown} keyboardShown={keyboardShown}>
        <Container>
          <PlayButton
            isPaused={isPaused}
            isFetching={isFetching}
            onPress={this._togglePlay}
            isLoaded={isLoaded}
          />
          <TitleContainer onPress={this._showModal}>
            <SouncastText>{title}</SouncastText>
            <DateText>{subtitle}</DateText>
          </TitleContainer>
          <UpButton onPress={this._showModal} />
        </Container>
        <Progress progress={this._getCurrentTime()} />
        <PlayerModal
          onRequestClose={this._hideModal}
          visible={this.state.modalVisible}
          onCloseModal={this._hideModal}
          {...modalProps}
        />
        <Player {...playerProps} />
      </PlayerWrapper>
    )
  }

  _togglePlay = () => {
    const { requestPauseTrack, requestContinueTrack, isPaused } = this.props
    if (isPaused) requestContinueTrack()
    else requestPauseTrack()
  }

  _getCurrentTime = () => {
    const { currentTrackPosition: { playPosition, duration } = {} } = this.props
    return (playPosition || 0.0001) / (duration || 1)
  }

  componentDidMount() {
    this.keyboardDidShowSub = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    )
    this.keyboardDidHideSub = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    )
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove()
    this.keyboardDidHideSub.remove()
  }

  keyboardDidShow = () => {
    this.setState({
      keyboardShown: true,
    })
  }

  keyboardDidHide = () => {
    this.setState({
      keyboardShown: false,
    })
  }
}

export default PlayerBar
