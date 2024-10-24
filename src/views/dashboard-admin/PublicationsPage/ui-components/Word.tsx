import axios from 'axios';
import { create, createOptions, DocumentFormat } from 'devexpress-richedit';
import 'devexpress-richedit/dist/dx.richedit.css';
import 'devextreme/dist/css/dx.light.css';
import { useEffect, useRef, useState } from 'react';

interface Props {
  path: string;
  onSave: (documentData: ArrayBuffer) => void;
}

function Word({ path, onSave }: Props) {
  const richRef = useRef(null);

  console.log(path);
  


  useEffect(() => {
    const loadDocument = async () => {
      if (path) {
        console.log('hghg', 21);
        console.log(richRef.current);

        const options = createOptions();
        options.events.saving = (s, e) => {
          e.handled = true;
          handleSave();
        };
        options.readOnly = false;

        const richEditInstance = create(document.getElementById("richEdit"), options);
        richRef.current = richEditInstance;
        console.log(richRef.current);

        const documentPath = "http://192.168.1.76:5030/publication/word/6485ab70-bfc0-410d-932b-a66c218a6974_ma-ta-cha-c-na-ng-pha-n-ma-m-qua-n-la-th-via-n.docx";
        
        if (documentPath) {
          console.log('aaaa',documentPath);
          
          try {
            const response = await axios.get(documentPath, { responseType: 'blob' });
            console.log('xxxx',response);
            
            const blob = response.data;

            const fileReader = new FileReader();
            fileReader.onload = () => {
              richEditInstance.openDocument(fileReader.result as ArrayBuffer, 'DocumentName', DocumentFormat.OpenXml);
            };

            fileReader.readAsArrayBuffer(blob);
          } catch (error) {
            console.error('Error fetching document:', error);
          }
        }
      }
    };

    loadDocument();
  }, [path]);
  const handleSave = async () => {
    if (richRef.current) {
      const richEditInstance = richRef.current;
      richEditInstance.exportToFile((file: File) => {
        handleFileExport(file);
      }, DocumentFormat.OpenXml);
    }
  };
  const handleFileExport = (blob: Blob) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const documentData = fileReader.result as ArrayBuffer;
      onSave(documentData);
    };
    fileReader.readAsArrayBuffer(blob);
  };
  return <div id="richEdit"></div>;
}

export default Word;
