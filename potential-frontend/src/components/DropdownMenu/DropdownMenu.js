import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

function DropdownMenu(props) {

    const [currItem, setCurrItem] = useState(props.items[0])
    const [isOpen, setIsOpen] = useState(false)

    const items = props.items.map((item) => (
        <div key={item} style={isOpen ? {display: 'block'} : {display: 'none'}} className='left-[2%] w-full text-4xl text-highlight-color cursor-pointer' onClick={() => {props.changeWindow(item); setCurrItem(item); setIsOpen(false)}}>
            <div className='h-full w-full text-center mb-[4%]'>
                {item}
            </div>
        </div>
    ));

  return (
    <div className='w-full h-[100vh]'>
        <div onClick={() => {setIsOpen(!isOpen)}} className='text-3xl cursor-pointer text-highlight-color'>
            <div className='absolute left-[2%] top-[3%]'>
                <MenuIcon className='absolute scale-[200%]' fontSize='large'/>
            </div>
        </div>
        <div className='h-[100%] w-[25%] left-0' style={isOpen ? {backgroundColor: "rgba(40, 38, 54, 1)"} : {backgroundColor: '#201e2b'}}>
            <div className='pt-[50%] translate-y-[50%]'>
                    {items}
            </div>
        </div>
    </div>
  );
}

export default DropdownMenu;