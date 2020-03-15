import React from 'react';
import { string } from 'prop-types';
import styled from 'styled-components';

const StyledListTitleButton = styled.button`
  flex-grow: 1;
  padding: 10px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  background: #F8F8F8;
  color: rgb(46,68,78);
  font-size: 14px;
  border: none;
  cursor: pointer;
  border-top-left-radius: 3px;
`

const ListTitleButton = (props) => {
  const { text } = props;
  return (
    <StyledListTitleButton {...props}>
      {text}
    </StyledListTitleButton>
  );
}

ListTitleButton.propTypes = {
  text: string.isRequired
}

export default ListTitleButton;