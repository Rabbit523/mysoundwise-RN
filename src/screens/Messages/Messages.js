import React from 'react'
import R from 'ramda'
import styled from 'styled-components'
import {
  MessageContainer as Message,
  PlayerViewContainer as PlayerView,
  ThemedRefreshControlContainer as RefreshControl,
} from '../../containers'
import { Preloader, Placeholders } from '../../components'
import Header from './Header'
import SoundcastItem from './SoundcastItem'
import * as NavigationService from '../../NavigationService'
import { isExists } from '../../utils'

const FlatList = styled.FlatList`
  flex: 1;
`

const OverlayBackground = styled.View`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
`

class Messages extends React.Component {
  state = {
    isDropdownShown: false,
    selectedSubscription: '',
  }

  _messageKeyExtractor = ({ messageId }) => messageId

  _soundcastKeyExtractor = ({ soundcastId }) => soundcastId

  _renderItem = ({
    item: { firstName, lastName, messageId, picUrl, ...rest },
  }) => {
    const goToDetails = () => {
      this.props.selectMessage(messageId)
      NavigationService.navigate('MessageDetails', {
        dateCreated: rest.createdAt,
        publisherName: [firstName, lastName].join(' '),
        publisherImageUrl: picUrl,
      })
    }
    return (
      <Message
        {...rest}
        showPublisher
        messageId={messageId}
        publisherImageUrl={picUrl}
        publisherFirstName={firstName}
        publisherLastName={lastName}
        onLikeTextPress={goToDetails}
        onCommentTextPress={goToDetails}
      />
    )
  }

  _showLikesList = messageId => () => {
    this.props.selectMessage(messageId)
    NavigationService.navigate('MessageLikes')
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Header
        {...navigation.getParam('headerInfo')}
        onPress={navigation.getParam('handlePressArrow')}
        arrowDown={navigation.getParam('arrowDown')}
      />
    ),
  })

  _handlePressArrow = () => {
    const { isDropdownShown } = this.state
    this.setState({ isDropdownShown: !isDropdownShown })
    this.props.navigation.setParams({ arrowDown: isDropdownShown })
  }

  _onPressSubscriptionItem = soundcast => {
    this._selectSubscription(soundcast)
    this._handlePressArrow()
  }

  _selectSubscription = ({ soundcastId, imageUrl, title }) => {
    const { selectSubscription, requestMessages, navigation } = this.props
    this.setState({ selectedSubscription: soundcastId })
    selectSubscription(soundcastId)
    requestMessages(soundcastId)
    navigation.setParams({
      headerInfo: { title, imageUrl, onlyTitle: false },
    })
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handlePressArrow: this._handlePressArrow,
      arrowDown: true,
      headerInfo: { onlyTitle: true, title: 'Messages' },
    })
  }

  componentDidUpdate(oldProps) {
    const { playlistId, soundcasts, subscription } = this.props
    const { selectedSubscription } = this.state
    if (soundcasts.length) {
      let soundcast
      if (isExists(playlistId) && oldProps.playlistId !== playlistId) {
        soundcast = R.find(R.propEq('soundcastId', playlistId), soundcasts)
      } else if (
        isExists(subscription) &&
        selectedSubscription !== subscription
      ) {
        soundcast = R.find(R.propEq('soundcastId', subscription), soundcasts)
      } else if (!isExists(selectedSubscription)) {
        soundcast = soundcasts[0]
      }
      if (soundcast) {
        this._selectSubscription(soundcast)
      }
    }
  }

  _renderSoundcastItem = ({ item }) => (
    <SoundcastItem
      onPress={this._onPressSubscriptionItem}
      isSelected={this.state.selectedSubscription === item.soundcastId}
      {...item}
    />
  )

  render() {
    const { isDropdownShown } = this.state
    const {
      messages,
      soundcasts,
      refreshMessages,
      isFetchingMessages,
      isRefreshingMessages,
      isFetchingSoundcasts,
    } = this.props
    return (
      <PlayerView>
        {isFetchingMessages && !messages.length ? (
          <Preloader renderContainer />
        ) : (
          <FlatList
            ListEmptyComponent={<Placeholders.MessagesPlaceholder />}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshingMessages}
                onRefresh={refreshMessages}
              />
            }
            keyExtractor={this._messageKeyExtractor}
            renderItem={this._renderItem}
            data={messages}
          />
        )}
        {isDropdownShown && (
          <OverlayBackground>
            {isFetchingSoundcasts ? (
              <Preloader renderContainer />
            ) : (
              <FlatList
                data={soundcasts}
                keyExtractor={this._soundcastKeyExtractor}
                renderItem={this._renderSoundcastItem}
              />
            )}
          </OverlayBackground>
        )}
      </PlayerView>
    )
  }
}

export default Messages
