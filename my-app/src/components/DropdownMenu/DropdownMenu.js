import { useState } from 'react';

function DropdownMenu(props) {

    const [currItem, setCurrItem] = useState(props.items[0])
    const [isOpen, setIsOpen] = useState(false)

    const items = props.items.map((item) => (
        <div key={item} style={isOpen ? {display: 'block'} : {display: 'none'}} className='align-middle text-center leading-[150%] hover:bg-secondary-color/50 w-full h-[15%] text-3xl border-secondary-color border-2 border-solid text-highlight-color cursor-pointer' onClick={() => {props.changeWindow(item); setCurrItem(item); setIsOpen(false)}}>
            <div className='h-full w-full text-center'>
                {item}
            </div>
        </div>
    ));

  return (
    <div>
        <div onClick={() => {setIsOpen(!isOpen)}} className='text-3xl cursor-pointer h-[15%] w-full rounded text-highlight-color border-highlight-color border-solid border-2'>
            <div className='h-full w-full align-middle leading-[150%] text-center'>
                {currItem}
            </div>
        </div>
        <div>
                {items}
        </div>
    </div>
  );
}

export default DropdownMenu;