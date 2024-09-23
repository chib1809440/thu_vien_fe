import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import DocViewer, { DocViewerRenderers, PDFRenderer } from "@cyntler/react-doc-viewer";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'none',
    border: 'none',
    boxShadow: 24,
    // p: 4,
    // borderRadius: '22px',
    // minWidth: '100vw',
    // minHeight: '100vh',
    // display:'flex'
};

export default function ModalViewDetails(props: {
    [x: string]: any;
    isOpen?:any;
    isClose?:any;
    docs:any;
}) {

    const headers = {
        "Content-Type":"application/vnd.ms-powerpoint"
    }

    const handleClose = () => {
        props.isClose(false);
    };

    return (
        <Modal
            open={props.isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <div style={{ width: '90vw', height: '90vh' }}>
                <DocViewer
                    className="example"
                    documents={props.docs}
                    pluginRenderers={DocViewerRenderers}
                    // pluginRenderers={[PDFRenderer]}
                    prefetchMethod="GET" requestHeaders={headers}
                    style={{ scrollbarWidth: 'none', scrollbarColor: '#f2f', overflowY: 'hidden' }}
                    theme={{
                        primary: "#5296d8",
                        secondary: "#ffffff",
                        tertiary: "#5296d899",
                        textPrimary: "#ffffff",
                        textSecondary: "#5296d8",
                        textTertiary: "#00000099",
                        disableThemeScrollbar: true,
                    }}
                    config={{
                        header: {
                            disableHeader: true,
                        },
                        csvDelimiter: ",", // "," as default,
                        pdfZoom: {
                            defaultZoom: 0.5, // 1 as default.
                            zoomJump: 0.1 // 0.1 as default,
                        },
                        pdfVerticalScrollByDefault: false, // false as default
                    }}
                />
            </div>
            {/* <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} style={{height:'90vh', width:'90vw'}}/> */}

        </Modal>
    )
}