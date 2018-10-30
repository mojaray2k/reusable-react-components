import React, {Component} from "react";
import ReactTable from "react-table";
import Pagination from "./Pagination";

import "react-table/react-table.css";
import "./styles/table.scss";

class Table extends Component {
    /**
     * Creates props for `TrGroupComponent`
     */
    setTrGroupProps(state, rowInfo) {
        return !rowInfo
            ? {
                  style: {
                      display: "none"
                  }
              }
            : {};
    }

    render() {
        return (
            <ReactTable
                getTrGroupProps={this.setTrGroupProps}
                getTheadThProps={() => { return { style: { outline: 0, } }; }}
                PaginationComponent={Pagination}
                {...this.props}
            />
        );
    }
}

export default Table;
