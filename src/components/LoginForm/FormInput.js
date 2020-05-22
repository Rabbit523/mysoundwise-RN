import React from 'react'
import styled from 'styled-components'
import { TEXT_SIZE, TEXT_COLOR, StyledText } from '../typography'
import { isExists } from '../../utils'

const Input = styled.TextInput.attrs({
  underlineColorAndroid: 'transparent',
})`
  font-size: ${({ theme }) => theme.size.xl};
`

const InputLabel = StyledText.extend.attrs({
  size: TEXT_SIZE.l,
})`
  margin-bottom: 11px;
`

const InputWrapper = styled.View`
  margin-bottom: 36px;
`

const Error = StyledText.extend.attrs({
  size: TEXT_SIZE.XXS,
  color: TEXT_COLOR.ERROR,
})``

const FormInput = ({ labelText, placeholderText, error, ...rest }) => (
  <InputWrapper>
    {isExists(labelText) && <InputLabel>{labelText}</InputLabel>}
    <Input placeholder={placeholderText} {...rest} />
    {isExists(error) && <Error>{error}</Error>}
  </InputWrapper>
)

export default FormInput
