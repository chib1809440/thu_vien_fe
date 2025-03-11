import { IconArrowsMaximize, IconArrowsMinimize, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Box, Container, Paper, Typography, useTheme } from '@mui/material';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import StyledIconButton from '../../../components/default/button/StyledIconButton';
import useConfig from '../../../hooks/useConfig';
import "./style.css";

interface PageCoverProps {
    children: ReactNode;
}

const PageCover = React.forwardRef<HTMLDivElement, PageCoverProps>((props, ref) => {
    return (
        <div className="page page-cover" ref={ref} data-density="hard">
            <div className="page-content">
                {props.children}
            </div>
        </div>
    );
});

interface PageProps {
    children: ReactNode;
    number: number;
    header?: ReactNode;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>((props, ref) => {
    return (
        <div className="page" ref={ref}>
            <div className="page-content-book">
                {props.children}
            </div>
        </div>
    );
});

interface BookProps {
    pages?: string[];
    title?: string;
}

const BookViewPage = ({ title, pages }: BookProps) => {
    const fullUrlPages = pages?.map(page =>
        `${process.env.REACT_APP_BASE_API_FILE_URL}/${page}`
    );
    // const fullUrlPages = pages?.slice(0, 10).map(page =>
    //     `${process.env.REACT_APP_BASE_API_FILE_URL}/${page}`
    // );
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const flipBook = useRef(null);
    const theme = useTheme();
    const { borderRadius } = useConfig();

    const screen = useFullScreenHandle();
    const isFull = screen.active;

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const nextButtonClick = () => {
        flipBook.current.pageFlip().flipNext();
    };

    const prevButtonClick = () => {
        flipBook.current.pageFlip().flipPrev();
    };

    const onPage = (e) => {
        setPage(e.data);
    };

    const onScreenChange = () => {
        const isFull = screen.active;
        if (isFull) return screen.exit();
        if (!isFull) return screen.enter();
    };

    useEffect(() => {
        setTotalPage(fullUrlPages?.length);
    }, [fullUrlPages]);

    return (
        <Paper sx={{
            border: `1px solid ${theme.palette.grey[200]}`,
            borderRadius: `${borderRadius}px`,
            [theme.breakpoints.down('sm')]: {
                border: 'none',
            },
        }}>
            <FullScreen handle={screen}>
                <Container maxWidth="xl" sx={{ p: 2, display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
                    <HTMLFlipBook
                        width={550}
                        height={733}
                        size="stretch"
                        minWidth={315}
                        maxWidth={1000}
                        minHeight={400}
                        maxHeight={1533}
                        maxShadowOpacity={0.5}
                        showCover={false}
                        mobileScrollSupport={true}
                        onFlip={onPage}
                        className="demo-block"
                        ref={flipBook}
                        style={undefined}
                        startPage={0}
                        drawShadow={true}
                        flippingTime={1000}
                        usePortrait={true}
                        startZIndex={0}
                        autoSize={true}
                        clickEventForward={true}
                        useMouseEvents={true}
                        swipeDistance={0}
                        showPageCorners={true}
                        disableFlipByClick={true}
                    >
                        {fullUrlPages?.map((item, index) => (
                            <Page number={index} key={index}>
                                <img
                                    style={{
                                        aspectRatio: 9 / 16,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'fill',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        border: "solid 1px #f4e8d7"
                                    }}
                                    src={item}
                                    alt=""
                                    loading="lazy"
                                />
                            </Page>
                        ))}
                    </HTMLFlipBook>
                </Container>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1,
                    position: isFull ? "fixed" : "none", width: "100%",
                    bottom: 0,
                    borderRadius: `${borderRadius}px ${borderRadius}px 0 0`
                }}>
                    <Paper sx={{ py: 2, pl: { xs: 0, sm: 0, md: 1 } }}>
                        {fullUrlPages && fullUrlPages.length > 0 && (
                            <Typography variant='body2'>
                                Trang {page + 1} / {fullUrlPages.length}
                            </Typography>
                        )}
                    </Paper>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                        <StyledIconButton size='small' variant='outlined' onClick={prevButtonClick}>
                            <IconChevronLeft />
                        </StyledIconButton>

                        <StyledIconButton size='small' variant='outlined' onClick={nextButtonClick}>
                            <IconChevronRight />
                        </StyledIconButton>
                        {isFull ? (
                            <StyledIconButton size='small' variant='outlined' onClick={() => onScreenChange()}>
                                <IconArrowsMinimize />
                            </StyledIconButton>
                        ) : (
                            <StyledIconButton size='small' variant='outlined' onClick={() => onScreenChange()}>
                                <IconArrowsMaximize />
                            </StyledIconButton>
                        )}
                    </Box>
                </Box>
            </FullScreen>
        </Paper>
    );
};

export default BookViewPage;
