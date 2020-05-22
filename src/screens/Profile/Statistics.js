import React from 'react'
import styled from 'styled-components'
import { Preloader, StyledText, TEXT_SIZE, TEXT_COLOR } from '../../components'
import { View } from 'react-native'

const StatWrapper = styled.View`
  margin-bottom: 14px;
`

const StatBlock = styled.View`
  margin-top: 14px;
  background-color: ${({ theme }) => theme.color.headerBackgroundColor}
  flex-direction: row;
  border-radius: 6px;
  justify-content: space-between;
  padding: 13px 40px 19px;
`

const StatHeader = StyledText.extend.attrs({
  size: TEXT_SIZE.XL,
  color: TEXT_COLOR.FONT_BLACK,
})``

const StatText = StyledText.extend.attrs({
  size: TEXT_SIZE.M,
})`
  text-align: center;
`

class Statistics extends React.PureComponent {
  render() {
    const {
      title,
      listenedCount,
      likesCount,
      commentsCount,
      isFetching,
    } = this.props

    return (
      <StatWrapper>
        <StatHeader>{title}</StatHeader>
        {isFetching ? (
          <Preloader />
        ) : (
          <StatBlock>
            <View>
              <StatText>{listenedCount}</StatText>
              <StatText>Listened</StatText>
            </View>
            <View>
              <StatText>{likesCount}</StatText>
              <StatText>{likesCount === 1 ? 'Like' : 'Likes'}</StatText>
            </View>
            <View>
              <StatText>{commentsCount}</StatText>
              <StatText>
                {commentsCount === 1 ? 'Comment' : 'Comments'}
              </StatText>
            </View>
          </StatBlock>
        )}
      </StatWrapper>
    )
  }
}

export default Statistics
