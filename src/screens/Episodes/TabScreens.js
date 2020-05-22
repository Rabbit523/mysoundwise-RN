import R from 'ramda'
import React from 'react'
import styled from 'styled-components'
import { EpisodesListContainer } from '../../containers'

const TabContainer = styled.View`
  flex: 1;
`

export const OnDeviceScreen = ({ screenProps: { episodes, ...rest } }) => (
  <TabContainer>
    <EpisodesListContainer
      episodes={R.filter(R.propEq('isLoaded', true), episodes)}
      {...rest}
    />
  </TabContainer>
)

export const AllScreen = ({ screenProps }) => (
  <TabContainer>
    <EpisodesListContainer {...screenProps} />
  </TabContainer>
)
