import DateTimePicker from 'react-datetime-picker';
import React from 'react';

function EmployeeWorkVM(props){

    var dateS = new Date(props.start)
    var dateE = new Date(props.end)

    return (
        <> 
            <div className="workData"> 
                <h5>Task  {props.num+1}</h5>

                <div className="form-group mt-3">
                    <label>Task Start Date and Time </label>
                    <div>
                        <DateTimePicker className="mt-1"
                            value={dateS}
                            readOnly={true}/>
                    </div>
                </div>

                <div className="form-group mt-3">
                    <label>End  Date and Time </label>
                    <div>
                        <DateTimePicker className="mt-1"
                            value={dateE}
                            readOnly={true}/>
                    </div>
                </div>

                <div className="form-group mt-3">
                        <label>Task Description </label>
                        <input  type="text"
                                className="form-control mt-1"
                                value = {props.des}
                                readOnly={true}/>
                </div>
            </div>
        </>
    )
}

export default EmployeeWorkVM



