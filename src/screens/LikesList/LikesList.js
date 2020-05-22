import React from 'react'
import styled from 'styled-components'
import { FlatList } from 'react-native'
import {
  HeaderArrowButton,
  Preloader,
  StyledText,
  TEXT_SIZE,
  TEXT_WEIGHT,
} from '../../components'
import ListItem from './ListItem'
import { PlayerViewContainer as PlayerView } from '../../containers'
import * as NavigationService from '../../NavigationService'

const Container = styled.View`
  flex: 1;
`

const GuestLikes = StyledText.extend.attrs({
  size: TEXT_SIZE.M,
  weight: TEXT_WEIGHT.BOLD,
})`
  padding-left: 24px;
`

const AllGuests = styled.View`
  margin-top: 50px;
`

class LikesList extends React.Component {
  static navigationOptions = {
    headerLeft: (
      <HeaderArrowButton onPress={NavigationService.goBack}>
        Back
      </HeaderArrowButton>
    ),
  }

  componentDidMount() {
    const {
      entityType,
      entityId,
      entityLikesCount,
      likesList,
      requestLikes,
    } = this.props
    if (entityLikesCount > likesList.length) {
      requestLikes({ entityType, entityId })
    }
  }

  render() {
    const { likesList, isFetching, addTopPadding } = this.props
    return (
      <PlayerView>
        <Container addTopPadding={addTopPadding}>
          {isFetching ? (
            <Preloader renderContainer />
          ) : (
            <FlatList
              data={likesList}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
              ListFooterComponent={this._renderFooter}
            />
          )}
        </Container>
      </PlayerView>
    )
  }

  _keyExtractor = ({ likeId }) => likeId

  _renderItem = ({ item: { userId, firstName, lastName, picUrl } }) => {
    const { selectUser, otherProfileRoute } = this.props
    return (
      <ListItem
        imageUrl={picUrl}
        firstName={firstName}
        lastName={lastName}
        userId={userId}
        selectUser={selectUser}
        otherProfileRoute={otherProfileRoute}
      />
    )
  }

  _renderFooter = () => {
    const { likesList, entityLikesCount } = this.props
    // `likesList` is 'subscriberList' and `entityLikesCount` is 'total likes'

    // when all the likes are from guests
    if (likesList.length === 0) {
      return (
        <AllGuests>
          <GuestLikes>{`${entityLikesCount} likes from guests`}</GuestLikes>
        </AllGuests>
      )
    }

    const countGuests = entityLikesCount - likesList.length
    return (
      countGuests > 0 && (
        <GuestLikes>{`And ${countGuests} guest${
          countGuests > 1 ? 's' : ''
        }`}</GuestLikes>
      )
    )
  }
}

export default LikesList
