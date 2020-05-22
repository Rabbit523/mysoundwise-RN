import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import EpisodeImage from './EpisodeImage'
import { StyledText, TEXT_COLOR, TEXT_WEIGHT, TEXT_SIZE } from './typography'
import { isExists } from '../utils'

const EpisodeHeadWrapper = styled.View`
  flex-direction: row;
`

const EpisodeHeader = StyledText.extend.attrs({
  size: TEXT_SIZE.XL,
  weight: TEXT_WEIGHT.BOLD,
  color: TEXT_COLOR.ALMOST_BLACK,
})``

const EpisodeHeaderSubtitle = StyledText.extend.attrs({
  size: TEXT_SIZE.M,
})`
  margin-top: 4px;
`

const EpisodeRightBlock = styled.View`
  flex-shrink: 1;
  flex: 1;
  margin-left: 23px;
`

const EpisodeHead = ({
  imageUrl,
  title,
  subtitle,
  episode,
  episodeLoaded,
  updateDownloadTask,
  removeDownloadTask,
}) => (
  <EpisodeHeadWrapper>
    <EpisodeImage
      imageUrl={imageUrl}
      episode={episode}
      episodeLoaded={episodeLoaded}
      updateDownloadTask={updateDownloadTask}
      removeDownloadTask={removeDownloadTask}
    />
    <EpisodeRightBlock>
      <EpisodeHeader>{title}</EpisodeHeader>
      {isExists(subtitle) && (
        <EpisodeHeaderSubtitle>{subtitle}</EpisodeHeaderSubtitle>
      )}
    </EpisodeRightBlock>
  </EpisodeHeadWrapper>
)

EpisodeHead.propTypes = {
  title: PropTypes.string.isRequired,
  episode: PropTypes.object.isRequired,
  imageUrl: PropTypes.string,
  subtitle: PropTypes.string,
}

export default EpisodeHead
