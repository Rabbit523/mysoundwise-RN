import React from 'react'
import R from 'ramda'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ExploreSoundcast from './CardSoundcast'
import { StyledText, TEXT_COLOR, TEXT_SIZE } from '../components'
import { HITSLOP_10, PAGINATION_LIMITS } from '../constants'

const Container = styled.View`
  margin-bottom: 24px;
`

const Head = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-horizontal: 17px;
`

const TitleText = StyledText.extend.attrs({
  size: TEXT_SIZE.XL,
})`
  flex: 1;
`

const MoreText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXXM,
  color: TEXT_COLOR.MAIN_ORANGE,
})`
  flex-shrink: 0;
  margin-left: 10px;
  line-height: ${({ theme }) => theme.size.xl * 1.5}px;
`

const Touchable = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
  hitSlop: HITSLOP_10,
})``

const MoreButton = props => (
  <Touchable {...props}>
    <MoreText>More</MoreText>
  </Touchable>
)

const FlatList = styled.FlatList.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
})``

class ExploreList extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    soundcasts: PropTypes.array.isRequired,
    showLimit: PropTypes.number.isRequired,
    categoryId: PropTypes.string.isRequired,
    onPressMore: PropTypes.func.isRequired,
    onPressSoundcast: PropTypes.func.isRequired,
  }

  static defaultProps = {
    showLimit: PAGINATION_LIMITS.CATEGORY_SONDCASTS,
  }

  _keyExtractor = ({ soundcastId }) => soundcastId

  _renderItem = ({ item: { title, imageUrl, publisherName, soundcastId } }) => (
    <ExploreSoundcast
      title={title}
      imageUrl={imageUrl}
      soundcastId={soundcastId}
      publisherName={publisherName}
      onPressItem={this.props.onPressSoundcast}
    />
  )

  _handlePressMore = () => {
    const { onPressMore, title, categoryId } = this.props
    onPressMore({ title, categoryId })
  }

  render() {
    const { title, showLimit, soundcasts } = this.props
    return (
      <Container>
        <Head>
          <TitleText>{title}</TitleText>
          <MoreButton onPress={this._handlePressMore} />
        </Head>
        <FlatList
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          data={R.take(showLimit, soundcasts)}
        />
      </Container>
    )
  }
}

export default ExploreList
