import styled from 'styled-components'
import { Platform } from 'react-native'
export const TEXT_SIZE = {
  XXXXL: 'xxxxl',
  XXXL: 'xxxl',
  XXL: 'xxl',
  XL: 'xl',
  L: 'l',
  M: 'm',
  XM: 'xm',
  XXM: '`xxm',
  XXXM: 'xxxm',
  S: 's',
  XS: 'xs',
  XXS: 'xxs',
  XXXS: 'xxxs',
}

export const TEXT_COLOR = {
  MAIN_WHITE: 'mainWhite',
  MAIN_ORANGE: 'mainOrange',
  MAIN_BLACK: 'mainBlack',
  ALMOST_BLACK: 'almostBlack',
  FONT_BLACK: 'fontBlack',
  FONT_GREY: 'fontGrey',
  FONT_PURPLE: 'fontPurple',
  LINK_BLUE: 'linkBlue',
  SEARCH_GRAY: 'searchGray',
  EPISODE_DATE: 'episodeDate',
  ERROR: 'error',
}

export const TEXT_WEIGHT = {
  BOLD: 'bold',
  REGULAR: 'regular',
  LIGHT: 'light',
  SEMI: 'semi',
}

export const StyledText = styled.Text`
  ${Platform.OS === 'android' ? 'font-family: Roboto;' : ''}
  font-weight: ${({ weight, theme }) =>
    theme.weight[weight] || theme.weight.regular};
  font-size: ${({ size, theme }) => theme.size[size] || theme.size.s}px;
  color: ${({ color, theme }) => theme.color[color] || theme.color.mainBlack};
`
