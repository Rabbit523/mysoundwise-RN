import React from 'react'
import { createBottomTabNavigator } from 'react-navigation'
import theme from '../theme'
import {
  ProfileIcon,
  RadioIcon,
  MessageIcon,
  // NewsIcon,
  ExploreIcon,
} from '../assets/icons'
import ProfileNavigator from './Profile'
import MessagesNavigator from './Messages'
import ExploreNavigator from './Explore'
import SoundcastsNavigator from './Soundcasts'
// import UpdateNavigator from './Update'
import { Preloader, TabBarComponent } from '../components'
import { PlayerBarContainer } from '../containers'
import { TAB_BAR_HEIGHT } from '../constants'
import styled from 'styled-components'

const Main = createBottomTabNavigator(
  {
    // Update: {
    //   screen: UpdateNavigator,
    //   navigationOptions: {
    //     header: null,
    //     tabBarIcon: ({ focused }) => <NewsIcon active={focused} />,
    //   },
    // },
    SoundcastsTab: {
      screen: SoundcastsNavigator,
      navigationOptions: {
        header: null,
        tabBarLabel: 'Soundcasts',
        tabBarIcon: ({ focused }) => <RadioIcon active={focused} />,
      },
    },
    ExploreTab: {
      screen: ExploreNavigator,
      navigationOptions: {
        header: null,
        tabBarLabel: 'Explore',
        tabBarIcon: ({ focused }) => <ExploreIcon active={focused} />,
      },
    },
    MessagesTab: {
      screen: MessagesNavigator,
      navigationOptions: ({ screenProps: { refreshMessages } }) => ({
        header: null,
        tabBarLabel: 'Messages',
        tabBarOnPress: ({ defaultHandler }) => {
          refreshMessages()
          defaultHandler()
        },
        tabBarIcon: ({ focused }) => <MessageIcon active={focused} />,
      }),
    },
    ProfileTab: {
      screen: ProfileNavigator,
      navigationOptions: {
        header: null,
        tabBarIcon: ({ focused }) => <ProfileIcon active={focused} />,
        tabBarLabel: 'Me',
      },
    },
  },
  {
    order: [
      /* 'Update', */ 'SoundcastsTab',
      'ExploreTab',
      'MessagesTab',
      'ProfileTab',
    ],
    initialRouteName: 'SoundcastsTab',
    tabBarComponent: TabBarComponent,
    backBehavior: 'none',
    tabBarOptions: {
      iconStyle: {
        width: '100%',
        height: 25,
      },
      labelStyle: { padding: 0, margin: 0, fontSize: theme.size.xxxs },
      upperCaseLabel: false,
      inactiveTintColor: theme.color.fontGrey,
      activeTintColor: theme.color.mainOrange,
      showIcon: true,
      indicatorStyle: { backgroundColor: theme.color.tabBarColor },
      style: {
        backgroundColor: theme.color.tabBarColor,
        height: TAB_BAR_HEIGHT,
      },
    },
  },
)

const AbsoluteLoaderWrapper = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
`

const AbsoluteLoader = () => (
  <AbsoluteLoaderWrapper>
    <Preloader />
  </AbsoluteLoaderWrapper>
)

const MainWithPlayer = props => (
  <React.Fragment>
    <Main {...props} />
    <PlayerBarContainer />
    {props.screenProps.isPreparingTransition && <AbsoluteLoader />}
  </React.Fragment>
)

MainWithPlayer.router = Main.router

export default MainWithPlayer
