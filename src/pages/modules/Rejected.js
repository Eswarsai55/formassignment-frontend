import React, {Fragment} from "react";
import Topbar from "../../common_components/navbar/Topbar";
import {Button, Col, Grid, Row} from "react-bootstrap";

import BaseComponent from "../../utils/BaseComponent";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import { COLUMNS } from '../constants/data'
import _ from 'lodash';
import { getToken } from '../../utils/ManageToken';
import jwt from 'jsonwebtoken';
import fetchRequestData from '../../actions/getrequestData';


class Rejected extends BaseComponent {
  constructor() {
    super();
    this.state = {
      rejectedRequests: [],
      apiError: {
        isError: false,
        data: ""
      }
    }
  }

  componentDidMount = () => {
    this.getRejectedRequests();
  }

  getRejectedRequests = () => {
    const rejectedRequests = [];
    const token = getToken();
    const encryptedData = jwt.decode(token)
    fetchRequestData().then(response => {
      for (let i=0; i<response.length; i++) {
        if (response[i].status === 'REJECTED' && response[i].userId === encryptedData.id) {
          rejectedRequests.push({
            createdOn: new Date(response[i].createdOn).toDateString(),
            modifiedOn: new Date(response[i].modifiedOn).toDateString(),
            reqId: response[i]._id,
            message: response[i].message,
            rejectedReason: response[i].reason,
          })
        }
      }
      this.setState({
        rejectedRequests,
      })
    }).catch(err => {
      this.setState({
        apiError: {
          isError: true,
          data: err.message,
        }
      })
    })
  }

  render() {
    const { SearchBar } = Search;
    const { rejectedRequests, apiError } = this.state;
    const updatedColumns = _.cloneDeep(COLUMNS);
    updatedColumns.push({
      dataField: 'rejectedReason',
      text: 'RejectedReason'
    })
    return (
      <Fragment>
        <Grid fluid>
          <div className="top-section">
            <Topbar activeKey={4}/>
          </div>
          <div className="main-section">
            <div className="right-side-section">
              <Grid className="main-container">
                <Row className="pd-t-2 pd-b-2 pd-r-1 pd-l-1">
                  <Col md={12}>
                    <h2>List of Rejected Requests</h2>
                  </Col>
                </Row>
                <Row>
                  <Col className="table-wrapper" md={12}>
                    {apiError.isError && <p className="error-text">{apiError.data}</p>}
                    <ToolkitProvider keyField="id" data={rejectedRequests} columns={updatedColumns} search>
                      {props => (
                        <div>
                          <Grid className="enquiry-filter-container">
                            <Row>
                              <Col md={3}>
                                <SearchBar {...props.searchProps} />
                              </Col>
                            </Row>
                          </Grid>
                          <hr/>
                          <BootstrapTable
                            {...props.baseProps}
                            noDataIndication={"No results found"}
                            bordered={false}
                            pagination={paginationFactory()}
                          />
                        </div>
                      )}
                    </ToolkitProvider>
                  </Col>
                </Row>
              </Grid>
            </div>
          </div>
        </Grid>
      </Fragment>
    )
  }
}

export default Rejected;