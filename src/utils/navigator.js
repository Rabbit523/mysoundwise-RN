import theme from '../theme'

export const getHeaderStyle = backgroundColor => ({
  backgroundColor: backgroundColor
    ? backgroundColor
    : theme.color.headerBackgroundColor,
  borderBottomWidth: 0,
  shadowRadius: 0,
  elevation: 0,
})

export const getHeaderTitleStyle = () => ({
  alignSelf: 'center',
  textAlign: 'center',
  fontWeight: theme.weight.semi,
  flex: 1,
})

export const getHeaderAbsoluteStyle = backgroundColor => ({
  ...getHeaderStyle(backgroundColor),
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
})
