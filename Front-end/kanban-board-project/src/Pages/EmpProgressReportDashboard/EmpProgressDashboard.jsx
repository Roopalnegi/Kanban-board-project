import { useState} from 'react';
import { Box, Tooltip } from '@mui/material';
import PieChartView from './PieChartView';
import BarChartView from './BarChartView';
import { Icon, barChartGif, PieChartGif } from '../../Components/IconComponent/Icon';

function EmpProgressDashboard()
{

   const [barChartOpen, setBarChartOpen] = useState(false);

   return (

         <Box sx={{position: "relative", padding: 2}}>

            {/* Toggle Button -- top right corner */}
            <Tooltip title = {barChartOpen ? "Show Pie Chart" : "Show Bar Chart"}>

                 <Box sx ={{position: "absolute", top: 100, right: 35, cursor: "pointer", boxShadow: 3,
                            zIndex: 10}}
                      onClick = {() => setBarChartOpen(prev => !prev)} 
                 >
                  {
                    barChartOpen ? (
                                      <Icon src={PieChartGif} alt = "Pie Chart Gif" width="50" height= "50" />
                                   )
                                 :(
                                      <Icon src={barChartGif} alt = "Bar Chart Gif" width="50" height= "50" />
                                  ) 
                  } 
                     
                 </Box>

            </Tooltip>

            {
                barChartOpen ? <BarChartView /> : <PieChartView /> 
            }

         </Box>

   );

}

export default EmpProgressDashboard;