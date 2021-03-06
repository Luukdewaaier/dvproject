import React from 'react';

import axios from 'axios';
import {store} from 'statorgfc';
import {LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend} from 'recharts';

let date = new Date();
let today = '01-0' + (date.getMonth() + 1) + '-' + date.getFullYear().toString().substr(-2);

export default class IncomeTime extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data2: [],
            maxValue: 140000,
            oldFrom: null,
            oldTo: null,
            domain: true,
            hosting: true,
            search: true,
            cloudflare: true,
            service: true,
            print: true
        };

        store.connectComponentState(this, ['date', 'data'])
    }

    componentDidMount() {
        this.props.onRef(this);
        this.getData();
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    handleChange(type) {
        let newState = this.state;

        newState[type] = !this.state[type];

        this.setState(newState);

        this.getData();
    }

    getIndex(key) {
        switch (key) {
            case 'domain':
                return 1;
            case 'hosting':
                return 2;
            case 'search':
                return 3;
            case 'cloudflare':
                return 4;
            case 'service':
                return 5;
            case 'print':
                return 6;
            default:
                return 7;
        }
    }

    getData() {
        let from = this.state.date.from.getMonth() + '-' + this.state.date.from.getDate() + '-' + this.state.date.from.getFullYear();
        let to = this.state.date.to.getMonth() + '-' + this.state.date.to.getDate() + '-' + this.state.date.to.getFullYear();

        let excludes = [];

        for (let key in this.state) {
            if (this.state.hasOwnProperty(key) && !this.state[key]) {
                excludes.push(this.getIndex(key));
            }
        }

        axios.get('/data/line?from=' + from + '&to=' + to + '&exclude=' + excludes.join(','))
            .then(response => {
                if (from !== this.state.oldFrom || to !== this.state.oldTo) {
                    console.log('lele');
                    this.setState({
                        oldFrom: from,
                        oldTo: to
                    });

                    this.calculateMaxValue();
                }

                this.setState({data2: response.data});
            })
            .catch(response => {
                console.log(response);
            })
    }

    calculateMaxValue() {
        let maxValue = 0;

        this.state.data2.map((item) => {
            if (item.value > maxValue) {
                maxValue = item.value;
            }
        });

        this.setState({maxValue: maxValue})
    }

    render() {
        return (
            <div className="row custom-row justify-content-center">
                <div className="col-lg-12">
                    <h3>Income over time</h3>
                    <LineChart width={window.innerWidth - 50} height={360} data={this.state.data2}
                               margin={{top: 20, right: 50, left: 20, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis type="number" domain={['auto', 140000]}/>
                        <ReferenceLine x={today} label="Current" stroke="black"/>
                        <Tooltip/>
                        <Line type="monotone" dataKey="value" stroke="#ff9933" strokeWidth={3}/>
                    </LineChart>
                </div>
                <div className="col-lg-2">
                    <input type="checkbox" checked={this.state.domain} name="domain" onChange={(e) => this.handleChange('domain')}/>
                    <label htmlFor="domain">&nbsp;&nbsp;Domein</label>
                </div>
                <div className="col-lg-2">
                    <input type="checkbox" checked={this.state.hosting} name="hosting" onChange={(e) => this.handleChange('hosting')}/>
                    <label htmlFor="hosting">&nbsp;&nbsp;Magento hosting</label>
                </div>
                <div className="col-lg-2">
                    <input type="checkbox" checked={this.state.search} name="search" onChange={(e) => this.handleChange('search')}/>
                    <label htmlFor="search">&nbsp;&nbsp;Search server</label>
                </div>
                <div className="col-lg-2">
                    <input type="checkbox" checked={this.state.cloudflare} name="cloudflare" onChange={(e) => this.handleChange('cloudflare')}/>
                    <label htmlFor="cloudflare">&nbsp;&nbsp;Cloudflare</label>
                </div>
                <div className="col-lg-2">
                    <input type="checkbox" checked={this.state.service} name="service" onChange={(e) => this.handleChange('service')}/>
                    <label htmlFor="service">&nbsp;&nbsp;Magento onderhoud</label>
                </div>
                <div className="col-lg-2">
                    <input type="checkbox" checked={this.state.print} name="print" onChange={(e) => this.handleChange('print')}/>
                    <label htmlFor="print">&nbsp;&nbsp;Auto printen</label>
                </div>
            </div>
        )
    }
}