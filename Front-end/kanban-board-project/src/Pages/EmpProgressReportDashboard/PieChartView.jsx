import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, FormControl, InputLabel, Card,
        Select, MenuItem, ListItemText, LinearProgress, Tooltip } from '@mui/material';
import { Icon, backArrowIcon } from '../../Components/IconComponent/Icon';
import { getEmployeeDetails, getEmployeeProgressReport } from '../../Services/TaskServices';
import formatEmployeeData from '../../Services/Utils/employeeUtil';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import styles from './PieChartView.module.css';



function PieChartView()
{

   const navigate = useNavigate();

   const [allEmployees, setAllEmployees] = useState([]);
   const [progressReport, setProgressReport] = useState({});
   const [selectedEmployee, setSelectedEmployee] = useState('');
   const [empProgressData, setEmpProgressData] = useState({});
   
   // for pie chart
   const pieData = [
                     {name: 'Completed', value : empProgressData.completedTasks || 0, color: "#2e7d32"},
                     {name: 'Pending', value : empProgressData.pendingTasks || 0, color: "#ef6c00"},
                    ];


   // convert value percentage 
   const customLabelForPie = ({value}) => {
      const total = empProgressData.totalTasks || 0;
      if(total === 0) 
         return "0%";
      return `${((value / total) * 100)}%`;
   };                 

   // get all emloyee details
   useEffect(() => {

      const fetchEmployeeData = async () => {
          try
          {
             const response = await getEmployeeDetails();       // return object 
             const empArray = formatEmployeeData(response);       // convert object to array
             setAllEmployees(empArray);
             console.log("Employee progress -- all emp data : ", allEmployees);
          }
          catch(error)
          {
             console.error("Error in fetching employee data for progress : ", error);
          }
      };
      
      fetchEmployeeData();

   },[]);



   // get progress report of all employee
   useEffect(() => {

       const fetchProgressReportData = async () => {
           try
           {
              const response = await getEmployeeProgressReport();
              setProgressReport(response);
              console.log("Employee progreess report : ", response);
           }
           catch(error)
           {
              console.error("Error in fetching progress report : ", error);
           }
       };

       fetchProgressReportData();

   },[]);


   // get progress report of specific employee
   const handleEmployeeCard = (email) => {
      let data = progressReport[email];              // as progressReport is in object form
      setEmpProgressData(data);
      console.log("Selected employee progress data :", empProgressData);
   }; 



   return (

      <Box className={styles.mainWrapper}>
 
          <Box className={styles.mainHeader}>

                 <Tooltip title = "Back to Dashboard">
                     <Icon src={backArrowIcon} alt = "Back Arrow Icon" width="38" height= "38" className={styles.backArrowIconPosition}
                           onClick={() => navigate("/admin-dashboard")}/>
                 </Tooltip>
                <Typography variant = "h4" className={styles.headingStyle}>
                    Employee Progress Overview 📈
                </Typography>

          </Box>

          {/* drop down -- where employee can be selected to see report */}
          <Box sx = {{m: "40px"}}>
             <FormControl sx={{width: "500px"}}>
                <InputLabel sx={{color: "black"}}>
                   Select Employee To See Progress Report 
                </InputLabel>
                <Select value = {selectedEmployee}
                        onChange = {(e) => setSelectedEmployee(e.target.value)}
                        sx={{height: 60, fontSize: "14px", color: "black", '& .MuiSelect-icon': { color: 'black' },}}
                >
                {
                  allEmployees.map(emp => (
                                            <MenuItem key = {emp.id} value = {emp.email} onClick = {() => handleEmployeeCard(emp.email)}>
                                                <ListItemText primary = {emp.name} secondary = {emp.email} 
                                                              primaryTypographyProps={{ fontSize: '14px' }}
                                                              secondaryTypographyProps={{ fontSize: '12px', color: 'gray' }}
                                                />
                                            </MenuItem>
                                          ))
                }
                </Select>        
             </FormControl>
          </Box>

          {/* progress report card  */}
          <Box>
            { empProgressData?.name && (
            
            <Card className={styles.progressCard} raised>
            
            <Typography variant="h6" className={styles.progressCardHeader}>
                <b>{empProgressData.name} </b> &nbsp; - &nbsp;{empProgressData.email}    
            </Typography>

            <Box className={styles.progressCardContainer}>
                
                {/* left column -- employee progress info */}
                <Box className={styles.progressCardLeftSide}>

                     <Box className={styles.progressCardRow}>
                        <Typography variant="body1" className={styles.progressCardRowHeading}>Total Tasks : </Typography>
                        <Typography variant="body2"> {empProgressData.totalTasks}  </Typography>
                    </Box>  
    
                    <Box className={styles.progressCardRow}>
    
                        <Typography variant="body1" className={styles.progressCardRowHeading}>Completed Tasks : </Typography>
                        <Typography variant="body1"> {empProgressData.completedTasks}  </Typography>
                    </Box>  
    
                    <Box className={styles.progressCardRow}>
    
                        <Typography variant="body1" className={styles.progressCardRowHeading}>Pending Tasks : </Typography>
                        <Typography variant="body2"> {empProgressData.pendingTasks}  </Typography>
                    </Box>  
    
    
                    {/* Progress Bar */}
                    <Box className={styles.progressCardRow}>
    
                        <LinearProgress variant="determinate" 
                                        value={empProgressData.progressPer || 0}
                                        className={styles.progressBar} 
                                        sx={{'& .MuiLinearProgress-bar':{
                                          backgroundColor: "#117508",   
                                        }}}
                        />
                        <Typography variant="body2" className={styles.progressBarText}>
                              {empProgressData.progressPer}%
                        </Typography>
                    </Box>  
                </Box>


                {/* right column -- pie chart  */}
                <Box sx ={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>

                    <ResponsiveContainer width = "100%" height = {200}>
                        <PieChart>
                            <Pie data ={pieData} dataKey = "value" nameKey = "name"
                                 cx = "50%" cy = "50%"       // horizontal and vertical center 
                                 outerRadius = {70} label = {customLabelForPie} // shows name + percentage 
                                 isAnimationActive = {true}
                            >
                            {
                                pieData.map((entry, index) => (
                                                                <Cell key = {`cell-${index}`} fill = {entry.color} />
                                                              ))
                            }
                            </Pie>
                            <Legend/>                             
                        </PieChart>
                    </ResponsiveContainer>
                </Box>

              </Box>   
               
            </Card>
            )}
          </Box>


      </Box>
   );

}

export default PieChartView;