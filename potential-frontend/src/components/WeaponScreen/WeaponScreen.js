import { Grid } from "@mui/material";


function WeaponScreen(props) {

    const items = props.items.map((item, index) => {
        console.log(item)
        const crafted = item.name.includes('---CRAFTED---');
        return (<div className="h-20 text-highlight-color text-3xl">
            <Grid container spacing={1} className="h-full">
                {/* <Grid item xs={1} className="h-full border-solid border-r-2 border-t-2 border-highlight-color truncate">
                    <img src={item.wikiaThumbnail} alt="test"/>
                </Grid> */}
                <Grid item xs={2} style={index == props.items.length - 1 ? {borderBottomWidth: '2px'} : {}} className="h-full border-solid border-r-2 border-t-2 border-highlight-color truncate">
                    {item.name.split("---CRAFTED---")[0]}
                </Grid>
                <Grid item xs={1} style={index == props.items.length - 1 ? {borderBottomWidth: '2px'} : {}} className="h-full border-solid border-r-2 border-t-2 border-highlight-color">

                </Grid>
            </Grid>
        </div>)
    })


    return (
        <div className="absolute w-full top-[11%] h-[90%] overflow-scroll overflow-x-hidden">
            {items}
        </div>
    )

}

export default WeaponScreen;