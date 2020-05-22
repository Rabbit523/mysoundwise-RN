import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Avatar,
  StyledText,
  TEXT_SIZE,
  TEXT_WEIGHT,
  OrangeButton,
} from '../../components'
import * as NavigationService from '../../NavigationService'

const ListItemWrapper = styled.View`
  padding: 14.5px 24px;
  align-items: center;
  flex-direction: row;
`

const NameText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXM,
  weight: TEXT_WEIGHT.BOLD,
})`
  flex: 1;
  flex-shrink: 1;
  margin-horizontal: 19px;
`

class ListItem extends React.PureComponent {
  static propTypes = {
    imageUrl: PropTypes.string,
    lastName: PropTypes.string,
    firstName: PropTypes.string,
    onButtonPress: PropTypes.func,
    otherProfileRoute: PropTypes.string.isRequired,
  }

  _handlePress = () => {
    const { userId, selectUser, otherProfileRoute } = this.props
    selectUser(userId)
    if (otherProfileRoute) {
      NavigationService.navigate(otherProfileRoute)
    }
  }

  render() {
    const { imageUrl, firstName, lastName } = this.props
    return (
      <ListItemWrapper>
        <Avatar
          imageUrl={imageUrl}
          firstName={firstName}
          lastName={lastName}
          size={40}
        />
        <NameText>{[firstName, lastName].join(' ')}</NameText>
        <OrangeButton title="View profile" onPress={this._handlePress} />
      </ListItemWrapper>
    )
  }
}

export default ListItem
