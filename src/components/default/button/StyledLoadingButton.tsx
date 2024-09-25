import React, { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import { Theme, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ButtonProps } from '@mui/material/Button'
import { LoadingButton, LoadingButtonProps } from '@mui/lab'
import useConfig from '../../../hooks/useConfig'

interface BaseButtonProps extends Pick<LoadingButtonProps, 'onClick' | 'type' | 'startIcon' | 'endIcon'> {
  variant?: 'contained' | 'outlined' | 'text'
  color?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  disableHoverEffect?: boolean,
  loading: boolean,
  disabled?: boolean,
  fullWidth?: boolean,
  borderRadius?: number,
}
interface StyledButtonRootProps extends BaseButtonProps {
  theme?: Theme
}

const StyledButtonRoot = styled(LoadingButton, {
  shouldForwardProp: (prop) =>
    prop !== 'variant' && prop !== 'color' && prop !== 'size' && prop !== 'disableHoverEffect',
})<StyledButtonRootProps>(({ theme, color, variant, size, borderRadius, disableHoverEffect, disabled, fullWidth }) => ({
  minWidth: fullWidth ? "100%" : "auto",
  fontSize: 14,
  fontWeight: 500,
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

  [theme.breakpoints.down('lg')]: {
    width: '100%',
  },
  // hover
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
    ...(!disableHoverEffect && {
      transform: 'translateY(-3px)',
    }),

  },

  '& svg': {
    fontSize: 20,
  },

  // sizes and variants
  ...(size === 'small' && {
    padding: '4px 8px',
    fontSize: 12,
  }),
  ...(size === 'medium' && {
    padding: '8px 16px',
    fontSize: 14,
  }),
  ...(size === 'large' && {
    padding: '12px 24px',
    fontSize: 15,
  }),

  // variants
  ...(variant !== 'contained' && {
    backgroundColor: disabled ? theme.palette.grey[300] : 'transparent',
    boxShadow: 'none !important',
  }),

  ...(color === 'primary' &&
    variant === 'contained' && {
    backgroundColor: disabled ? theme.palette.grey[300] : theme.palette.primary.dark,
    color: theme.palette.text.secondary,
  }),
  ...(color === 'secondary' &&
    variant === 'contained' && {
    backgroundColor: disabled ? theme.palette.grey[300] : theme.palette.secondary.dark,
    color: theme.palette.text.secondary,
  }),


  ...(color === 'primary' &&
    variant === 'outlined' && {
    border: `2px solid ${theme.palette.primary.dark}`,
    color: theme.palette.primary.main,
  }),
  ...(color === 'secondary' &&
    variant === 'outlined' && {
    border: `2px solid ${theme.palette.secondary.dark}`,
    color: theme.palette.secondary.main,
  }),


  ...(color === 'primary' &&
    variant === 'text' && {
    color: theme.palette.primary.dark,
  }),
  ...(color === 'secondary' &&
    variant === 'text' && {
    color: theme.palette.secondary.dark,
  }),

}))

interface Props extends BaseButtonProps {
  children: ReactNode
}

const StyledLoadingButton: FC<Props> = (props: Props) => {
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

export default StyledLoadingButton
