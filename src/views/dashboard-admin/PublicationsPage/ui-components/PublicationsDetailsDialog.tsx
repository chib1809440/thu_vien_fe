import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TPublications } from '../../../../types/models/publications.type';

const PublicationsDetailsDialog = ({ open, onClose, publications }: { open: boolean; onClose: () => void; publications: TPublications | null }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Chi tiết ấn phẩm</DialogTitle>
            <DialogContent dividers>
                {publications ? (
                    <Box>
                        <p><strong>Tên ấn phẩm:</strong> {publications.name}</p>
                    </Box>
                ) : (
                    <p>Không có thông tin chi tiết để hiển thị</p>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Đóng</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PublicationsDetailsDialog;
