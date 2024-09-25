import { FC, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MainCard from '../../default/card/MainCard'
import { useTheme } from '@mui/material'
import useConfig from '../../../hooks/useConfig'

interface Props {
    title: string,
    description: string,
    limitDescription: number,
    photo: string
}

const OverviewCard: FC<Props> = ({ title, description, limitDescription, photo }) => {
    const theme=useTheme()
    const {borderRadius}=useConfig()
    const renderDescription = useMemo(() => description!.length > limitDescription ? (description?.slice(0, limitDescription) + "...") : description, [])
    return (
        <Box mx={1.5} pt={3} pb={5}>
            <MainCard
                sx={{
                    transition: 'transform .2s',
                    '&:hover': {
                        boxShadow: 1,
                        transform: 'scale(1.05)'
                    },
                }}
            >
                <Box
                    sx={{
                        lineHeight: 0,
                        overflow: 'hidden',
                        borderRadius: `${borderRadius}px`,
                        minHeight: 200,
                        mb: 2,
                        pt: 4,
                        pb: { xs: 8, md: 10 },
                        height: { xs: '170px', md: '240px' },
                        width: '100%',
                        backgroundSize: 'cover',
                        objectFit: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundImage: `url('${photo as string}')`,
                    }}
                ></Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h3">
                        {title}
                    </Typography>
                    <Typography sx={{ mb: 2, color: theme.palette.text.primary }} variant="body1" textAlign='justify'>
                        {renderDescription}
                    </Typography>
                </Box>
            </MainCard>
        </Box>
    )
}
export default OverviewCard
