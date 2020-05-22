import React from 'react'
import styled from 'styled-components'
import UserInfo from './UserInfo'
import Statistics from './Statistics'
import { PlayerViewContainer as PlayerView } from '../../containers'
import * as NavigationService from '../../NavigationService'

const Scroll = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 26,
  },
})`
  flex: 1;
`

class Profile extends React.Component {
  _navigateToEdit = () => NavigationService.navigate('Edit')

  render() {
    const {
      userInfo: { firstName, lastName, link, bio, picUrl },
      isFetchingInfo,
      isMe,
      monthStatistics: {
        listened: mListened,
        likes: mLikes,
        comments: mComments,
      },
      weekStatistics: {
        listened: wListened,
        likes: wLikes,
        comments: wComments,
      },
      isFetchingMonthStatistics,
      isFetchingWeekStatistics,
    } = this.props

    return (
      <PlayerView>
        <Scroll>
          <UserInfo
            info={bio}
            isMe={isMe}
            imageUrl={picUrl}
            firstName={firstName}
            lastName={lastName}
            websiteUrl={link}
            isFetching={isFetchingInfo}
            onEditProfile={this._navigateToEdit}
          />
          <Statistics
            title="This week"
            listenedCount={wListened}
            likesCount={wLikes}
            commentsCount={wComments}
            isFetching={isFetchingWeekStatistics}
          />
          <Statistics
            title="This month"
            listenedCount={mListened}
            likesCount={mLikes}
            commentsCount={mComments}
            isFetching={isFetchingMonthStatistics}
          />
        </Scroll>
      </PlayerView>
    )
  }

  componentDidMount() {
    const { requestOtherUserInfo, selectedUser, isMe } = this.props
    isMe || requestOtherUserInfo(selectedUser)
  }
}

export default Profile
