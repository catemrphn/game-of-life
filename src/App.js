import React, {useState, useEffect,useRef} from 'react';
import './App.css';
import Cell from './components/Cell/Cell';


function App(props) {
    const width = 20;
    const height = 20;
    const [field, setField] = useState(createEmptyField());
    const [isRunning, setIsRunning] = useState(false);
    const [delay, setDelay] = useState(1000);
    const figures = {
        'Tumbler': [
            [0, 1, 1, 0, 1, 1, 0],
            [0, 1, 1, 0, 1, 1, 0],
            [0, 0, 1, 0, 1, 0, 0],
            [1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1],
            [1, 1, 0, 0, 0, 1, 1],
        ],
        'Exploder': [
            [1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 1, 0, 1],
        ],
        'Glider': [
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 1],
        ],
        'Clear': [
            []
        ],
    };

    useInterval(() => {
        step()
    }, isRunning ? delay : null);

    function handleButtonClick() {
        setIsRunning(!isRunning);
    }

    function handleSpeedChange(e) {
        let currValue = e.target.value;
            setDelay(- currValue);
    }

    function handleShapesChange(e) {
        let currShapeName = e.target.value;
        let currShape = figures[currShapeName];
        let currField = createEmptyField();
        let midFieldX = Math.round(width / 2);
        let midFieldY = Math.round(height / 2);
            let shapesWidth = currShape[0].length;
            let shapesHeight = currShape.length;
            let midShapesX = Math.round(shapesWidth / 2);
            let midShapesY = Math.round(shapesHeight / 2);
            let startX = midFieldX - midShapesX;
            let startY = midFieldY - midShapesY;
            for (let i = 0; i < shapesWidth; i++) {
                for (let j = 0; j < shapesHeight; j++) {
                    let bigX = startX + i;
                    let bigY = startY + j;
                    currField[bigX][bigY] = currShape[j][i] + "";
                }
            }
        setField(currField);
    }

    function createEmptyField() {
       let table = [];
       for (let i = 0; i < width; i++) {
           let row = [];
            for (let j = 0; j < height; j++) {
                row.push('0');
            }
            table.push(row);
        }
        return table;
    }

    function change(item, wCell, hCell) {
        let table = Array.from(field);
        if (table[wCell][hCell] !== '1') {
            table[wCell][hCell] = '1';
        } else if (table[wCell][hCell] !== '0') {
            table[wCell][hCell] = '0';
        }
        setField(table);
    }

    function step() {
        console.log('step');
        let table = [];
        for (let i = 0; i < width; i++) {
            let row = [];
            for (let j = 0; j < height; j++) {
                row.push('0');
            }
            table.push(row);
        }

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let sum = 0;
                if (i > 0) {
                    // middle left
                    if (field[i - 1][j] === '1') {
                        sum++;
                    }
                    if (j > 0) {
                        // bottom left
                        if (field[i - 1][j - 1] === '1') {
                            sum++;
                        }
                    }
                    if (j < height - 1) {
                        // top left
                        if (field[i - 1][j + 1] === '1') {
                            sum++;
                        }
                    }
                }
                if (i < width - 1) {
                    // middle right
                    if (field[i + 1][j] === '1') {
                        sum++;
                    }
                    if (j < height - 1) {
                        // top right
                        if (field[i + 1][j + 1] === '1') {
                            sum++;
                        }
                    }
                    if (j > 0) {
                        // bottom right
                        if (field[i + 1][j - 1] === '1') {
                            sum++;
                        }
                    }
                }
                if (j > 0) {
                    // bottom center
                    if (field[i][j - 1] === '1') {
                        sum++;
                    }
                }
                if (j < height - 1) {
                    // top center
                    if (field[i][j + 1] === '1') {
                        sum++;
                    }
                }

                if(sum > 0) {
                }
                if (field[i][j] === '1' && (sum <= 1 || sum >= 4)) {
                    table[i][j] = '0';
                } else if (field[i][j] === '0' && sum === 3) {
                    table[i][j] = '1';
                } else {
                    table[i][j] = field[i][j];
                }
            }
        }
        setField(table);
    }

    function genRow(row, col) {
        let rowField = row.map(function (item, index) {
            return (
                <Cell onChangePopulation={(item, wCell, hCell) => change(item, wCell, hCell)} item={item[0]}
                      hCell={index} wCell={col}/>
            );
        });

        return (
            <div>
                {rowField}
            </div>
        )
    }

    return (
        <div className="App">
            <h1>Game of life</h1>
            <div className='gamefield__container'>
                {
                    field.map(function (item, index) {
                            return (
                                genRow(item, index)
                            );
                        }
                    )
                }
            </div>
            <div className='button__container'>
                <button className='button' onClick={handleButtonClick}>{isRunning ? 'Stop' : 'Start'}</button>
                <button className='button' onClick={step}>Step</button>
                <div className='speedListener'>
                    <label>Speed</label>
                    <input id='speed' type='range' min='-2000' max='-200' step='100' defaultValue='delay' title='speed' onChange={handleSpeedChange}/>
                </div>
                <select id='shapes' onChange={handleShapesChange}>
                    <option>Clear</option>
                    <option>Tumbler</option>
                    <option>Glider</option>
                    <option>Exploder</option>
                </select>
            </div>
        </div>
    );
}

function useInterval(callback, delay) {
    const savedCallback = useRef();
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default App;
