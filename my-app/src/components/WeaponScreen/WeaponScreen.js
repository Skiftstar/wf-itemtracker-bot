

function WeaponScreen(props) {

    const items = props.items.map((item) => (
        <div className="h-[10%] text-highlight-color text-3xl border-highlight-color border-solid border-2 mb-[2%]">
            {item.name}
        </div>
    ))


    return (
        <div className="absolute w-full top-[10%]">
            {items}
        </div>
    )

}

export default WeaponScreen;