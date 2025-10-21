import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { Icon } from '../IconComponent/Icon';



function LeftSideSpeedDial({actions = []}) 
{
  return (
    <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
      
      <SpeedDial
        ariaLabel="Left Side speed dial"
        sx={{zIndex: 1100, '& .MuiFab-primary': {width: 40, height: 40}, }}  // smaller size 
        icon={<SpeedDialIcon sx = {{fontSize: 20}}/>}
        direction= "left"                 // open toward left side
      >
        
        {
          actions.map((action) => (
                                   <SpeedDialAction key={action.name} 
                                                    icon={<Icon src={action.src} sx={{ cursor: "pointer" }}/>}
                                                    tooltipTitle= {action.name}
                                                    onClick = {action.onClick}
                                  />
                                  ))
        }
      </SpeedDial>
     </Box>
    );

}

export default LeftSideSpeedDial;