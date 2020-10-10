import React from "react";
import { CalculateWins } from "../../Helpers/SeasonStatHelper";

class Wins extends React.Component {
    constructor(props){
        super(props);

    }
    

    render() {
        console.log("PROPS");
        console.log(this.props.stats);
        let winsData = CalculateWins("", -1, "asc", this.props.stats)
        console.log(winsData);
        return (
            <div>wins</div>
        );
    }
}

export default Wins;