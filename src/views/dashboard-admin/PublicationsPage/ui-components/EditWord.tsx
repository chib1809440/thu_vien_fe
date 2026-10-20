import axios from 'axios';
import { create, createOptions, DocumentFormat } from 'devexpress-richedit';
import 'devexpress-richedit/dist/dx.richedit.css';
import 'devextreme/dist/css/dx.light.css';
import { useEffect, useRef, useState } from 'react';

interface Props {
  path: string;
}

function ViewWord({ path }: Props) {
  const richRef = useRef(null);
  const [fileUrl, setFileUrl] = useState<string>();

  useEffect(() => {
    setFileUrl(path);
  }, [path]);

  useEffect(() => {
    if (fileUrl && !richRef.current) {
      const options = createOptions();
      options.readOnly = true;

      const richEditInstance = create(document.getElementById("richEdit"), options);
      richRef.current = richEditInstance;

      console.log(`Fetching document from: ${import.meta.env.REACT_APP_BASE_API_FILE_URL}/${path}`);

      axios.get(`${import.meta.env.REACT_APP_BASE_API_FILE_URL}/${path}`, { responseType: 'blob' })
        .then(response => {
          console.log('Response received:', response);
          if (response.status === 200) {
            const blob = response.data;

            // Kiểm tra Content-Type
            const contentType = response.headers['content-type'];
            if (contentType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
              console.error('Tài liệu không phải định dạng DOCX.');
              return;
            }

            const fileReader = new FileReader();
            fileReader.onload = () => {
              richEditInstance.openDocument(fileReader.result as ArrayBuffer, 'DocumentName', DocumentFormat.OpenXml);
            };
            fileReader.onerror = (error) => {
              console.error('Error reading file:', error);
            };
            fileReader.readAsArrayBuffer(blob);
          } else {
            console.error(`Error fetching document: ${response.status}`);
          }
        })
        .catch(error => {
          console.error('Error fetching document:', error);
          alert('Không thể tải tài liệu. Vui lòng kiểm tra lại URL.');
        });
    }
  }, [fileUrl]);

  return <div id="richEdit" style={{ height: '100%', width: '100%' }}></div>;
}

export default ViewWord;
