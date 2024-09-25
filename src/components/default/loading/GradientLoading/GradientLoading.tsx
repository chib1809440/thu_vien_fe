import { styled } from '@mui/material'


const ContainerLoading = styled("div")(({theme})=>`
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    height: 96px;
    width: 96px;
    animation: rotate_3922 1.2s linear infinite;
    background-color: #9b59b6;
    background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
    span {
        position: absolute;
        border-radius: 50%;
        height: 100%;
        width: 100%;
        background-color: #9b59b6;
        background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
    }
    
    span:nth-of-type(1) {
        filter: blur(5px);
    }
    
    span:nth-of-type(2) {
        filter: blur(10px);
    }
    
    span:nth-of-type(3) {
        filter: blur(25px);
    }
    
    span:nth-of-type(4) {
        filter: blur(50px);
    }
    
    ::after {
        content: "";
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        background: #fff;
        border: solid 5px #ffffff;
        border-radius: 50%;
    }
    
    @keyframes rotate_3922 {
        from {
        transform: translate(-50%, -50%) rotate(0deg);
        }
    
        to {
        transform: translate(-50%, -50%) rotate(360deg);
        }
    }
`)
function GradientLoading() {
    return (
        <ContainerLoading >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </ContainerLoading>
    )
}
export default GradientLoading