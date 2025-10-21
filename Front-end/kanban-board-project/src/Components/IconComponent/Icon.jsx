// {...props} allow to pass onClick or className or style or sx props

export const Icon = ({src, alt = '', width = 24, height = 24, ...props}) => {
   
    return <img src = {src} alt = {alt} width = {width} height = {height} {...props} />;

};


export const pencilImg = process.env.PUBLIC_URL + "/Icons/pencil-icon.png";

export const addColumnImg = process.env.PUBLIC_URL + "/Icons/add-column-icon.png";

export const addTaskImg = process.env.PUBLIC_URL + "/Icons/add-task-icon.png";

export const deleteImg = process.env.PUBLIC_URL + "/Icons/delete-icon.png";

export const helpImg = process.env.PUBLIC_URL + "/Icons/help-icon.png";



/*
process.env.PUBLIC_URL 
 ---> PUBLIC_URL -- a special variable in React , points to public folder at runtime
                 -- can acessed anything inside public / folder by using this URL
 ---> since, all icons images in public/ Icon path 
      so, we use "process.env.PUBLIC_URL" + "image_path" tells React to load icon correctly , no matter which component uses them               
*/