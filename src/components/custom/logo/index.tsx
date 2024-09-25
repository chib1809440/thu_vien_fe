import React, { FC } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
// import { META_DATA } from '../../../constant'
// import { WEB_NAME } from '../../../config'

interface Props {
  onClick?: () => void
  variant?: 'primary' | 'secondary',
  title?: string,
  size?: 'small' | 'medium' | "large",
  isInBox?: boolean
}

const Logo: FC<Props> = ({ onClick, variant, isInBox, title, size }) => {
  const theme = useTheme()
  return (
    <Box onClick={onClick} sx={{ width: "auto", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1, py: 2 }}>
      <Box sx={{ bgcolor: isInBox ? theme.palette.background.paper : "transparent", px: 2, py: 1, borderRadius: "32px" }}>
        {/* <img width={size === "small" ? 24 : 84} height={size === "small" ? 24 : 84} src={META_DATA.icon} alt='logo' /> */}
      </Box>

      {title &&
        <Typography
          variant="body2"
          textTransform='uppercase'
          sx={{ p: 2, fontWeight: 800, '& span': { color: 'primary.dark' } }}
        >
          <span>{title}</span>
        </Typography>
      }
    </Box>
  )
}


export default Logo
