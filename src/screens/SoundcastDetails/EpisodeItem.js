import React from 'react'
import styled from 'styled-components'
import { InformationIcon, PlayCircleIcon } from '../../assets/icons'
import { PlayExploreButtonContainer as PlayButton } from '../../containers'
import { EpisodeHeader } from '../../components'
import { HITSLOP_10 } from '../../constants'

const EpisodeElementWrapper = styled.View`
  background-color: ${({ theme }) => theme.color.mainWhite};
  border-color: ${({ theme }) => theme.color.divider};
  border-bottom-width: 4px;
  padding: 18px 59px 12px 17px;
  flex-direction: row;
`

const PlayButtonWrapper = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
  hitSlop: HITSLOP_10,
})``

const InformationButtonWrapper = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
  hitSlop: HITSLOP_10,
})`
  position: absolute;
  right: -36px;
`

const GrayPlayButton = props => (
  <PlayButtonWrapper {...props}>
    <PlayCircleIcon />
  </PlayButtonWrapper>
)

const InformationButton = props => (
  <InformationButtonWrapper {...props}>
    <InformationIcon />
  </InformationButtonWrapper>
)

class EpisodeItem extends React.PureComponent {
  _handlePressInfo = () => {
    const { onPressInfo, description, title } = this.props
    onPressInfo({ description, title })
  }

  render() {
    const {
      title,
      date_created,
      duration,
      publicEpisode,
      episodeId,
      soundcastId,
      publisherId,
      soundcastImageUrl,
      description,
      onGetAccess,
      isLoaded,
    } = this.props
    return (
      <EpisodeElementWrapper>
        {publicEpisode ? (
          <PlayButton
            episodeId={episodeId}
            soundcastId={soundcastId}
            publisherId={publisherId}
            soundcastImageUrl={soundcastImageUrl}
            isLoaded={isLoaded}
          />
        ) : (
          <GrayPlayButton onPress={onGetAccess} />
        )}
        <EpisodeHeader
          date={date_created}
          title={title}
          duration={Number(duration)}
        />
        {!!description && <InformationButton onPress={this._handlePressInfo} />}
      </EpisodeElementWrapper>
    )
  }
}

export default EpisodeItem
