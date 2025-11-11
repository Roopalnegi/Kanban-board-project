import { useState, useEffect } from 'react'; 
import { getEmployeeProgressReport } from '../../Services/TaskServices';
import { Box, IconButton, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { BarChart, ResponsiveContainer, Tooltip as RechartTooltip, XAxis, YAxis, Bar, Label, Cell } from 'recharts';
import styles from './PieChartView.module.css';
import BarChartInfoDialog from './BarChartInfoDialog';

function BarChartView() 
{

  const [barData, setBarData] = useState([]);   

  const [infoDialogBox, setInfoDialogBox] = useState(false);


  // fetch employee progress report
  useEffect(() => {
    
    const fetchProgressReportData = async () => {
      
        try 
        {
          const response = await getEmployeeProgressReport();
          console.log("Employee progress report:", response);
          convertData(response);
        } 
        catch (error) 
        {
          console.error("Error in fetching progress report:", error);
        }
    };

    fetchProgressReportData();
  }, []);


  // convert object data to array type 
  const convertData = (responseObj) => {
    
    const array = Object.entries(responseObj).map(([email, data]) => {
    
        const total = (data.completedTasks || 0) + (data.pendingTasks || 0);
        const per = total === 0 ? 0 : (data.completedTasks / total) * 100;

        return {
                 name: data.name || email,
                 value: per,
               };
    });

    setBarData(array);
  };


  return (
    <Box sx={{ mt: "80px", mb: "20px", p:1, position: "relative", bgcolor: "#fff"}}>

      {/* Title + InfoDialogBox Icon */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, p: 1, justifyContent: "center" }}>
      
        <Typography variant = "h4" className={styles.headingStyle}> 
          Employee Performance Chart 
        </Typography>
      
          <IconButton color="#000000" size="large" onClick = {() => setInfoDialogBox(true)}>
            <InfoOutlinedIcon />
          </IconButton>
      </Box>


      {/* info dialog box*/}
      {
        infoDialogBox && <BarChartInfoDialog open={infoDialogBox} onClose={() => setInfoDialogBox(false)}/>
      }
      

      <ResponsiveContainer width="100%" height={400}>
        
        <BarChart data={barData} margin={{ top: 30, right: 30, left: 30, bottom: 40 }}>
          
          {/* X Axis with colored labels */}
          <XAxis dataKey="name" 
                 style={{ textAnchor: "middle", fill: "#674b4bff", fontSize: "18px", fontWeight: "bolder" }}
          > 
            <Label value="Employee Names" 
                   offset={-30} 
                   position="insideBottom"
                   style={{ textAnchor: "middle", fill: "#000000", fontSize: "20px", fontWeight: "bolder" }}
            />
          </XAxis>

          {/* Y Axis with label */}
          <YAxis>
            <Label 
              value="Performance (%)" 
              angle={-90} 
              position="insideLeft" 
              style={{ textAnchor: "middle", fill: "#000000", fontSize: "20px", fontWeight: "bolder" }}
            />
          </YAxis>

          {/* Tooltip */}
          <RechartTooltip formatter={(value) => `${value}%`} />

          {/* Bars with color */}
          <Bar dataKey="value" barSize={40}>
            {barData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#0eb5e37b" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default BarChartView;
