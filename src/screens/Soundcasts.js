import React from 'react'
import R from 'ramda'
import styled from 'styled-components'
import {
  SearchBar,
  Preloader,
  StyledText,
  Placeholders,
  SoundcastImage,
  TEXT_SIZE,
  TEXT_COLOR,
} from '../components'
import { PlayerViewContainer as PlayerView } from '../containers'
import moment from 'moment'
import * as NavigationService from '../NavigationService'

const Container = styled.View`
  flex: 1;
`

const ListItem = styled.TouchableOpacity.attrs({
  activeOpacity: 0.6,
})`
  padding: 16px 17px;
  border-bottom-width: 1px;
  flex-direction: row;
  border-color: ${({ theme }) => theme.color.border};
`

const TitleWrapper = styled.View`
  margin-left: 19px;
  flex-shrink: 1;
  flex: 1;
`

const TitleText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXXM,
})``

const DateText = StyledText.extend.attrs({
  color: TEXT_COLOR.FONT_BLACK,
  size: TEXT_SIZE.M,
})``

class SoundcastItem extends React.PureComponent {
  render() {
    const { imageUrl, title, date } = this.props

    return (
      <ListItem onPress={this._handlePress}>
        <SoundcastImage imageUrl={imageUrl} />
        <TitleWrapper>
          <TitleText>{title}</TitleText>
          <DateText>{date}</DateText>
        </TitleWrapper>
      </ListItem>
    )
  }

  _handlePress = () => this.props.onPressItem(this.props.soundcastId)
}

const FlatList = styled.FlatList`
  flex: 1;
`

class Soundcasts extends React.Component {
  state = {
    filteredSoundcasts: null,
  }

  _getItemLayout = (_, index) => ({
    length: 110,
    offset: 110 * index,
    index,
  })

  render() {
    const { isFetching, userSoundcasts } = this.props
    const { filteredSoundcasts } = this.state
    return (
      <PlayerView>
        <Container>
          <SearchBar search={this._filterSoundcasts} />
          {isFetching && R.isEmpty(userSoundcasts) ? (
            <Preloader renderContainer />
          ) : R.isEmpty(userSoundcasts) ? (
            <Placeholders.SoundcastsPlaceholder />
          ) : (
            <FlatList
              data={filteredSoundcasts ? filteredSoundcasts : userSoundcasts}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              getItemLayout={this._getItemLayout}
            />
          )}
        </Container>
      </PlayerView>
    )
  }

  _keyExtractor = ({ soundcastId }) => soundcastId

  _renderItem = ({ item }) => (
    <SoundcastItem
      imageUrl={item.imageUrl}
      title={item.title}
      soundcastId={item.soundcastId}
      onPressItem={this._goToSoundcast}
      date={moment.unix(item.updateDate).format('MMM D')}
    />
  )

  _goToSoundcast = soundcastId => {
    this.props.selectSoundcast(soundcastId)
    NavigationService.navigate('Episodes')
  }

  _filterSoundcasts = word =>
    this.setState({
      filteredSoundcasts: R.filter(
        R.pipe(
          R.prop('title'),
          R.toLower,
          R.contains(R.toLower(word)),
        ),
        this.props.userSoundcasts,
      ),
    })
}

export default Soundcasts
