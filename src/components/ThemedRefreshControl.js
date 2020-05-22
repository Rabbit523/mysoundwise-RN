import React from 'react'
import { RefreshControl } from 'react-native'

const ThemedRefreshControl = ({ theme, ...rest }) => (
  <RefreshControl
    colors={[theme.color.mainOrange]}
    tintColor={theme.color.mainOrange}
    {...rest}
  />
)

export default ThemedRefreshControl
