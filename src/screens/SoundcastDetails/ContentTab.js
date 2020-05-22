import React from 'react'
import styled from 'styled-components'
import { Linking } from 'react-native'
import {
  Modal,
  Preloader,
  StyledText,
  BlurBackground,
  CardSoundcast,
  TEXT_SIZE,
} from '../../components'
import EpisodeItem from './EpisodeItem'
import HTML from 'react-native-render-html'
import * as NavigationService from '../../NavigationService'

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.mainWhite};
`

const ModalInner = styled.View`
  background-color: ${({ theme }) => theme.color.mainWhite};
  flex: 1;
  padding-horizontal: 40px;
  padding-vertical: 20px;
`

const ModalHeaderText = StyledText.extend.attrs({
  size: TEXT_SIZE.L,
})`
  text-align: center;
  margin: 14px 40px;
`

const FlatList = styled.FlatList``

const TwoColFlatList = styled.FlatList.attrs({
  numColumns: 2,
  columnWrapperStyle: { justifyContent: 'space-around', marginBottom: 35 },
})``

class ContentTab extends React.Component {
  _renderItem = ({ item }) => (
    <EpisodeItem
      onPressInfo={this._handlePressInfo}
      onGetAccess={this.props.screenProps.onGetAccess}
      likeEpisode={this.props.screenProps.likeEpisode}
      unlikeEpisode={this.props.screenProps.unlikeEpisode}
      soundcastImageUrl={this.props.screenProps.soundcast.imageUrl}
      {...item}
    />
  )

  _renderSoundcastItem = ({ item }) => (
    <CardSoundcast
      onPressItem={() => this._handlePressSoundcast(item.soundcastId)}
      {...item}
    />
  )

  state = { description: '', title: '', modalVisible: false }

  _keyExtractor = item => item.episodeId

  _bundleKeyExtractor = item => item.soundcastId

  _handlePressInfo = ({ description, title }) =>
    this.setState({ description, title, modalVisible: true })

  _handlePressSoundcast = soundcastId => {
    this.props.screenProps.selectBundleSoundcast(soundcastId)
    NavigationService.navigate('SoundcastBundleDetails')
  }

  _hideModal = () => this.setState({ modalVisible: false })

  _handleLinkPress = (_, href) =>
    Linking.canOpenURL(href).then(
      canOpen =>
        canOpen
          ? Linking.openURL(href)
          : Linking.canOpenURL(`http://${href}`).then(
              canOpen =>
                canOpen
                  ? Linking.openURL(`http://${href}`)
                  : Linking.openURL(`https://${href}`),
            ),
    )

  render() {
    const {
      screenProps: {
        bundle,
        episodes,
        isFetching,
        bundleSoundcasts,
        soundcast: { blurredImageUrl },
      },
    } = this.props
    const { modalVisible, description, title } = this.state
    return (
      <Container>
        {isFetching ? (
          <Preloader renderContainer />
        ) : bundle ? (
          <TwoColFlatList
            data={bundleSoundcasts}
            keyExtractor={this._bundleKeyExtractor}
            renderItem={this._renderSoundcastItem}
          />
        ) : (
          <FlatList
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            data={episodes}
          />
        )}
        <Modal visible={modalVisible} onCloseModal={this._hideModal}>
          <BlurBackground imageUrl={blurredImageUrl} />
          <ModalHeaderText>{title}</ModalHeaderText>
          <ModalInner>
            <HTML onLinkPress={this._handleLinkPress} html={description} />
          </ModalInner>
        </Modal>
      </Container>
    )
  }
}

export default ContentTab
