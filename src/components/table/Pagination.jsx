// @flow

import React, {Component} from "react";
import PropTypes from "prop-types";
import {createUltimatePagination, ITEM_TYPES} from "react-ultimate-pagination";
import {Pagination} from "react-bootstrap";

import {SelectField} from "../form-fields";
import ControlRow from "../control-row/ControlRow";
import Icon from "../icon/Icon";

import type {TableProps} from "react-table";

type ReactTablePaginationProps = TableProps;
type ReactTablePaginationState = {
    page: number
};

class ReactTablePagination extends Component<ReactTablePaginationProps, ReactTablePaginationState> {
    props: ReactTablePaginationProps;
    state: ReactTablePaginationState;
    getSafePage: (page: number) => number;
    changePage: (page: number) => void;
    applyPage: (e?: SyntheticEvent<any>) => void;
    changePageSize: (pageSize: number) => void;

    constructor(props: ReactTablePaginationProps) {
        super(props);

        this.state = {
            page: this.props.page,
            selectedPageValue: this.props.pageSize
        };

        this.getSafePage = this.getSafePage.bind(this);
        this.changePage = this.changePage.bind(this);
        this.applyPage = this.applyPage.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
    }

    static getDerivedStateFromProps(nextProps: ReactTablePaginationProps) {
        return {page: nextProps.page};
    }

    get pageSizeOptions() {
        const {pageSizeOptions, data} = this.props;

        return pageSizeOptions.reduce((options, option) => {
            if (data.length > option) {
                options.push({
                    label: option.toString(),
                    value: option
                });
            }

            return options;
        }, []);
    }

    getSafePage(page: number) {
        if (isNaN(page)) {
            page = this.props.page;
        }

        return page - 1;
    }

    changePage(page: number) {
        page = this.getSafePage(page);

        this.setState({page});

        if (this.props.page !== page) {
            this.props.onPageChange(page);
        }
    }

    applyPage(e: SyntheticEvent<any>) {
        if (e) {
            e.preventDefault();
        }

        const page = this.state.page;
        this.changePage(page === "" ? this.props.page : page);
    }

    changePageSize(pageSize: number) {
        const page = this.state.page;
        this.setState({selectedPageValue: pageSize});
        this.props.onPageSizeChange(pageSize, page);
    }

    render() {
        const {pages, page, showPageSizeOptions} = this.props;

        const TablePagination = createUltimatePagination({
            WrapperComponent: Pagination,
            itemTypeToComponent: {
                [ITEM_TYPES.PAGE]: ({value}) => {
                    return (
                        <Pagination.Item active={page === value - 1} onClick={this.changePage.bind(undefined, value)}>
                            {value}
                        </Pagination.Item>
                    );
                },
                [ITEM_TYPES.ELLIPSIS]: () => {
                    return <Pagination.Ellipsis className="more" />;
                },
                [ITEM_TYPES.FIRST_PAGE_LINK]: () => (
                    <Pagination.Item disabled={page === 0} onClick={this.changePage.bind(undefined, 0)}>
                        <Icon name="arrow-left" size="small" />
                    </Pagination.Item>
                ),
                [ITEM_TYPES.PREVIOUS_PAGE_LINK]: () => (
                    <Pagination.Item disabled={page === 0} onClick={this.changePage.bind(undefined, page)}>
                        <Icon name="chevron-left" size="small" />
                    </Pagination.Item>
                ),
                [ITEM_TYPES.NEXT_PAGE_LINK]: () => (
                    <Pagination.Item disabled={page + 1 === pages} onClick={this.changePage.bind(undefined, page + 2)}>
                        <Icon name="chevron-right" size="small" />
                    </Pagination.Item>
                ),
                [ITEM_TYPES.LAST_PAGE_LINK]: () => (
                    <Pagination.Item disabled={page + 1 === pages} onClick={this.changePage.bind(undefined, pages)}>
                        <Icon name="arrow-right" size="small" />
                    </Pagination.Item>
                )
            }
        });

        const pageSizeOptions = this.pageSizeOptions;

        return (
            <ControlRow split alignCenter flush>
                <ControlRow.Section style={{maxWidth: "150px"}}>
                    {showPageSizeOptions &&
                        pageSizeOptions.length > 0 && (
                            <SelectField
                                className="ReactTable-pagesize"
                                options={this.pageSizeOptions}
                                placeholder="Page Size"
                                searchable={false}
                                clearable={false}
                                value={this.state.selectedPageValue}
                                input={{
                                    onChange: value => this.changePageSize(value),
                                    onBlur: () => {}
                                }}
                                simpleValue
                            />
                        )}
                </ControlRow.Section>
                <ControlRow.Section>
                    <TablePagination
                        currentPage={(pages && pages.length) ? page + 1 : 0}
                        totalPages={pages}
                        onChange={this.changePage}
                    />
                </ControlRow.Section>
            </ControlRow>
        );
    }
}

ReactTablePagination.propTypes = {
    pages: PropTypes.number,
    page: PropTypes.number,
    showPageSizeOptions: PropTypes.bool,
    pageSizeOptions: PropTypes.array,
    pageSize: PropTypes.number,
    showPageJump: PropTypes.bool,
    canPrevious: PropTypes.bool,
    canNext: PropTypes.bool,
    pageText: PropTypes.string,
    ofText: PropTypes.string,
    onPageSizeChange: PropTypes.func,
    onPageChange: PropTypes.func,
    previousText: PropTypes.string,
    nextText: PropTypes.string,
    rowsText: PropTypes.string
};

export default ReactTablePagination;
