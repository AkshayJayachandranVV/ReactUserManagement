import React from 'react';
import { TailSpin,BallTriangle,Puff ,Bars} from 'react-loader-spinner';
import './Spinner.css';

function Spinner() {
    return (
        <div className="spinner-container">
            <Bars
                color="#007bff" // Customize the color
                height={50} // Specify the height of the spinner
                width={50} // Specify the width of the spinner
            />
        </div>
    );
}

export default Spinner;