import React from 'react';
import styled from 'styled-components';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';

const StyledDeleteListButton = styled.button`
  border: 0;
  padding: 0;
  margin-right: 10px;
  background: #F8F8F8;
  color: rgb(46,68,78);
  cursor: pointer;
  font-size: 18px;
  opacity: 0.8;
  &:hover,
  &:focus,
  &:active {
    color: #DA3849;
    opacity: 1;
  }
`

const DeleteListButton = (props) => {  
  return (
    <StyledDeleteListButton {...props}>
      <FaTimesCircle />
    </StyledDeleteListButton>
  );
}

export default DeleteListButton;