import React, { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import { Theme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ButtonProps } from '@mui/material/Button'
import useConfig from '../../../hooks/useConfig'

interface BaseButtonProps extends Pick<ButtonProps, 'onClick' | 'type' | 'startIcon' | 'endIcon'> {
  variant?: 'contained' | 'outlined' | 'text'
  color?: 'default' | 'primary' | 'secondary' | 'dark' | 'light'
  size?: 'small' | 'medium' | 'large'
  disableHoverEffect?: boolean,
  disabled?: boolean,
  fullwidth?: boolean,
  borderRadius?: number,
  sx?: React.CSSProperties
}
interface StyledButtonRootProps extends BaseButtonProps {
  theme?: Theme
}

const StyledButtonRoot = styled('button', {
  shouldForwardProp: (prop) =>
    prop !== 'variant' && prop !== 'color' && prop !== 'size' && prop !== 'disableHoverEffect',
})<StyledButtonRootProps>(({ theme, color, variant, size, borderRadius, disableHoverEffect, disabled, fullwidth }) => ({
  minWidth: fullwidth ? "100%" : "auto",
  // lineHeight: 1.5,
  // letterSpacing: 1,
  cursor: disabled ? 'not-allowed' : 'pointer',
  borderRadius: borderRadius,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
  transform: 'unset',
  position: 'relative',
  overflow: 'hidden',
  border: 'none',
  // whiteSpace: 'wrap',
  WebkitTapHighlightColor: 'transparent',
  verticalAlign: 'middle',
  outline: 'none !important',
  transition: theme.transitions.create(['transform']),
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },

  // default
  fontSize: 12,
  fontWeight: 600,
  padding: '8px 16px',
  backgroundColor: disabled ? theme.palette.grey[500] : theme.palette.primary.dark,
  color: theme.palette.text.secondary,
  boxShadow: `${theme.palette.primary.main} 0px 4px 12px`,


  '& svg': {
    fontSize: 20,
  },

  // sizes
  ...(size === 'small' && {
    padding: '8px 16px',
    fontSize: 12,
  }),
  ...(size === 'medium' && {
    padding: '12px 24px',
    fontSize: 14,
  }),
  ...(size === 'large' && {
    padding: '16px 32px',
    fontSize: 15,
  }),

  // variants
  ...(variant === 'contained' && {
    backgroundColor: disabled ? theme.palette.grey[500] : theme.palette.primary.dark,
    color: theme.palette.text.secondary,
  }),
  ...(variant === 'outlined' && {
    backgroundColor: disabled ? theme.palette.grey[500] : "transparent",
    color: theme.palette.primary.dark,
    borderColor: theme.palette.primary.dark,
    border: "2px solid",

    ...(size === 'small' && {
      padding: '6px 14px',
      fontSize: 12,
    }),
    ...(size === 'medium' && {
      padding: '10px 22px',
      fontSize: 14,
    }),
    ...(size === 'large' && {
      padding: '14px 30px',
      fontSize: 15,
    }),
  }),
  ...(variant === 'text' && {
    backgroundColor: "transparent",
    color: theme.palette.primary.dark,
    border: 0,
  }),


  // colors & varians
  ...(color === 'default' && variant === 'contained' && {
    backgroundColor: disabled ? theme.palette.grey[500] : theme.palette.primary.dark,
    color: theme.palette.text.secondary,
  }),
  ...(color === 'primary' && variant === 'contained' && {
    backgroundColor: disabled ? theme.palette.grey[500] : theme.palette.primary.main,
    color: theme.palette.text.secondary,
  }),
  ...(color === 'secondary' && variant === 'contained' && {
    backgroundColor: disabled ? theme.palette.grey[500] : theme.palette.secondary.main,
    color: theme.palette.text.secondary,
  }),
  ...(color === 'light' && variant === 'contained' && {
    backgroundColor: disabled ? theme.palette.grey[500] : theme.palette.text.secondary,
    color: theme.palette.text.primary,
  }),
  ...(color === 'dark' && variant === 'contained' && {
    backgroundColor: disabled ? theme.palette.grey[500] : theme.palette.text.primary,
    color: theme.palette.text.secondary,
  }),

  ...(color === 'default' && variant === 'outlined' && {
    color: theme.palette.primary.dark,
    borderColor: theme.palette.primary.dark
  }),
  ...(color === 'primary' && variant === 'outlined' && {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  }),
  ...(color === 'secondary' && variant === 'outlined' && {
    color: theme.palette.secondary.main,
    borderColor: theme.palette.secondary.main,
  }),
  ...(color === 'light' && variant === 'outlined' && {
    color: theme.palette.text.secondary,
    borderColor: theme.palette.text.secondary,
  }),
  ...(color === 'dark' && variant === 'outlined' && {
    color: theme.palette.text.primary,
    borderColor: theme.palette.text.primary,
  }),

  ...(color === 'default' && variant === 'text' && {
    color: theme.palette.primary.dark,
  }),
  ...(color === 'primary' && variant === 'text' && {
    color: theme.palette.primary.main,
  }),
  ...(color === 'secondary' && variant === 'text' && {
    color: theme.palette.secondary.main,
  }),
  ...(color === 'light' && variant === 'text' && {
    color: theme.palette.text.secondary,
  }),
  ...(color === 'dark' && variant === 'text' && {
    color: theme.palette.text.primary,
  }),
}))

interface Props extends BaseButtonProps {
  children: ReactNode
}

const ShadowButton: FC<Props> = (props: Props) => {
  const { children, onClick, disableHoverEffect, startIcon, endIcon, ...rest } = props
  const { borderRadius } = useConfig();
  return (
    <StyledButtonRoot onClick={onClick} borderRadius={borderRadius} disableHoverEffect={disableHoverEffect} {...rest}>
      {startIcon && (
        <Box component="span" sx={{ display: 'inherit', mr: "4px" }}>
          {startIcon}
        </Box>
      )}
      {children}
      {endIcon && (
        <Box component="span" sx={{ display: 'inherit', ml: "4px" }}>
          {endIcon}
        </Box>
      )}
    </StyledButtonRoot>
  )
}

export default ShadowButton
