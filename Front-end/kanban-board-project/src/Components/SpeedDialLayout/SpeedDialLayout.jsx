import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { Icon } from '../IconComponent/Icon';



function SpeedDialLayout({actions = [], direction, className = ""}) 
{
  return (
    <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
      
      <SpeedDial
        ariaLabel="Side speed dial"
        className= {className}
        sx={{zIndex: 1100, '& .MuiFab-primary': {width: 40, height: 40}, }}  // smaller size 
        icon={<SpeedDialIcon sx = {{fontSize: 10}}/>}
        direction= {direction}                 // open toward which side
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

export default SpeedDialLayout;