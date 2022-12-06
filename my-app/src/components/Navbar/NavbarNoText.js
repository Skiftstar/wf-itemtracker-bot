import React from "react";
import HomeIcon from '@mui/icons-material/Home'
import TranslateIcon from '@mui/icons-material/Translate';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

class Navbar extends React.Component {
    render() {
        return (
            <div className="font-bold overflow-hidden w-full bottom-0 absolute m-0 p-0 bg-main-bg-color text-highlight-color text-center block h-[10%] border-solid border-t-2 border-secondary-color">
                <div className="gap-4 flex flex-col w-1/4 hover:bg-secondary-color h-full float-left cursor-pointer border-r border-solid border-secondary-color"
                    onClick={() => {this.props.setWindowState(0)}}
                >
                    <div className="absolute m-0 top-1/2 left-[12.5%] translate-y-[-50%] translate-x-[-50%]">
                        <HomeIcon fontSize="large" className="" />
                    </div>
                </div>
                <div className="gap-4 flex flex-col w-1/4 hover:bg-secondary-color h-full float-left cursor-pointer border-r border-solid border-secondary-color"
                    onClick={() => {this.props.setWindowState(5)}}
                >
                    <div className="absolute m-0 top-1/2 left-[37.5%] translate-y-[-50%] translate-x-[-50%]">
                        <TranslateIcon fontSize="large" className="" />
                    </div>
                </div>
                <div className="gap-4 flex flex-col w-1/4 hover:bg-secondary-color h-full float-left cursor-pointer border-r border-solid border-secondary-color"
                    onClick={() => {this.props.setWindowState(6)}}
                >
                    <div className="absolute m-0 top-1/2 left-[62.5%] translate-y-[-50%] translate-x-[-50%]">
                        <AutoStoriesIcon fontSize="large" className="" />
                    </div>
                </div>
                <div className="gap-4 flex flex-col w-1/4 hover:bg-secondary-color h-full float-left cursor-pointer"
                    onClick={() => {this.props.setWindowState(3)}}
                >
                    <div className="absolute m-0 top-1/2 left-[87.5%] translate-y-[-50%] translate-x-[-50%]">
                        <RecordVoiceOverIcon fontSize="large" className="" />
                    </div>
                </div>
            </div>
        )
    }
}

export default Navbar;