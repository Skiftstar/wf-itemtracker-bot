import React, { useState } from "react";

function Navbar(props) {

    const [currItem, setCurrItem] = useState(props.items[0])

    const items = props.items.map((item) => (
        <div key={item} style={{width: `1/${props.items.length}`}} className="left-[2%] text-4xl text-highlight-color cursor-pointer" onClick={() => {props.changeWindow(item); setCurrItem(item);}}>
            <div className='h-full w-full text-center'>
                {item}
            </div>
        </div>
    ));

    return (
        <div className="font-bold overflow-hidden w-full top-0 absolute m-0 p-0 bg-main-bg-color text-text-color align-center flex justify-center block h-[10%] border-solid border-b-2 border-secondary-color">
            <div className="flex gap-[2%] translate-x-[-50%] ml-[50%] justify-center align-center h-full">
                {items}
            </div>
        </div>
    )
}

export default Navbar;