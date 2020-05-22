import React from 'react'
import styled from 'styled-components'
import {
  HeaderArrowButton,
  SearchSoundcast,
  HeaderFiller,
  Preloader,
} from '../components'
import {
  PlayerViewContainer as PlayerView,
  ThemedRefreshControlContainer as RefreshControl,
} from '../containers'
import * as NavigationService from '../NavigationService'

const Container = styled.View`
  flex: 1;
`

const FlatList = styled.FlatList.attrs({
  initialNumToRender: 7,
  onEndReachedThreshold: 0.1,
})``

const FooterLoaderWrapper = styled.View`
  height: 107px;
`

const FooterLoader = ({ isFetching }) =>
  isFetching && (
    <FooterLoaderWrapper>
      <Preloader renderContainer />
    </FooterLoaderWrapper>
  )

class ExploreDetails extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('title'),
    headerLeft: <HeaderArrowButton onPress={() => navigation.goBack()} />,
    headerRight: <HeaderFiller />,
  })

  _getItemLayout = (_, index) => ({
    length: SearchSoundcast.ITEM_HEIGHT,
    offset: SearchSoundcast.ITEM_HEIGHT * index,
    index,
  })

  _handlePressSoundcast = soundcastId => {
    this.props.selectExploreSoundcast(soundcastId)
    NavigationService.navigate('SoundcastDetails')
  }

  _renderItem = ({ item: { title, publisherName, imageUrl, soundcastId } }) => {
    const subtitle =
      publisherName !== undefined &&
      publisherName !== null &&
      publisherName.toLowerCase() !== 'online imported podcast'
        ? publisherName
        : ''
    return (
      <SearchSoundcast
        title={title}
        imageUrl={imageUrl}
        soundcastId={soundcastId}
        subtitle={subtitle}
        onPress={this._handlePressSoundcast}
      />
    )
  }

  _keyExtractor = ({ soundcastId }) => soundcastId

  _loadData = () => {
    const { pagesEnded, requestSoundcastsByCategory } = this.props
    if (!pagesEnded) requestSoundcastsByCategory()
  }

  _refreshData = () =>
    this.props.refreshSoundcastsByCategory(this.props.category.categoryId)

  componentDidMount() {
    this.props.requestSoundcastsByCategory()
  }

  render() {
    const {
      isFetching,
      isRefreshing,
      category: { soundcasts },
    } = this.props
    return (
      <PlayerView>
        <Container>
          {isFetching && !soundcasts.length ? (
            <Preloader renderContainer />
          ) : (
            <FlatList
              ListFooterComponent={<FooterLoader isFetching={isFetching} />}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={this._refreshData}
                />
              }
              onEndReached={this._loadData}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              getItemLayout={this._getItemLayout}
              data={soundcasts}
            />
          )}
        </Container>
      </PlayerView>
    )
  }
}

export default ExploreDetails
