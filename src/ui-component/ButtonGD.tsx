import { Button } from "@chatscope/chat-ui-kit-react";
import styled from "styled-components";
import AnimateButton from "./extended/AnimateButton";
import useAuth from "../hooks/useAuth";

interface Props {
    title?: string;
    border?: string;
    color?: string;
    children?: React.ReactNode;
    height?: string;
    onClick?: () => void;
    onKeyDown?: any;
    radius?: string
    width?: string | '100px';
    isColor?: boolean | false;
    disabled?: boolean | false;
    type?: any;
    endIcon?: React.ReactNode;
}

export default function ButtonGD(props: Props) {
    const { user } = useAuth();

    return (
        <>
            {props.isColor ?
                <AnimateButton>
                    <CSButtonV2 style={{ width: props.width !== undefined ? props.width : '130px' }} disabled={props.disabled || user?.role !== 2} onClick={props.onClick}>{props.title} {props.endIcon} {props.children}</CSButtonV2>
                </AnimateButton>
                :
                <AnimateButton>
                    <CSButton onKeyDown={props.onKeyDown} style={{ width: props.width !== undefined ? props.width : '130px' }} disabled={props.disabled || user?.role !== 2} onClick={props.onClick}>{props.title} {props.endIcon} {props.children}</CSButton>
                </AnimateButton>

            }

        </>
    );
}

const CSButton = styled(Button)((props: { disabled?: boolean }) => ({
    border: 'none',
    color: '#fff',
    height: '50px',
    borderRadius: '4px',
    fontWeight: 600,
    fontSize: '14px',
    background: props.disabled ? '#C0C0C0' : '#2196F2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px',
    '&:hover': {
        background: props.disabled ? '#C0C0C0' : '#2182F1',
    }
}));

const CSButtonV2 = styled(Button)((props: { disabled?: boolean }) => ({
    border: 'none',
    color: '#fff',
    height: '50px',
    borderRadius: '4px',
    fontWeight: 600,
    fontSize: '14px',
    background: props.disabled ? '#C0C0C0' : '#f82336',
    '&:hover': {
        background: props.disabled ? '#C0C0C0' : 'red',
    }
}));