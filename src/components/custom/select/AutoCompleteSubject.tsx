import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Theme, useTheme } from '@mui/material/styles';
import useConfig from '../../../hooks/useConfig';

interface Subject {
  id: number | null;
  name: string;
}

interface CustomAutocompleteProps {
  dataSubject: Subject[];
  subjectSelected: number | null;
  setSubjectSelected: (id: number | null) => void;
}

const AutoCompleteSearch: React.FC<CustomAutocompleteProps> = ({
  dataSubject,
  subjectSelected,
  setSubjectSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const theme: Theme = useTheme();
  const { borderRadius } = useConfig();

  useEffect(() => {
    if (subjectSelected === null && dataSubject?.length > 0) {
      setSubjectSelected(dataSubject[0].id);
    }
  }, [subjectSelected, dataSubject, setSubjectSelected]);

  const handleInputChange = (event: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
  };



  const filterOptions = (options: Subject[], state: any) => {
    if (state.inputValue === '') {
      return options; // Hiển thị tất cả các tùy chọn khi inputValue rỗng
    }
    return options.filter((option) =>
      option.name.toLowerCase().includes(state.inputValue.toLowerCase())
    );
  };


  return (
    <Autocomplete
      size='small'
      id="country-customized-option-demo"
      options={dataSubject}
      value={dataSubject?.find(subject => subject?.id === subjectSelected) || null}
      onChange={(event, newValue) => {
        setSubjectSelected(newValue ? newValue?.id : null); // Cập nhật giá trị
      }}
      // inputValue={inputValue}
      // onInputChange={handleInputChange}
      // filterOptions={filterOptions}
      getOptionLabel={(option: Subject) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          color="primary"
          InputProps={{
            ...params.InputProps,
            style: {
              borderRadius: `${borderRadius}px`,
              backgroundColor: theme.palette.grey[200],
              color: "#fff"
            },
          }}
        />
      )}
    />
  );
};

export default AutoCompleteSearch;
