import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Box, Chip } from '@mui/material';
import { TGroup } from '../../../../types/models/group.type';

const GroupDetailsDialog = ({ open, onClose, group }: { open: boolean; onClose: () => void; group: TGroup | null }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Chi tiết nhóm</DialogTitle>
            <DialogContent dividers>
                {group ? (
                    <Box>
                        <p><strong>Tên nhóm:</strong> {group.name}</p>
                        <p><strong>Trưởng nhóm:</strong> {group.mainLibrary ? group.mainLibrary.name : "Chưa có thư viện"}</p>
                        <p><strong>Các thư viện liên thông:</strong>{
                            group.libraries && group.libraries.length > 0
                                ? (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                        {group.libraries.map((lib) => (
                                            <Chip
                                                key={lib._id}
                                                label={lib.name}
                                                variant="outlined"
                                                color="primary"
                                            />
                                        ))}
                                    </Box>
                                )
                                : "Chưa có thư viện"
                        }</p>
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

export default GroupDetailsDialog;
