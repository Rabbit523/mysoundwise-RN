import R from 'ramda'
import React from 'react'
import styled from 'styled-components'
import EpisodeHeader from '../EpisodeHeader'
import { DownloadButton, NextButton, CommentButton } from './Buttons'
import {
  PlayButtonContainer as PlayButton,
  LikeButtonContainer as LikeButton,
  PlayerProgressContainer as Progress,
} from '../../containers'
import theme from '../../theme'
import * as NavigationService from '../../NavigationService'

const Row = styled.View`
  flex-direction: row;
`

const EpisodeElementWrapper = styled.View`
  background-color: ${({ theme }) => theme.color.mainWhite};
  border-color: ${({ theme }) => theme.color.divider};
  border-bottom-width: 4px;
  padding: 18px 77px 12px 17px;
`

class EpisodeElement extends React.PureComponent {
  componentDidMount() {
    const { openEpisodeChannel, episodeId } = this.props
    openEpisodeChannel(episodeId)
  }

  componentWillUnmount() {
    const { closeEpisodeChannel, episodeId } = this.props
    closeEpisodeChannel(episodeId)
  }

  render() {
    const {
      title,
      date_created,
      duration,
      episodeId,
      likesCount,
      userLiked,
      lastLiked,
      commentsCount,
      isLikeFetching,
      soundcastId,
      publisherId,
      isLoaded,
      url,
      selectEpisode,
      soundcastImageUrl,
      downloadState,
      episodeLoaded,
      updateDownloadTask,
      removeDownloadTask,
    } = this.props
    return (
      <EpisodeElementWrapper>
        <Row>
          <PlayButton
            episodeId={episodeId}
            soundcastId={soundcastId}
            publisherId={publisherId}
            selectEpisode={selectEpisode}
            soundcastImageUrl={soundcastImageUrl}
            isLoaded={isLoaded}
            url={url}
            episodeLoaded={episodeLoaded}
            updateDownloadTask={updateDownloadTask}
            removeDownloadTask={removeDownloadTask}
          />
          <EpisodeHeader
            date={date_created}
            title={title}
            duration={Number(duration)}
            onPress={this._onNextPress}
          />
          <DownloadButton
            episodeId={episodeId}
            isLoaded={isLoaded}
            url={url}
            onEpisodeRemove={this._onPressRemoveEpisode}
            downloadState={downloadState}
            episodeLoaded={episodeLoaded}
            updateDownloadTask={updateDownloadTask}
            removeDownloadTask={removeDownloadTask}
          />
        </Row>
        <Row marginTop={10} alignItems="center">
          <Progress episodeId={episodeId} />
          <NextButton onPress={this._onNextPress} />
        </Row>
        <Row justifyContent="space-between" marginLeft={10}>
          <LikeButton
            lastLiked={lastLiked}
            likesCount={likesCount}
            isFetching={isLikeFetching}
            onLike={this._onLike}
            onPressText={this._onLikeTextPress}
            likeIconProps={{
              width: 18,
              height: 17,
              strokeWidth: 1.5,
              fillColor: userLiked
                ? theme.color.mainOrange
                : theme.color.episodeListLike,
              strokeColor: userLiked
                ? theme.color.mainOrange
                : theme.color.episodeListLike,
            }}
          />
          {R.gt(commentsCount, 0) && (
            <CommentButton
              onPress={this._onNextPress}
              commentCount={commentsCount}
            />
          )}
        </Row>
      </EpisodeElementWrapper>
    )
  }

  _onLike = () => {
    const {
      likeEpisode,
      unlikeEpisode,
      soundcastId,
      episodeId,
      userLiked,
    } = this.props
    if (userLiked) {
      unlikeEpisode(episodeId)
    } else {
      likeEpisode({
        episodeId,
        soundcastId,
      })
    }
  }

  _onLikeTextPress = () => {
    const { selectEpisode, episodeId } = this.props
    selectEpisode(episodeId)
    NavigationService.navigate('LikesList')
  }

  _onNextPress = () => {
    const { selectEpisode, episodeId } = this.props
    selectEpisode(episodeId)
    NavigationService.navigate('EpisodeDetails')
  }

  _onPressRemoveEpisode = () => this.props.onRemoveEpisode(this.props.episodeId)
}

export default EpisodeElement
