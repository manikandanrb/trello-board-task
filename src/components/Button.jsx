import React from 'react'
import { string } from 'prop-types';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(46,68,78);
  line-height: 18px;
  border: none;
  transition-duration: 0.085s;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: ${props => props.list ? '5px' : '3px'};
  font-weight: ${props => props.list ? '600' : '500'};
  font-size: ${props =>
    (props.list && '14px')
    || (props.board && '14px')
    || '13px'
  };
  margin: ${props => props.list ? '8px' : '0'};
  width: ${props =>
    (props.list && '268px')
    || (props.board && '70px')
    || 'auto'
  };
  height: ${props =>
    (props.list && '48px')
    || (props.board && '34px')
    || 'auto'
  };
  transition-timing-function: ease-in;
  background-color: ${props =>
    (props.card && '#c0dfff')
    || (props.list && '#ffffff')
    || (props.board && '#c0defb;')
    || (props.add && '#c0defb;')
    || '#fff'
  };
  &:hover,
  &:focus,
  &:active {
    box-shadow: inset 0 0 0 2px rgba(0,0,0,0.2);
  }
`

const Button = (props) => {
  return (
    <StyledButton {...props}>
      {props.text}
    </StyledButton>
  )
}

Button.propTypes = {
  text: string.isRequired
}


export default Button;