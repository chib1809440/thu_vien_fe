import {
    Button
} from '@mui/material';
import { useRef } from 'react';
import { useDownloadExcel } from 'react-export-table-to-excel';

export default function ExportEX(props: {
    title?: any;
    nameFile?: any;
    data?: any;
}) {
    const tableRef = useRef(null);
    const header = ["Mã Phiếu", "Tên thành viên", "Số điện thoại", "Ngày mượn", 'Ngày trả', 'Sách mượn'];

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: props.title,
    })

    return (
        <div>
            <Button variant='contained' onClick={onDownload}>{props.title}</Button>
            <table ref={tableRef} style={{ display: 'none' }}>
                <tbody>
                    <tr>
                        {header.map((head) => (
                            <th key={head}> {head} </th>
                        ))}
                    </tr>

                    {props.data.map((item, i) => (
                        <tr key={i}>
                            <td key={i}>{item.loanSlipNumber}</td>
                            <td key={i}>{item.users.fullName}</td>
                            <td key={i}>{item.users.numberPhone}</td>
                            <td key={i}>{new Date(item.create_at).toLocaleDateString("en-GB")}</td>
                            <td key={i}>{new Date(item.return_at).toLocaleDateString("en-GB")}</td>
                            {item.supplies.map((items, is) => (
                                <td key={is}>{items.supply.supplyName}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}