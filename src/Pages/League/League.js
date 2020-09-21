import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  withRouter
} from "react-router-dom";

class League extends React.Component {
    render() {
        debugger;
       let id = this.props.match.params.league_id;
        return (
            <div style={{width:"100%", height: 600}}>
                <div className="p-grid p-align-center" style={{ margin: 100, padding:0, cursor: "pointer" }}>
                    <div className="p-col p-shadow-10">
                        League Overview
                    </div>
                    <div className="p-col p-shadow-10">
                        Current Season Overview
                    </div>
                </div>
                <div className="p-grid p-align-center" style={{ margin: 100, padding:0, cursor: "pointer" }}>
                    <div className="p-col p-shadow-10">
                        Manager Overview
                    </div>
                    <div className="p-col p-shadow-10">
                        Season Overview
                    </div>
                </div>

                Now showing league id: {id}
            </div>
        );
    }
}


export default withRouter(League);