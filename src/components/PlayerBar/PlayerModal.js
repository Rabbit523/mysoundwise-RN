import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  BlurBackground,
  Modal,
  StyledText,
  TEXT_SIZE,
  Preloader,
  TEXT_WEIGHT,
} from '../../components'
import {
  PauseBigIcon,
  PlayIcon,
  ReplayIcon,
  ForwardIcon,
  CheckIcon,
} from '../../assets/icons'
import Slider from 'react-native-slider'
import { PlayerLikeButtonContainer as LikeButton } from '../../containers'
import PlayerTab from './PlayerTab'
import { formatSeconds } from '../../utils'
import theme from '../../theme'

const Container = styled.View`
  flex: 1;
  justify-content: space-between;
`

const TrackTitle = StyledText.extend.attrs({
  numberOfLines: 1,
  size: TEXT_SIZE.L,
})`
  margin-horizontal: 40px;
  margin-bottom: 37px;
  text-align: center;
`

const Touchable = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})``

const PlayTouchable = Touchable.extend`
  margin-horizontal: 31px;
`

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`

const RateText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXXS,
})`
  text-align: center;
`

const RateItemText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXM,
  weight: ({ active }) => active && TEXT_WEIGHT.BOLD,
})``

const RateItemWrapper = styled.View`
  flex-direction: row;
  padding: 17px 23px 8px 2px;
  margin-left: 28px;
  border-bottom-color: ${({ theme }) => theme.color.border};
  border-bottom-width: 0.5px;
  justify-content: space-between;
`

const RateItem = ({ text, isActive, ...rest }) => (
  <Touchable {...rest}>
    <RateItemWrapper>
      <RateItemText active={isActive}>{text}</RateItemText>
      {isActive && <CheckIcon />}
    </RateItemWrapper>
  </Touchable>
)

RateItem.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
}

const ModalHeaderText = StyledText.extend.attrs({
  size: TEXT_SIZE.L,
})`
  text-align: center;
`

const StyledSlider = styled(Slider).attrs({
  minimumTrackTintColor: ({ theme }) => theme.color.playerRed,
  maximumTrackTintColor: ({ theme }) => theme.color.progressGray,
  thumbStyle: ({ theme }) => ({ backgroundColor: theme.color.playerRed }),
})`
  flex: 1;
  margin-horizontal: 3px;
`

const ControlsContainer = styled.View`
  padding: 20px 15px;
  margin-top: 30px;
  flex-shrink: 1;
`

const TimestampText = StyledText.extend``

class PlayerModal extends React.PureComponent {
  state = { wasPaused: this.props.isPaused, modalShown: false }
  speedRateArray = [
    { value: 0.75, text: '0.75x' },
    { value: 1, text: '1.0x' },
    { value: 1.25, text: '1.25x' },
    { value: 1.5, text: '1.5x' },
    { value: 2, text: '2.0x' },
    { value: 2.5, text: '2.5x' },
    { value: 3, text: '3.0x' },
  ]

  render() {
    const {
      title,
      trackImageUrl,
      blurredImageUrl,
      trackId,
      isPaused,
      speedRate,
      setSpeedRate,
      currentTrackPosition: { duration, playPosition } = {
        duration: 1,
        playPosition: 0,
      },
      isFetching,
      notes,
      actionstep,
      description,
      ...rest
    } = this.props
    let truncCurrentTime = Math.trunc(playPosition),
      truncDuration = Math.trunc(duration)
    return (
      <Modal {...rest}>
        <BlurBackground imageUrl={blurredImageUrl} />
        <Container>
          <TrackTitle>{title}</TrackTitle>
          <PlayerTab
            imageUrl={trackImageUrl}
            notes={notes}
            actionstep={actionstep}
            description={description}
          />
          <ControlsContainer>
            <Row justifyContent="center">
              <Touchable onPress={this._seekBackward}>
                <ReplayIcon />
              </Touchable>
              <PlayTouchable onPress={this._togglePlay}>
                {isPaused ? (
                  <PlayIcon
                    width={37}
                    height={47}
                    fillColor={theme.color.playerModalIcon}
                  />
                ) : isFetching ? (
                  <Preloader />
                ) : (
                  <PauseBigIcon />
                )}
              </PlayTouchable>
              <Touchable onPress={this._seekForward}>
                <ForwardIcon />
              </Touchable>
            </Row>
            <Row justifyContent="space-between">
              <Touchable onPress={this._showSpeedRateModal}>
                <RateText>{speedRate}X</RateText>
                <RateText>Speed</RateText>
              </Touchable>
              <LikeButton episodeId={trackId} />
            </Row>
            <Row>
              <TimestampText>{formatSeconds(truncCurrentTime)}</TimestampText>
              <StyledSlider
                onSlidingComplete={this._onSlideEnd}
                onSlidingStart={this._onSlideStart}
                value={playPosition}
                maximumValue={duration}
              />
              <TimestampText>
                -{formatSeconds(truncDuration - truncCurrentTime)}
              </TimestampText>
            </Row>
          </ControlsContainer>
        </Container>
        <Modal
          visible={this.state.modalShown}
          onCloseModal={this._hideSpeedRateModal}
        >
          <ModalHeaderText>Play Speed</ModalHeaderText>
          {this.speedRateArray.map(({ value, text }, key) => (
            <RateItem
              key={key}
              text={text}
              onPress={() => setSpeedRate(value)}
              isActive={speedRate === value}
            />
          ))}
        </Modal>
      </Modal>
    )
  }

  _showSpeedRateModal = () => this.setState({ modalShown: true })
  _hideSpeedRateModal = () => this.setState({ modalShown: false })

  _togglePlay = () => {
    const { isPaused, requestPauseTrack, requestContinueTrack } = this.props
    if (isPaused) requestContinueTrack()
    else requestPauseTrack()
  }

  _seekForward = () =>
    this.props.seekTime(this.props.currentTrackPosition.playPosition + 30)
  _seekBackward = () =>
    this.props.seekTime(this.props.currentTrackPosition.playPosition - 30)

  _onSlideStart = () => {
    const { isPaused, pauseTrack } = this.props
    this.setState({ wasPaused: isPaused })
    pauseTrack()
  }

  _onSlideEnd = value => {
    const { seekTime, playTrack } = this.props
    seekTime(value)
    if (!this.state.wasPaused) playTrack()
  }
}

export default PlayerModal
