import React from 'react'
import styled from 'styled-components'
import {
  Avatar,
  Preloader,
  StyledText,
  TEXT_COLOR,
  TEXT_SIZE,
  TEXT_WEIGHT,
} from '../../components'
import { ListMarkerIcon } from '../../assets/icons'
import { isExists } from '../../utils'
import getRNDraftJSBlocks from 'react-native-draftjs-render'
import theme from '../../theme'

const AboutContainer = styled.ScrollView.attrs({
  contentContainerStyle: { paddingVertical: 15 },
})`
  flex: 1;
  background-color: ${({ theme }) => theme.color.mainWhite};
`

const PaddingWrapper = styled.View`
  padding-horizontal: 22px;
`

const Text = StyledText.extend.attrs({
  size: TEXT_SIZE.M,
  color: TEXT_COLOR.FONT_BLACK,
})``

const HeaderText = StyledText.extend.attrs({
  size: TEXT_SIZE.L,
  color: TEXT_COLOR.FONT_BLACK,
  weight: TEXT_WEIGHT.BOLD,
})`
  margin-bottom: 7px;
  text-align: center;
`

const Divider = styled.View`
  height: 0.5px;
  background-color: ${({ theme }) => theme.color.border};
  margin-top: 13px;
  margin-bottom: 26px;
`

const ListItemWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 14px;
`

const IndentText = Text.extend`
  margin-left: 11.3px;
`

const ListItem = ({ text }) => (
  <ListItemWrapper>
    <ListMarkerIcon />
    <IndentText>{text}</IndentText>
  </ListItemWrapper>
)

const HostHeadWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`

const HostBlock = ({ imageUrl, name, text }) => (
  <React.Fragment>
    <HeaderText>Your Host</HeaderText>
    <HostHeadWrapper>
      <Avatar size={52} imageUrl={imageUrl} firstName={name} />
      <IndentText>{name}</IndentText>
    </HostHeadWrapper>
    <Text>{text}</Text>
  </React.Fragment>
)

const LoaderWrapper = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.mainWhite};
`

const Loader = () => (
  <LoaderWrapper>
    <Preloader renderContainer />
  </LoaderWrapper>
)

const descriptionStyles = {
  paragraph: {
    color: theme.color.fontBlack,
    fontSize: theme.size.m,
    marginVertical: 8.5,
  },
  unstyled: {
    color: theme.color.fontBlack,
    fontSize: theme.size.m,
    marginVertical: 8.5,
  },
  'ordered-list-item': {
    color: theme.color.fontBlack,
    fontSize: theme.size.m,
    marginVertical: 2.5,
  },
  'unordered-list-item': {
    color: theme.color.fontBlack,
    fontSize: theme.size.m,
    marginVertical: 2.5,
  },
}

export class AboutTab extends React.PureComponent {
  _renderContent = () => {
    const {
      screenProps: {
        soundcast: {
          shortDescription,
          longDescription,
          features,
          hostName,
          hostBio,
          hostImageUrl,
        },
      },
    } = this.props

    return (
      <AboutContainer>
        {isExists(shortDescription) && (
          <PaddingWrapper>
            <Text>{shortDescription}</Text>
          </PaddingWrapper>
        )}
        {isExists(features) && (
          <React.Fragment>
            {isExists(shortDescription) && <Divider />}
            <PaddingWrapper>
              <HeaderText>What You Will Get</HeaderText>
              {features.map((val, key) => <ListItem key={key} text={val} />)}
            </PaddingWrapper>
          </React.Fragment>
        )}
        {isExists(longDescription) && (
          <React.Fragment>
            {(isExists(features) || isExists(shortDescription)) && <Divider />}
            <PaddingWrapper>
              {getRNDraftJSBlocks({
                contentState: longDescription,
                customStyles: descriptionStyles,
              })}
            </PaddingWrapper>
          </React.Fragment>
        )}
        {isExists(hostName) &&
          isExists(hostBio) && (
            <React.Fragment>
              {(isExists(features) ||
                isExists(shortDescription) ||
                isExists(longDescription)) && <Divider />}
              <PaddingWrapper>
                <HostBlock
                  imageUrl={hostImageUrl}
                  name={hostName}
                  text={hostBio}
                />
              </PaddingWrapper>
            </React.Fragment>
          )}
      </AboutContainer>
    )
  }

  render() {
    const {
      screenProps: { isFetching },
    } = this.props
    return isFetching ? <Loader /> : this._renderContent()
  }
}

export default AboutTab
