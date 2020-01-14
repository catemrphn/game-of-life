import React  from 'react';
import './Cell.css';

function Cell(props) {
    function getClassName() {
        switch (props.item) {
            default:
                return 'cell';
            case '1':
                return 'cell life';
        }
    }
    return (
        <div className={getClassName()} onClick={() => {props.onChangePopulation(props.item, props.wCell, props.hCell);
        }}>

        </div>
    );
}

export default Cell;

//props.item[0] = value;
//props.item[1] = height;
//props.item[2] = width:
