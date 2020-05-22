import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { StyledText, TEXT_COLOR, TEXT_SIZE } from '../../components'
import { CommentIcon, ArrowCircleIcon, DownloadIcon } from '../../assets/icons'
import { Circle } from 'react-native-progress'
// import RNFetchBlob from 'rn-fetch-blob'
import { DOCUMENT_DIR } from '../../constants'
import { bgDownloadCancel, bgDownloadEpisode } from '../../utils/DownloadTask'

const Touchable = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})``

const TouchableRow = Touchable.extend`
  flex-direction: row;
  flex: 1;
  justify-content: ${({ rightAlign }) =>
    rightAlign ? 'flex-end' : 'flex-start'};
  margin-left: ${({ rightAlign }) => (rightAlign ? 5 : 0)};
`

const GrayText = StyledText.extend.attrs({
  color: TEXT_COLOR.FONT_BLACK,
  size: TEXT_SIZE.XS,
})`
  margin-left: 5px;
`

const OrangeText = StyledText.extend.attrs({
  color: TEXT_COLOR.MAIN_ORANGE,
  size: TEXT_SIZE.XS,
})`
  margin-top: 2px;
`

const AbsoluteTouchable = Touchable.extend`
  position: absolute;
  right: -54.5px;
`

const AbsoluteCircle = styled(Circle).attrs({
  size: 35,
  showsText: true,
  thickness: 1,
  color: ({ theme }) => theme.color.mainOrange,
  unfilledColor: ({ theme }) => theme.color.progressCircle,
  borderWidth: 0,
  textStyle: { fontSize: 8 },
})``

export class DownloadButton extends React.Component {
  static propTypes = {
    onEpisodeRemove: PropTypes.func,
    episodeId: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    downloadState: PropTypes.any,
    episodeLoaded: PropTypes.func,
    updateDownloadTask: PropTypes.func,
    removeDownloadTask: PropTypes.func,
  }

  state = {
    percent: undefined,
    episodePath:
      this.props.localPath ||
      `${DOCUMENT_DIR + this.props.episodeId}.${this.props.url
        .split('.')
        .pop()}`,
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.downloadState &&
      prevState.percent !== this.props.downloadState.progress
    ) {
      this.setState({ percent: this.props.downloadState.progress })
    }
    if (
      prevProps.downloadState !== undefined &&
      this.props.downloadState === undefined
    ) {
      this.setState({ percent: undefined })
    }
  }

  _downloadCancel = () => {
    const { episodeId, removeDownloadTask } = this.props
    bgDownloadCancel(episodeId, removeDownloadTask)
  }

  _downloadEpisode = () => {
    const {
      episodeId,
      url,
      episodeLoaded,
      updateDownloadTask,
      removeDownloadTask,
    } = this.props
    this.setState({ percent: 0 })
    bgDownloadEpisode(
      episodeId,
      updateDownloadTask,
      removeDownloadTask,
      episodeLoaded,
      url,
    )
    // console.log(`${episodeId} this.state.episodePath = ${this.state.episodePath}`)
    // console.log(`${episodeId} url = ${url}`)
    // RNFetchBlob.config({
    //   path: this.state.episodePath,
    //   IOSBackgroundTask: true,
    // })
    //   .fetch('GET', url)
    //   .progress((received, total) => {
    //     const progress = received / total
    //     console.log(`${episodeId} downloaded ${progress}%`)
    //     this.setState({ progress })
    //   })
    //   .then(res => {
    //     const result_path = res.path()
    //     console.log(`${episodeId} downloaded complete : ${result_path}`)
    //     onEpisodeLoaded({ [episodeId]: result_path })
    //     this.setState({ isLoading: false })
    //   })
    //   .catch(err => {
    //     console.warn('download error: ', err)
    //     this.setState({ isLoading: false })
    //   }) // TODO: add handler
  }

  _removeEpisode = () => this.props.onEpisodeRemove()

  _loadOrRemoveEpisode = () =>
    this.props.isLoaded ? this._removeEpisode() : this._downloadEpisode()

  render() {
    const { isLoaded } = this.props
    const { percent } = this.state
    return percent !== undefined ? (
      <AbsoluteTouchable onPress={this._downloadCancel}>
        <AbsoluteCircle progress={percent} />
      </AbsoluteTouchable>
    ) : (
      <AbsoluteTouchable onPress={this._loadOrRemoveEpisode}>
        {isLoaded ? <OrangeText>Remove</OrangeText> : <DownloadIcon />}
      </AbsoluteTouchable>
    )
  }
}

export const NextButton = props => (
  <AbsoluteTouchable {...props}>
    <ArrowCircleIcon />
  </AbsoluteTouchable>
)

NextButton.propTypes = {
  onPress: PropTypes.func,
}

export const CommentButton = ({ commentCount = 0, ...rest }) => (
  <TouchableRow rightAlign {...rest}>
    <CommentIcon />
    <GrayText>
      {commentCount}
      {commentCount === 1 ? ' comment' : ' comments'}
    </GrayText>
  </TouchableRow>
)

CommentButton.propTypes = {
  commentCount: PropTypes.number,
  onPress: PropTypes.func,
}
