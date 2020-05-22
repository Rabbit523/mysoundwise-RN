import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { CachedImage } from 'react-native-cached-image'
import { PlayButtonContainer as PlayButton } from '../containers'
import { isExists } from '../utils'

const ButtonWrapper = styled.View`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
`

const ShadowContainer = styled.View`
  elevation: 3;
  shadow-offset: 2px 4px;
  shadow-opacity: 0.7;
  shadow-color: ${({ theme }) => theme.color.mainBlack};
  background-color: ${({ theme, showBackground }) =>
    showBackground ? `${theme.color.mainOrange};` : `white`};
  width: 77px;
  height: 77px;
`

const Image = styled(CachedImage)`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`

const EpisodeImage = ({
  imageUrl,
  episode: { episodeId, soundcastId, publisherId, isLoaded, url },
  episodeLoaded,
  updateDownloadTask,
  removeDownloadTask,
}) => (
  <ShadowContainer showBackground={!isExists(imageUrl)}>
    {isExists(imageUrl) && <Image source={{ uri: imageUrl }} />}
    <ButtonWrapper>
      <PlayButton
        soundcastImageUrl={imageUrl}
        episodeId={episodeId}
        soundcastId={soundcastId}
        publisherId={publisherId}
        isLoaded={isLoaded}
        url={url}
        episodeLoaded={episodeLoaded}
        updateDownloadTask={updateDownloadTask}
        removeDownloadTask={removeDownloadTask}
      />
    </ButtonWrapper>
  </ShadowContainer>
)

EpisodeImage.propTypes = {
  episode: PropTypes.object.isRequired,
  imageUrl: PropTypes.string,
}

export default EpisodeImage
