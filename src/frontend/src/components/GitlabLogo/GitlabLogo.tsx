import * as React from "react"

interface GitlabLogoProps {
    width: number
    height: number
}

const GitlabLogo = ({width, height}: GitlabLogoProps) => {
    // Calculate padding to ensure content remains fully visible
    const padding = 7; // You can adjust this value as needed

    // Calculate viewBox dimensions with padding
    const viewBoxWidth = 40;
    const viewBoxHeight = 35;
    const viewBox = `95 100 ${viewBoxWidth+165} ${viewBoxHeight+160}`;

    return (

        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={viewBoxWidth}
            height={viewBoxHeight}
            viewBox={viewBox}
        >
            <defs>
                <style>{`.cls-1{fill:#e24329;}.cls-2{fill:#fc6d26;}.cls-3{fill:#fca326;}`}</style>
            </defs>
            <g id="LOGO">
                <path className="cls-1" d="M282.83,170.73l-.27-.69-26.14-68.22a6.81,6.81,0,0,0-2.69-3.24,7,7,0,0,0-8,.43,7,7,0,0,0-2.32,3.52l-17.65,54H154.29l-17.65-54A6.86,6.86,0,0,0,134.32,99a7,7,0,0,0-8-.43,6.87,6.87,0,0,0-2.69,3.24L97.44,170l-.26.69a48.54,48.54,0,0,0,16.1,56.1l.09.07.24.17,39.82,29.82,19.7,14.91,12,9.06a8.07,8.07,0,0,0,9.76,0l12-9.06,19.7-14.91,40.06-30,.1-.08A48.56,48.56,0,0,0,282.83,170.73Z"/>
                <path className="cls-2" d="M282.83,170.73l-.27-.69a88.3,88.3,0,0,0-35.15,15.8L190,229.25c19.55,14.79,36.57,27.64,36.57,27.64l40.06-30,.1-.08A48.56,48.56,0,0,0,282.83,170.73Z"/>
                <path className="cls-3" d="M153.43,256.89l19.7,14.91,12,9.06a8.07,8.07,0,0,0,9.76,0l12-9.06,19.7-14.91S209.55,244,190,229.25C170.45,244,153.43,256.89,153.43,256.89Z"/>
                <path className="cls-2" d="M132.58,185.84A88.19,88.19,0,0,0,97.44,170l-.26.69a48.54,48.54,0,0,0,16.1,56.1l.09.07.24.17,39.82,29.82s17-12.85,36.57-27.64Z"/>
            </g>
        </svg>
    )
}
export default GitlabLogo

