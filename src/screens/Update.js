import React from 'react'
import R from 'ramda'
import PropTypes from 'prop-types'
import {
  StyledText,
  TEXT_COLOR,
  TEXT_SIZE,
  Avatar,
  Preloader,
  TEXT_WEIGHT,
} from '../components'
import styled from 'styled-components'
import {
  PlayerViewContainer as PlayerView,
  ThemedRefreshControlContainer as RefreshControl,
} from '../containers'
import { isExists, formatDateForMonth } from '../utils'

const FlatList = styled.FlatList`
  flex: 1;
`

const ListItemWrapper = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  padding: 12.3px 19px 7.7px 13px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.color.updatesBorder};
`

const TextWrapper = styled.View`
  flex: 1;
  margin-left: 13px;
`

const Text = StyledText.extend.attrs({
  size: TEXT_SIZE.XS,
  numberOfLines: 3,
})``

const BoldText = StyledText.extend.attrs({
  size: TEXT_SIZE.XS,
  weight: TEXT_WEIGHT.BOLD,
})``

const DateText = StyledText.extend.attrs({
  size: TEXT_SIZE.XS,
  color: TEXT_COLOR.FONT_GREY,
})``

class ListItem extends React.PureComponent {
  static propTypes = {
    imageUrl: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    content: PropTypes.array.isRequired,
    onPressItem: PropTypes.func.isRequired,
  }

  _handlePress = () => this.props.onPressItem(this.props)

  render() {
    const { imageUrl, timestamp, content, firstName, lastName } = this.props
    return (
      <ListItemWrapper onPress={this._handlePress}>
        <Avatar
          size={40}
          imageUrl={imageUrl}
          firstName={firstName}
          lastName={lastName}
        />
        <TextWrapper>
          <Text>
            {R.map(
              arr =>
                arr[1] === 'b' ? (
                  <BoldText key={arr[0]}>{arr[0]}</BoldText>
                ) : (
                  arr[0]
                ),
              content,
            )}
          </Text>
          <DateText>{formatDateForMonth(timestamp)}</DateText>
        </TextWrapper>
      </ListItemWrapper>
    )
  }
}

const FooterLoaderWrapper = styled.View`
  padding: 12.3px 19px 7.7px 13px;
`

const FooterLoader = ({ isFetching }) =>
  isFetching && (
    <FooterLoaderWrapper>
      <Preloader renderContainer />
    </FooterLoaderWrapper>
  )

FooterLoader.propTypes = { isFetching: PropTypes.bool.isRequired }

class Update extends React.PureComponent {
  _renderItem = ({ item }) => (
    <ListItem {...item} onPressItem={this.props.prepareForTransition} />
  )

  _keyExtractor = ({ updateId }) => updateId

  componentDidMount() {
    this.props.requestUpdates()
  }

  _renderLoader = () => <FooterLoader isFetching={this.props.isFetching} />

  _loadUpdates = () => {
    const { isPagesEnded, requestUpdates } = this.props
    if (!isPagesEnded) requestUpdates()
  }

  render() {
    const { updates, isFetching, isRefreshing, refreshUpdates } = this.props
    return (
      <PlayerView>
        {isExists(updates) ? (
          <FlatList
            data={updates}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refreshUpdates}
              />
            }
            onEndReachedTreshold={0.1}
            onEndReached={this._loadUpdates}
            ListFooterComponent={this._renderLoader}
          />
        ) : (
          isFetching && <Preloader renderContainer />
        )}
      </PlayerView>
    )
  }
}

export default Update
