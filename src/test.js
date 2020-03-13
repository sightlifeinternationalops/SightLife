// Represents a single row in the metric/metric calculations table
// Contains all metric name and metric calculation names for a metric area
export default class MetricCalculationRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <th>
                    {this.props.metrics}
                </th>
                <th>
                    {this.props.metricCalc}
                </th>
            </tr>
        )
    }
}

