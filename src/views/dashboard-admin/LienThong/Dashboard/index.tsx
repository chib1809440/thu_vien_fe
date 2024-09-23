import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import CardCategory from './components/CardCategory';
// import TotalOrderLineChartCard from './TotalOrderLineChartCard';
// import TotalIncomeDarkCard from './TotalIncomeDarkCard';
// import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './components/ChartWrapper';
import SchoolCard from './components/CardSchool';
import CardMaterial from './components/CardMaterial';
import CardPublisher from './components/CardPublisher';
import CardAuthor from './components/CardAuthor';
import PieChart from './components/ChartPie';
import CardTypeSupply from './components/CardTypeSupply';


// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = (props: {
  dataSchool: any;
  dataSupplies: any;
  dataSuppliesLT: any;
  dataProducer: any;
  dataCategoryLT: any;
  dataAuthor: any;
  dataTypeSuplyLT: any;

}) => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  function mergeArraysAndAddIsLocal(arr1: any, arr2: any) {
    return arr1.map(book1 => {
      let matchingBook2 = arr2.find(book2 => book2.id === book1.supplyId);
      let isLT = matchingBook2 ? true : false;
      return { ...book1, ...matchingBook2, isLT };
    });
  }

  function mergeArraysAndAddIsConnected(arr1: any, arr2: any) {
    return arr1.map(book1 => {
      let matchingBook2 = arr2.find(book2 => book2.supplyId === book1.id);
      let isLT = matchingBook2 ? true : false;
      return { ...book1, ...matchingBook2, isLT };
    });
  }

  let newArrayLocal = mergeArraysAndAddIsLocal(props.dataSupplies, props.dataSuppliesLT);
  let newArrayConnected = mergeArraysAndAddIsConnected(props.dataSuppliesLT, props.dataSupplies);
  // const filterEBookIsConnected = newArrayConnected.filter((item) => item.printedMatter.printedMatterName === 'Học liệu điện tử')
  const filterBookIsConnected = newArrayConnected.filter((item) => item.printedMatter.printedMatterName === 'Học liệu truyền thống')
  // const filterEBook = newArrayLocal.filter((item) => item.printedMatter.printedMatterName === 'Học liệu điện tử')
  const filterEBookIsConnected = newArrayConnected.filter((item) =>
    item.printedMatter &&
    ['Học liệu điện tử', 'Học liệu điện tử khác'].includes(item.printedMatter.printedMatterName)
  );
  const filterEBook = newArrayLocal.filter((item) =>
  item.printedMatter &&
  ['Học liệu điện tử', 'Học liệu điện tử khác'].includes(item.printedMatter.printedMatterName)
);
  const filterBook = newArrayLocal.filter((item) => item.printedMatter.printedMatterName === 'Học liệu truyền thống')

  // Hàm filter để lấy ra các giá trị không trùng lặp và chỉ lấy 1 đối tượng nếu trùng
  const getUniqueSchoolNames = (array) => {
    const uniqueObjects = array.filter((obj, index, self) => {
      return (
        index ===
        self.findIndex((o) => o.user.schoolName === obj.user.schoolName)
      );
    });
    return uniqueObjects;
  };
  const objectCount = {};
  props.dataSuppliesLT.forEach((obj) => {
    const objKey = JSON.stringify(obj.user.schoolName);
    if (!objectCount[objKey]) {
      objectCount[objKey] = { object: obj.user, count: 1 };
    } else {
      objectCount[objKey].count++;
    }
  });
  const resultArray = Object.values(objectCount);

  const uniqueNames = getUniqueSchoolNames(props.dataSuppliesLT);

  return (
    <Grid container spacing={3}>
      <Grid item sm={6} xs={12} md={8} lg={8}>
        <Grid container spacing={3}>
          <Grid item lg={12} md={6} sm={6} xs={12}>
            <Grid container spacing={3}>
              <Grid item lg={3} md={6} sm={6} xs={12}>
                <CardCategory isLoading={isLoading} dataCategoryLT={props.dataCategoryLT} />
              </Grid>
              <Grid item lg={3} md={6} sm={6} xs={12}>
                <CardAuthor isLoading={isLoading} dataAuthor={props.dataAuthor} />
              </Grid>
              <Grid item lg={3} md={6} sm={6} xs={12}>
                <CardPublisher isLoading={isLoading} dataProducer={props.dataProducer} />
              </Grid>
              <Grid item lg={3} md={6} sm={6} xs={12}>
                <CardTypeSupply isLoading={isLoading} dataTypeSupply={props.dataTypeSuplyLT} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={12} md={6} sm={6} xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <PieChart
                  title="THỐNG KÊ ẤN PHẨM VÀ HỌC LIỆU"
                  chart={{
                    series: [
                      { label: 'Ấn phẩm thư viện', value: Number(filterBook.length) },
                      { label: 'Học liệu điện tử thư viện', value: Number(filterEBook.length) },
                      { label: 'Ấn phẩm liên thông', value: Number(filterBookIsConnected.length) },
                      { label: 'Học liệu điện tử liên thông', value: Number(filterEBookIsConnected.length) },
                    ],
                    colors: [
                      "#00897B", "#c1961f", "#ff0000", "#2f36fb"
                    ]
                  }} subheader={undefined} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={6} xs={12} md={4} lg={4}>
        <SchoolCard dataSchool={resultArray} isLoading={isLoading} />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
