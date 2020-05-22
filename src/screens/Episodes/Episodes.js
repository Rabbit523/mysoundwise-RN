import React from 'react'
import styled from 'styled-components'
import { BlurBackground, SoundcastHead } from '../../components'
import { Header } from 'react-navigation'
import Tab from './Tab'
import { PlayerViewContainer as PlayerView } from '../../containers'

const Container = styled.View`
  flex: 1;
  padding-top: ${Header.HEIGHT};
`

const PaddingWrapper = styled.View`
  padding: 14px 17px 13px;
`

class Episodes extends React.Component {
  componentDidMount() {
    const {
      selectedSoundcast: { soundcastId },
      openSoundcastChannel,
    } = this.props
    openSoundcastChannel(soundcastId)
  }

  componentWillUnmount() {
    this.props.closeSoundcastChannel()
  }

  render() {
    const {
      selectedSoundcast: {
        imageUrl,
        title,
        showSubscriberCount,
        subscribersCount,
        blurredImageUrl,
      },
      screenProps,
      episodes,
    } = this.props
    const subtitle =
      showSubscriberCount &&
      `${subscribersCount} ${
        subscribersCount === 1 ? 'subscriber' : 'subscribers'
      }`
    return (
      <PlayerView>
        <Container>
          <BlurBackground imageUrl={blurredImageUrl} />
          <PaddingWrapper>
            <SoundcastHead
              imageUrl={imageUrl}
              title={title}
              subtitle={subtitle}
            />
          </PaddingWrapper>
          <Tab
            screenProps={{
              ...screenProps,
              episodes,
            }}
          />
        </Container>
      </PlayerView>
    )
  }
}

export default Episodes
