import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { SearchIcon } from '../assets/icons'
import { StyledText, TEXT_COLOR, TEXT_SIZE } from '../components'
import { isExists } from '../utils'
import { HITSLOP_10 } from '../constants'

const SearchWrapper = styled.View`
  padding: 7px 8px;
  background-color: ${({ theme }) => theme.color.searchBackground};
  flex-direction: row;
  align-items: center;
`

const SearchInner = styled.View`
  justify-content: center;
  flex: 1;
`

const SearchPlaceholderText = StyledText.extend.attrs({
  color: TEXT_COLOR.SEARCH_GRAY,
  size: TEXT_SIZE.XM,
})`
  margin-left: 8px;
`
const Touchable = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
  hitslop: HITSLOP_10,
})``

const CancelText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXXM,
  color: TEXT_COLOR.MAIN_ORANGE,
})``

const CancelButtonWrapper = Touchable.extend`
  margin-left: 8px;
`

const CancelButton = props => (
  <CancelButtonWrapper {...props}>
    <CancelText>Cancel</CancelText>
  </CancelButtonWrapper>
)

const SearchPlaceholderWrapper = Touchable.extend`
position: absolute;
align-self: center
width: 100%;
height: 100%;
flex-direction: row;
justify-content: center;
align-items: center;
`

const SearchPlaceholder = ({ placeholderText, ...rest }) => (
  <SearchPlaceholderWrapper {...rest}>
    <SearchIcon />
    <SearchPlaceholderText>
      {placeholderText ? placeholderText : 'Search'}
    </SearchPlaceholderText>
  </SearchPlaceholderWrapper>
)

const SearchInput = styled.TextInput.attrs({
  underlineColorAndroid: 'transparent',
})`
background-color: ${({ theme }) => theme.color.mainWhite}
padding: 5px 5px 7px 5px;
border-radius: 5px;
font-size: ${({ theme }) => theme.size.xm};
`

class Search extends React.PureComponent {
  state = { focused: false, text: '' }

  static propTypes = {
    search: PropTypes.func.isRequired,
    placeholderText: PropTypes.string,
    showCancelButton: PropTypes.bool,
    onCancel: PropTypes.func,
  }

  _hidePlaceholder = () => this.setState({ focused: true }, this.input.focus)

  _showPlacholder = () => this.setState({ focused: false })

  _onChangeText = text => {
    this.props.search(text)
    this.setState({ text })
  }

  _onPressCancel = () => this.setState({ text: '' }, this.props.onCancel)

  render() {
    const { focused, text } = this.state
    const { placeholderText, showCancelButton } = this.props
    return (
      <SearchWrapper>
        <SearchInner>
          <SearchInput
            onChangeText={this._onChangeText}
            onBlur={this._showPlacholder}
            innerRef={ref => (this.input = ref)}
            value={text}
          />
          {!focused &&
            !isExists(text) && (
              <SearchPlaceholder
                placeholderText={placeholderText}
                onPress={this._hidePlaceholder}
              />
            )}
        </SearchInner>
        {showCancelButton && <CancelButton onPress={this._onPressCancel} />}
      </SearchWrapper>
    )
  }
}

export default Search
