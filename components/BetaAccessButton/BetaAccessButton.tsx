import React from 'react';
import Image from 'next/image';

import {Col, Container, Row } from 'react-bootstrap';

import styles from './BetaAccessButton.module.css';
import classnames from 'classnames';

interface BetaAccessButtonProps
  extends React.HTMLAttributes<HTMLAnchorElement> {}

export const BetaAccessButton = (props: BetaAccessButtonProps) => {
  return (
    <a href="" className={classnames(props.className, styles.button)}>
      Beta Access
    </a>)

}