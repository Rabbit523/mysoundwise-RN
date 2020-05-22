import React from 'react'
import { createStackNavigator } from 'react-navigation'
import {
  EpisodeLikesListContainer,
  EpisodeDetailsContainer,
  OtherProfileContainer,
  SoundcastsContainer,
  EpisodesContainer,
} from '../containers'
import { HeaderArrowButton, AbsoluteHeader, HeaderFiller } from '../components'
import * as NavigationService from '../NavigationService'
import theme from '../theme'
import { getHeaderTitleStyle, getHeaderStyle } from '../utils'

const SoundcastsTab = createStackNavigator(
  {
    Soundcasts: {
      screen: SoundcastsContainer,
      navigationOptions: {
        title: 'Soundcasts',
      },
    },
    Episodes: {
      screen: EpisodesContainer,
      navigationOptions: {
        header: (
          <AbsoluteHeader backgroundColor="transparent">
            <HeaderArrowButton onPress={NavigationService.goBack}>
              Soundcasts
            </HeaderArrowButton>
          </AbsoluteHeader>
        ),
      },
    },
    OtherProfileSoundcasts: {
      screen: OtherProfileContainer,
      navigationOptions: {
        headerLeft: <HeaderArrowButton onPress={NavigationService.goBack} />,
      },
    },
    EpisodeDetails: {
      screen: EpisodeDetailsContainer,
      navigationOptions: ({ navigation }) => ({
        header: (
          <AbsoluteHeader backgroundColor="transparent">
            <HeaderArrowButton
              onPress={() =>
                navigation.getParam('key')
                  ? NavigationService.navigate(navigation.getParam('key'))
                  : NavigationService.goBack()
              }
            />
          </AbsoluteHeader>
        ),
      }),
    },
    LikesList: {
      screen: EpisodeLikesListContainer,
      navigationOptions: {
        title: 'Likes',
        headerLeft: <HeaderArrowButton onPress={NavigationService.goBack} />,
        headerRight: <HeaderFiller />,
      },
    },
  },
  {
    initialRouteName: 'Soundcasts',
    headerMode: 'screen',
    cardStyle: { backgroundColor: theme.color.mainWhite },
    navigationOptions: {
      headerTitleStyle: getHeaderTitleStyle(),
      headerStyle: getHeaderStyle(),
    },
  },
)

export default SoundcastsTab
